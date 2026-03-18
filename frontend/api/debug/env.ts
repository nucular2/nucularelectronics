import { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const vars = {
    RETAILCRM_URL: !!process.env.RETAILCRM_URL,
    RETAILCRM_API_KEY: !!process.env.RETAILCRM_API_KEY,
    RETAILCRM_MANAGER_ID: !!process.env.RETAILCRM_MANAGER_ID,
    VITE_SUPABASE_URL: !!process.env.VITE_SUPABASE_URL,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    STRIPE_SECRET: !!process.env.STRIPE_SECRET,
    STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
    FRONTEND_URL: !!process.env.FRONTEND_URL,
    VITE_API_BASE_URL: !!process.env.VITE_API_BASE_URL,
  };
  res.status(200).json({ ok: true, vars });
}
