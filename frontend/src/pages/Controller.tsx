import { useState } from "react";
import Header from "../components/Header";

export default function Controller() {
  const [activeFeature, setActiveFeature] = useState<'water' | 'cooling'>('water');

  return (
    <div className="onboard-page">
      <Header />
      <section className="hero controller-hero">
        <div className="hero-image-container">
          <picture>
            <source media="(min-width: 1px)" srcSet="/комп1.png" />
            <img
              src="/firstscreen1.png"
              alt="Nucular controller P24F"
              className="hero-main-image"
            />
          </picture>
        </div>
        <div className="controller-hero-actions">
          <button type="button" className="controller-hero-tab active">
            Overview
          </button>
          <button type="button" className="controller-hero-tab">
            Specifications
          </button>
          <button type="button" className="controller-hero-buy">
            Buy
          </button>
        </div>
      </section>
      
      {/* Mobile Content */}
      <div className="mobile-only">
        <section className="onboard-section">
          <img src="/content-box16.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box17.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box18.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box19.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box20.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box21.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box22.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box23.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box24.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box25.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box26.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box27.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box28.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box29.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box30.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box31.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box32.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/Group 2087330907.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box34.png" alt="Controller details" className="onboard-image" />
        </section>
      </div>

      {/* Desktop Content */}
      <div className="desktop-only">
        <section className="onboard-section">
          <img src="/content-box35.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box36.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box37.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box43.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box38.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box39.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box40.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box41.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box42.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box44.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box45.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box46.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box47.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box48.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box49.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box50.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box51.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <img src="/content-box52.png" alt="Controller details" className="onboard-image" />
        </section>
        
        <section className="onboard-section promo-features-section">
          <div className="promo-features-container">
            <div 
              className={`promo-feature-column ${activeFeature === 'water' ? 'active' : ''}`}
              onClick={() => setActiveFeature('water')}
            >
              <div className="promo-image-wrapper">
                <img 
                  src="/promo_controller-P24F_water.png" 
                  alt="Full water protection" 
                  className="promo-feature-image"
                />
              </div>
              <div className="promo-text-content">
                <h3 className="promo-title">Full water protection</h3>
                <p className="promo-description">
                  With compound potting — protection class IP67, the controller can work even under water.
                </p>
              </div>
            </div>
            
            <div 
              className={`promo-feature-column ${activeFeature === 'cooling' ? 'active' : ''}`}
              onClick={() => setActiveFeature('cooling')}
            >
              <div className="promo-image-wrapper">
                <img 
                  src="/promo_controller-P24F_cooling.png" 
                  alt="Efficient cooling" 
                  className="promo-feature-image"
                />
              </div>
              <div className="promo-text-content">
                <h3 className="promo-title">Efficient cooling</h3>
                <p className="promo-description">
                  Due to the double-sided heat sink to the case, under heavy loads, the temperature gradient is minimal. Heats up slowly, cools down quickly.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="onboard-section">
          <img src="/content-box53.png" alt="Controller details" className="onboard-image" />
        </section>

        <section className="desktop-buy-banner">
          <div className="desktop-buy-content">
            <h2 className="desktop-buy-title">Nucular controller P24F</h2>
            <p className="desktop-buy-price">$610.00</p>
            <button className="desktop-buy-button">Buy</button>
          </div>
        </section>
      </div>

      <section className="onboard-section">
        <div className="onboard-panel">
          <div className="onboard-panel-title">Nucular controller P24F</div>
          <div className="onboard-panel-price">$610.00</div>
          <button className="onboard-panel-button">Buy</button>
        </div>
      </section>
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
              <span className="author-name">Germany, Max Stoun</span>
            </div>
          </article>
          <article className="review-card">
            <h3 className="review-title">Nucular controller P24F</h3>
            <p className="review-text">
              A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set ...
            </p>
            <div className="review-author">
              <img src="/flag3.png" alt="Norway" className="review-flag" />
              <span className="author-name">Norway, Anna Orlova</span>
            </div>
          </article>
          <article className="review-card">
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
      <section className="onboard-section onboard-section-last" />
    </div>
  );
}
