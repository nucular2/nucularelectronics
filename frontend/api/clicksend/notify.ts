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

function displayOrderNumber(order: any) {
  const crmNumber = order?.contacts?.crm?.number;
  if (crmNumber) return String(crmNumber);
  const id = typeof order?.id === "string" ? order.id : "";
  return id.includes("-") ? id.split("-")[0].toUpperCase() : id;
}

function normalizeToE164(input: string) {
  const raw = String(input || "").trim();
  if (!raw) return "";
  if (raw.startsWith("+")) return raw;
  const digits = raw.replace(/[^\d]/g, "");
  return digits ? `+${digits}` : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const username = String(process.env.CLICKSEND_USERNAME || "").trim();
    const apiKey = String(process.env.CLICKSEND_API_KEY || "").trim();
    const toRaw = String(process.env.CLICKSEND_TO || "").trim();
    const from = String(process.env.CLICKSEND_FROM || "Nucular").trim();
    if (!username || !apiKey || !toRaw) {
      return res.status(500).json({ message: "ClickSend is not configured" });
    }

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
    const reason = String(body?.reason || "").trim() || "order";
    if (!orderId) return res.status(400).json({ message: "Missing orderId" });

    const { data: orderRow, error: orderError } = await supabaseService
      .from("orders")
      .select("id,user_id,customer_name,customer_phone,total_amount,items,contacts,created_at")
      .eq("id", orderId)
      .single();
    if (orderError || !orderRow) return res.status(404).json({ message: "Order not found" });
    if (String((orderRow as any).user_id) !== authData.user.id) return res.status(403).json({ message: "Forbidden" });

    const orderNumber = displayOrderNumber(orderRow);
    const phone = String((orderRow as any).customer_phone || "").trim();
    const total = Number((orderRow as any).total_amount || 0);
    const items = Array.isArray((orderRow as any).items) ? (orderRow as any).items : [];
    const titles = items
      .map((it: any) => String(it?.title || it?.name || it?.productName || "").trim())
      .filter(Boolean)
      .slice(0, 3);
    const titlePart = titles.length > 0 ? ` | ${titles.join(", ")}${items.length > 3 ? "…" : ""}` : "";

    const message = `Order ${orderNumber} (${reason}) | ${String((orderRow as any).customer_name || "").trim()} | ${phone} | $${Number.isFinite(total) ? total.toFixed(2) : "0.00"}${titlePart}`;

    const to = normalizeToE164(toRaw);
    if (!to) return res.status(500).json({ message: "CLICKSEND_TO is invalid" });

    const r = await fetch("https://rest.clicksend.com/v3/sms/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${username}:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            to,
            body: message,
            from,
          },
        ],
      }),
    });
    const text = await r.text();
    if (!r.ok) {
      return res.status(500).json({ message: "ClickSend request failed", details: text });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: "Handler exception", details: e?.message || String(e) });
  }
}

