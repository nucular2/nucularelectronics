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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const accountSid = String(process.env.TWILIO_ACCOUNT_SID || "").trim();
    const authToken = String(process.env.TWILIO_AUTH_TOKEN || "").trim();
    const serviceSid = String(process.env.TWILIO_VERIFY_SERVICE_SID || "").trim();
    if (!accountSid || !authToken || !serviceSid) {
      return res.status(500).json({ message: "Twilio Verify is not configured" });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "";
    if (!supabaseUrl || !supabaseAnonKey) {
      return res.status(500).json({ message: "Supabase credentials are missing" });
    }
    const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : "";
    if (!token) return res.status(401).json({ message: "Missing Authorization token" });
    const { data: authData, error: authError } = await supabaseAnon.auth.getUser(token);
    if (authError || !authData?.user) return res.status(401).json({ message: "Invalid user token" });

    const body = getBodyAny(req);
    const phone = String(body?.phone || "").trim();
    const code = String(body?.code || "").trim();
    if (!phone) return res.status(400).json({ message: "Missing phone" });
    if (!code) return res.status(400).json({ message: "Missing code" });

    const form = new URLSearchParams();
    form.set("To", phone);
    form.set("Code", code);

    const r = await fetch(`https://verify.twilio.com/v2/Services/${encodeURIComponent(serviceSid)}/VerificationCheck`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: form.toString(),
    });
    const text = await r.text();
    if (!r.ok) {
      return res.status(400).json({ message: "Invalid code", details: text });
    }
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
    const status = String(data?.status || "").toLowerCase();
    if (status !== "approved") {
      return res.status(400).json({ message: "Invalid code" });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: "Handler exception", details: e?.message || String(e) });
  }
}

