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
  const hasNotPaid =
    paymentStatuses.some((s) => ['not-paid', 'not_paid'].includes((s || '').toLowerCase()));
 
  if (base === 'Canceled' || base === 'Delivered' || base === 'Shipped' || base === 'Awaiting pickup') {
    return base;
  }
  if (hasPaid) return 'Paid';
  if (hasNotPaid) return 'Awaiting payment';
  return base;
}
 
async function fetchCrmOrderByExternalId(externalId: string) {
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
 
export default async function handler(req: VercelRequest, res: VercelResponse) {
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
 
    const { data: orders, error: ordersError } = orderIds
      ? await baseQuery.in('id', orderIds)
      : await baseQuery;
 
    if (ordersError) {
      return res.status(500).json({ message: 'Failed to load orders', details: ordersError.message });
    }
 
    const updates: Record<string, { status: OrderStatus; contacts?: any }> = {};
 
    for (const row of orders ?? []) {
      const externalId = String(row.id);
      let crmOrder: any;
      try {
        crmOrder = await fetchCrmOrderByExternalId(externalId);
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
        Boolean(prevContacts?.payment?.paidAt) || String(prevContacts?.payment?.status || '').toLowerCase() === 'paid';
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
