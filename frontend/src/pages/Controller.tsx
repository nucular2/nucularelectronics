import Header from "../components/Header";

export default function Controller() {
  return (
    <div className="onboard-page">
      <Header variant="white" />
      <section className="hero">
        <div className="hero-image-container">
          <img
            src="/firstscreen1.png"
            alt="Nucular controller P24F"
            className="hero-main-image"
          />
        </div>
      </section>
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
