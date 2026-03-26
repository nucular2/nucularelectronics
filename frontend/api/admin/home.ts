import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_utils/adminAuth';
import { writeJson } from '../_utils/cmsStorage';

const PATH = 'home.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

  try {
    const body = (req.body || {}) as { config?: unknown };
    if (!body || !body.config || typeof body.config !== 'object') {
      return res.status(400).json({ message: 'Missing config' });
    }
    await writeJson(PATH, body.config);
    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || String(e) });
  }
}

