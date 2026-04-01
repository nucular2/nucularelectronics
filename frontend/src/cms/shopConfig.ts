export type ShopCmsConfigV1 = {
  version: 1;
  banners: {
    desktop: Array<{ id: string; imageUrl: string; alt: string }>;
    mobile: Array<{ id: string; imageUrl: string; alt: string }>;
  };
};

export type ShopCmsConfig = ShopCmsConfigV1;

export const defaultShopCmsConfig: ShopCmsConfig = {
  version: 1,
  banners: {
    desktop: [
      { id: 'left', imageUrl: '/banner-1.png', alt: 'Shop banner 1' },
      { id: 'center', imageUrl: '/banner-2.png', alt: 'Shop banner 2' },
      { id: 'right', imageUrl: '/banner-3.png', alt: 'Shop banner 3' },
    ],
    mobile: [
      { id: 'left', imageUrl: '/banner-1мб.png', alt: 'Shop banner 1' },
      { id: 'center', imageUrl: '/banner-2моб.png', alt: 'Shop banner 2' },
      { id: 'right', imageUrl: '/banner-3мб.png', alt: 'Shop banner 3' },
    ],
  },
};

