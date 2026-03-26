import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_utils/adminAuth';
import { readJson, writeJson } from '../_utils/cmsStorage';

const PATH = 'news.json';

function sanitizeBlocks(blocks: any) {
  const list = Array.isArray(blocks) ? blocks : [];
  const out = [];
  for (const b of list) {
    const type = String(b?.type || '').trim();
    const id = String(b?.id || '').trim() || `${type}-${Math.random().toString(16).slice(2)}`;
    if (type === 'heading') {
      const text = String(b?.text || '').trim();
      if (!text) continue;
      out.push({ id, type: 'heading', text });
      continue;
    }
    if (type === 'paragraph') {
      const text = String(b?.text || '').trim();
      if (!text) continue;
      out.push({ id, type: 'paragraph', text });
      continue;
    }
    if (type === 'image') {
      const url = String(b?.url || '').trim();
      if (!url) continue;
      const alt = String(b?.alt || '').trim() || undefined;
      const caption = String(b?.caption || '').trim() || undefined;
      out.push({ id, type: 'image', url, alt, caption });
      continue;
    }
  }
  return out;
}

function sanitizeNews(items: any[]) {
  const normalized = (items || [])
    .map((x) => ({
      id: Number(x?.id),
      title: String(x?.title || '').trim(),
      date: String(x?.date || '').trim(),
      image: String(x?.image || '').trim(),
      text: String(x?.text || '').trim(),
      link: String(x?.link || '').trim() || undefined,
      blocks: sanitizeBlocks(x?.blocks),
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
