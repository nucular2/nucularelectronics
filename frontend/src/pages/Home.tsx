import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  // Styles for Mobile View
  const controllersSectionStyle = { overflowX: "auto" as const };
  const controllersGridStyle = {
    display: "flex",
    flexWrap: "nowrap" as const,
    gap: "16px",
    overflowX: "auto" as const,
    overflowY: "hidden" as const,
    padding: "0 16px 12px",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch" as const,
    width: "max-content",
  };
  const controllerCardStyle = {
    flex: "0 0 280px",
    width: "280px",
    maxWidth: "280px",
    height: "373px",
    padding: "20px",
    borderRadius: "20px",
    scrollSnapAlign: "start",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  };
  const cardImageContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "200px",
    marginBottom: "16px",
    paddingRight: "0",
    width: "100%",
  };
  const cardTextBlockStyle = {
    marginTop: "auto",
    width: "100%",
  };
  const cardImageStyle = {
    width: "220px",
    height: "220px",
    objectFit: "contain" as const,
  };
  const cardLinkStyle = { marginTop: "8px" };
  const cardActionsStyle = {
    marginTop: "12px",
    justifyContent: "flex-start",
    gap: "12px",
    width: "100%",
  };

  return (
    <div className={isMobile ? "home-mobile" : undefined}>
      <Header />
      
      {!isMobile ? (
        // DESKTOP VIEW
        <div style={{ width: '100%', background: '#fff' }}>
          
          {/* Hero Section */}
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            height: '100vh', 
            minHeight: '800px',
            overflow: 'hidden'
          }}>
            <img 
              src="/first.png" 
              alt="Hero"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover',
                objectPosition: 'center'
              }} 
            />
          </div>

          {/* Main SVG Content */}
          <div style={{ width: '100%', background: '#fff' }}>
             <object
               type="image/svg+xml"
               data="/Main.svg"
               style={{ width: '100%', display: 'block' }}
             >
               <img src="/Main.svg" alt="Main Content" style={{ width: '100%', display: 'block' }} />
             </object>
          </div>
        </div>
      ) : (
        // MOBILE VIEW
        <div style={{ width: '100%', overflowX: 'hidden', background: '#ffffff', minHeight: '100vh' }}>
          
          {/* 1. Hero Image (firstmob.png) */}
          <div style={{ position: 'relative', width: '100%' }}>
            <img 
              src="/firstmob.png" 
              alt="Nucular Mobile Hero" 
              style={{ width: '100%', display: 'block', height: 'auto' }} 
            />
          </div>

          {/* 2. Product Slider (3 Cards) */}
          <div style={{ padding: '40px 0', background: '#ffffff' }}>
            <div style={{ padding: '0 20px', marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 16px', color: '#111', fontFamily: 'var(--font-family)' }}>Controllers</h2>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.5, margin: 0, fontFamily: 'var(--font-family)' }}>
                For controlling 3-phase permanent magnet electric motors (BLDC, PMSM or PMAC).
              </p>
            </div>

            <div style={{
              display: 'flex',
              overflowX: 'auto',
              gap: '16px',
              padding: '0 20px 20px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}>
              {/* Card 1: P24F */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                background: '#f9f9f9',
                borderRadius: '20px',
                padding: '20px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '380px',
                boxShadow: 'none' // Removed shadow for cleaner look on white
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <img src="/miniature.png" alt="P24F" style={{ height: '180px', objectFit: 'contain' }} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111', fontFamily: 'var(--font-family)' }}>Nucular controller P24F</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, fontFamily: 'var(--font-family)' }}>27 kW</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <a href="/cart" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F36F25',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '0 32px',
                    height: '44px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    fontFamily: 'var(--font-family)'
                  }}>Buy</a>
                  <a href="#" style={{ color: '#F36F25', textDecoration: 'none', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-family)' }}>Learn more</a>
                </div>
              </div>

              {/* Card 2: 12F HE */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                background: '#f9f9f9',
                borderRadius: '20px',
                padding: '20px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '380px',
                boxShadow: 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', height: '180px', alignItems: 'center', background: '#fff', borderRadius: '12px' }}>
                  <span style={{ fontSize: '48px', color: '#e0e0e0', fontWeight: 700, fontFamily: 'var(--font-family)' }}>N</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111', fontFamily: 'var(--font-family)' }}>Nucular controller 12F HE</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, fontFamily: 'var(--font-family)' }}>12 kW</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                  <button disabled style={{
                    background: '#F36F25',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 24px',
                    height: '44px',
                    fontWeight: 600,
                    fontSize: '14px',
                    opacity: 0.9,
                    fontFamily: 'var(--font-family)'
                  }}>Preorder</button>
                  <span style={{ color: '#999', fontSize: '14px', fontFamily: 'var(--font-family)' }}>In development</span>
                </div>
              </div>

              {/* Card 3: 6F HE */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                background: '#f9f9f9',
                borderRadius: '20px',
                padding: '20px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '380px',
                boxShadow: 'none'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', height: '180px', alignItems: 'center', background: '#fff', borderRadius: '12px' }}>
                   <span style={{ fontSize: '48px', color: '#e0e0e0', fontWeight: 700, fontFamily: 'var(--font-family)' }}>N</span>
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px', color: '#111', fontFamily: 'var(--font-family)' }}>Nucular controller 6F HE</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, fontFamily: 'var(--font-family)' }}>4 kW</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
                   <button disabled style={{
                    background: '#F36F25',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0 24px',
                    height: '44px',
                    fontWeight: 600,
                    fontSize: '14px',
                    opacity: 0.9,
                    fontFamily: 'var(--font-family)'
                  }}>Preorder</button>
                  <span style={{ color: '#999', fontSize: '14px', fontFamily: 'var(--font-family)' }}>In development</span>
                </div>
              </div>

            </div>
          </div>
          
          {/* 3. Bottom Image (мобилка6.svg) */}
          <div style={{ width: '100%' }}>
            <img 
              src="/мобилка6.svg" 
              alt="Footer Content" 
              style={{ width: '100%', display: 'block', height: 'auto' }} 
            />
          </div>

          {/* 4. Features Slider (4 Cards) */}
          <div style={{ 
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            padding: '0 20px 40px', // Added horizontal padding for scroll snap and spacing
            background: '#ffffff',
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none'
          }}>
            {/* Card 1: Shipping */}
            <div style={{
              flex: '0 0 250px',
              width: '250px',
              height: '184px',
              padding: '20px',
              borderRadius: '20px',
              boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
              background: '#fff',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '14px', color: '#999', fontWeight: 500, fontFamily: 'var(--font-family)' }}>01.</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0', lineHeight: 1.2, color: '#111', fontFamily: 'var(--font-family)' }}>
                Worldwide courier <span style={{ color: '#F36F25' }}>shipping</span>
              </h3>
              <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-family)' }}>
                We guarantee delivery of your order.
              </p>
            </div>

            {/* Card 2: Support */}
            <div style={{
              flex: '0 0 250px',
              width: '250px',
              height: '184px',
              padding: '20px',
              borderRadius: '20px',
              boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
              background: '#fff',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '14px', color: '#999', fontWeight: 500, fontFamily: 'var(--font-family)' }}>02.</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0', lineHeight: 1.2, color: '#111', fontFamily: 'var(--font-family)' }}>
                Faster and friendly technical <span style={{ color: '#F36F25' }}>support</span>
              </h3>
              <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-family)' }}>
                Be sure we'll help you in any situation.
              </p>
            </div>

            {/* Card 3: Firmware */}
            <div style={{
              flex: '0 0 250px',
              width: '250px',
              height: '184px',
              padding: '20px',
              borderRadius: '20px',
              boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
              background: '#fff',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '14px', color: '#999', fontWeight: 500, fontFamily: 'var(--font-family)' }}>03.</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0', lineHeight: 1.2, color: '#111', fontFamily: 'var(--font-family)' }}>
                Regularly updated <span style={{ color: '#F36F25' }}>firmware</span>
              </h3>
              <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-family)' }}>
                You can suggest new features and vote on other user's ideas.
              </p>
            </div>

            {/* Card 4: Warranty */}
            <div style={{
              flex: '0 0 250px',
              width: '250px',
              height: '184px',
              padding: '20px',
              borderRadius: '20px',
              boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
              background: '#fff',
              scrollSnapAlign: 'start',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <span style={{ fontSize: '14px', color: '#999', fontWeight: 500, fontFamily: 'var(--font-family)' }}>04.</span>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '8px 0', lineHeight: 1.2, color: '#111', fontFamily: 'var(--font-family)' }}>
                The worldwide <span style={{ color: '#F36F25' }}>warranty</span> is up to 3 years
              </h3>
              <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.4, fontFamily: 'var(--font-family)' }}>
                We'll repair your device if stuff happens.
              </p>
            </div>
          </div>

          {/* 5. Complete Solutions Slider */}
          <div style={{ padding: '0 0 40px', background: '#ffffff' }}>
            <div style={{ padding: '0 20px', marginBottom: '24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, margin: '0 0 16px', color: '#111', fontFamily: 'var(--font-family)' }}>Complete solutions</h2>
              <p style={{ fontSize: '16px', color: '#666', lineHeight: 1.5, margin: 0, fontFamily: 'var(--font-family)' }}>
                Plug and Ride kits so as not to bother with diagrams, custom wiring harnesses, connectors and soldering.
              </p>
            </div>
            <div style={{ 
              width: '100%', 
              overflowX: 'auto', 
              padding: '0 20px', // Horizontal padding
              background: '#ffffff',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}>
              <img 
                src="/скролл5.svg" 
                alt="Complete Solutions" 
                style={{ 
                  height: '320px', 
                  width: 'auto', 
                  maxWidth: 'none', 
                  display: 'block' 
                }} 
              />
            </div>
          </div>

          {/* 6. News Section */}
          <div style={{ padding: '0 0 40px', background: '#ffffff' }}>
            <div style={{ padding: '0 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#111', fontFamily: 'var(--font-family)' }}>News</h2>
              <a href="/news" style={{ color: '#F36F25', textDecoration: 'none', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-family)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                All news
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L5 5L1 1" stroke="#F36F25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            <div style={{ 
              display: 'flex',
              overflowX: 'auto',
              gap: '16px',
              padding: '0 20px 20px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}>
              {/* News Card 1 */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ width: '280px', height: '185px', borderRadius: '20px', overflow: 'hidden' }}>
                  <img src="/new1.png" alt="Protection" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px', fontFamily: 'var(--font-family)' }}>June 20, 2022</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#111', lineHeight: '1.3', fontFamily: 'var(--font-family)' }}>Protection of controllers</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
                    New circuit engineering and improved protection of controllers from our users.
                  </p>
                </div>
              </div>

              {/* News Card 2 */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                <div style={{ width: '280px', height: '185px', borderRadius: '20px', overflow: 'hidden' }}>
                  <img src="/new2.png" alt="Price increase" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px', fontFamily: 'var(--font-family)' }}>June 5, 2022</div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#111', lineHeight: '1.3', fontFamily: 'var(--font-family)' }}>Price increase</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
                    Updating the cost of controllers. The sadness and grief news about the reasons for the price ...
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 7. Reviews Section */}
          <div style={{ padding: '0 0 40px', background: '#ffffff' }}>
            <div style={{ padding: '0 20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '32px', fontWeight: 700, margin: 0, color: '#111', fontFamily: 'var(--font-family)' }}>Reviews</h2>
              <a href="/reviews" style={{ color: '#F36F25', textDecoration: 'none', fontSize: '14px', fontWeight: 500, fontFamily: 'var(--font-family)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                All reviews
                <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 9L5 5L1 1" stroke="#F36F25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
            <div style={{ 
              display: 'flex',
              overflowX: 'auto',
              gap: '16px',
              padding: '0 20px 20px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}>
              {/* Review Card 1 */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                height: '213px',
                padding: '20px',
                borderRadius: '20px',
                background: '#f9f9f9',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#111', fontFamily: 'var(--font-family)' }}>Nucular controller P24F</h3>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
                    A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set ...
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/flag.png" alt="USA" style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-family)' }}>USA, Alex Smith</span>
                </div>
              </div>

              {/* Review Card 2 */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                height: '213px',
                padding: '20px',
                borderRadius: '20px',
                background: '#f9f9f9',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <a href="/reviews/ulight" style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#111', fontFamily: 'var(--font-family)' }}>uLight controller</h3>
                  </a>
                  <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
                    Lighting control signals, brake light and LED strip. Easy connection and necessary ...
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src="/flag2.png" alt="Germany" style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-family)' }}>Germany, Max Stoun</span>
                </div>
              </div>
            </div>
          </div>

          {/* 8. Newsletter Section */}
          <div style={{ width: '100%', background: '#101010', padding: '32px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxSizing: 'border-box' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 12px', color: '#fff', textAlign: 'center', fontFamily: 'var(--font-family)' }}>Join our newsletter</h2>
            <p style={{ fontSize: '14px', color: '#ccc', textAlign: 'center', margin: '0 0 24px', lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
              We will notify you of the release of new features and firmware for the Nucular platform.
            </p>
            <div style={{ width: '100%', maxWidth: '374px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="email" 
                placeholder="E-mail" 
                style={{ 
                  width: '100%', 
                  height: '54px', 
                  padding: '0 20px', 
                  borderRadius: '8px', 
                  border: 'none', 
                  fontSize: '16px',
                  boxSizing: 'border-box',
                  fontFamily: 'var(--font-family)'
                }} 
              />
              <button style={{ 
                width: '100%', 
                height: '54px', 
                background: '#F36F25', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '16px', 
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)'
              }}>
                Subscribe
              </button>
            </div>
          </div>

        </div>
      )}
      <Footer />
    </div>
  );
}
