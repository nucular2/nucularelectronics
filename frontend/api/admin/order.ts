import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

function getAdminEmailSet() {
  const raw = process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || '';
  const emails = raw
    .split(/[,\s;]+/g)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return new Set(emails);
}

function isDev() {
  return process.env.NODE_ENV !== 'production';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
    if (!token) return res.status(401).json({ message: 'Missing Authorization token' });

    const { data: authData, error: authError } = await supabaseAnon.auth.getUser(token);
    if (authError || !authData?.user) return res.status(401).json({ message: 'Invalid user token' });

    const email = (authData.user.email || '').toLowerCase();
    const admins = getAdminEmailSet();
    if (!email) return res.status(403).json({ message: 'User email is missing' });
    if (admins.size === 0 && !isDev()) return res.status(403).json({ message: 'Admin access list is not configured' });
    if (admins.size > 0 && !admins.has(email)) return res.status(403).json({ message: 'Forbidden' });

    const { id } = (req.body || {}) as { id?: string };
    const orderId = typeof id === 'string' ? id.trim() : '';
    if (!orderId) return res.status(400).json({ message: 'Missing order id' });

    const { data, error } = await supabaseService
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !data) return res.status(404).json({ message: 'Order not found' });
    return res.status(200).json({ ok: true, order: data });
  } catch (e: any) {
    return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
  }
}

