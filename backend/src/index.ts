import "dotenv/config";
import express, { Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import csrf from "csurf";
import pino from "pino";
import { createServer } from "https";
import { readFileSync } from "fs";
import { join } from "path";
import { Registry, collectDefaultMetrics, Counter, Gauge } from "prom-client";
import { stripe, verifyWebhook } from "./services/stripe";
import { supabase } from "./lib/supabase";

const logger = pino();

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);
app.use((req, res, next) => {
  if (req.path === "/api/stripe/webhook") {
    next();
  } else {
    express.json({ limit: "1mb" })(req, res, next);
  }
});
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX || 200),
    standardHeaders: true,
    legacyHeaders: false,
  })
);

const csrfProtection = csrf({ cookie: true });

const registry = new Registry();
collectDefaultMetrics({ register: registry });
const httpRequests = new Counter({
  name: "http_requests_total",
  help: "Total HTTP requests",
  registers: [registry],
});
const activeUsers = new Gauge({
  name: "active_users",
  help: "Active users gauge",
  registers: [registry],
});

app.get("/metrics", async (_req: Request, res: Response) => {
  res.setHeader("Content-Type", registry.contentType);
  res.send(await registry.metrics());
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.post("/api/auth/login", csrfProtection, (_req: Request, res: Response) => {
  httpRequests.inc();
  res.status(501).json({ message: "not implemented" });
});

app.post("/api/auth/refresh", (_req: Request, res: Response) => {
  res.status(501).json({ message: "not implemented" });
});

app.get("/api/products/inventory", async (_req: Request, res: Response) => {
  httpRequests.inc();
  res.status(501).json({ message: "not implemented" });
});

app.post("/api/checkout/session", async (req: Request, res: Response) => {
  httpRequests.inc();
  const { orderId } = req.body as { orderId?: string };

  if (!orderId) {
    return res.status(400).json({ message: "orderId is required" });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (error || !order) {
    return res.status(404).json({ message: "Order not found" });
  }

  const amountNumber = Number(order.total_amount);
  const amount = Math.round(amountNumber * 100);

  if (!Number.isFinite(amountNumber) || amount <= 0) {
    return res.status(400).json({ message: "Invalid order amount" });
  }

  try {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const items = Array.isArray(order.items) ? order.items : [];
    const lineItems: any[] = [];
    let itemsSum = 0;

    for (const raw of items) {
      const name = String(raw?.title || raw?.name || raw?.productName || "Item").slice(0, 120);
      const quantityRaw = raw?.quantity;
      const quantity =
        typeof quantityRaw === "number" && Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.floor(quantityRaw) : 1;
      const unit =
        parseMoney(raw?.price) ??
        parseMoney(raw?.unitPrice) ??
        parseMoney(raw?.initialPrice) ??
        (parseMoney(raw?.total) && quantity > 0 ? (parseMoney(raw.total) as number) / quantity : undefined);
      if (!unit) continue;
      const unitCents = Math.round(unit * 100);
      if (!unitCents) continue;

      itemsSum += unitCents * quantity;
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
          product_data: { name: `Order #${String(order.id).slice(0, 8)}` },
          unit_amount: amount,
        },
        quantity: 1,
      });
    } else if (itemsSum !== amount) {
      const diff = amount - itemsSum;
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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${frontendUrl}/orders?payment=success`,
      cancel_url: `${frontendUrl}/cart?payment=canceled`,
      metadata: {
        order_id: order.id,
        user_id: order.user_id,
      },
    });

    return res.json({ id: session.id, url: session.url });
  } catch (err) {
    logger.error({ err }, "failed to create checkout session");
    return res.status(500).json({ message: "Failed to create checkout session" });
  }
});

function normalizePhoneE164(phone?: string): string | undefined {
  if (!phone) return undefined;
  const digits = phone.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  return `+${digits.replace(/^\+/, "")}`;
}

function countryIsoFrom(order: any): string | undefined {
  const iso = order?.shipping_address?.countryIso;
  if (iso) return iso;
  const country = order?.shipping_address?.country || order?.recipient_info?.country;
  if (!country) return undefined;
  const map: Record<string, string> = {
    "United States": "US",
    USA: "US",
    "United Kingdom": "GB",
    UK: "GB",
    Germany: "DE",
    France: "FR",
    Norway: "NO",
  };
  return map[country] || undefined;
}

function parseMoney(value: unknown): number | undefined {
  if (typeof value === "number") {
    return isNaN(value) ? undefined : value;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return undefined;
    if (trimmed.toLowerCase() === "preorder") return undefined;
    const normalized = trimmed.replace(/[^0-9.,-]/g, "").replace(/,/g, "");
    const num = parseFloat(normalized);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
}

async function upsertRetailCrmPayment(params: {
  orderExternalId: string;
  amount: number;
  paidAtIso: string;
  paymentExternalId: string;
}) {
  const apiUrl = process.env.RETAILCRM_URL;
  const apiKey = process.env.RETAILCRM_API_KEY;
  const site = process.env.RETAILCRM_SITE || undefined;
  const paymentType = process.env.RETAILCRM_PAYMENT_TYPE || "bank-card";
  const paymentStatusPaid = process.env.RETAILCRM_PAYMENT_STATUS_PAID || "paid";
  if (!apiUrl || !apiKey) return;

  const paidCodes = ["paid", "payment-paid", "payment_paid"];
  const fetchOrderUrl =
    `${apiUrl}/api/v5/orders/${encodeURIComponent(params.orderExternalId)}` +
    `?apiKey=${encodeURIComponent(apiKey)}` +
    `&by=externalId` +
    (site ? `&site=${encodeURIComponent(site)}` : "");

  let crmOrder: any = null;
  try {
    const r = await fetch(fetchOrderUrl, { headers: { Accept: "application/json" } });
    const text = await r.text();
    const data = JSON.parse(text);
    crmOrder = data?.success ? data?.order : null;
  } catch {
    crmOrder = null;
  }

  const payments = Array.isArray(crmOrder?.payments) ? crmOrder.payments : [];
  const normalizedAmount = Math.round(params.amount * 100) / 100;
  const exactMatch = (value: unknown) => Math.abs(Number(value) - normalizedAmount) < 0.01;

  const candidate =
    payments.find((p: any) => p?.externalId && String(p.externalId) === params.paymentExternalId) ||
    payments.find((p: any) => {
      const status = String(p?.status || "").toLowerCase();
      const isPaid = paidCodes.includes(status);
      if (isPaid) return false;
      if (!exactMatch(p?.amount)) return false;
      return true;
    }) ||
    null;

  const paymentBase = {
    externalId: candidate?.externalId || params.paymentExternalId,
    order: { externalId: params.orderExternalId },
    amount: normalizedAmount,
    paidAt: params.paidAtIso,
    type: candidate?.type || paymentType,
    status: paymentStatusPaid,
  };

  if (candidate?.id) {
    const editUrl = `${apiUrl}/api/v5/orders/payments/${encodeURIComponent(String(candidate.id))}/edit?apiKey=${encodeURIComponent(apiKey)}${
      site ? `&site=${encodeURIComponent(site)}` : ""
    }`;
    const form = new URLSearchParams();
    form.set("payment", JSON.stringify(paymentBase));
    const r = await fetch(editUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
      body: form.toString(),
    });
    if (!r.ok) {
      const text = await r.text();
      throw new Error(text || "RetailCRM payments edit failed");
    }
    return;
  }

  const createUrl = `${apiUrl}/api/v5/orders/payments/create?apiKey=${encodeURIComponent(apiKey)}${
    site ? `&site=${encodeURIComponent(site)}` : ""
  }`;
  const form = new URLSearchParams();
  form.set("payment", JSON.stringify(paymentBase));
  const r = await fetch(createUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: form.toString(),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(text || "RetailCRM payments create failed");
  }
}

app.post("/api/retailcrm/order", async (req: Request, res: Response) => {
  httpRequests.inc();
  const { order } = req.body as { order: any };
  if (!order || !order.id) {
    return res.status(400).json({ message: "Invalid order payload" });
  }
  const apiUrl = process.env.RETAILCRM_URL;
  const apiKey = process.env.RETAILCRM_API_KEY;
  if (!apiUrl || !apiKey) {
    return res.status(500).json({ message: "RetailCRM credentials are missing" });
  }
  const managerId = process.env.RETAILCRM_MANAGER_ID ? Number(process.env.RETAILCRM_MANAGER_ID) : undefined;
  const site = process.env.RETAILCRM_SITE || undefined;
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
            const quantity = typeof i.quantity === "number" && i.quantity > 0 ? i.quantity : 1;
            const totalParsed = parseMoney(i.total);
            const unitPrice =
              parseMoney(i.price) ??
              parseMoney(i.initialPrice) ??
              (totalParsed !== undefined ? totalParsed / quantity : undefined) ??
              (itemsArray.length === 1 && orderTotal !== undefined ? orderTotal / quantity : undefined);
            const item: any = {
              quantity,
              productName: i.title || i.name || "Item",
            };
            if (article) {
              item.offer = { article };
            }
            if (typeof unitPrice === "number" && !isNaN(unitPrice)) {
              item.initialPrice = Math.round(unitPrice * 100) / 100;
            }
            return item;
          }),
      customerComment: order.contacts?.comment || "",
      delivery: {
        address: {
          countryIso: countryIsoFrom(order),
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
    const url = `${apiUrl}/api/v5/orders/create?apiKey=${apiKey}${site ? `&site=${encodeURIComponent(site)}` : ''}`;
    const form = new URLSearchParams();
    form.set("order", JSON.stringify(payload.order));
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Accept": "application/json" },
      body: form.toString(),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) {
      await supabase.from("orders").update({ status: "Error" }).eq("id", order.id);
      return res.status(r.status).json({ message: "RetailCRM error", details: data });
    }
    await supabase.from("orders").update({ status: "Sent" }).eq("id", order.id);
    return res.status(200).json({ ok: true, data });
  } catch (e: any) {
    await supabase.from("orders").update({ status: "Error" }).eq("id", order.id);
    return res.status(500).json({ message: "RetailCRM exception", details: e?.message || String(e) });
  }
});

// Delete order by ID (admin/test cleanup)
app.post("/api/orders/delete", async (req: Request, res: Response) => {
  httpRequests.inc();
  const { orderId } = req.body as { orderId?: string };
  if (!orderId) {
    return res.status(400).json({ message: "orderId is required" });
  }
  try {
    const { error } = await supabase.from("orders").delete().eq("id", orderId);
    if (error) {
      return res.status(500).json({ message: "Failed to delete order", details: error.message });
    }
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: "Exception deleting order", details: e?.message || String(e) });
  }
});

app.post("/api/orders/create", csrfProtection, async (_req: Request, res: Response) => {
  httpRequests.inc();
  res.status(501).json({ message: "not implemented" });
});

app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];

    if (!sig || typeof sig !== "string") {
      return res.status(400).send("Missing Stripe signature");
    }

    let event;

    try {
      event = verifyWebhook(req.body as Buffer, sig);
    } catch (err) {
      logger.error({ err }, "invalid Stripe webhook signature");
      return res.status(400).send("Webhook Error");
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;
      const orderId = session.metadata?.order_id as string | undefined;

      if (orderId) {
        try {
          const paidAtIso = new Date(((session.created as number) || Math.floor(Date.now() / 1000)) * 1000).toISOString();
          const amountTotal = typeof session.amount_total === "number" ? session.amount_total / 100 : undefined;
          const { data: existingOrder } = await supabase
            .from("orders")
            .select("id,contacts,total_amount")
            .eq("id", orderId)
            .single();

          const prevContacts =
            existingOrder?.contacts && typeof existingOrder.contacts === "object" ? existingOrder.contacts : {};
          const nextContacts = {
            ...prevContacts,
            payment: {
              ...(prevContacts?.payment && typeof prevContacts.payment === "object" ? prevContacts.payment : {}),
              provider: "stripe",
              status: "paid",
              paidAt: paidAtIso,
              amount: typeof amountTotal === "number" ? amountTotal : existingOrder?.total_amount,
              updatedAt: new Date().toISOString(),
            },
          };

          await supabase.from("orders").update({ status: "Paid", contacts: nextContacts }).eq("id", orderId);

          const amount =
            typeof amountTotal === "number"
              ? amountTotal
              : typeof existingOrder?.total_amount === "number"
              ? existingOrder.total_amount
              : Number(existingOrder?.total_amount);
          if (Number.isFinite(amount) && amount > 0) {
            await upsertRetailCrmPayment({
              orderExternalId: orderId,
              amount,
              paidAtIso,
              paymentExternalId: `stripe_${session.id}`,
            });
          }
        } catch (err) {
          logger.error({ err, orderId }, "failed to process paid checkout session");
        }
      }
    }

    res.json({ received: true });
  }
);

const port = Number(process.env.PORT || 4000);
const useHttps = process.env.HTTPS === "true";

if (useHttps) {
  const keyPath = process.env.TLS_KEY_PATH || join(process.cwd(), "certs", "server.key");
  const certPath = process.env.TLS_CERT_PATH || join(process.cwd(), "certs", "server.crt");
  const server = createServer(
    {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
      minVersion: "TLSv1.3",
      ciphers:
        "TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256",
    },
    app
  );
  server.listen(port, () => {
    logger.info({ port }, "https server started");
  });
} else {
  app.listen(port, () => {
    logger.info({ port }, "http server started");
  });
}
