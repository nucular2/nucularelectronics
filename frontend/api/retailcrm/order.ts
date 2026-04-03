import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getBodyAny(req: VercelRequest): any {
  const b: any = (req as any).body;
  if (!b) return {};
  if (typeof b === "string") {
    try {
      return JSON.parse(b);
    } catch {
      return {};
    }
  }
  if (typeof b === "object") return b;
  return {};
}

function normalizePhoneE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  return `+${digits.replace(/^\+/, "")}`;
}

function parseMoney(input: unknown): number | undefined {
  const n = typeof input === "number" ? input : Number(input);
  if (!Number.isFinite(n)) return undefined;
  return Math.round(n * 100) / 100;
}

function normalizePaymentType(typeIn: any, fallbackCode: string) {
  if (typeIn && typeof typeIn === "object") {
    const code = String((typeIn as any).code || "").trim();
    if (code) return code;
  }
  return String(typeIn || fallbackCode || "").trim();
}

function fnv1aHex(input: string) {
  let h1 = 2166136261;
  let h2 = 2166136261 ^ 0x9e3779b9;
  for (let i = 0; i < input.length; i += 1) {
    const c = input.charCodeAt(i);
    h1 ^= c;
    h1 = Math.imul(h1, 16777619);
    h2 ^= c;
    h2 = Math.imul(h2, 2166136261);
  }
  const a = (h1 >>> 0).toString(16).padStart(8, "0");
  const b = (h2 >>> 0).toString(16).padStart(8, "0");
  return `${a}${b}`;
}

function safePaymentExternalId(params: { provider: string; orderId: string }) {
  const base = `pending_${params.provider}_${params.orderId}`;
  const max = 50;
  const normalizedBase = base.replace(/[^a-zA-Z0-9_]/g, "_");
  if (normalizedBase.length <= max) return normalizedBase;
  const hash = fnv1aHex(base).slice(0, 10);
  const orderPart = String(params.orderId || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || "order";
  const compact = `pending_${params.provider}_${orderPart}_${hash}`.replace(/[^a-zA-Z0-9_]/g, "_");
  return compact.length <= max ? compact : compact.slice(0, max);
}

async function parseCrmApiResult(r: Response) {
  const text = await r.text();
  let data: any = {};
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }
  const ok = r.ok && Boolean(data?.success);
  return { ok, status: r.status, data, message: data?.errorMsg || data?.errors?.[0] || (r.ok ? "" : "RetailCRM request failed") };
}

async function fetchCrmOrderByExternalId(params: { apiUrl: string; apiKey: string; externalId: string; site?: string }) {
  const url =
    `${params.apiUrl}/api/v5/orders/${encodeURIComponent(params.externalId)}` +
    `?apiKey=${encodeURIComponent(params.apiKey)}` +
    `&by=externalId` +
    (params.site ? `&site=${encodeURIComponent(params.site)}` : "");
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const parsed = await parseCrmApiResult(r);
  if (!parsed.ok) return null;
  return parsed.data?.order ?? null;
}

