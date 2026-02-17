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
app.use(express.json({ limit: "1mb" }));
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

app.post("/api/orders/create", csrfProtection, async (_req: Request, res: Response) => {
  httpRequests.inc();
  res.status(501).json({ message: "not implemented" });
});

app.post("/api/stripe/webhook", express.raw({ type: "application/json" }), (_req: Request, res: Response) => {
  res.status(501).json({ message: "not implemented" });
});

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
