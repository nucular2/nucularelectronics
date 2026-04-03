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

function cents(value: unknown) {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.round(n * 100);
}

function asArray(value: any) {
  return Array.isArray(value) ? value : [];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  try {
    const body = getBodyAny(req);
    const orderId = String(body?.orderId || body?.order_id || "").trim();
    if (!orderId) return res.status(400).json({ message: "Missing orderId" });

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "";
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ message: "Supabase service credentials are missing" });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (error || !order) return res.status(404).json({ message: "Order not found" });

    const origin = String(req.headers.origin || "").trim();
    const forwardedProto = String((req.headers["x-forwarded-proto"] as any) || "").trim() || "https";
    const forwardedHost = String((req.headers["x-forwarded-host"] as any) || "").trim();
    const host = String(req.headers.host || "").trim();
    const inferred = forwardedHost || host ? `${forwardedProto}://${forwardedHost || host}` : "";
    const frontendUrl = process.env.FRONTEND_URL || origin || inferred || "https://new.nucular.tech";

    const totalCents = cents((order as any).total_amount);
    const items = asArray((order as any).items);
    const crmNumber = (order as any)?.contacts?.crm?.number ? String((order as any).contacts.crm.number) : null;

    const lineItems: any[] = [];
    let itemsSumCents = 0;
    for (const raw of items) {
      const baseName = String(raw?.title || raw?.name || raw?.productName || "Item").slice(0, 120);
      const name = crmNumber ? `Order ${crmNumber}: ${baseName}`.slice(0, 120) : baseName;
      const quantityRaw = raw?.quantity;
      const quantity =
        typeof quantityRaw === "number" && Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.floor(quantityRaw) : 1;

      const unitCents =
        cents(raw?.price) ||
        cents(raw?.unitPrice) ||
        cents(raw?.initialPrice) ||
        (cents(raw?.total) && quantity > 0 ? Math.floor(cents(raw.total) / quantity) : 0);

      if (!unitCents) continue;
      itemsSumCents += unitCents * quantity;
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name },
          unit_amount: unitCents,
        },
        quantity,
      });
    }

    if (lineItems.length === 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: { name: `Order #${String((order as any).id).slice(0, 8)}` },
          unit_amount: totalCents,
        },
        quantity: 1,
      });
    } else if (itemsSumCents !== totalCents && totalCents > 0) {
      const diff = totalCents - itemsSumCents;
      if (diff !== 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: diff > 0 ? "Adjustment" : "Discount" },
            unit_amount: Math.abs(diff),
          },
          quantity: 1,
        });
      }
    }

    const stripeClient = await getStripe();
    const session = await stripeClient.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${frontendUrl}/orders?payment=success&orderId=${encodeURIComponent(String(orderId))}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/cart?payment=canceled&orderId=${encodeURIComponent(String(orderId))}`,
      metadata: {
        order_id: String((order as any).id),
        user_id: String((order as any).user_id || ""),
      },
    });

    return res.status(200).json({ id: session.id, url: session.url });
  } catch (e: any) {
    return res.status(500).json({ message: "Server error", details: e?.message || String(e) });
  }
}