async function crmUpsertOrderPayment(params: {
  apiUrl: string;
  apiKey: string;
  site?: string;
  orderExternalId: string;
  paymentExternalId: string;
  paymentType: string;
  status: string;
  amount: number;
}) {
  const crmOrder = await fetchCrmOrderByExternalId({
    apiUrl: params.apiUrl,
    apiKey: params.apiKey,
    externalId: params.orderExternalId,
    site: params.site,
  });
  const payments = Array.isArray(crmOrder?.payments) ? crmOrder.payments : [];
  const paidCodes = ["paid", "payment-paid", "payment_paid", "succeeded"];
  const normalizedAmount = Math.round(params.amount * 100) / 100;
  const exactMatch = (value: unknown) => Math.abs(Number(value) - normalizedAmount) < 0.01;

  const candidate =
    payments.find((p: any) => p?.externalId && String(p.externalId) === params.paymentExternalId) ||
    payments.find((p: any) => {
      const status = String(p?.status || "").toLowerCase();
      if (paidCodes.includes(status)) return false;
      if (!exactMatch(p?.amount)) return false;
      return true;
    }) ||
    null;

  const paymentBase: any = {
    externalId: candidate?.externalId || params.paymentExternalId,
    order: { externalId: params.orderExternalId },
    amount: normalizedAmount,
    type: normalizePaymentType(candidate?.type, params.paymentType),
    status: params.status,
  };

  if (candidate?.id) {
    const editUrl = `${params.apiUrl}/api/v5/orders/payments/${encodeURIComponent(String(candidate.id))}/edit?apiKey=${encodeURIComponent(params.apiKey)}${
      params.site ? `&site=${encodeURIComponent(params.site)}` : ""
    }`;
    const form = new URLSearchParams();
    form.set("payment", JSON.stringify(paymentBase));
    const r = await fetch(editUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: form.toString(),
    });
    const parsed = await parseCrmApiResult(r);
    if (!parsed.ok) throw new Error(parsed.message || "RetailCRM payments edit failed");
    return;
  }

  const createUrl = `${params.apiUrl}/api/v5/orders/payments/create?apiKey=${encodeURIComponent(params.apiKey)}${
    params.site ? `&site=${encodeURIComponent(params.site)}` : ""
  }`;
  const form = new URLSearchParams();
  form.set("payment", JSON.stringify(paymentBase));
  const r = await fetch(createUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: form.toString(),
  });
  const parsed = await parseCrmApiResult(r);
  if (!parsed.ok) throw new Error(parsed.message || "RetailCRM payments create failed");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const apiUrl = process.env.RETAILCRM_URL;
    const apiKey = process.env.RETAILCRM_API_KEY;
    const managerId = process.env.RETAILCRM_MANAGER_ID ? Number(process.env.RETAILCRM_MANAGER_ID) : undefined;
    const site = process.env.RETAILCRM_SITE || undefined;
    const paymentTypeStripe = process.env.RETAILCRM_PAYMENT_TYPE_STRIPE || process.env.RETAILCRM_PAYMENT_TYPE || "stripe-payment";
    const paymentTypePayPal = process.env.RETAILCRM_PAYMENT_TYPE_PAYPAL || "paypal";
    const paymentTypeBank = process.env.RETAILCRM_PAYMENT_TYPE_BANK || "bank-transfer";
    const paymentTypeNoPayment = process.env.RETAILCRM_PAYMENT_TYPE_NO_PAYMENT || "no-payment";
    const paymentStatusNotPaid = process.env.RETAILCRM_PAYMENT_STATUS_NOT_PAID || "not-paid";

    if (!apiUrl || !apiKey) {
      return res.status(500).json({ message: "RetailCRM credentials are missing" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ message: "Supabase service credentials are missing" });
    }
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = getBodyAny(req);
    const order = body?.order;
    if (!order || !order.id) return res.status(400).json({ message: "Invalid order payload" });

    const discountAmount = (order.discount_total as number) ?? (order.contacts?.discountAmount as number) ?? 0;
    const discountPercent = (order.discount_percent as number) ?? (order.contacts?.discountPercent as number) ?? undefined;

    const itemsArray = Array.isArray(order.items) ? order.items : [];
    const orderTotal = parseMoney(order.total_amount);

    const addr = order.shipping_address || {};
    const phoneRaw = order?.recipient_info?.phone || order?.customer_phone || order?.contacts?.phone || undefined;

    const payload: any = {
      order: {
        externalId: order.id,
        ...(site ? { site } : {}),
        firstName: order.recipient_info?.firstName,
        lastName: order.recipient_info?.lastName,
        phone: normalizePhoneE164(phoneRaw),
        email: order.recipient_info?.email,
        items: itemsArray.map((i: any) => {
          const article = i.article ?? i.sku;
          const quantity = typeof i.quantity === "number" && i.quantity > 0 ? i.quantity : 1;
          const unitPrice = parseMoney(i.price) ?? parseMoney(i.initialPrice);
          const item: any = { quantity, productName: i.title || i.name || "Item" };
          if (article) item.offer = { article };
          if (typeof unitPrice === "number") item.initialPrice = unitPrice;
          return item;
        }),
        customerComment: order.contacts?.comment || "",
        delivery: {
          address: {
            index: addr.zipCode || addr.postcode || undefined,
            region: addr.region || undefined,
            city: addr.city || undefined,
            text: order.customer_address || addr.text || undefined,
          },
        },
        status: "new",
        ...(managerId ? { managerId } : {}),
        discountManualAmount: discountPercent ? undefined : discountAmount,
        discountManualPercent: discountPercent ?? undefined,
        customFields: {
          ...(order.contacts?.telegram ? { telegram_nick: order.contacts.telegram } : {}),
          ...(order.contacts?.whatsapp ? { messenger: "WhatsApp" } : order.contacts?.messenger ? { messenger: order.contacts.messenger } : {}),
        },
      },
    };

    try {
      await supabase.from("orders").update({ status: "Processing" }).eq("id", order.id);
    } catch {}

    const url = `${apiUrl}/api/v5/orders/create?apiKey=${encodeURIComponent(apiKey)}${site ? `&site=${encodeURIComponent(site)}` : ""}`;
    const form = new URLSearchParams();
    form.set("order", JSON.stringify(payload.order));
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: form.toString(),
    });
    const parsed = await parseCrmApiResult(r);
    if (!parsed.ok) {
      try {
        await supabase.from("orders").update({ status: "Error" }).eq("id", order.id);
      } catch {}
      return res.status(parsed.status).json({ message: parsed.message || "RetailCRM error", details: parsed.data });
    }

    try {
      const crmOrder = await fetchCrmOrderByExternalId({ apiUrl, apiKey, externalId: String(order.id), site });
      const crmId = crmOrder?.id ?? null;
      const crmNumber = crmOrder?.number ?? null;
      const prevContacts = order.contacts && typeof order.contacts === "object" ? order.contacts : {};
      const nextContacts = {
        ...prevContacts,
        crm: {
          ...(prevContacts?.crm && typeof prevContacts.crm === "object" ? prevContacts.crm : {}),
          id: crmId,
          number: crmNumber,
          syncedAt: new Date().toISOString(),
        },
      };
      await supabase.from("orders").update({ status: "Sent", contacts: nextContacts }).eq("id", order.id);

      const amount = typeof orderTotal === "number" && orderTotal > 0 ? orderTotal : parseMoney(order.total_amount) || 0;
      if (amount > 0) {
        const pm = String(order?.contacts?.paymentMethod || "").trim().toLowerCase();
        const paymentType =
          pm === "paypal"
            ? paymentTypePayPal
            : pm === "bank"
            ? paymentTypeBank
            : pm === "no_payment"
            ? paymentTypeNoPayment
            : paymentTypeStripe;
        const paymentExternalId = safePaymentExternalId({ provider: pm || "card", orderId: String(order.id) });
        await crmUpsertOrderPayment({
          apiUrl,
          apiKey,
          site,
          orderExternalId: String(order.id),
          paymentExternalId,
          paymentType,
          status: paymentStatusNotPaid,
          amount,
        });
      }
    } catch {
      try {
        await supabase.from("orders").update({ status: "Sent" }).eq("id", order.id);
      } catch {}
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: "Handler exception", details: e?.message || String(e) });
  }
}
