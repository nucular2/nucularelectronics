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

export const config = {
  api: {
    bodyParser: false,
  },
};

async function pushPaymentToRetailCrm(params: {
  orderExternalId: string;
  amount: number;
  paidAtIso: string;
  paymentExternalId: string;
}) {
  const apiUrl = process.env.RETAILCRM_URL;
  const apiKey = process.env.RETAILCRM_API_KEY;
  const site = process.env.RETAILCRM_SITE || undefined;
  const paymentType = process.env.RETAILCRM_PAYMENT_TYPE || 'bank-card';
  const paymentStatusPaid = process.env.RETAILCRM_PAYMENT_STATUS_PAID || 'paid';
 
  if (!apiUrl || !apiKey) return;

  const paidCodes = ['paid', 'payment-paid', 'payment_paid'];

  const fetchOrderUrl =
    `${apiUrl}/api/v5/orders/${encodeURIComponent(params.orderExternalId)}` +
    `?apiKey=${encodeURIComponent(apiKey)}` +
    `&by=externalId` +
    (site ? `&site=${encodeURIComponent(site)}` : '');

  let crmOrder: any = null;
  try {
    const r = await fetch(fetchOrderUrl, { headers: { Accept: 'application/json' } });
    const text = await r.text();
    const data = JSON.parse(text);
    crmOrder = data?.success ? data?.order : null;
  } catch {
    crmOrder = null;
  }

  const payments = Array.isArray(crmOrder?.payments) ? crmOrder.payments : [];
  const normalizedAmount = Math.round(params.amount * 100) / 100;
  const exactMatch = (value: unknown) => Math.abs(Number(value) - normalizedAmount) < 0.01;

  const candidate =
    payments.find((p: any) => p?.externalId && String(p.externalId) === params.paymentExternalId) ||
    payments.find((p: any) => {
      const status = String(p?.status || '').toLowerCase();
      const isPaid = paidCodes.includes(status);
      if (isPaid) return false;
      if (!exactMatch(p?.amount)) return false;
      return true;
    }) ||
    null;

  const paymentBase = {
    externalId: candidate?.externalId || params.paymentExternalId,
    order: { externalId: params.orderExternalId },
    amount: normalizedAmount,
    paidAt: params.paidAtIso,
    type: candidate?.type || paymentType,
    status: paymentStatusPaid,
  };

  if (candidate?.id) {
    const editUrl = `${apiUrl}/api/v5/orders/payments/${encodeURIComponent(String(candidate.id))}/edit?apiKey=${encodeURIComponent(apiKey)}${
      site ? `&site=${encodeURIComponent(site)}` : ''
    }`;
    const form = new URLSearchParams();
    form.set('payment', JSON.stringify(paymentBase));
    const r = await fetch(editUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
      body: form.toString(),
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(text || 'RetailCRM payments edit failed');
    }
    return;
  }

  const createUrl = `${apiUrl}/api/v5/orders/payments/create?apiKey=${encodeURIComponent(apiKey)}${
    site ? `&site=${encodeURIComponent(site)}` : ''
  }`;
  const form = new URLSearchParams();
  form.set('payment', JSON.stringify(paymentBase));
  const r = await fetch(createUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
    body: form.toString(),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || 'RetailCRM payments create failed');
  }
}

async function buffer(readable: any) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return res.status(400).send('Missing signature or webhook secret');
  }

  let event;

  try {
    const buf = await buffer(req);
    event = getStripe().webhooks.constructEvent(buf, sig as string, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id;

    if (orderId) {
      try {
        const paidAtIso = new Date(((session.created as number) || Math.floor(Date.now() / 1000)) * 1000).toISOString();
        const amountTotal = typeof session.amount_total === 'number' ? session.amount_total / 100 : undefined;

        const { data: existingOrder } = await supabase
          .from('orders')
          .select('id,contacts,total_amount')
          .eq('id', orderId)
          .single();

        const prevContacts =
          existingOrder?.contacts && typeof existingOrder.contacts === 'object' ? existingOrder.contacts : {};
        const nextContacts = {
          ...prevContacts,
          payment: {
            ...(prevContacts?.payment && typeof prevContacts.payment === 'object' ? prevContacts.payment : {}),
            provider: 'stripe',
            status: 'paid',
            paidAt: paidAtIso,
            amount: typeof amountTotal === 'number' ? amountTotal : existingOrder?.total_amount,
            updatedAt: new Date().toISOString(),
          },
        };

        const { error } = await supabase
          .from('orders')
          .update({ status: 'Paid', contacts: nextContacts })
          .eq('id', orderId);

        if (error) {
          console.error('Error updating order:', error);
          return res.status(500).send('Database update failed');
        }

        try {
          const amount =
            typeof amountTotal === 'number'
              ? amountTotal
              : typeof existingOrder?.total_amount === 'number'
              ? existingOrder.total_amount
              : Number(existingOrder?.total_amount);
          if (Number.isFinite(amount) && amount > 0) {
            await pushPaymentToRetailCrm({
              orderExternalId: orderId,
              amount,
              paidAtIso,
              paymentExternalId: `stripe_${session.id}`,
            });
          }
        } catch (e) {
          console.error('RetailCRM payment push failed:', e);
        }
      } catch (err) {
        console.error('Error updating order:', err);
        return res.status(500).send('Internal Server Error');
      }
    }
  }

  res.json({ received: true });
}
