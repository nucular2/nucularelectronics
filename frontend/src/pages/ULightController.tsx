import React, { useEffect, useRef, useState } from 'react';
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import AnimatedSection from "../components/AnimatedSection";
import './ULightController.css';

const TurnSignalIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 12L3 12M3 12L6 9M3 12L6 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 12L21 12M21 12L18 9M21 12L18 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const BrakeLightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="6" stroke="white" strokeWidth="2"/>
    <path d="M4 12C4 8 6 5 8 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 12C20 8 18 5 16 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 12C4 16 6 19 8 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M20 12C20 16 18 19 16 20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HeadlightIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 6C16.2091 6 18 8.68629 18 12C18 15.3137 16.2091 18 14 18V6Z" stroke="white" strokeWidth="2" fill="white"/>
    <path d="M2 8L10 8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 12L10 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    <path d="M2 16L10 16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const LedStripIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="4" width="12" height="16" rx="2" stroke="white" strokeWidth="2"/>
    <circle cx="12" cy="8" r="1" fill="white"/>
    <circle cx="12" cy="12" r="1" fill="white"/>
    <circle cx="12" cy="16" r="1" fill="white"/>
  </svg>
);

export default function ULightController() {
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications'>('overview');
  const { addToCart } = useCart();
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 900px)").matches;
  });
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const apply = () => {
      setIsMobile(mq.matches);
      if (mq.matches) {
        document.body.classList.add("is-mobile");
      } else {
        document.body.classList.remove("is-mobile");
      }
    };
    apply();
    if (mq.addEventListener) mq.addEventListener("change", apply);
    else mq.addListener(apply);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", apply);
      else mq.removeListener(apply);
    };
  }, []);

  useEffect(() => {
    if (activeTab !== "overview") {
      setShowStickyBar(false);
      return;
    }
    const element = topSentinelRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [activeTab]);

  const handleBuy = () => {
    addToCart({
      id: 3,
      category: 'Components',
      title: 'uLight controller',
      price: '$55.00',
      image: '/4экран.png'
    });
  };

  return (
    <div className="ulight-page">
      <div ref={topSentinelRef} />
      {activeTab === "overview" && showStickyBar && (
        <div className="controller-sticky-bar">
          <div className="controller-sticky-title">uLight controller</div>
          <div className="controller-sticky-right">
            <div className="controller-sticky-price">$55.00</div>
            <button className="controller-sticky-cta" onClick={handleBuy}>
              Buy
            </button>
          </div>
        </div>
      )}
      <Header variant="transparent" />
      
      {/* Mobile hero */}
      <AnimatedSection className="ulight-mobile-hero" delay={0.05}>
        <img 
          src="/uLight controller.svg" 
          alt="uLight controller" 
          className="ulight-mobile-hero-image"
        />
      </AnimatedSection>
      
      <section className="ulight-hero">
        {/* Desktop Navigation */}
        <div className="controller-hero-actions ulight-desktop-actions">
          <button 
            type="button" 
            className={`controller-hero-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            type="button" 
            className={`controller-hero-tab ${activeTab === 'specifications' ? 'active' : ''}`}
            onClick={() => setActiveTab('specifications')}
          >
            Specifications
          </button>
          <button type="button" className="controller-hero-buy" onClick={handleBuy}>
            Buy
          </button>
        </div>

        {activeTab === 'overview' ? (
          <AnimatedSection className="ulight-desktop-hero-container" delay={0.1}>
            <img 
              src="/first screen10.png" 
              alt="uLight controller overview" 
              className="ulight-full-width-image"
            />
          </AnimatedSection>
        ) : (
          <div className="specifications-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' }}>
            <h1 className="specifications-title" style={{ textAlign: 'center', color: 'white' }}>Specifications</h1>
            <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
              Specifications content coming soon...
            </div>
          </div>
        )}
      </section>

      {activeTab === 'overview' && (
        <>
          <AnimatedSection className="ulight-desktop-hero-container" delay={0.2}>
            <img 
              src="/uLight controller.png" 
              alt="uLight controller info" 
              className="ulight-full-width-image"
            />
          </AnimatedSection>

          <AnimatedSection className="ulight-reviews-container" delay={0.3}>
            <div className="ulight-buy-plate buy-plate">
              <div className="ulight-buy-info buy-info">
                <h3 className="ulight-buy-title buy-title">uLight controller</h3>
                <p className="ulight-buy-price buy-price">$55.00</p>
              </div>
              <button className="ulight-buy-button buy-button" onClick={handleBuy}>Buy</button>
            </div>

            <section
              className="reviews-section reviews-bleed"
              style={
                isMobile
                  ? { padding: "0 0 40px", background: "#fff" }
                  : undefined
              }
            >
              <div className="section-header">
                <h2 className="section-title">Reviews</h2>
                <a href="/reviews" className="section-link">
                  All reviews
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9L5 5L1 1" stroke="#F36F25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>
              <div
                className="reviews-grid"
                style={
                  isMobile
                    ? {
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "nowrap",
                        overflowX: "auto",
                        overflowY: "hidden",
                        gap: "16px",
                        padding: "0 20px 12px",
                        scrollSnapType: "x mandatory",
                        WebkitOverflowScrolling: "touch",
                      }
                    : undefined
                }
              >
                <article
                  className="review-card"
                  style={
                    isMobile
                      ? {
                          flex: "0 0 280px",
                          width: "280px",
                          minWidth: "280px",
                          maxWidth: "280px",
                          minHeight: "213px",
                          height: "213px",
                          padding: "20px",
                          borderRadius: "20px",
                          background: "#F9F9F9",
                          scrollSnapAlign: "start",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }
                      : undefined
                  }
                >
                  <h3 className="review-title">Nucular controller P24F</h3>
                  <p className="review-text">
                    A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set ...
                  </p>
                  <div className="review-author">
                    <img src="/flag.png" alt="USA" className="review-flag" />
                    <span className="author-name">USA, Alex Smith</span>
                  </div>
                </article>
                <article
                  className="review-card"
                  style={
                    isMobile
                      ? {
                          flex: "0 0 280px",
                          width: "280px",
                          minWidth: "280px",
                          maxWidth: "280px",
                          minHeight: "213px",
                          height: "213px",
                          padding: "20px",
                          borderRadius: "20px",
                          background: "#F9F9F9",
                          scrollSnapAlign: "start",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }
                      : undefined
                  }
                >
                  <h3 className="review-title">uLight controller</h3>
                  <p className="review-text">
                    Lighting control signals, brake light and LED strip. Easy connection and necessary ...
                  </p>
                  <div className="review-author">
                    <img src="/flag2.png" alt="Germany" className="review-flag" />
                    <span className="author-name">Germany, Max Stoun</span>
                  </div>
                </article>
                <article
                  className="review-card"
                  style={
                    isMobile
                      ? {
                          flex: "0 0 280px",
                          width: "280px",
                          minWidth: "280px",
                          maxWidth: "280px",
                          minHeight: "213px",
                          height: "213px",
                          padding: "20px",
                          borderRadius: "20px",
                          background: "#F9F9F9",
                          scrollSnapAlign: "start",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }
                      : undefined
                  }
                >
                  <h3 className="review-title">Nucular controller P24F</h3>
                  <p className="review-text">
                    A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set ...
                  </p>
                  <div className="review-author">
                    <img src="/flag3.png" alt="Norway" className="review-flag" />
                    <span className="author-name">Norway, Anna Orlova</span>
                  </div>
                </article>
                <article
                  className="review-card"
                  style={
                    isMobile
                      ? {
                          flex: "0 0 280px",
                          width: "280px",
                          minWidth: "280px",
                          maxWidth: "280px",
                          minHeight: "213px",
                          height: "213px",
                          padding: "20px",
                          borderRadius: "20px",
                          background: "#F9F9F9",
                          scrollSnapAlign: "start",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                        }
                      : undefined
                  }
                >
                  <h3 className="review-title">The on-board computer</h3>
                  <p className="review-text">
                    The on-board computer is equipped with a large sunlight resistant screen. It displays main parameters, driving modes, ...
                  </p>
                  <div className="review-author">
                    <img src="/flag4.png" alt="France" className="review-flag" />
                    <span className="author-name">France, Robert Jonson</span>
                  </div>
                </article>
              </div>
            </section>
          </AnimatedSection>
        </>
      )}
      
    </div>
  );
}
