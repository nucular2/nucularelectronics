import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  try {
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase env vars');
      return res.status(500).json({ message: 'Server misconfiguration: Supabase env' });
    }
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
      console.error('Supabase insert error:', error);
      return res.status(500).json({ message: error.message });
    }
    return res.status(200).json({ order: data });
  } catch (e: any) {
    console.error('Orders create exception:', e);
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}
