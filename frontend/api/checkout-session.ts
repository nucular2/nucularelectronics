import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

let stripe: Stripe | null = null;
function getStripe() {
  if (stripe) return stripe;
  const secret = process.env.STRIPE_SECRET || '';
  if (!secret) {
    throw new Error('Stripe is not configured (STRIPE_SECRET is missing)');
  }
  stripe = new Stripe(secret, { apiVersion: '2024-04-10' } as any);
  return stripe;
}

const supabaseUrl =
  process.env.VITE_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://placeholder.supabase.co';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

function toNumber(value: unknown): number {
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

function cents(value: unknown): number {
  return Math.max(0, Math.round(toNumber(value) * 100));
}

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ message: 'Missing orderId' });
  }

  try {
    // 1. Get order details from Supabase
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const totalCents = cents(order.total_amount);
    const frontendUrl = process.env.FRONTEND_URL || 'https://nucularelectronics.vercel.app';

    const items = asArray(order.items);
    const crmNumber = order?.contacts?.crm?.number ? String(order.contacts.crm.number) : null;
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let itemsSumCents = 0;

    for (const raw of items) {
      const baseName = String(raw?.title || raw?.name || raw?.productName || 'Item').slice(0, 120);
      const name = crmNumber ? `Order ${crmNumber}: ${baseName}`.slice(0, 120) : baseName;
      const quantityRaw = raw?.quantity;
      const quantity = typeof quantityRaw === 'number' && Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.floor(quantityRaw) : 1;

      const unitCents =
        cents(raw?.price) ||
        cents(raw?.unitPrice) ||
        cents(raw?.initialPrice) ||
        (cents(raw?.total) && quantity > 0 ? Math.floor(cents(raw.total) / quantity) : 0);

      if (!unitCents) continue;

      itemsSumCents += unitCents * quantity;
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name,
          },
          unit_amount: unitCents,
        },
        quantity,
      });
    }

    if (lineItems.length === 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: { name: `Order #${String(order.id).slice(0, 8)}` },
          unit_amount: totalCents,
        },
        quantity: 1,
      });
    } else if (itemsSumCents !== totalCents) {
      const diff = totalCents - itemsSumCents;
      if (diff !== 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: { name: diff > 0 ? 'Adjustment' : 'Discount' },
            unit_amount: Math.abs(diff),
          },
          quantity: 1,
        });
      }
    }

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${frontendUrl}/orders?payment=success`,
      cancel_url: `${frontendUrl}/cart?payment=canceled`,
      metadata: {
        order_id: order.id,
        user_id: order.user_id,
      },
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({ message: err.message });
  }
}
