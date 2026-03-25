import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type NewsItem = {
  id: number;
  title: string;
  date: string;
  image: string;
  text: string;
  link?: string;
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
  addNews: (item: Omit<NewsItem, 'id'>) => void;
  updateNews: (id: number, updated: Partial<NewsItem>) => void;
  deleteNews: (id: number) => void;
}

const STORAGE_KEY = 'site_news_v1';

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export const NewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setNews(JSON.parse(stored));
        return;
      } catch {
        setNews(initialNews);
        return;
      }
    }
    setNews(initialNews);
  }, []);

  useEffect(() => {
    if (news.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(news));
    }
  }, [news]);

  const value = useMemo<NewsContextType>(
    () => ({
      news,
      addNews: (item) =>
        setNews((prev) => {
          const nextId = Math.max(...prev.map((n) => n.id), 0) + 1;
          return [{ id: nextId, ...item }, ...prev];
        }),
      updateNews: (id, updated) => setNews((prev) => prev.map((n) => (n.id === id ? { ...n, ...updated } : n))),
      deleteNews: (id) => setNews((prev) => prev.filter((n) => n.id !== id)),
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

