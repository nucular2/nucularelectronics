import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Review {
  id: number;
  category: string;
  product: string;
  text: string;
  author: string;
  flag: string;
  image: string;
  link?: string;
}

// Initial data matching the SVG design
const initialReviews: Review[] = [
  {
    id: 1,
    category: 'uLight controller',
    product: 'uLight controller',
    text: 'Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of..',
    author: 'Germany, Max Stoun',
    flag: '/flag2.png',
    link: '/reviews/ulight',
    image: '/uLight controller.png'
  },
  {
    id: 2,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'USA, Alex Smith',
    flag: '/flag.png',
    image: '/miniature.png'
  },
  {
    id: 3,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'Norway, Anna Orlova',
    flag: '/flag3.png',
    image: '/content-box3.png'
  },
  {
    id: 4,
    category: 'uLight controller',
    product: 'uLight controller',
    text: 'Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of..',
    author: 'Germany, Max Stoun',
    flag: '/flag2.png',
    link: '/reviews/ulight',
    image: '/uLight controller.png'
  },
  {
    id: 5,
    category: 'On-board computer',
    product: 'On-board computer',
    text: 'The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the ..',
    author: 'France, Robert Jonson',
    flag: '/flag.png',
    image: '/content-box2.png'
  },
  {
    id: 6,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'USA, Alex Smith',
    flag: '/flag.png',
    image: '/content-box3.png'
  },
  {
    id: 7,
    category: 'Controllers',
    product: 'Nucular controller 6F',
    text: 'Small but mighty. Perfect for my light electric scooter. The app connectivity is a game changer for tuning settings on the fly.',
    author: 'UK, John Doe',
    flag: '/flag.png',
    image: '/content-box5.png'
  },
  {
    id: 8,
    category: 'BMS',
    product: 'Nucular BMS',
    text: 'Keeps my battery pack perfectly balanced. The monitoring features give me peace of mind. Robust construction and reliable performance.',
    author: 'Australia, Sarah Connor',
    flag: '/flag2.png',
    image: '/content-box6.png'
  },
  {
    id: 9,
    category: 'On-board computer',
    product: 'On-board computer',
    text: 'The best display on the market. Customizable screens are awesome. It integrates perfectly with the controller.',
    author: 'Italy, Marco Polo',
    flag: '/flag3.png',
    image: '/content-box2.png'
  },
  {
    id: 10,
    category: 'Controllers',
    product: 'Nucular controller 24F',
    text: 'Built like a tank. Handles high currents without overheating. The regenerative braking is very effective and adjustable.',
    author: 'Sweden, Sven Svensson',
    flag: '/flag4.png',
    image: '/miniature.png'
  }
];

interface ReviewsContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id'>) => void;
  updateReview: (id: number, updatedReview: Partial<Review>) => void;
  deleteReview: (id: number) => void;
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined);

export const ReviewsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const storedReviews = localStorage.getItem('site_reviews');
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews));
      } catch (e) {
        console.error('Failed to parse reviews', e);
        setReviews(initialReviews);
      }
    } else {
      setReviews(initialReviews);
    }
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('site_reviews', JSON.stringify(reviews));
    }
  }, [reviews]);

  const addReview = (newReviewData: Omit<Review, 'id'>) => {
    const newId = Math.max(...reviews.map(r => r.id), 0) + 1;
    const newReview = { ...newReviewData, id: newId };
    setReviews(prev => [...prev, newReview]);
  };

  const updateReview = (id: number, updatedReview: Partial<Review>) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, ...updatedReview } : r));
  };

  const deleteReview = (id: number) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, updateReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewsContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewsProvider');
  }
  return context;
};
