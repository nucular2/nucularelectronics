import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Device = 'desktop' | 'mobile';

function clampDays(value: unknown, fallback: number) {
  const parsed = typeof value === 'string' ? Number(value) : typeof value === 'number' ? value : NaN;
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(365, Math.max(1, Math.floor(parsed)));
}

function isoDate(d: Date) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ message: 'Server misconfiguration: Supabase env' });
    }

    const days = clampDays(req.query.days, 30);
    const now = new Date();
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const { data, error } = await supabase
      .from('page_views')
      .select('created_at, device')
      .gte('created_at', from.toISOString())
      .order('created_at', { ascending: true })
      .limit(50000);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    const byDevice: Record<Device, number> = { desktop: 0, mobile: 0 };
    const byDay: Record<string, { total: number; desktop: number; mobile: number }> = {};

    for (const row of data || []) {
      const device = (row as any).device as Device;
      if (device !== 'desktop' && device !== 'mobile') continue;

      byDevice[device] += 1;

      const dayKey = isoDate(new Date((row as any).created_at));
      if (!byDay[dayKey]) byDay[dayKey] = { total: 0, desktop: 0, mobile: 0 };
      byDay[dayKey].total += 1;
      byDay[dayKey][device] += 1;
    }

    const series: Array<{ name: string; value: number; desktop: number; mobile: number }> = [];
    for (let i = 0; i < days; i += 1) {
      const d = new Date(from.getTime() + i * 24 * 60 * 60 * 1000);
      const key = isoDate(d);
      const entry = byDay[key] || { total: 0, desktop: 0, mobile: 0 };
      series.push({ name: key, value: entry.total, desktop: entry.desktop, mobile: entry.mobile });
    }

    return res.status(200).json({
      days,
      total: byDevice.desktop + byDevice.mobile,
      desktop: byDevice.desktop,
      mobile: byDevice.mobile,
      series,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || 'Server error' });
  }
}

