import React, { useState } from 'react';
import Header from "../components/Header";
import CardBase from "../components/cards/CardBase";
import { useCart } from "../context/CartContext";
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
      <Header variant="transparent" />
      
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
          <div className="ulight-desktop-hero-container">
            <img 
              src="/first screen10.png" 
              alt="uLight controller overview" 
              className="ulight-full-width-image"
            />
          </div>
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
          <div className="ulight-desktop-hero-container">
            <img 
              src="/uLight controller.png" 
              alt="uLight controller info" 
              className="ulight-full-width-image"
            />
          </div>

          <section className="ulight-reviews-container">
             <div className="ulight-buy-plate">
                <div className="ulight-buy-info">
                  <h3 className="ulight-buy-title">uLight controller</h3>
                  <p className="ulight-buy-price">$55.00</p>
                </div>
                <button className="ulight-buy-button" onClick={handleBuy}>Buy</button>
              </div>

              <div className="ulight-reviews-section">
                <div className="ulight-reviews-header">
                  <h2 className="ulight-reviews-title">Reviews</h2>
                  <a href="#" className="reviews-link">
                    All reviews
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 9L5 5L1 1" stroke="#F36F25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                </div>
                <div className="product-reviews-list">
                  <CardBase className="product-review-card" height={218}>
                    <div className="product-review-text">
                      A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...
                    </div>
                    <div className="product-review-meta">
                      <img className="product-review-flag" src="/flag.png" width={24} height={24} alt="USA" />
                      <span>USA, Alex Smith</span>
                    </div>
                  </CardBase>
                  <CardBase className="product-review-card" height={218}>
                    <div className="product-review-text">
                      Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of...
                    </div>
                    <div className="product-review-meta">
                      <img className="product-review-flag" src="/flag2.png" width={24} height={24} alt="Germany" />
                      <span>Germany, Max Stoun</span>
                    </div>
                  </CardBase>
                  <CardBase className="product-review-card" height={218}>
                    <div className="product-review-text">
                      A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...
                    </div>
                    <div className="product-review-meta">
                      <img className="product-review-flag" src="/flag3.png" width={24} height={24} alt="Norway" />
                      <span>Norway, Anna Orlova</span>
                    </div>
                  </CardBase>
                  <CardBase className="product-review-card" height={218}>
                    <div className="product-review-text">
                      The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the ...
                    </div>
                    <div className="product-review-meta">
                      <img className="product-review-flag" src="/flag4.png" width={24} height={24} alt="France" />
                      <span>France, Robert Jonson</span>
                    </div>
                  </CardBase>
                </div>
              </div>
          </section>
        </>
      )}
      
    </div>
  );
}
