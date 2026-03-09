import { useEffect, useRef, useState } from 'react';
import './AnimatedSpecsBlock.css';

export default function AnimatedSpecsBlock() {
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
      className={`animated-specs-block ${isVisible ? 'visible' : ''}`}
    >
      <img 
        src="/content-box82.svg" 
        alt="Compact dimensions, high-quality assembly" 
        className="specs-svg-image"
      />
    </div>
  );
}
