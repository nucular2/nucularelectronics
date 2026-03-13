import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import AnimatedSpecsBlock from "../components/AnimatedSpecsBlock";
import AnimatedSpecsText from "../components/AnimatedSpecsText";
import "./ControllerHero.css";

export default function Controller() {
  const [activeFeature, setActiveFeature] = useState<'water' | 'cooling'>('water');
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
      id: 1,
      category: 'Components',
      title: 'Nucular controller P24F',
      price: '$610.00',
      image: '/мото2.png'
    });
  };

  return (
    <div className="onboard-page controller-page">
      {/* Header with dynamic variant based on active tab */}
      <Header variant={activeTab === 'specifications' ? 'white' : 'transparent'} />
      
      {activeTab === 'overview' && (
        <section className="hero controller-hero">
          <div className="hero-image-container">
            <picture>
              <source media="(min-width: 901px)" srcSet="/controller-hero-clean.png" />
              <img
                src="/firstscreen1.png"
                alt="Nucular controller P24F"
                className="hero-main-image"
              />
            </picture>
            
            {/* Desktop Text Overlay with Animation */}
            <div className="controller-hero-text desktop-only">
              <h1 className="controller-hero-title">
                Nucular <br /> controller P24F
              </h1>
              <p className="controller-hero-description">
                For controlling 3-phase permanent magnet electric motors (BLDC, PMSM or PMAC). A powerful ARM microprocessor provides precise and smooth control of the electric motor.
              </p>
            </div>
          </div>
          <div className="controller-hero-actions">
            <button 
              type="button" 
              className="controller-hero-tab active"
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              type="button" 
              className="controller-hero-tab"
              onClick={() => setActiveTab('specifications')}
            >
              Specifications
            </button>
            <button type="button" className="controller-hero-buy" onClick={handleBuy}>
              Buy
            </button>
          </div>
        </section>
      )}

      {activeTab === 'specifications' && (
        <section className="specifications-header-section">
          <div className="specifications-header-content">
            <h1 className="specifications-page-title">Nucular controller P24F</h1>
            <div className="controller-hero-actions static-actions">
              <button 
                type="button" 
                className="controller-hero-tab"
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button 
                type="button" 
                className="controller-hero-tab active"
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button type="button" className="controller-hero-buy" onClick={handleBuy}>
              Buy
            </button>
            </div>
          </div>
        </section>
      )}

      {activeTab === 'overview' ? (
        <>
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

        <section className="onboard-section">
          <div className="onboard-panel">
            <div className="onboard-panel-title">Nucular controller P24F</div>
            <div className="onboard-panel-price">$610.00</div>
            <button className="onboard-panel-button" onClick={handleBuy}>Buy</button>
          </div>
        </section>
      </div>

      {/* Desktop Content */}
      <div className="desktop-only">
        <section className="onboard-section">
          <div style={{ position: 'relative', width: '100%', maxWidth: '1680px', margin: '0 auto' }}>
            {/* Background image - static */}
            <img 
              src="/content-box83.svg" 
              alt="Specs background" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {/* Animated text overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AnimatedSpecsText 
                imageSrc="/content-box84.svg" 
                alt="Specs numbers"
                width="980px"
                height="274px"
              />
            </div>
          </div>
        </section>
        <section className="onboard-section">
          <AnimatedSpecsBlock />
        </section>
        <section className="onboard-section">
          <img src="/content-box37.png" alt="Controller details" className="onboard-image" />
        </section>
        <section className="onboard-section">
          <AnimatedSpecsText 
            imageSrc="/content-box74.svg" 
            alt="Controller details" 
          />
        </section>
        <section className="onboard-section">
          <AnimatedSpecsText 
            imageSrc="/content-box75.svg" 
            alt="Controller details" 
          />
        </section>
        <section className="onboard-section">
          <AnimatedSpecsText 
            imageSrc="/content-box76.svg" 
            alt="Controller details" 
          />
        </section>
        <section className="onboard-section">
          <div style={{ position: 'relative', width: '100%', maxWidth: '1680px', margin: '0 auto' }}>
            {/* Background image - static */}
            <img 
              src="/content-box87.svg" 
              alt="Field-Oriented Control Graph" 
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
            {/* Animated text overlay - positioned lower */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '130px' }}>
              <AnimatedSpecsText 
                imageSrc="/content-box88.svg" 
                alt="Field-Oriented Control Description"
                width="880px"
                height="149px"
              />
            </div>
          </div>
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
            <button className="desktop-buy-button" onClick={handleBuy}>Buy</button>
          </div>
        </section>
      </div>

      <section
        className="reviews-section"
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
      </>
      ) : (
        <div className="specifications-container">
          <h1 className="specifications-title">Specifications</h1>
          <div className="specifications-table-wrapper">
            <table className="specifications-table">
              <thead>
                <tr>
                  <th>
                    <div className="spec-header-card active">
                      Nucular controller P24F
                    </div>
                  </th>
                  <th>
                    <div className="spec-header-card">
                      Nucular controller 6F HE
                    </div>
                  </th>
                  <th>
                    <div className="spec-header-card">
                      Nucular controller 12F HE
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={3} className="spec-row-label">Maximum power</td>
                </tr>
                <tr>
                  <td>27 kW</td>
                  <td>4 kW</td>
                  <td>12 kW</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Nominal power</td>
                </tr>
                <tr>
                  <td>10 kW</td>
                  <td>2 kW</td>
                  <td>5 kW</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Voltage range</td>
                </tr>
                <tr>
                  <td>30-90V</td>
                  <td>30-90V</td>
                  <td>30-90V</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Phase current, max</td>
                </tr>
                <tr>
                  <td>500A</td>
                  <td>120A</td>
                  <td>250A</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Battery current, max</td>
                </tr>
                <tr>
                  <td>350A</td>
                  <td>90A</td>
                  <td>150A</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Supply out</td>
                </tr>
                <tr>
                  <td>12V 3A</td>
                  <td>12V 3A</td>
                  <td>12V 3A</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Phase wires</td>
                </tr>
                <tr>
                  <td>7AWG terminals M6</td>
                  <td>11AWG 5 mm bullets</td>
                  <td>8AWG XT150</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Protection</td>
                </tr>
                <tr>
                  <td>Temperature, hardware overcurrent, IO ports overvoltage protection</td>
                  <td>Temperature and hardware overcurrent protection</td>
                  <td>Temperature and hardware overcurrent protection</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Protection class</td>
                </tr>
                <tr>
                  <td>IP67 (compound filled)</td>
                  <td>IP54 (IP67 with compound)</td>
                  <td>IP54 (IP67 with compound)</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Size, without wires</td>
                </tr>
                <tr>
                  <td>205x98x50 mm</td>
                  <td>53x32x91 mm</td>
                  <td>86x43x125 mm</td>
                </tr>
                <tr>
                  <td colSpan={3} className="spec-row-label">Weight</td>
                </tr>
                <tr>
                  <td>1400 g</td>
                  <td>280 g</td>
                  <td>640 g</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
