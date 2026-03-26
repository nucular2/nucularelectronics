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
      </div>
      <div className={`product-collapsible-content ${isOpen ? 'open' : ''}`}>
        {children}
      </div>
    </div>
  );
}
