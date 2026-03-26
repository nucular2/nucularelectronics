import type { VercelRequest, VercelResponse } from '@vercel/node';
import { readJson, writeJson } from '../_utils/cmsStorage';

const PATH = 'news.json';

const fallback = [
  {
    id: 1,
    title: 'Protection of controllers',
    date: 'June 20, 2022',
    image: '/new1.png',
    text: 'New circuit engineering and improved protection of controllers from our users.',
    link: '/news/protection-of-controllers',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'New circuit engineering and improved protection of controllers from our users.' }],
  },
  {
    id: 2,
    title: 'Price increase',
    date: 'June 5, 2022',
    image: '/new2.png',
    text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...',
    link: '/news/price-increase',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...' }],
  },
  {
    id: 3,
    title: 'Big/Bug update!',
    date: 'May 28, 2022',
    image: '/new3.png',
    text: 'The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).' }],
  },
  {
    id: 4,
    title: 'Discount on pre-order',
    date: 'May 24, 2022',
    image: '/new4.png',
    text: 'Until the end of spring, you can order a controller with a 15% discount.',
    blocks: [{ id: 'p1', type: 'paragraph', text: 'Until the end of spring, you can order a controller with a 15% discount.' }],
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const stored = await readJson<any[]>(PATH);
    if (stored && Array.isArray(stored)) {
      return res.status(200).json({ ok: true, news: stored });
    }

    await writeJson(PATH, fallback);
    return res.status(200).json({ ok: true, news: fallback });
  } catch (e: any) {
    return res.status(200).json({ ok: true, news: fallback, warning: e?.message || String(e) });
  }
}
