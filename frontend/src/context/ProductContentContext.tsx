import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type ProductSpec = { label: string; value: string };
export type ProductKitItem = { title: string; quantity: string };

export type ProductContent = {
  code?: string;
  overview?: string;
  images?: string[];
  specs?: ProductSpec[];
  kitItems?: ProductKitItem[];
};

type ProductContentMap = Record<number, ProductContent>;

interface ProductContentContextType {
  getContent: (productId: number) => ProductContent | undefined;
  upsertContent: (productId: number, content: ProductContent) => void;
  deleteContent: (productId: number) => void;
}

const STORAGE_KEY = 'site_product_content_v1';

const ProductContentContext = createContext<ProductContentContextType | undefined>(undefined);

export const ProductContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [map, setMap] = useState<ProductContentMap>({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setMap(parsed as ProductContentMap);
      }
    } catch {
      setMap({});
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  }, [map]);

  const value = useMemo<ProductContentContextType>(
    () => ({
      getContent: (productId) => map[productId],
      upsertContent: (productId, content) => setMap((prev) => ({ ...prev, [productId]: content })),
      deleteContent: (productId) =>
        setMap((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        }),
    }),
    [map]
  );

  return <ProductContentContext.Provider value={value}>{children}</ProductContentContext.Provider>;
};

export const useProductContent = () => {
  const ctx = useContext(ProductContentContext);
  if (!ctx) {
    throw new Error('useProductContent must be used within a ProductContentProvider');
  }
  return ctx;
};

