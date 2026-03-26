import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { defaultHomeCmsConfig } from '../src/cms/homeConfig';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

const CMS_BUCKET = process.env.CMS_BUCKET || 'cms';

async function ensureCmsBucket() {
  const { data, error } = await supabaseService.storage.listBuckets();
  if (error) return;
  const exists = (data || []).some((b) => b.name === CMS_BUCKET);
  if (exists) return;
  await supabaseService.storage.createBucket(CMS_BUCKET, { public: true });
}

async function readJson<T>(path: string): Promise<T | null> {
  await ensureCmsBucket();
  const { data, error } = await supabaseService.storage.from(CMS_BUCKET).download(path);
  if (error || !data) return null;
  const ab = await data.arrayBuffer();
  const text = Buffer.from(ab).toString('utf-8');
  return JSON.parse(text) as T;
}

async function writeJson(path: string, payload: unknown) {
  await ensureCmsBucket();
  const body = Buffer.from(JSON.stringify(payload, null, 2), 'utf-8');
  const { error } = await supabaseService.storage
    .from(CMS_BUCKET)
    .upload(path, body, { contentType: 'application/json', upsert: true });
  if (error) throw new Error(error.message);
}

async function uploadFile(params: { path: string; contentType: string; data: Buffer }) {
  await ensureCmsBucket();
  const { error } = await supabaseService.storage
    .from(CMS_BUCKET)
    .upload(params.path, params.data, { contentType: params.contentType, upsert: true });
  if (error) throw new Error(error.message);
  const { data } = supabaseService.storage.from(CMS_BUCKET).getPublicUrl(params.path);
  return data.publicUrl;
}

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

async function requireAdmin(req: VercelRequest) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  if (!token) return { ok: false as const, status: 401 as const, message: 'Missing Authorization token' };

  const { data: authData, error: authError } = await supabaseAnon.auth.getUser(token);
  if (authError || !authData?.user) return { ok: false as const, status: 401 as const, message: 'Invalid user token' };

  const email = (authData.user.email || '').toLowerCase();
  const admins = getAdminEmailSet();
  if (!email) return { ok: false as const, status: 403 as const, message: 'User email is missing' };
  if (admins.size === 0 && !isDev()) return { ok: false as const, status: 403 as const, message: 'Admin access list is not configured' };
  if (admins.size > 0 && !admins.has(email)) return { ok: false as const, status: 403 as const, message: 'Forbidden' };

  return { ok: true as const, user: authData.user, token };
}

let stripe: Stripe | null = null;
function getStripe() {
  if (stripe) return stripe;
  stripe = new Stripe(process.env.STRIPE_SECRET || '', { apiVersion: '2024-04-10' } as any);
  return stripe;
}

function sanitizeBlocks(blocks: any) {
  const list = Array.isArray(blocks) ? blocks : [];
  const out = [];
  for (const b of list) {
    const type = String(b?.type || '').trim();
    const id = String(b?.id || '').trim() || `${type}-${Math.random().toString(16).slice(2)}`;
    if (type === 'heading') {
      const text = String(b?.text || '').trim();
      if (!text) continue;
      out.push({ id, type: 'heading', text });
      continue;
    }
    if (type === 'paragraph') {
      const text = String(b?.text || '').trim();
      if (!text) continue;
      out.push({ id, type: 'paragraph', text });
      continue;
    }
    if (type === 'image') {
      const url = String(b?.url || '').trim();
      if (!url) continue;
      const alt = String(b?.alt || '').trim() || undefined;
      const caption = String(b?.caption || '').trim() || undefined;
      out.push({ id, type: 'image', url, alt, caption });
      continue;
    }
  }
  return out;
}

