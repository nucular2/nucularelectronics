import { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET!, {
  apiVersion: '2026-01-28.clover',
});

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

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

    // 2. Create Stripe Checkout Session
    const amount = Math.round(Number(order.total_amount) * 100);
    const frontendUrl = process.env.FRONTEND_URL || 'https://nucularelectronics.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Order #${order.id.slice(0, 8)}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
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
