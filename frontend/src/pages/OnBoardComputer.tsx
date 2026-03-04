import Header from "../components/Header";

export default function OnBoardComputer() {
  return (
    <div className="onboard-page">
      <Header variant="white" />
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
    </div>
  );
}
