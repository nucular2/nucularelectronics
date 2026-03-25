import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

type OrderStatus =
  | 'New'
  | 'Processing'
  | 'Awaiting payment'
  | 'Paid'
  | 'Shipped'
  | 'Awaiting pickup'
  | 'Delivered'
  | 'Canceled';

type PaymentFilter = 'All' | 'Paid' | 'NotPaid' | 'AwaitingPayment';

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

function formatDateIsoRange(input?: string) {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;
  return trimmed;
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

    const body = (req.body || {}) as {
      searchTerm?: string;
      statusFilter?: OrderStatus | 'All';
      paymentFilter?: PaymentFilter;
      dateRange?: { start?: string; end?: string };
      limit?: number;
    };

    const statusFilter = body.statusFilter ?? 'All';
    const paymentFilter = body.paymentFilter ?? 'All';
    const limit = typeof body.limit === 'number' && body.limit > 0 ? Math.min(body.limit, 1000) : 500;

    const start = formatDateIsoRange(body?.dateRange?.start);
    const end = formatDateIsoRange(body?.dateRange?.end);

    let q = supabaseService
      .from('orders')
      .select('id,user_id,created_at,total_amount,status,recipient_info,contacts')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (statusFilter !== 'All') q = q.eq('status', statusFilter);
    if (paymentFilter === 'Paid') q = q.eq('status', 'Paid');
    if (paymentFilter === 'AwaitingPayment') q = q.eq('status', 'Awaiting payment');
    if (paymentFilter === 'NotPaid') q = q.neq('status', 'Paid');

    if (start) q = q.gte('created_at', `${start}T00:00:00`);
    if (end) q = q.lte('created_at', `${end}T23:59:59`);

    const { data, error } = await q;
    if (error) return res.status(500).json({ message: 'Failed to load orders', details: error.message });

    const term = String(body.searchTerm || '').trim().toLowerCase();
    const orders = (data || []).filter((o: any) => {
      if (!term) return true;
      const hay = [
        o.id,
        o?.recipient_info?.firstName,
        o?.recipient_info?.lastName,
        o?.recipient_info?.email,
        o?.recipient_info?.phone,
        o?.contacts?.crm?.number,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });

    return res.status(200).json({ ok: true, orders });
  } catch (e: any) {
    return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
  }
}

