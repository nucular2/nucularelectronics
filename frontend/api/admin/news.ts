import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_utils/adminAuth';
import { readJson, writeJson } from '../_utils/cmsStorage';

const PATH = 'news.json';

function sanitizeNews(items: any[]) {
  const normalized = (items || [])
    .map((x) => ({
      id: Number(x?.id),
      title: String(x?.title || '').trim(),
      date: String(x?.date || '').trim(),
      image: String(x?.image || '').trim(),
      text: String(x?.text || '').trim(),
      link: String(x?.link || '').trim() || undefined,
    }))
    .filter((x) => x.id && x.title && x.date && x.text);

  const seen = new Set<number>();
  const uniq = [];
  for (const n of normalized) {
    if (seen.has(n.id)) continue;
    seen.add(n.id);
    uniq.push(n);
  }
  return uniq;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

  try {
    const body = (req.body || {}) as { news?: any[] };
    const news = sanitizeNews(Array.isArray(body.news) ? body.news : []);
    await writeJson(PATH, news);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || String(e) });
  }
}

