import { useEffect, useState } from "react";
import Header from "../components/Header";
import CardBase from "../components/cards/CardBase";
import "./OnBoardComputer.css";
import { useCart } from "../context/CartContext";
import AnimatedSection from "../components/AnimatedSection";
// NewsletterBanner удалён по требованию

export default function OnBoardComputer() {
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications'>('overview');
  const { addToCart } = useCart();
  const [isMobile, setIsMobile] = useState(false);

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
      <Header variant="transparent" />
      
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
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/2promo.png" alt="On-board computer promo" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box4.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box5.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box6.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box7.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box8.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box9.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box10.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box11.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section onboard-section-last" delay={0.1}>
          <img src="/content-box12.png" alt="On-board computer details" className="onboard-image onboard-image-full" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box13.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box14.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
        <AnimatedSection className="onboard-section" delay={0.1}>
          <img src="/content-box15.png" alt="On-board computer details" className="onboard-image" />
        </AnimatedSection>
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
            <AnimatedSection className="onboard-desktop-container" delay={0.2}>
              <img 
                src="/стрконтр.png" 
                alt="On-board computer desktop view" 
                className="onboard-desktop-full-image" 
              />
            </AnimatedSection>

            <AnimatedSection className="desktop-buy-banner" delay={0.3} direction="up">
              <div className="desktop-buy-content">
                <h2 className="desktop-buy-title">On-board computer</h2>
                <p className="desktop-buy-price">$110.00</p>
                <button className="desktop-buy-button" onClick={handleBuy}>Buy</button>
              </div>
            </AnimatedSection>

            {/* Reviews: same layout and spacing as uLight */}
            <AnimatedSection className="onboard-reviews-container" delay={0.35}>
              <div className="onboard-reviews-section">
                <div className="onboard-reviews-header">
                  <h2 className="onboard-reviews-title">Reviews</h2>
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
                      <img className="product-review-flag" src="/flag.png" width="24" height="24" alt="USA" />
                      <span>USA, Alex Smith</span>
                    </div>
                  </CardBase>
                  <CardBase className="product-review-card" height={218}>
                    <div className="product-review-text">
                      Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of...
                    </div>
                    <div className="product-review-meta">
                      <img className="product-review-flag" src="/flag2.png" width="24" height="24" alt="Germany" />
                      <span>Germany, Max Stoun</span>
                    </div>
                  </CardBase>
                  <CardBase className="product-review-card" height={218}>
                    <div className="product-review-text">
                      A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...
                    </div>
                    <div className="product-review-meta">
                      <img className="product-review-flag" src="/flag3.png" width="24" height="24" alt="Norway" />
                      <span>Norway, Anna Orlova</span>
                    </div>
                  </CardBase>
                  <CardBase className="product-review-card" height={218}>
                    <div className="product-review-text">
                      The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the ...
                    </div>
                    <div className="product-review-meta">
                      <img className="product-review-flag" src="/flag4.png" width="24" height="24" alt="France" />
                      <span>France, Robert Jonson</span>
                    </div>
                  </CardBase>
                </div>
              </div>
            </AnimatedSection>
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

      {/* Удалён старый блок reviews-section */}
    </div>
  );
}
