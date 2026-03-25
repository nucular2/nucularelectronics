import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

const supabaseService = createClient(supabaseUrl, supabaseServiceKey);
const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

type Period = '6m' | '30d';

type OrderStatus =
  | 'New'
  | 'Processing'
  | 'Awaiting payment'
  | 'Paid'
  | 'Shipped'
  | 'Awaiting pickup'
  | 'Delivered'
  | 'Canceled';

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

function clampPeriod(input: unknown): Period {
  return input === '30d' ? '30d' : '6m';
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function formatDayLabel(d: Date) {
  return `${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function formatMonthLabel(d: Date) {
  return d.toLocaleString('en-US', { month: 'short' });
}

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d: Date, days: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addMonths(d: Date, months: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + months);
  return x;
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

    const body = (req.body || {}) as { period?: Period };
    const period = clampPeriod(body.period);

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

    const statusCountsEntries = await Promise.all(
      ([
        'New',
        'Processing',
        'Awaiting payment',
        'Paid',
        'Shipped',
        'Awaiting pickup',
        'Delivered',
        'Canceled',
      ] as OrderStatus[]).map(async (status) => {
        const { count } = await supabaseService.from('orders').select('id', { count: 'exact', head: true }).eq('status', status);
        return [status, count || 0] as const;
      })
    );

    const countsByStatus = Object.fromEntries(statusCountsEntries) as Record<OrderStatus, number>;

    const now = new Date();
    const rangeStart =
      period === '30d' ? startOfDay(addDays(now, -29)) : startOfMonth(addMonths(now, -5));
    const rangeStartIso = rangeStart.toISOString();

    const [{ data: paidInRange }, { data: awaitingInRange }] = await Promise.all([
      supabaseService
        .from('orders')
        .select('created_at,total_amount')
        .eq('status', 'Paid')
        .gte('created_at', rangeStartIso)
        .limit(5000),
      supabaseService
        .from('orders')
        .select('created_at')
        .eq('status', 'Awaiting payment')
        .gte('created_at', rangeStartIso)
        .limit(5000),
    ]);

    const series =
      period === '30d'
        ? (() => {
            const buckets = new Map<string, { paidRevenue: number; paidOrders: number; awaitingOrders: number }>();
            for (let i = 0; i < 30; i++) {
              const d = addDays(rangeStart, i);
              buckets.set(formatDayLabel(d), { paidRevenue: 0, paidOrders: 0, awaitingOrders: 0 });
            }
            for (const row of paidInRange || []) {
              const label = formatDayLabel(new Date((row as any).created_at));
              const bucket = buckets.get(label);
              if (!bucket) continue;
              bucket.paidOrders += 1;
              bucket.paidRevenue += Number((row as any).total_amount || 0);
            }
            for (const row of awaitingInRange || []) {
              const label = formatDayLabel(new Date((row as any).created_at));
              const bucket = buckets.get(label);
              if (!bucket) continue;
              bucket.awaitingOrders += 1;
            }
            return Array.from(buckets.entries()).map(([name, v]) => ({ name, ...v }));
          })()
        : (() => {
            const buckets = new Map<string, { paidRevenue: number; paidOrders: number; awaitingOrders: number; sortKey: number }>();
            for (let i = 0; i < 6; i++) {
              const d = addMonths(rangeStart, i);
              const label = formatMonthLabel(d);
              buckets.set(label, { paidRevenue: 0, paidOrders: 0, awaitingOrders: 0, sortKey: d.getTime() });
            }
            for (const row of paidInRange || []) {
              const d = new Date((row as any).created_at);
              const label = formatMonthLabel(d);
              const bucket = buckets.get(label);
              if (!bucket) continue;
              bucket.paidOrders += 1;
              bucket.paidRevenue += Number((row as any).total_amount || 0);
            }
            for (const row of awaitingInRange || []) {
              const d = new Date((row as any).created_at);
              const label = formatMonthLabel(d);
              const bucket = buckets.get(label);
              if (!bucket) continue;
              bucket.awaitingOrders += 1;
            }
            return Array.from(buckets.entries())
              .map(([name, v]) => ({ name, paidRevenue: v.paidRevenue, paidOrders: v.paidOrders, awaitingOrders: v.awaitingOrders, sortKey: v.sortKey }))
              .sort((a, b) => a.sortKey - b.sortKey)
              .map(({ sortKey: _sortKey, ...rest }) => rest);
          })();

    const { data: recentOrders, error: recentError } = await supabaseService
      .from('orders')
      .select('id,created_at,total_amount,status,recipient_info,contacts')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentError) return res.status(500).json({ message: 'Failed to load recent orders', details: recentError.message });

    return res.status(200).json({
      ok: true,
      period,
      totalOrders: totalOrders || 0,
      paidOrders: paidOrders || 0,
      awaitingPaymentOrders: awaitingPaymentOrders || 0,
      paidRevenue,
      countsByStatus,
      series,
      recentOrders: recentOrders || [],
    });
  } catch (e: any) {
    return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
  }
}
