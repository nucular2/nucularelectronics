import Header from "../components/Header";

export default function Controller() {
  return (
    <div className="onboard-page">
      <Header />
      <section className="hero controller-hero">
        <div className="hero-image-container">
          <picture>
            <source media="(min-width: 900px)" srcSet="/комп1.png" />
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
              <img src="/flag1.png" alt="USA" className="review-flag" />
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
        </div>
      </section>
      <section className="onboard-section onboard-section-last" />
    </div>
  );
}
