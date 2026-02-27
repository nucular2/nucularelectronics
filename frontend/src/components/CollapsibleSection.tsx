import React from 'react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  isOpen: boolean;
  onToggle: () => void;
  headerContent?: React.ReactNode;
}

export default function CollapsibleSection({ 
  title, 
  children, 
  className = "", 
  titleClassName = "",
  isOpen, 
  onToggle,
  headerContent
}: CollapsibleSectionProps) {
  return (
    <div className={className}>
      <div className="product-collapsible-header" onClick={onToggle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          <h2 className={titleClassName}>{title}</h2>
          {headerContent}
        </div>
        <svg 
          className={`chevron ${isOpen ? 'open' : ''}`} 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M6 9L12 15L18 9" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className={`product-collapsible-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
}
