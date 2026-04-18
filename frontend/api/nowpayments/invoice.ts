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

function originFromReq(req: VercelRequest) {
  const proto = String(req.headers["x-forwarded-proto"] || "https").split(",")[0].trim() || "https";
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  if (!host) return null;
  return `${proto}://${host}`;
}

function orderDescription(items: any[], orderId: string) {
  const titles = (Array.isArray(items) ? items : [])
    .map((it) => String(it?.title || it?.name || "").trim())
    .filter(Boolean);
  const first = titles[0];
  const base = first ? `Order ${orderId}: ${first}` : `Order ${orderId}`;
  return base.length <= 200 ? base : base.slice(0, 197) + "...";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const apiKey = String(process.env.NOWPAYMENTS_API_KEY || "").trim();
    const apiBase = String(process.env.NOWPAYMENTS_API_BASE_URL || "https://api.nowpayments.io").trim().replace(/\/+$/, "");
    if (!apiKey) return res.status(500).json({ message: "NOWPayments API key is missing" });

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

    const body = getBodyAny(req);
    const orderId = String(body?.orderId || "").trim();
    if (!orderId) return res.status(400).json({ message: "Missing orderId" });

    const { data: orderRow, error: orderError } = await supabaseService
      .from("orders")
      .select("id,user_id,total_amount,items,contacts,status")
      .eq("id", orderId)
      .maybeSingle();
    if (orderError) return res.status(500).json({ message: "Failed to load order", details: orderError.message });
    if (!orderRow) return res.status(404).json({ message: "Order not found" });
    if (String((orderRow as any).user_id) !== String(authData.user.id)) return res.status(403).json({ message: "Forbidden" });

    const amount = Math.round(Number((orderRow as any).total_amount || 0) * 100) / 100;
    if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ message: "Order amount is invalid" });

    const origin = originFromReq(req);
    if (!origin) return res.status(400).json({ message: "Missing request host" });

    const success_url = `${origin}/orders?payment=success&orderId=${encodeURIComponent(orderId)}&provider=crypto`;
    const cancel_url = `${origin}/orders?payment=canceled&orderId=${encodeURIComponent(orderId)}&provider=crypto`;
    const ipn_callback_url = `${origin}/api/nowpayments/ipn`;

    const items = Array.isArray((orderRow as any).items) ? (orderRow as any).items : [];
    const description = orderDescription(items, orderId);

    const payload: any = {
      price_amount: amount,
      price_currency: "usd",
      order_id: orderId,
      order_description: description,
      success_url,
      cancel_url,
      ipn_callback_url,
    };

    const r = await fetch(`${apiBase}/v1/invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    if (!r.ok) {
      return res.status(502).json({ message: "NOWPayments request failed", details: data || text });
    }
    const invoiceUrl = String(data?.invoice_url || data?.invoiceUrl || "").trim();
    const invoiceId = data?.id ?? data?.iid ?? null;
    if (!invoiceUrl) return res.status(502).json({ message: "NOWPayments invoice_url is missing", details: data });

    const prevContacts = (orderRow as any).contacts && typeof (orderRow as any).contacts === "object" ? (orderRow as any).contacts : {};
    const nextContacts = {
      ...prevContacts,
      paymentMethod: "crypto",
      payment: {
        ...(prevContacts as any).payment,
        provider: "crypto",
        status: "invoice_created",
        amount,
        updatedAt: new Date().toISOString(),
        nowpayments: {
          invoiceId,
          invoiceUrl,
        },
      },
    };
    await supabaseService.from("orders").update({ contacts: nextContacts }).eq("id", orderId);

    return res.status(200).json({ ok: true, invoiceUrl });
  } catch (e: any) {
    return res.status(500).json({ message: "Handler exception", details: e?.message || String(e) });
  }
}