function sanitizeNews(items: any[]) {
  const normalized = (items || [])
    .map((x) => ({
      id: Number(x?.id),
      title: String(x?.title || '').trim(),
      date: String(x?.date || '').trim(),
      image: String(x?.image || '').trim(),
      text: String(x?.text || '').trim(),
      link: String(x?.link || '').trim() || undefined,
      blocks: sanitizeBlocks(x?.blocks),
    }))
    .filter((x) => x.id && x.title && x.date && x.text);

  const seen = new Set<number>();
  const uniq = [];
  for (const n of normalized) {
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    uniq.push(n);
  }
  return uniq;
}

function safeBaseName(name: string) {
  const n = String(name || '').trim().toLowerCase();
  const cleaned = n.replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return cleaned || 'file';
}

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

function formatDateIsoRange(input?: string) {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const m = trimmed.match(/^(\d{2})[./-](\d{2})[./-](\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yyyy = Number(m[3]);
    if (yyyy >= 1900 && yyyy <= 2100 && mm >= 1 && mm <= 12 && dd >= 1 && dd <= 31) {
      return `${String(yyyy).padStart(4, '0')}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
    }
  }
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime())) {
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const day = d.getDate();
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  return null;
}

type Period = '6m' | '30d';

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

function detectDevice(userAgent: string | undefined): 'mobile' | 'desktop' {
  const ua = (userAgent || '').toLowerCase();
  if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) return 'mobile';
  return 'desktop';
}

function normalizePath(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) return null;
  if (trimmed.length > 512) return null;
  return trimmed;
}

type Device = 'desktop' | 'mobile';

function clampDays(value: unknown, fallback: number) {
  const parsed = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN;
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(365, Math.max(1, Math.floor(parsed)));
}

function isoDate(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function normalizePhoneE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) return digits;
  return `+${digits.replace(/^\+/, '')}`;
}

function countryIsoFrom(order: any): string | undefined {
  const iso = order?.shipping_address?.countryIso;
  if (iso) return iso;
  const country = order?.shipping_address?.country || order?.recipient_info?.country;
  if (!country) return undefined;
  const map: Record<string, string> = {
    'United States': 'US',
    USA: 'US',
    'United Kingdom': 'GB',
    UK: 'GB',
    Germany: 'DE',
    France: 'FR',
    Norway: 'NO',
  };
  return map[country] || undefined;
}

function parseMoney(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.toLowerCase() === 'preorder') return undefined;
    const normalized = trimmed.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    const num = parseFloat(normalized);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

async function fetchCrmOrderByExternalId(params: {
  apiUrl: string;
  apiKey: string;
  externalId: string;
  site?: string;
}) {
  const url =
    `${params.apiUrl}/api/v5/orders/${encodeURIComponent(params.externalId)}` +
    `?apiKey=${encodeURIComponent(params.apiKey)}` +
    `&by=externalId` +
    (params.site ? `&site=${encodeURIComponent(params.site)}` : '');

  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  const text = await r.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!r.ok || !data?.success) return null;
  return data?.order ?? null;
}

function mapCrmStatusToUiStatus(input?: string): OrderStatus | null {
  if (!input) return null;
  const code = input.trim().toLowerCase();

  if (['cancelled', 'canceled', 'cancel', 'cancellation', 'canceled-by-client', 'cancelled-by-client'].includes(code)) {
    return 'Canceled';
  }
  if (['delivered', 'completed', 'complete', 'done', 'success'].includes(code)) {
    return 'Delivered';
  }
  if (['shipped', 'sent', 'shipment', 'shipping'].includes(code)) {
    return 'Shipped';
  }
  if (['awaiting-pickup', 'awaiting_pickup', 'pickup', 'ready-for-pickup', 'ready_for_pickup'].includes(code)) {
    return 'Awaiting pickup';
  }
  if (['paid', 'payment-paid', 'payment_paid'].includes(code)) {
    return 'Paid';
  }
  if (
    [
      'awaiting-payment',
      'awaiting_payment',
      'not-paid',
      'not_paid',
      'invoice',
      'bill',
      'payment',
      'wait-payment',
      'wait_payment',
    ].includes(code)
  ) {
    return 'Awaiting payment';
  }
  if (['processing', 'assembling', 'assembly', 'in-assembly', 'in_assembly', 'in_the_assembly'].includes(code)) {
    return 'Processing';
  }
  if (['new', 'draft', 'created'].includes(code)) {
    return 'New';
  }

  return null;
}

function deriveUiStatus(params: {
  crmStatus?: string;
  fullPaidAt?: string | null;
  paymentStatuses?: string[];
}): OrderStatus {
  const base = mapCrmStatusToUiStatus(params.crmStatus) ?? 'New';
  const paymentStatuses = params.paymentStatuses ?? [];
  const hasPaid =
    Boolean(params.fullPaidAt) ||
    paymentStatuses.some((s) => ['paid', 'payment-paid', 'payment_paid'].includes((s || '').toLowerCase()));
  const hasNotPaid = paymentStatuses.some((s) => ['not-paid', 'not_paid'].includes((s || '').toLowerCase()));

  if (base === 'Canceled' || base === 'Delivered' || base === 'Shipped' || base === 'Awaiting pickup') {
    return base;
  }
  if (hasPaid) return 'Paid';
  if (hasNotPaid) return 'Awaiting payment';
  return base;
}

async function fetchCrmOrderByExternalIdStrict(externalId: string) {
  const apiUrl = process.env.RETAILCRM_URL;
  const apiKey = process.env.RETAILCRM_API_KEY;
  const site = process.env.RETAILCRM_SITE || undefined;

  if (!apiUrl || !apiKey) {
    throw new Error('RetailCRM credentials are missing');
  }

  const url =
    `${apiUrl}/api/v5/orders/${encodeURIComponent(externalId)}` +
    `?apiKey=${encodeURIComponent(apiKey)}` +
    `&by=externalId` +
    (site ? `&site=${encodeURIComponent(site)}` : '');

  const r = await fetch(url, { headers: { Accept: 'application/json' } });
  const text = await r.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  if (!r.ok || !data?.success) {
    const message = data?.errorMsg || data?.errors?.[0] || 'RetailCRM request failed';
    throw new Error(message);
  }
  return data?.order ?? null;
}

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

const NEWS_PATH = 'news.json';
const HOME_PATH = 'home.json';

const fallbackNews = [
  {
    id: 1,
    title: 'Protection of controllers',
    date: 'June 20, 2022',
    image: '/new1.png',
    text: 'New circuit engineering and improved protection of controllers from our users.',
    link: '/news/protection-of-controllers',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'New circuit engineering and improved protection of controllers from our users.' }],
  },
  {
    id: 2,
    title: 'Price increase',
    date: 'June 5, 2022',
    image: '/new2.png',
    text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...',
    link: '/news/price-increase',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...' }],
  },
  {
    id: 3,
    title: 'Big/Bug update!',
    date: 'May 28, 2022',
    image: '/new3.png',
    text: 'The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).' }],
  },
  {
    id: 4,
    title: 'Discount on pre-order',
    date: 'May 24, 2022',
    image: '/new4.png',
    text: 'Until the end of spring, you can order a controller with a 15% discount.',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'Until the end of spring, you can order a controller with a 15% discount.' }],
  },
];

function getRouteParts(req: VercelRequest) {
  const raw = (req.query as any)?.path;
  if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
  if (typeof raw === 'string' && raw) return [raw];
  return [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const parts = getRouteParts(req);
  const route = parts.join('/');

  if (!route) {
    return res.status(404).json({ message: 'Not Found' });
  }

  if (route === 'content/news') {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }

    try {
      const stored = await readJson<any[]>(NEWS_PATH);
      if (stored && Array.isArray(stored)) {
        return res.status(200).json({ ok: true, news: stored });
      }
      await writeJson(NEWS_PATH, fallbackNews);
      return res.status(200).json({ ok: true, news: fallbackNews });
    } catch (e: any) {
      return res.status(200).json({ ok: true, news: fallbackNews, warning: e?.message || String(e) });
    }
  }

  if (route === 'admin/news') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    const auth = await requireAdmin(req);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    try {
      const body = (req.body || {}) as { news?: any[] };
      const news = sanitizeNews(Array.isArray(body.news) ? body.news : []);
      await writeJson(NEWS_PATH, news);
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || String(e) });
    }
  }

  if (route === 'content/home') {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }

    try {
      const stored = await readJson<any>(HOME_PATH);
      if (stored && typeof stored === 'object') {
        return res.status(200).json({ ok: true, config: stored });
      }
      await writeJson(HOME_PATH, defaultHomeCmsConfig);
      return res.status(200).json({ ok: true, config: defaultHomeCmsConfig });
    } catch (e: any) {
      return res.status(200).json({ ok: true, config: defaultHomeCmsConfig, warning: e?.message || String(e) });
    }
  }

  if (route === 'admin/home') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    const auth = await requireAdmin(req);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    try {
      const body = (req.body || {}) as { config?: unknown };
      if (!body || !body.config || typeof body.config !== 'object') {
        return res.status(400).json({ message: 'Missing config' });
      }
      await writeJson(HOME_PATH, body.config);
      return res.status(200).json({ ok: true });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || String(e) });
    }
  }

  if (route === 'admin/upload') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    const auth = await requireAdmin(req);
    if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

    try {
      const body = (req.body || {}) as { filename?: string; contentType?: string; base64?: string; folder?: string };
      const base64 = String(body.base64 || '');
      if (!base64) return res.status(400).json({ message: 'Missing base64' });

      const contentType = String(body.contentType || 'application/octet-stream');
      const filename = safeBaseName(String(body.filename || 'upload'));
      const folder = safeBaseName(String(body.folder || 'uploads'));

      const data = Buffer.from(base64, 'base64');
      const ts = new Date().toISOString().replace(/[:.]/g, '-');
      const path = `${folder}/${ts}-${filename}`;

      const publicUrl = await uploadFile({ path, contentType, data });
      return res.status(200).json({ ok: true, url: publicUrl, path });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || String(e) });
    }
  }

  if (route === 'admin/orders') {
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

  if (route === 'admin/stats') {
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
          const { count } = await supabaseService
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('status', status);
          return [status, count || 0] as const;
        })
      );

      const countsByStatus = Object.fromEntries(statusCountsEntries) as Record<OrderStatus, number>;

      const now = new Date();
      const rangeStart = period === '30d' ? startOfDay(addDays(now, -29)) : startOfMonth(addMonths(now, -5));
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
                .map(([name, v]) => ({
                  name,
                  paidRevenue: v.paidRevenue,
                  paidOrders: v.paidOrders,
                  awaitingOrders: v.awaitingOrders,
                  sortKey: v.sortKey,
                }))
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

  if (route === 'admin/order') {
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

      const { data, error } = await supabaseService.from('orders').select('*').eq('id', orderId).single();
      if (error || !data) return res.status(404).json({ message: 'Order not found' });
      return res.status(200).json({ ok: true, order: data });
    } catch (e: any) {
      return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
    }
  }

  if (route === 'orders/create') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    try {
      if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ message: 'Server misconfiguration: Supabase env' });
      }
      const { payload } = req.body as { payload: any };
      if (!payload || !payload.user_id || !payload.total_amount) {
        return res.status(400).json({ message: 'Invalid order payload' });
      }
      const { data, error } = await supabaseService.from('orders').insert(payload).select().single();
      if (error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(200).json({ order: data });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  if (route === 'analytics/track') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }
    try {
      if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ message: 'Server misconfiguration: Supabase env' });
      }

      const path = normalizePath((req.body as any)?.path);
      if (!path) {
        return res.status(400).json({ message: 'Invalid path' });
      }

      const device = detectDevice(req.headers['user-agent']);
      const userId = typeof (req.body as any)?.userId === 'string' ? (req.body as any).userId : null;

      const { error } = await supabaseService.from('page_views').insert({
        path,
        device,
        user_id: userId,
      });

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      return res.status(204).end();
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  if (route === 'analytics/summary') {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).end('Method Not Allowed');
    }
    try {
      if (!supabaseUrl || !supabaseServiceKey) {
        return res.status(500).json({ message: 'Server misconfiguration: Supabase env' });
      }

      const days = clampDays((req.query as any).days, 30);
      const now = new Date();
      const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      const { data, error } = await supabaseService
        .from('page_views')
        .select('created_at, device')
        .gte('created_at', from.toISOString())
        .order('created_at', { ascending: true })
        .limit(50000);

      if (error) {
        return res.status(500).json({ message: error.message });
      }

      const byDevice: Record<Device, number> = { desktop: 0, mobile: 0 };
      const byDay: Record<string, { total: number; desktop: number; mobile: number }> = {};

      for (const row of data || []) {
        const device = (row as any).device as Device;
        if (device !== 'desktop' && device !== 'mobile') continue;

        byDevice[device] += 1;

        const dayKey = isoDate(new Date((row as any).created_at));
        if (!byDay[dayKey]) byDay[dayKey] = { total: 0, desktop: 0, mobile: 0 };
        byDay[dayKey].total += 1;
        byDay[dayKey][device] += 1;
      }

      const series: Array<{ name: string; value: number; desktop: number; mobile: number }> = [];
      for (let i = 0; i < days; i += 1) {
        const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
        const key = isoDate(d);
        const entry = byDay[key] || { total: 0, desktop: 0, mobile: 0 };
        series.push({ name: key, value: entry.total, desktop: entry.desktop, mobile: entry.mobile });
      }

      return res.status(200).json({
        days,
        total: byDevice.desktop + byDevice.mobile,
        desktop: byDevice.desktop,
        mobile: byDevice.mobile,
        series,
      });
    } catch (e: any) {
      return res.status(500).json({ message: e?.message || 'Server error' });
    }
  }

  if (route === 'checkout-session') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    const { orderId } = req.body as any;
    if (!orderId) {
      return res.status(400).json({ message: 'Missing orderId' });
    }

    try {
      const { data: order, error } = await supabaseService.from('orders').select('*').eq('id', orderId).single();
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
      res.status(500).json({ message: err.message });
    }
  }

  if (route === 'retailcrm/order') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    try {
      const apiUrl = process.env.RETAILCRM_URL;
      const apiKey = process.env.RETAILCRM_API_KEY;
      const managerId = process.env.RETAILCRM_MANAGER_ID ? Number(process.env.RETAILCRM_MANAGER_ID) : undefined;
      const site = process.env.RETAILCRM_SITE || undefined;

      if (!apiUrl || !apiKey) {
        return res.status(500).json({ message: 'RetailCRM credentials are missing' });
      }

      const { order } = req.body as { order: any };
      if (!order || !order.id) {
        return res.status(400).json({ message: 'Invalid order payload' });
      }

      const discountAmount = (order.discount_total as number) ?? (order.contacts?.discountAmount as number) ?? 0;
      const discountPercent = (order.discount_percent as number) ?? (order.contacts?.discountPercent as number) ?? undefined;

      const itemsArray = Array.isArray(order.items) ? order.items : [];
      const orderTotal = parseMoney(order.total_amount);

      const addr = order.shipping_address || {};
      const phoneRaw = order?.recipient_info?.phone || order?.customer_phone || order?.contacts?.phone || undefined;
      const payload = {
        order: {
          externalId: order.id,
          ...(site ? { site } : {}),
          firstName: order.recipient_info?.firstName,
          lastName: order.recipient_info?.lastName,
          phone: normalizePhoneE164(phoneRaw),
          email: order.recipient_info?.email,
          items: itemsArray.map((i: any) => {
            const article = i.article ?? i.sku;
            const quantity = typeof i.quantity === 'number' && i.quantity > 0 ? i.quantity : 1;
            const unitPrice =
              parseMoney(i.price) ??
              parseMoney(i.initialPrice) ??
              (parseMoney(i.total) !== undefined ? (parseMoney(i.total) as number) / quantity : undefined) ??
              (itemsArray.length === 1 && orderTotal !== undefined ? orderTotal / quantity : undefined);
            const item: any = {
              quantity,
              productName: i.title || i.name || 'Item',
            };
            if (article) {
              item.offer = { article };
            }
            if (typeof unitPrice === 'number' && !isNaN(unitPrice)) {
              item.initialPrice = Math.round(unitPrice * 100) / 100;
            }
            return item;
          }),
          customerComment: order.contacts?.comment || '',
          delivery: {
            address: {
              countryIso: countryIsoFrom(order),
              index: addr.zipCode || addr.postcode || undefined,
              region: addr.region || undefined,
              city: addr.city || undefined,
              text: order.customer_address || addr.text || undefined,
            },
          },
          status: 'new',
          ...(managerId ? { managerId } : {}),
          discountManualAmount: discountPercent ? undefined : discountAmount,
          discountManualPercent: discountPercent ?? undefined,
          customFields: {
            ...(order.contacts?.telegram ? { telegram_nick: order.contacts.telegram } : {}),
            ...(order.contacts?.whatsapp
              ? { messenger: 'WhatsApp' }
              : order.contacts?.messenger
              ? { messenger: order.contacts.messenger }
              : {}),
          },
        },
      };

      try {
        await supabaseService.from('orders').update({ status: 'Processing' }).eq('id', order.id);
      } catch (e: any) {
      }
      const url = `${apiUrl}/api/v5/orders/create?apiKey=${apiKey}${site ? `&site=${encodeURIComponent(site)}` : ''}`;
      const form = new URLSearchParams();
      form.set('order', JSON.stringify(payload.order));
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' },
        body: form.toString(),
      });
      const text = await r.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }
      if (!r.ok) {
        try {
          await supabaseService.from('orders').update({ status: 'Error' }).eq('id', order.id);
        } catch {}
        return res.status(r.status).json({ message: 'RetailCRM error', details: data });
      }

      try {
        const crmOrder = await fetchCrmOrderByExternalId({ apiUrl, apiKey, externalId: order.id, site });
        const crmId = crmOrder?.id ?? null;
        const crmNumber = crmOrder?.number ?? null;
        const prevContacts = order.contacts && typeof order.contacts === 'object' ? order.contacts : {};
        const nextContacts = {
          ...prevContacts,
          crm: {
            ...(prevContacts?.crm && typeof prevContacts.crm === 'object' ? prevContacts.crm : {}),
            id: crmId,
            number: crmNumber,
            syncedAt: new Date().toISOString(),
          },
        };
        await supabaseService.from('orders').update({ status: 'Sent', contacts: nextContacts }).eq('id', order.id);
      } catch {
        try {
          await supabaseService.from('orders').update({ status: 'Sent' }).eq('id', order.id);
        } catch {}
      }

      return res.status(200).json({ ok: true, data });
    } catch (e: any) {
      return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
    }
  }

  if (route === 'retailcrm/sync') {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).end('Method Not Allowed');
    }

    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
      if (!token) {
        return res.status(401).json({ message: 'Missing Authorization token' });
      }

      const { data: authData, error: authError } = await supabaseAnon.auth.getUser(token);
      if (authError || !authData?.user) {
        return res.status(401).json({ message: 'Invalid user token' });
      }

      const userId = authData.user.id;
      const body = (req.body ?? {}) as { orderIds?: string[] };
      const orderIds =
        Array.isArray(body.orderIds) && body.orderIds.length > 0
          ? body.orderIds.filter((x) => typeof x === 'string' && x.trim())
          : null;

      const baseQuery = supabaseService
        .from('orders')
        .select('id,user_id,status,contacts,total_amount,updated_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(25);

      const { data: orders, error: ordersError } = orderIds ? await baseQuery.in('id', orderIds) : await baseQuery;

      if (ordersError) {
        return res.status(500).json({ message: 'Failed to load orders', details: ordersError.message });
      }

      const updates: Record<string, { status: OrderStatus; contacts?: any }> = {};

      for (const row of orders ?? []) {
        const externalId = String(row.id);
        let crmOrder: any;
        try {
          crmOrder = await fetchCrmOrderByExternalIdStrict(externalId);
        } catch {
          continue;
        }

        const crmStatus = crmOrder?.status;
        const crmNumber = crmOrder?.number ?? null;
        const crmId = crmOrder?.id ?? null;
        const payments = Array.isArray(crmOrder?.payments) ? crmOrder.payments : [];
        const paymentStatuses: string[] = payments.map((p: any) => p?.status).filter(Boolean);
        const fullPaidAt: string | null = crmOrder?.fullPaidAt || null;
        const paidAt: string | null =
          fullPaidAt ||
          payments
            .map((p: any) => p?.paidAt)
            .filter(Boolean)
            .sort()
            .slice(-1)[0] ||
          null;

        const prevContacts = row.contacts && typeof row.contacts === 'object' ? row.contacts : {};
        const stripePaid =
          Boolean((prevContacts as any)?.payment?.paidAt) || String((prevContacts as any)?.payment?.status || '').toLowerCase() === 'paid';
        const dbPaid = row.status === 'Paid';
        const keepPaid = stripePaid || dbPaid;

        let nextStatus = deriveUiStatus({ crmStatus, fullPaidAt, paymentStatuses });
        if (keepPaid && !['Canceled', 'Delivered', 'Shipped', 'Awaiting pickup'].includes(nextStatus)) {
          nextStatus = 'Paid';
        }
        const nextContacts = {
          ...prevContacts,
          crm: {
            ...(prevContacts?.crm && typeof prevContacts.crm === 'object' ? prevContacts.crm : {}),
            id: crmId,
            number: crmNumber,
            status: crmStatus || null,
            fullPaidAt,
            paidAt,
            paymentStatuses,
            syncedAt: new Date().toISOString(),
          },
        };

        const { error: updateError } = await supabaseService
          .from('orders')
          .update({ status: nextStatus, contacts: nextContacts })
          .eq('id', row.id)
          .eq('user_id', userId);

        if (!updateError) {
          updates[String(row.id)] = { status: nextStatus, contacts: nextContacts };
        }
      }

      return res.status(200).json({ ok: true, updates });
    } catch (e: any) {
      return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
    }
  }

  if (route === 'debug/env') {
    const debugToken = process.env.DEBUG_TOKEN;
    const providedToken = (req.headers['x-debug-token'] as string | undefined) || ((req.query as any).token as string | undefined);
    if (!debugToken || providedToken !== debugToken) {
      return res.status(404).end();
    }
    const vars = {
      RETAILCRM_URL: !!process.env.RETAILCRM_URL,
      RETAILCRM_API_KEY: !!process.env.RETAILCRM_API_KEY,
      RETAILCRM_MANAGER_ID: !!process.env.RETAILCRM_MANAGER_ID,
      VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      STRIPE_SECRET: !!process.env.STRIPE_SECRET,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      FRONTEND_URL: !!process.env.FRONTEND_URL,
      VITE_API_BASE_URL: !!process.env.VITE_API_BASE_URL,
    };
    return res.status(200).json({ ok: true, vars });
  }

  return res.status(404).json({ message: 'Not Found' });
}
