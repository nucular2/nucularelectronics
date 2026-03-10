import { useEffect, useRef, useState } from 'react';
import './AnimatedSpecsBlock.css';

interface AnimatedSpecsTextProps {
  imageSrc: string;
  alt: string;
  width?: string;
  height?: string;
}

export default function AnimatedSpecsText({ 
  imageSrc, 
  alt,
  width,
  height
}: AnimatedSpecsTextProps) {
  const [isVisible, setIsVisible] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (blockRef.current) {
      observer.observe(blockRef.current);
    }

    return () => {
      // Don't disconnect to allow repeat animations
    };
  }, []);

  return (
    <div 
      ref={blockRef} 
      style={{ 
        position: 'relative',
        width: '100%',
        maxWidth: '1680px',
        margin: '0 auto',
        overflow: 'hidden',
        // Changed animation to translateY (slide up) instead of clip-path
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(100px)',
        transition: 'opacity 1.2s ease-out, transform 1.2s ease-out',
      }}
    >
      <img 
        src={imageSrc} 
        alt={alt} 
        className="specs-svg-image"
        style={{ 
          display: 'block', 
          width: width || '100%', 
          height: height || 'auto',
          margin: width ? '0 auto' : undefined // Center if width is constrained
        }}
      />
    </div>
  );
}