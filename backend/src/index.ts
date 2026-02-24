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

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Nucular shop order",
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
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
          await supabase
            .from("orders")
            .update({ status: "Paid" })
            .eq("id", orderId);
        } catch (err) {
          logger.error({ err, orderId }, "failed to update order status to Paid");
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
