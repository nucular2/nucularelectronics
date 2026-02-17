import Stripe from "stripe";

const secret = process.env.STRIPE_SECRET || "";
export const stripe = new Stripe(secret, { apiVersion: "2024-04-10" });

export function verifyWebhook(payload: Buffer, sig: string) {
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET || "";
  return Stripe.webhooks.constructEvent(payload, sig, whSecret);
}
