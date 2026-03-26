import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readJson, writeJson } from '../_utils/cmsStorage';
import { defaultHomeCmsConfig } from '../../src/cms/homeConfig';

const PATH = 'home.json';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const stored = await readJson<any>(PATH);
    if (stored && typeof stored === 'object') {
      return res.status(200).json({ ok: true, config: stored });
    }
    await writeJson(PATH, defaultHomeCmsConfig);
    return res.status(200).json({ ok: true, config: defaultHomeCmsConfig });
  } catch (e: any) {
    return res.status(200).json({ ok: true, config: defaultHomeCmsConfig, warning: e?.message || String(e) });
  }
}

