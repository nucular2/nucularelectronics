import { createClient } from '@supabase/supabase-js';
import type { VercelRequest } from '@vercel/node';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY!;

const supabaseAnon = createClient(supabaseUrl, supabaseAnonKey);

function getAdminEmailSet() {
  const raw = process.env.ADMIN_EMAILS || process.env.VITE_ADMIN_EMAILS || '';
  const emails = raw
    .split(/[,\s;]+/g)
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return new Set(emails);
}

function isDev() {
  return process.env.NODE_ENV !== 'production';
}

export async function requireAdmin(req: VercelRequest) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : '';
  if (!token) return { ok: false as const, status: 401 as const, message: 'Missing Authorization token' };

  const { data: authData, error: authError } = await supabaseAnon.auth.getUser(token);
  if (authError || !authData?.user) return { ok: false as const, status: 401 as const, message: 'Invalid user token' };

  const email = (authData.user.email || '').toLowerCase();
  const admins = getAdminEmailSet();
  if (!email) return { ok: false as const, status: 403 as const, message: 'User email is missing' };
  if (admins.size === 0 && !isDev()) return { ok: false as const, status: 403 as const, message: 'Admin access list is not configured' };
  if (admins.size > 0 && !admins.has(email)) return { ok: false as const, status: 403 as const, message: 'Forbidden' };

  return { ok: true as const, user: authData.user, token };
}

