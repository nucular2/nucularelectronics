import { useEffect, useRef, useState } from 'react';
import './AnimatedImagesBlock.css';

export default function AnimatedImagesBlock() {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={blockRef} 
      className={`animated-images-block ${isVisible ? 'visible' : ''}`}
    >
      <img 
        src="/анимация4.svg" 
        alt="Animated controller details" 
        className="animated-svg-image"
      />
    </div>
  );
}
