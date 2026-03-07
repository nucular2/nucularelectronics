import { useState } from "react";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";

export default function OnBoardComputer() {
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications'>('overview');
  const { addToCart } = useCart();

  const handleBuy = () => {
    addToCart({
      id: 2,
      category: 'Components',
      title: 'On-board computer',
      price: '$110.00',
      image: '/miniature.png'
    });
  };

  return (
    <div className="onboard-page">
      <Header variant="white" />
      
      {/* Mobile Version */}
      <div className="mobile-only">
        <section className="hero">
          <div className="hero-image-container">
            <img
              src="/first2png.png"
              alt="On-board computer"
              className="hero-main-image"
            />
          </div>
        </section>
        <section className="onboard-section">
          <img src="/2promo.png" alt="On-board computer promo" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box4.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box5.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box6.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box7.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box8.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box9.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box10.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box11.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section onboard-section-last">
          <img src="/content-box12.png" alt="On-board computer details" className="onboard-image onboard-image-full" />
        </section>
        <section className="onboard-section">
          <img src="/content-box13.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box14.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box15.png" alt="On-board computer details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <div className="onboard-panel">
            <div className="onboard-panel-title">On-board computer</div>
            <div className="onboard-panel-price">$110.00</div>
            <button className="onboard-panel-button" onClick={handleBuy}>Buy</button>
          </div>
        </section>
      </div>

      {/* Desktop Version */}
      <div className="desktop-only">
        <section className="onboard-desktop-hero">
          <div className="onboard-desktop-actions">
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
        </section>

        {activeTab === 'overview' && (
          <>
            <div className="onboard-desktop-container">
              <img 
                src="/стрконтр.png" 
                alt="On-board computer desktop view" 
                className="onboard-desktop-full-image" 
              />
            </div>

            <section className="desktop-buy-banner">
              <div className="desktop-buy-content">
                <h2 className="desktop-buy-title">On-board computer</h2>
                <p className="desktop-buy-price">$110.00</p>
                <button className="desktop-buy-button" onClick={handleBuy}>Buy</button>
              </div>
            </section>
          </>
        )}

        {activeTab === 'specifications' && (
          <div className="specifications-container">
            <h1 className="specifications-title">Specifications</h1>
            {/* Add specifications table here if needed later */}
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              Specifications content coming soon...
            </div>
          </div>
        )}
      </div>

      <section className="reviews-section">
        <div className="section-header">
          <h2 className="section-title">Reviews</h2>
          <a href="#" className="section-link">
            All reviews
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 9L5 5L1 1" stroke="#F36F25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
        <div className="reviews-grid">
          <article className="review-card">
            <h3 className="review-title">On-board computer</h3>
            <p className="review-text">
              The on-board computer is equipped with the large sunlight resistant screen to display main parameters...
            </p>
            <div className="review-author">
              <img src="/flag.png" alt="France" className="review-flag" />
              <span className="author-name">France, Robert Jonson</span>
            </div>
          </article>
          <article className="review-card">
            <h3 className="review-title">Nucular controller P24F</h3>
            <p className="review-text">
              A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set ...
            </p>
            <div className="review-author">
              <img src="/flag.png" alt="USA" className="review-flag" />
              <span className="author-name">USA, Alex Smith</span>
            </div>
          </article>
          <article className="review-card">
            <h3 className="review-title">uLight controller</h3>
            <p className="review-text">
              Lighting control signals, brake light and LED strip. Easy connection and necessary ...
            </p>
            <div className="review-author">
              <img src="/flag2.png" alt="Germany" className="review-flag" />
              <span className="author-name">Germany, Anna Muller</span>
            </div>
          </article>
          <article className="review-card">
            <h3 className="review-title">Nucular controller P24F</h3>
            <p className="review-text">
              A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set ...
            </p>
            <div className="review-author">
              <img src="/flag.png" alt="Norway" className="review-flag" />
              <span className="author-name">Norway, Anna Orlova</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
