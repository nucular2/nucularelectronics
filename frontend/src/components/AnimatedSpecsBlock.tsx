import { useEffect, useRef, useState } from 'react';
import './AnimatedSpecsBlock.css';

interface AnimatedSpecsBlockProps {
  imageSrc?: string;
  alt?: string;
}

export default function AnimatedSpecsBlock({ 
  imageSrc = "/content-box82.svg", 
  alt = "Compact dimensions, high-quality assembly" 
}: AnimatedSpecsBlockProps) {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Update visibility state based on whether the element is intersecting
        setIsVisible(entry.isIntersecting);
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
        src={imageSrc} 
        alt={alt} 
        className="specs-svg-image"
      />
    </div>
  );
}