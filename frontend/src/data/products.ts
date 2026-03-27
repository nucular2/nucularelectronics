export interface Product {
  id: number;
  category: string;
  title: string;
  price: string;
  image?: string;
  isPreorder?: boolean;
  sku?: string;
}

export const products: Product[] = [
  // Components
  {
    id: 1,
    category: 'Components',
    title: 'Nucular controller P24F',
    price: '$610.00',
    image: '/мото2.png',
    sku: 'NUCP24F',
  },
  {
    id: 2,
    category: 'Components',
    title: 'On-board\ncomputer',
    price: '$110.00',
    image: '/miniature.png',
    sku: 'NUCD',
  },
  {
    id: 3,
    category: 'Components',
    title: 'uLight controller',
    price: '$55.00',
    image: '/4экран.png',
    sku: 'ULIGHT',
  },
  {
    id: 4,
    category: 'Components',
    title: 'Nucular controller 12F HE',
    price: 'Preorder',
    isPreorder: true,
    sku: 'NUC12FHE',
  },
  {
    id: 5,
    category: 'Components',
    title: 'Nucular controller 6F HE',
    price: 'Preorder',
    isPreorder: true,
    sku: 'NUC6FHE',
  },
  {
    id: 999,
    category: 'Components',
    title: 'test',
    price: '0.50',
    image: '/miniature.png',
    sku: 'TEST',
  },
  // Accessories
  {
    id: 6,
    category: 'Accessories',
    title: 'Adapter for Sur-Ron Light Bee',
    price: '$105.00',
    image: '/cover.png',
    sku: 'NUCSURAD',
  },
  {
    id: 7,
    category: 'Accessories',
    title: 'CAN splitter',
    price: '$2.00',
    image: '/miniature2.png',
    sku: 'CAN-SPLITTER',
  },
  {
    id: 8,
    category: 'Accessories',
    title: 'PWM driver',
    price: '$4.00',
    image: '/cover2.png',
    sku: 'PWM-DRIVER',
  },
  {
    id: 9,
    category: 'Accessories',
    title: 'Crimped wires',
    price: '$3.00',
    image: '/miniature3.png',
    sku: 'CRIMPED-WIRES',
  },
  {
    id: 10,
    category: 'Accessories',
    title: 'Temperature sensors NTC10k',
    price: '$0.50',
    image: '/cover3.png',
    sku: 'NTC10K',
  },
  {
    id: 11,
    category: 'Accessories',
    title: 'USB-wire',
    price: '$6.50',
    image: '/cover4.png',
    sku: 'USB-WIRE',
  },
  // Spare parts
  {
    id: 12,
    category: 'Spare parts',
    title: 'On-board computer case',
    price: '$30.00',
    image: '/miniature5.png',
    sku: 'OBC-CASE',
  },
  {
    id: 13,
    category: 'Spare parts',
    title: 'On-board computer buttons',
    price: '$5.00',
    image: '/cover5.png',
    sku: 'OBC-BUTTONS',
  },
  {
    id: 14,
    category: 'Spare parts',
    title: 'Mounting kit',
    price: '$10.00',
    image: '/cover6.png',
    sku: 'MOUNTING-KIT',
  },
  // Complete solutions
  {
    id: 15,
    category: 'Complete solutions',
    title: 'Kit for Sur-Ron Light Bee',
    price: '$825.00',
    image: '/miniature7.png',
    sku: 'NUCP24FSUR',
  },
  {
    id: 16,
    category: 'Complete solutions',
    title: 'Kit for Talaria Sting',
    price: '$825.00',
    image: '/cover7.png',
    sku: 'KIT-TALARIA',
  },
  {
    id: 17,
    category: 'Complete solutions',
    title: 'Kit for Dual-motor scooters',
    price: '$825.00',
    sku: 'KIT-DUAL',
  },
  // Apparel
  {
    id: 18,
    category: 'Apparel',
    title: 'Baseball cap',
    price: '$20.00',
    image: '/cover8.png',
    sku: '7459066',
  },
  {
    id: 19,
    category: 'Apparel',
    title: 'Pen',
    price: '$5.00',
    image: '/cover9.png',
    sku: 'PEN',
  },
  {
    id: 20,
    category: 'Apparel',
    title: 'T-shirt',
    price: '$16.00',
    image: '/cover10.png',
    sku: 'TSHIRT',
  }
];
