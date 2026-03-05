import React, { useState } from 'react';
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import './SurRonLightBee.css';

export default function SurRonLightBee() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications'>('overview');

  // Placeholder handleBuy - assuming there might be a specific product or bundle
  const handleBuy = () => {
    addToCart({
      id: 99, // Temporary ID for this kit
      category: 'Complete solutions',
      title: 'Kit for Sur-Ron Light Bee',
      price: '$825.00',
      image: '/content-box60.png'
    });
  };

  return (
    <div className="surron-page">
      <Header variant="transparent" />
      
      {/* Desktop Navigation */}
      <div className="surron-desktop-actions">
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

      <section className="surron-hero">
        {activeTab === 'overview' ? (
          <>
            <div className="surron-full-width-container desktop-only">
              <img 
                src="/content-box60.png" 
                alt="Kit for Sur-Ron Light Bee" 
                className="surron-full-width-image"
              />
            </div>

            <div className="surron-full-width-container mobile-only">
              <img 
                src="/content-box62.png" 
                alt="Kit for Sur-Ron Light Bee Mobile" 
                className="surron-full-width-image"
              />
            </div>
            
            <div className="surron-buy-plate">
              <div className="surron-buy-info">
                <h3 className="surron-buy-title">Kit for Sur-Ron Light Bee</h3>
                <p className="surron-buy-price">$825.00</p>
              </div>
              <button className="surron-buy-button" onClick={handleBuy}>Buy</button>
            </div>
          </>
        ) : (
          <div className="specifications-container" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto', paddingTop: '100px' }}>
            <h1 className="specifications-title" style={{ textAlign: 'center', color: 'white' }}>Specifications</h1>
            <div style={{ textAlign: 'center', padding: '40px', color: '#ccc' }}>
              Specifications content coming soon...
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
