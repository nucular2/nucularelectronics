import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

function detectDevice(userAgent: string | undefined): 'mobile' | 'desktop' {
  const ua = (userAgent || '').toLowerCase();
  if (ua.includes('mobi') || ua.includes('android') || ua.includes('iphone') || ua.includes('ipad')) return 'mobile';
  return 'desktop';
}

function normalizePath(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) return null;
  if (trimmed.length > 512) return null;
  return trimmed;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ message: 'Server misconfiguration: Supabase env' });
    }

    const path = normalizePath((req.body as any)?.path);
    if (!path) {
      return res.status(400).json({ message: 'Invalid path' });
    }

    const device = detectDevice(req.headers['user-agent']);
    const userId = typeof (req.body as any)?.userId === 'string' ? (req.body as any).userId : null;

    const { error } = await supabase.from('page_views').insert({
      path,
      device,
      user_id: userId,
    });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    return res.status(204).end();
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}

