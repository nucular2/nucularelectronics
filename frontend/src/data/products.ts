export interface Product {
  id: number;
  category: string;
  title: string;
  price: string;
  image?: string;
  isPreorder?: boolean;
}

export const products: Product[] = [
  // Components
  {
    id: 1,
    category: 'Components',
    title: 'Nucular controller P24F',
    price: '$610.00',
    image: '/мото2.png'
  },
  {
    id: 2,
    category: 'Components',
    title: 'On-board computer',
    price: '$110.00',
    image: '/miniature.png'
  },
  {
    id: 3,
    category: 'Components',
    title: 'uLight controller',
    price: '$55.00',
    image: '/4экран.png'
  },
  {
    id: 4,
    category: 'Components',
    title: 'Nucular controller 12F HE',
    price: 'Preorder',
    isPreorder: true
  },
  {
    id: 5,
    category: 'Components',
    title: 'Nucular controller 6F HE',
    price: 'Preorder',
    isPreorder: true
  },
  // Accessories
  {
    id: 6,
    category: 'Accessories',
    title: 'Adapter for Sur-Ron Light Bee',
    price: '$105.00',
    image: '/cover.png'
  },
  {
    id: 7,
    category: 'Accessories',
    title: 'CAN splitter',
    price: '$2.00',
    image: '/miniature2.png'
  },
  {
    id: 8,
    category: 'Accessories',
    title: 'PWM driver',
    price: '$4.00',
    image: '/cover2.png'
  },
  {
    id: 9,
    category: 'Accessories',
    title: 'Crimped wires',
    price: '$3.00',
    image: '/miniature3.png'
  },
  {
    id: 10,
    category: 'Accessories',
    title: 'Temperature sensors NTC10k',
    price: '$0.50',
    image: '/cover3.png'
  },
  {
    id: 11,
    category: 'Accessories',
    title: 'USB-wire',
    price: '$6.50',
    image: '/cover4.png'
  },
  // Spare parts
  {
    id: 12,
    category: 'Spare parts',
    title: 'On-board computer case',
    price: '$30.00',
    image: '/miniature5.png'
  },
  {
    id: 13,
    category: 'Spare parts',
    title: 'On-board computer buttons',
    price: '$5.00',
    image: '/cover5.png'
  },
  {
    id: 14,
    category: 'Spare parts',
    title: 'Mounting kit',
    price: '$10.00',
    image: '/cover6.png'
  },
  // Complete solutions
  {
    id: 15,
    category: 'Complete solutions',
    title: 'Kit for Sur-Ron Light Bee',
    price: '$825.00',
    image: '/miniature7.png'
  },
  {
    id: 16,
    category: 'Complete solutions',
    title: 'Kit for Talaria Sting',
    price: '$825.00',
    image: '/cover7.png'
  },
  {
    id: 17,
    category: 'Complete solutions',
    title: 'Kit for Dual-motor scooters',
    price: '$825.00'
  },
  // Apparel
  {
    id: 18,
    category: 'Apparel',
    title: 'T-shirt',
    price: '$25.00',
    image: '/cover8.png'
  },
  {
    id: 19,
    category: 'Apparel',
    title: 'Hoodie',
    price: '$50.00',
    image: '/cover9.png'
  },
  {
    id: 20,
    category: 'Apparel',
    title: 'Cap',
    price: '$15.00',
    image: '/cover10.png'
  }
];
