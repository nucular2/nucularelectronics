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

    const [
      { count: totalOrders, error: totalError },
      { count: paidOrders, error: paidError },
      { count: awaitingPaymentOrders, error: awaitingError },
    ] = await Promise.all([
      supabaseService.from('orders').select('id', { count: 'exact', head: true }),
      supabaseService.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'Paid'),
      supabaseService.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'Awaiting payment'),
    ]);

    if (totalError || paidError || awaitingError) {
      return res.status(500).json({ message: 'Failed to load stats' });
    }

    const { data: paidRows } = await supabaseService
      .from('orders')
      .select('total_amount')
      .eq('status', 'Paid')
      .limit(2000);

    const paidRevenue = (paidRows || []).reduce((acc: number, row: any) => acc + Number(row.total_amount || 0), 0);

    const { data: recentOrders, error: recentError } = await supabaseService
      .from('orders')
      .select('id,created_at,total_amount,status,recipient_info,contacts')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) return res.status(500).json({ message: 'Failed to load recent orders', details: recentError.message });

    return res.status(200).json({
      ok: true,
      totalOrders: totalOrders || 0,
      paidOrders: paidOrders || 0,
      awaitingPaymentOrders: awaitingPaymentOrders || 0,
      paidRevenue,
      recentOrders: recentOrders || [],
    });
  } catch (e: any) {
    return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
  }
}

