import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener('change', updateMatch);
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  useEffect(() => {
    // Check if user has already agreed to cookies
    const hasAgreed = localStorage.getItem('cookieConsent');
    if (!hasAgreed) {
      // Show banner after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAgree = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  if (isMobile) {
    return (
      <div style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        width: '100%',
        padding: '24px 20px 40px',
        backgroundColor: '#fff',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        zIndex: 9999,
        boxSizing: 'border-box',
        fontFamily: 'var(--font-family)',
      }}>
        <p style={{
          margin: 0,
          fontSize: '14px',
          lineHeight: '1.5',
          color: '#111',
        }}>
          We use cookies to improve the performance of the website. By staying with us you agree to the use of <span style={{ color: '#F36F25' }}>cookies</span>.
        </p>
        <button 
          onClick={handleAgree}
          style={{
            backgroundColor: '#F36F25',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            width: '100%',
            height: '48px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
          }}
        >
          Agree
        </button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '680px',
      height: '84px',
      padding: '20px 20px 20px 32px',
      backgroundColor: '#fff',
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 9999,
      boxSizing: 'border-box',
      fontFamily: 'var(--font-family)',
    }}>
      <p style={{
        margin: 0,
        fontSize: '14px',
        lineHeight: '1.4',
        color: '#111',
        maxWidth: '480px'
      }}>
        We use cookies to improve the performance of the website. By staying with us you agree to the use of <span style={{ color: '#F36F25' }}>cookies</span>.
      </p>
      <button 
        onClick={handleAgree}
        style={{
          backgroundColor: '#F36F25',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '0 24px',
          height: '44px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'var(--font-family)',
          whiteSpace: 'nowrap'
        }}
      >
        Agree
      </button>
    </div>
  );
}
