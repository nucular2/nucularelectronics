import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

async function readRawBody(req: VercelRequest) {
  const b: any = (req as any).body;
  if (Buffer.isBuffer(b)) return b.toString("utf8");
  if (typeof b === "string") return b;
  if (typeof b === "object" && b) return JSON.stringify(b);
  return "";
}

function sortDeep(input: any): any {
  if (Array.isArray(input)) return input.map(sortDeep);
  if (!input || typeof input !== "object") return input;
  const out: any = {};
  for (const k of Object.keys(input).sort()) {
    out[k] = sortDeep(input[k]);
  }
  return out;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const ipnSecret = String(process.env.NOWPAYMENTS_IPN_SECRET || "").trim();
    if (!ipnSecret) return res.status(500).end("NOWPayments IPN secret is missing");

    const raw = await readRawBody(req);
    const payload = safeJsonParse(raw);
    if (!payload) return res.status(400).end("Invalid JSON");

    const sigHeader = String(req.headers["x-nowpayments-sig"] || req.headers["x-nowpayments-signature"] || "").trim();
    if (!sigHeader) return res.status(401).end("Missing signature");
    const computed = crypto.createHmac("sha512", ipnSecret).update(JSON.stringify(sortDeep(payload))).digest("hex");
    if (computed !== sigHeader) return res.status(401).end("Invalid signature");

    const orderId = String(payload?.order_id || "").trim();
    if (!orderId) return res.status(200).json({ ok: true });

    const status = String(payload?.payment_status || payload?.status || "").trim().toLowerCase();
    const paid = ["finished", "confirmed"].includes(status);
    const nowIso = new Date().toISOString();

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseUrl || !supabaseServiceKey) return res.status(500).end("Supabase service key is missing");
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    const { data: orderRow } = await supabaseService.from("orders").select("id,contacts,total_amount,status").eq("id", orderId).maybeSingle();
    if (!orderRow) return res.status(200).json({ ok: true });

    const prevContacts = (orderRow as any).contacts && typeof (orderRow as any).contacts === "object" ? (orderRow as any).contacts : {};
    const amount = Math.round(Number(payload?.price_amount ?? payload?.actually_paid ?? (orderRow as any).total_amount ?? 0) * 100) / 100;

    const nextContacts = {
      ...prevContacts,
      paymentMethod: "crypto",
      payment: {
        ...(prevContacts as any).payment,
        provider: "crypto",
        status: status || "unknown",
        amount: Number.isFinite(amount) ? amount : undefined,
        updatedAt: nowIso,
        paidAt: paid ? nowIso : (prevContacts as any)?.payment?.paidAt,
        nowpayments: payload,
      },
    };

    const update: any = { contacts: nextContacts };
    if (paid) update.status = "Paid";

    await supabaseService.from("orders").update(update).eq("id", orderId);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).end(e?.message || "Handler exception");
  }
}

