
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL or Anon Key is missing. Authentication features will not work.');
}

export function getSupabasePublicConfig() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  const configured = Boolean(url && anonKey);
  return { url, anonKey, configured };
}

export function getSupabaseConfigErrorMessage() {
  const cfg = getSupabasePublicConfig();
  if (cfg.configured) return null;
  return 'Supabase не настроен: проверь VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY';
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export async function refreshSupabaseSessionIfNeeded() {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  const session = sessionData?.session || null;
  if (!session) return null;
  const expiresAt = typeof (session as any)?.expires_at === 'number' ? (session as any).expires_at : null;
  const needsRefresh = expiresAt ? expiresAt * 1000 - Date.now() < 60_000 : true;
  if (!needsRefresh) return session;
  const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  return refreshed.session || null;
}

export async function getSupabaseAccessTokenOrThrow() {
  const cfgError = getSupabaseConfigErrorMessage();
  if (cfgError) throw new Error(cfgError);
  const session = await refreshSupabaseSessionIfNeeded();
  const token = session?.access_token || null;
  if (!token) throw new Error('No session token');
  return token;
}
