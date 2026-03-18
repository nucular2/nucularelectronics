import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    const { payload } = req.body as { payload: any };
    if (!payload || !payload.user_id || !payload.total_amount) {
      return res.status(400).json({ message: 'Invalid order payload' });
    }
    const { data, error } = await supabase
      .from('orders')
      .insert(payload)
      .select()
      .single();
    if (error) {
      return res.status(500).json({ message: error.message });
    }
    return res.status(200).json({ order: data });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}
