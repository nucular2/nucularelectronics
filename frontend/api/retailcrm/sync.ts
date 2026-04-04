import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

type OrderStatus =
  | "New"
  | "Processing"
  | "Awaiting payment"
  | "Paid"
  | "Shipped"
  | "Awaiting pickup"
  | "Delivered"
  | "Canceled";

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

async function fetchCrmOrderByExternalIdStrict(params: { apiUrl: string; apiKey: string; externalId: string; site?: string }) {
  const url =
    `${params.apiUrl}/api/v5/orders/${encodeURIComponent(params.externalId)}` +
    `?apiKey=${encodeURIComponent(params.apiKey)}` +
    `&by=externalId` +
    (params.site ? `&site=${encodeURIComponent(params.site)}` : "");
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const parsed = await parseCrmApiResult(r);
  if (!parsed.ok) {
    throw new Error(parsed.message || "RetailCRM request failed");
  }
  return parsed.data?.order ?? null;
}

function crmDatetime(input?: string) {
  const d = input ? new Date(input) : new Date();
  if (!Number.isFinite(d.getTime())) {
    const now = new Date();
    const y = now.getUTCFullYear();
    const m = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");
    const hh = String(now.getUTCHours()).padStart(2, "0");
    const mm = String(now.getUTCMinutes()).padStart(2, "0");
    const ss = String(now.getUTCSeconds()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
  }
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  const ss = String(d.getUTCSeconds()).padStart(2, "0");
  return `${y}-${m}-${day} ${hh}:${mm}:${ss}`;
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
  const base = `reconcile_${params.provider}_${params.orderId}`;
  const max = 50;
  const normalizedBase = base.replace(/[^a-zA-Z0-9_]/g, "_");
  if (normalizedBase.length <= max) return normalizedBase;
  const hash = fnv1aHex(base).slice(0, 10);
  const orderPart = String(params.orderId || "").replace(/[^a-zA-Z0-9]/g, "").slice(0, 12) || "order";
  const compact = `reconcile_${params.provider}_${orderPart}_${hash}`.replace(/[^a-zA-Z0-9_]/g, "_");
  return compact.length <= max ? compact : compact.slice(0, max);
}

function pickPaymentTypeCode(contacts: any) {
  const byProvider = String(contacts?.payment?.provider || "").trim().toLowerCase();
  const byMethod = String(contacts?.paymentMethod || "").trim().toLowerCase();
  const stripe = process.env.RETAILCRM_PAYMENT_TYPE_STRIPE || process.env.RETAILCRM_PAYMENT_TYPE || "stripe-payment";
  const paypal = process.env.RETAILCRM_PAYMENT_TYPE_PAYPAL || "paypal";
  const bank = process.env.RETAILCRM_PAYMENT_TYPE_BANK || "bank-transfer";
  const crypto = process.env.RETAILCRM_PAYMENT_TYPE_CRYPTO || "bank-transfer";
  const noPayment = process.env.RETAILCRM_PAYMENT_TYPE_NO_PAYMENT || "no-payment";
  if (byProvider === "paypal") return paypal;
  if (byProvider === "stripe") return stripe;
  if (byMethod === "paypal") return paypal;
  if (byMethod === "bank") return bank;
  if (byMethod === "crypto") return crypto;
  if (byMethod === "no_payment") return noPayment;
  return stripe;
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
  paidAtIso?: string;
}) {
  const fetchOrderUrl =
    `${params.apiUrl}/api/v5/orders/${encodeURIComponent(params.orderExternalId)}` +
    `?apiKey=${encodeURIComponent(params.apiKey)}` +
    `&by=externalId` +
    (params.site ? `&site=${encodeURIComponent(params.site)}` : "");

  let crmOrder: any = null;
  try {
    const r = await fetch(fetchOrderUrl, { headers: { Accept: "application/json" } });
    const parsed = await parseCrmApiResult(r);
    crmOrder = parsed.ok ? parsed.data?.order : null;
  } catch {
    crmOrder = null;
  }

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
  if (params.paidAtIso) paymentBase.paidAt = crmDatetime(params.paidAtIso);

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

function mapCrmStatusToUiStatus(input?: string): OrderStatus | null {
  if (!input) return null;
  const code = input.trim().toLowerCase();

  if (["cancelled", "canceled", "cancel", "cancellation", "canceled-by-client", "cancelled-by-client"].includes(code)) {
    return "Canceled";
  }
  if (["delivered", "completed", "complete", "done", "success"].includes(code)) {
    return "Delivered";
  }
  if (["shipped", "sent", "shipment", "shipping"].includes(code)) {
    return "Shipped";
  }
  if (["awaiting-pickup", "awaiting_pickup", "pickup", "ready-for-pickup", "ready_for_pickup"].includes(code)) {
    return "Awaiting pickup";
  }
  if (["paid", "payment-paid", "payment_paid"].includes(code)) {
    return "Paid";
  }
  if (["awaiting-payment", "awaiting_payment", "not-paid", "not_paid", "invoice", "bill", "payment", "wait-payment", "wait_payment"].includes(code)) {
    return "Awaiting payment";
  }
  if (["processing", "assembling", "assembly", "in-assembly", "in_assembly", "in_the_assembly"].includes(code)) {
    return "Processing";
  }
  if (["new", "draft", "created"].includes(code)) {
    return "New";
  }
  return null;
}

function deriveUiStatus(params: { crmStatus?: string; fullPaidAt?: string | null; paymentStatuses?: string[] }): OrderStatus {
  const base = mapCrmStatusToUiStatus(params.crmStatus) ?? "New";
  const paymentStatuses = params.paymentStatuses ?? [];
  const hasPaid =
    Boolean(params.fullPaidAt) || paymentStatuses.some((s) => ["paid", "payment-paid", "payment_paid", "succeeded"].includes((s || "").toLowerCase()));
  const hasNotPaid = paymentStatuses.some((s) => ["not-paid", "not_paid"].includes((s || "").toLowerCase()));

  if (base === "Canceled" || base === "Delivered" || base === "Shipped" || base === "Awaiting pickup") return base;
  if (hasPaid) return "Paid";
  if (hasNotPaid) return "Awaiting payment";
  return base;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const apiUrl = process.env.RETAILCRM_URL;
    const apiKey = process.env.RETAILCRM_API_KEY;
    const site = process.env.RETAILCRM_SITE || undefined;
    if (!apiUrl || !apiKey) return res.status(500).json({ message: "RetailCRM credentials are missing" });

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return res.status(500).json({ message: "Supabase credentials are missing" });
    }
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) return res.status(401).json({ message: "Missing Authorization token" });
    const { data: authData, error: authError } = await supabaseAnon.auth.getUser(token);
    if (authError || !authData?.user) return res.status(401).json({ message: "Invalid user token" });
    const userId = authData.user.id;

    const body = getBodyAny(req);
    const orderIds: string[] = Array.isArray(body?.orderIds) ? body.orderIds.map(String).filter(Boolean) : [];

    let query = supabaseService
      .from("orders")
      .select("id,user_id,status,contacts,total_amount,updated_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(25);

    if (orderIds.length > 0) {
      query = query.in("id", orderIds);
    }

    const { data: orders, error: ordersError } = await query;
    if (ordersError) return res.status(500).json({ message: "Failed to load orders", details: ordersError.message });

    const updates: Record<string, { status: OrderStatus; contacts?: any }> = {};

    for (const row of orders ?? []) {
      const externalId = String((row as any).id);
      let crmOrder: any;
      try {
        crmOrder = await fetchCrmOrderByExternalIdStrict({ apiUrl, apiKey, externalId, site });
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

      const prevContacts = (row as any).contacts && typeof (row as any).contacts === "object" ? (row as any).contacts : {};
      const stripePaid = Boolean((prevContacts as any)?.payment?.paidAt) || String((prevContacts as any)?.payment?.status || "").toLowerCase() === "paid";
      const dbPaid = (row as any).status === "Paid";
      const keepPaid = stripePaid || dbPaid;
      const crmHasPaid =
        Boolean(fullPaidAt) || paymentStatuses.some((s) => ["paid", "payment-paid", "payment_paid", "succeeded"].includes((s || "").toLowerCase()));

      if (keepPaid && !crmHasPaid) {
        try {
          const paidAtIso =
            String((prevContacts as any)?.payment?.paidAt || "").trim() ||
            String((prevContacts as any)?.payment?.updatedAt || "").trim() ||
            new Date().toISOString();
          const amount =
            typeof (prevContacts as any)?.payment?.amount === "number" && Number.isFinite((prevContacts as any).payment.amount)
              ? Math.round((prevContacts as any).payment.amount * 100) / 100
              : Math.round(Number((row as any).total_amount || 0) * 100) / 100;
          if (Number.isFinite(amount) && amount > 0) {
            const paymentStatusPaid = process.env.RETAILCRM_PAYMENT_STATUS_PAID || "paid";
            const paymentType = pickPaymentTypeCode(prevContacts);
            const provider = String((prevContacts as any)?.payment?.provider || "").trim().toLowerCase();
            const paymentExternalId = safePaymentExternalId({ provider: provider || paymentType, orderId: externalId });
            await crmUpsertOrderPayment({
              apiUrl,
              apiKey,
              site,
              orderExternalId: externalId,
              paymentExternalId,
              paymentType,
              status: paymentStatusPaid,
              amount,
              paidAtIso,
            });
          }
        } catch {
        }
      }

      let nextStatus = deriveUiStatus({ crmStatus, fullPaidAt, paymentStatuses });
      if (keepPaid && !["Canceled", "Delivered", "Shipped", "Awaiting pickup"].includes(nextStatus)) {
        nextStatus = "Paid";
      }

      const nextContacts = {
        ...prevContacts,
        crm: {
          ...(prevContacts?.crm && typeof prevContacts.crm === "object" ? prevContacts.crm : {}),
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
        .from("orders")
        .update({ status: nextStatus, contacts: nextContacts })
        .eq("id", (row as any).id)
        .eq("user_id", userId);

      if (!updateError) {
        updates[String((row as any).id)] = { status: nextStatus, contacts: nextContacts };
      }
    }

    return res.status(200).json({ ok: true, updates });
  } catch (e: any) {
    return res.status(500).json({ message: "Handler exception", details: e?.message || String(e) });
  }
}
