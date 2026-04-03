import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

let stripe: Stripe | undefined;

async function getStripe(): Promise<Stripe> {
  if (stripe) return stripe;
  const secret = process.env.STRIPE_SECRET || "";
  if (!secret) {
    throw new Error("Stripe is not configured (STRIPE_SECRET is missing)");
  }
  const mod: any = await import("stripe");
  const StripeCtor = mod?.default || mod;
  stripe = new StripeCtor(secret, { apiVersion: "2024-04-10" } as any);
  return stripe!;
}

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
  paidAtIso: string;
}) {
  const crmOrder = await fetchCrmOrderByExternalId({
    apiUrl: params.apiUrl,
    apiKey: params.apiKey,
    externalId: params.orderExternalId,
    site: params.site,
  });
  const payments = Array.isArray(crmOrder?.payments) ? crmOrder.payments : [];
  const normalizedAmount = Math.round(params.amount * 100) / 100;
  const exactMatch = (value: unknown) => Math.abs(Number(value) - normalizedAmount) < 0.01;

  const candidate =
    payments.find((p: any) => p?.externalId && String(p.externalId) === params.paymentExternalId) ||
    payments.find((p: any) => {
      const status = String(p?.status || "").toLowerCase();
      if (status.includes("paid") || status === "succeeded") return false;
      if (!exactMatch(p?.amount)) return false;
      return true;
    }) ||
    null;

  const paymentBase: any = {
    externalId: candidate?.externalId || params.paymentExternalId,
    order: { externalId: params.orderExternalId },
    amount: normalizedAmount,
    paidAt: crmDatetime(params.paidAtIso),
    type: candidate?.type || params.paymentType,
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
    const site = process.env.RETAILCRM_SITE || undefined;
    const paymentTypeStripe = process.env.RETAILCRM_PAYMENT_TYPE_STRIPE || process.env.RETAILCRM_PAYMENT_TYPE || "stripe-payment";
    const paymentTypePayPal = process.env.RETAILCRM_PAYMENT_TYPE_PAYPAL || "paypal";
    const paymentStatusPaid = process.env.RETAILCRM_PAYMENT_STATUS_PAID || "paid";
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

    const body = getBodyAny(req) as { orderId?: string; provider?: string; paymentId?: string; amount?: number; paidAt?: string };
    const orderId = String(body.orderId || "").trim();
    if (!orderId) return res.status(400).json({ message: "Missing orderId" });

    const { data: orderRow, error: orderError } = await supabaseService.from("orders").select("id,user_id,total_amount,contacts").eq("id", orderId).single();
    if (orderError || !orderRow) return res.status(404).json({ message: "Order not found" });
    if (String(orderRow.user_id) !== authData.user.id) return res.status(403).json({ message: "Forbidden" });

    const provider = String(body.provider || "paypal").trim().toLowerCase();
    const paymentIdRaw = String(body.paymentId || "").trim();
    const paidAtIso = String(body.paidAt || "").trim() || new Date().toISOString();

    let amount =
      typeof body.amount === "number" && Number.isFinite(body.amount) && body.amount > 0
        ? Math.round(body.amount * 100) / 100
        : Math.round(Number(orderRow.total_amount || 0) * 100) / 100;

    const paymentType = provider === "stripe" ? paymentTypeStripe : provider === "paypal" ? paymentTypePayPal : paymentTypeStripe;

    if (provider === "stripe") {
      if (!paymentIdRaw) return res.status(400).json({ message: "Missing paymentId (Stripe session id)" });
      const stripeClient = await getStripe();
      const session = await stripeClient.checkout.sessions.retrieve(paymentIdRaw);
      const sessionOrderId = String((session as any)?.metadata?.order_id || "");
      const sessionUserId = String((session as any)?.metadata?.user_id || "");
      const status = String((session as any)?.status || "").toLowerCase();
      const paymentStatus = String((session as any)?.payment_status || "").toLowerCase();
      if (!sessionOrderId || sessionOrderId !== orderId) {
        return res.status(400).json({ message: "Stripe session does not match orderId" });
      }
      if (sessionUserId && sessionUserId !== authData.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      if (!(status === "complete" || paymentStatus === "paid")) {
        return res.status(400).json({ message: "Stripe session is not paid" });
      }
      const sessionAmountTotal = Number((session as any)?.amount_total);
      if (Number.isFinite(sessionAmountTotal) && sessionAmountTotal > 0) {
        amount = Math.round((sessionAmountTotal / 100) * 100) / 100;
      }
    }

    const paymentExternalId =
      provider === "stripe" && paymentIdRaw
        ? `stripe_${paymentIdRaw}`
        : provider === "paypal" && paymentIdRaw
        ? `paypal_${paymentIdRaw}`
        : `${provider}_${Date.now()}`;

    await crmUpsertOrderPayment({
      apiUrl,
      apiKey,
      site,
      orderExternalId: orderId,
      paymentExternalId,
      paymentType,
      status: paymentStatusPaid,
      amount,
      paidAtIso,
    });

    const prevContacts = orderRow?.contacts && typeof orderRow.contacts === "object" ? orderRow.contacts : {};
    const nextContacts = {
      ...prevContacts,
      payment: {
        ...(prevContacts?.payment && typeof prevContacts.payment === "object" ? prevContacts.payment : {}),
        provider,
        status: "paid",
        paidAt: paidAtIso,
        amount,
        updatedAt: new Date().toISOString(),
      },
      crm: {
        ...(prevContacts?.crm && typeof prevContacts.crm === "object" ? prevContacts.crm : {}),
        syncedAt: new Date().toISOString(),
      },
    };
    await supabaseService.from("orders").update({ status: "Paid", contacts: nextContacts }).eq("id", orderId);

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: "Handler exception", details: e?.message || String(e) });
  }
}
