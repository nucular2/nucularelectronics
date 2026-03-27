import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type NewsBlock =
  | { id: string; type: 'heading'; text: string; level?: 2 | 3 | 4 }
  | { id: string; type: 'paragraph'; text: string; bold?: boolean }
  | { id: string; type: 'list'; items: string[]; ordered?: boolean }
  | { id: string; type: 'link'; href: string; text: string }
  | { id: string; type: 'image'; url: string; alt?: string; caption?: string }
  | { id: string; type: 'video'; url: string; title?: string }
  | { id: string; type: 'quote'; text: string; author?: string }
  | { id: string; type: 'slider'; images: Array<{ url: string; alt?: string }>; caption?: string }
  | { id: string; type: 'divider' };

export type NewsItem = {
  id: number;
  title: string;
  date: string;
  image: string;
  text: string;
  link?: string;
  blocks?: NewsBlock[];
};

const initialNews: NewsItem[] = [
  {
    id: 1,
    title: 'Protection of controllers',
    date: 'June 20, 2022',
    image: '/new1.png',
    text: 'New circuit engineering and improved protection of controllers from our users.',
    link: '/news/protection-of-controllers',
  },
  {
    id: 2,
    title: 'Price increase',
    date: 'June 5, 2022',
    image: '/new2.png',
    text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...',
    link: '/news/price-increase',
  },
  {
    id: 3,
    title: 'Big/Bug update!',
    date: 'May 28, 2022',
    image: '/new3.png',
    text: 'The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).',
  },
  {
    id: 4,
    title: 'Discount on pre-order',
    date: 'May 24, 2022',
    image: '/new4.png',
    text: 'Until the end of spring, you can order a controller with a 15% discount.',
  },
  {
    id: 5,
    title: 'Protection of controllers',
    date: 'May 15, 2022',
    image: '/new9.png',
    text: 'New circuit engineering and improved protection of controllers from our users.',
  },
  {
    id: 6,
    title: 'Protection of controllers',
    date: 'June 20, 2022',
    image: '/new6.png',
    text: 'New circuit engineering and improved protection of controllers from our users.',
  },
  {
    id: 7,
    title: 'Price increase',
    date: 'June 5, 2022',
    image: '/new7.png',
    text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...',
  },
  {
    id: 8,
    title: 'Brief news for the year',
    date: 'April 3, 2022',
    image: '/new8.png',
    text: 'The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ...',
    link: '/news/brief-news-for-the-year',
  },
  {
    id: 9,
    title: 'Protection of controllers',
    date: 'May 15, 2022',
    image: '/new9.png',
    text: 'New circuit engineering and improved protection of controllers from our users.',
  },
  {
    id: 10,
    title: 'Price increase',
    date: 'April 29, 2022',
    image: '/new10.png',
    text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...',
  },
  {
    id: 11,
    title: 'Brief news for the year',
    date: 'May 20, 2022',
    image: '/new11.png',
    text: 'The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ...',
  },
  {
    id: 12,
    title: 'Big/Bug update!',
    date: 'April 25, 2022',
    image: '/new12.png',
    text: 'The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).',
  },
  {
    id: 13,
    title: 'Brief news for the year',
    date: 'April 3, 2022',
    image: '/new13.png',
    text: 'The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ...',
  },
  {
    id: 14,
    title: 'Price increase',
    date: 'June 5, 2022',
    image: '/new14.png',
    text: 'Updating the cost of controllers. The sadness and grief news about the reasons for the price ...',
  },
];

interface NewsContextType {
  news: NewsItem[];
  refresh: () => Promise<void>;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);

  const refresh = async () => {
    try {
      const r = await fetch('/api/content/news');
      if (!r.ok) throw new Error(`Failed to load news: ${r.status}`);
      const payload = await r.json().catch(() => null);
      const items = Array.isArray(payload?.news) ? payload.news : null;
      if (items) {
        setNews(items);
        return;
      }
      setNews(initialNews);
    } catch {
      setNews(initialNews);
    }
  };

  useEffect(() => {
    void refresh();
  }, []);

  const value = useMemo<NewsContextType>(
    () => ({
      news,
      refresh,
    }),
    [news]
  );

  return <NewsContext.Provider value={value}>{children}</NewsContext.Provider>;
};

export const useNews = () => {
  const ctx = useContext(NewsContext);
  if (!ctx) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return ctx;
};
