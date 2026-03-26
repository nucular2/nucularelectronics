export type HomeCmsConfigV1 = {
  version: 1;
  categoryCards: {
    leftImageUrl: string;
    leftAlt: string;
    rightImageUrl: string;
    rightAlt: string;
  };
  advantages: {
    title: string;
    subtitle: string[];
    cards: Array<{
      id: string;
      number: string;
      title: string;
      accentWords: string[];
      text: string;
    }>;
  };
  solutions: {
    title: string;
    cards: Array<{
      id: string;
      imageUrl: string;
      alt: string;
      buyHref: string;
      learnHref: string;
    }>;
  };
  bottomPlates: {
    sections: Array<{
      id: string;
      title: string;
      subtitle: string;
      layout: 'lg-sm' | 'sm-lg';
      left: { title: string; text: string; buyHref: string; learnHref: string };
      right: { title: string; text: string; buyHref: string; learnHref: string };
    }>;
  };
};

export type HomeCmsConfig = HomeCmsConfigV1;

export const defaultHomeCmsConfig: HomeCmsConfig = {
  version: 1,
  categoryCards: {
    leftImageUrl: '/category-card210.svg',
    leftAlt: 'Accessories',
    rightImageUrl: '/category-card211.svg',
    rightAlt: 'Spare parts',
  },
  advantages: {
    title: 'Our advantages',
    subtitle: ['We work hard every day to make you happier and your e-bike more', 'powerful and faster.'],
    cards: [
      {
        id: 'shipping',
        number: '01.',
        title: 'Worldwide courier shipping',
        accentWords: ['shipping'],
        text: 'We guarantee delivery of your order.',
      },
      {
        id: 'support',
        number: '02.',
        title: 'Faster and friendly technical support',
        accentWords: ['support'],
        text: "Be sure we'll help you in any situation.",
      },
      {
        id: 'firmware',
        number: '03.',
        title: 'Regularly updated firmware',
        accentWords: ['firmware'],
        text: "You can suggest new features and vote on other user's ideas.",
      },
      {
        id: 'warranty',
        number: '04.',
        title: 'The worldwide warranty is up to 3 years',
        accentWords: ['warranty'],
        text: "We'll repair your device if stuff happens.",
      },
    ],
  },
  solutions: {
    title: 'Complete solutions',
    cards: [
      { id: 'kit1', imageUrl: '/kit1.png', alt: 'Kit 1', buyHref: '/shop', learnHref: '/shop' },
      { id: 'kit2', imageUrl: '/kit2.png', alt: 'Kit 2', buyHref: '/shop', learnHref: '/shop' },
      { id: 'kit3', imageUrl: '/kit3.png', alt: 'Kit 3', buyHref: '/shop', learnHref: '/shop' },
      { id: 'kit4', imageUrl: '/kit4.png', alt: 'Kit 4', buyHref: '/shop', learnHref: '/shop' },
      { id: 'kit5', imageUrl: '/kit5.png', alt: 'Kit 5', buyHref: '/shop', learnHref: '/shop' },
      { id: 'kit6', imageUrl: '/kit6.png', alt: 'Kit 6', buyHref: '/shop', learnHref: '/shop' },
    ],
  },
  bottomPlates: {
    sections: [
      {
        id: 'watersports',
        title: 'Electric Watersports',
        subtitle: 'Electric surfboards and an electric jet propulsion unit.',
        layout: 'lg-sm',
        left: { title: 'Electric surfboards', text: 'Nucular jetboards. Each model has its own strengths and personality.', buyHref: '/shop', learnHref: '/shop' },
        right: { title: 'Electric jet drive', text: 'Propulsion unit for your custom jetboard project.', buyHref: '/shop', learnHref: '/shop' },
      },
      {
        id: 'gokarts',
        title: 'E-go karts solutions',
        subtitle: 'Ready made go-kart and conversion kits.',
        layout: 'sm-lg',
        left: { title: 'Go-kart conversion kit', text: 'Ready made go-kart and conversion kits.', buyHref: '/shop', learnHref: '/shop' },
        right: { title: 'Ready made go-karts', text: 'Ready made go-kart and conversion kits.', buyHref: '/shop', learnHref: '/shop' },
      },
    ],
  },
};

