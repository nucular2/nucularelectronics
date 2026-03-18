import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import fetch from 'node-fetch';
import { createClient } from '@supabase/supabase-js';

const OrderSchema = z.object({
  id: z.string(),
  user_id: z.string(),
  items: z.array(z.object({
    id: z.number(),
    title: z.string(),
    quantity: z.number(),
    price: z.any().optional(),
    category: z.string().optional(),
    image: z.string().optional()
  })),
  total_amount: z.number(),
  status: z.string(),
  customer_name: z.string(),
  customer_phone: z.string(),
  customer_address: z.string(),
  recipient_info: z.any(),
  shipping_address: z.any(),
  contacts: z.any()
});

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

async function postRetailCRM(order: any): Promise<Response> {
  const apiUrl = process.env.RETAILCRM_URL;
  const apiKey = process.env.RETAILCRM_API_KEY;
  if (!apiUrl || !apiKey) {
    throw new Error('RetailCRM credentials are missing');
  }
  const payload = {
    order: {
      externalId: order.id,
      firstName: order.recipient_info?.firstName,
      lastName: order.recipient_info?.lastName,
      phone: order.customer_phone,
      email: order.recipient_info?.email,
      items: order.items.map((i: any) => ({
        offer: { externalId: String(i.id) },
        quantity: i.quantity,
        productName: i.title
      })),
      customerComment: order.contacts?.comment || '',
      delivery: {
        address: {
          text: order.customer_address
        }
      },
      status: 'new'
    }
  };
  const url = `${apiUrl}/api/v5/orders/create?apiKey=${apiKey}`;
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
}

async function withRetry(fn: () => Promise<Response>, attempts = 3) {
  let lastErr: any;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fn();
      if (res.ok) return res;
      const text = await res.text();
      lastErr = new Error(text);
    } catch (e: any) {
      lastErr = e;
    }
    await new Promise(r => setTimeout(r, Math.pow(2, i) * 500));
  }
  throw lastErr;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const body = req.body;
    const parsed = z.object({ order: OrderSchema }).safeParse(body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid order payload' });
      return;
    }
    const order = parsed.data.order;
    await supabase.from('orders').update({ status: 'Processing' }).eq('id', order.id);
    const response = await withRetry(() => postRetailCRM(order));
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      await supabase.from('orders').update({ status: 'Error' }).eq('id', order.id);
      res.status(response.status).json({ error: 'RetailCRM error', details: data });
      return;
    }
    await supabase.from('orders').update({ status: 'Sent' }).eq('id', order.id);
    res.status(200).json({ ok: true, data });
  } catch (e: any) {
    res.status(500).json({ error: 'Internal error', details: e?.message || String(e) });
  }
}
