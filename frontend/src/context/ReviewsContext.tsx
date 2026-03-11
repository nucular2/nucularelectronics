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
    image: '/miniature20.svg'
  },
  {
    id: 2,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'USA, Alex Smith',
    flag: '/flag.png',
    image: '/cover21.svg'
  },
  {
    id: 3,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'Norway, Anna Orlova',
    flag: '/flag3.png',
    image: '/cover23.svg'
  },
  {
    id: 4,
    category: 'uLight controller',
    product: 'uLight controller',
    text: 'Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of..',
    author: 'Germany, Max Stoun',
    flag: '/flag2.png',
    link: '/reviews/ulight',
    image: '/cover26.svg'
  },
  {
    id: 5,
    category: 'On-board computer',
    product: 'On-board computer',
    text: 'The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the ..',
    author: 'France, Robert Jonson',
    flag: '/flag.png',
    image: '/cover29svg.svg'
  },
  {
    id: 6,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'USA, Alex Smith',
    flag: '/flag.png',
    image: '/cover30.svg'
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
    const storedReviews = localStorage.getItem('site_reviews_v3');
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
      localStorage.setItem('site_reviews_v3', JSON.stringify(reviews));
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
