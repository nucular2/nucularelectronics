import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_utils/adminAuth';
import { uploadFile } from '../_utils/cmsStorage';

function safeBaseName(name: string) {
  const n = String(name || '').trim().toLowerCase();
  const cleaned = n.replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
  return cleaned || 'file';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const auth = await requireAdmin(req);
  if (!auth.ok) return res.status(auth.status).json({ message: auth.message });

  try {
    const body = (req.body || {}) as { filename?: string; contentType?: string; base64?: string; folder?: string };
    const base64 = String(body.base64 || '');
    if (!base64) return res.status(400).json({ message: 'Missing base64' });

    const contentType = String(body.contentType || 'application/octet-stream');
    const filename = safeBaseName(String(body.filename || 'upload'));
    const folder = safeBaseName(String(body.folder || 'uploads'));

    const data = Buffer.from(base64, 'base64');
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const path = `${folder}/${ts}-${filename}`;

    const publicUrl = await uploadFile({ path, contentType, data });
    return res.status(200).json({ ok: true, url: publicUrl, path });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || String(e) });
  }
}

