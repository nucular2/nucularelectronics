import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import AnimatedSection from "../components/AnimatedSection";

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

      <section
        className="reviews-section"
        id="reviews"
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
                    height: "213px",
                    padding: "20px",
                    borderRadius: "20px",
                    background: "#F9F9F9",
                    boxShadow: "0 0 20px 0 rgba(0,0,0,0.1)",
                    scrollSnapAlign: "start",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }
                : undefined
            }
          >
            <h3 className="review-title">On-board computer</h3>
            <p className="review-text">
              The on-board computer is equipped with the large sunlight resistant screen to display main parameters...
            </p>
            <div className="review-author">
              <img src="/flag.png" alt="France" className="review-flag" />
              <span className="author-name">France, Robert Jonson</span>
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
                    height: "213px",
                    padding: "20px",
                    borderRadius: "20px",
                    background: "#F9F9F9",
                    boxShadow: "0 0 20px 0 rgba(0,0,0,0.1)",
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
                    height: "213px",
                    padding: "20px",
                    borderRadius: "20px",
                    background: "#F9F9F9",
                    boxShadow: "0 0 20px 0 rgba(0,0,0,0.1)",
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
              <span className="author-name">Germany, Anna Muller</span>
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
                    height: "213px",
                    padding: "20px",
                    borderRadius: "20px",
                    background: "#F9F9F9",
                    boxShadow: "0 0 20px 0 rgba(0,0,0,0.1)",
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
              <img src="/flag.png" alt="Norway" className="review-flag" />
              <span className="author-name">Norway, Anna Orlova</span>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
