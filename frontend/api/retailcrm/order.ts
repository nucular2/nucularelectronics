import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const discountAmount =
      (order.discount_total as number) ??
      (order.contacts?.discountAmount as number) ??
      0;
    const discountPercent =
      (order.discount_percent as number) ??
      (order.contacts?.discountPercent as number) ??
      undefined;

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
          ...(order.contacts?.whatsapp ? { messenger: 'WhatsApp' } : order.contacts?.messenger ? { messenger: order.contacts.messenger } : {}),
        },
      },
    };

    try {
      await supabase.from('orders').update({ status: 'Processing' }).eq('id', order.id);
    } catch (e: any) {
      // Do not fail CRM call due to supabase error; still attempt send
    }
    const url = `${apiUrl}/api/v5/orders/create?apiKey=${apiKey}${site ? `&site=${encodeURIComponent(site)}` : ''}`;
    const form = new URLSearchParams();
    form.set('order', JSON.stringify(payload.order));
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
      body: form.toString(),
    });
    const text = await r.text();
    let data: any = {};
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    if (!r.ok) {
      try { await supabase.from('orders').update({ status: 'Error' }).eq('id', order.id); } catch {}
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
      await supabase.from('orders').update({ status: 'Sent', contacts: nextContacts }).eq('id', order.id);
    } catch {
      try { await supabase.from('orders').update({ status: 'Sent' }).eq('id', order.id); } catch {}
    }

    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    return res.status(500).json({ message: 'Handler exception', details: e?.message || String(e) });
  }
}
