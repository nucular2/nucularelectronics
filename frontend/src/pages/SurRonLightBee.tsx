import React, { useEffect, useRef, useState } from 'react';
import Header from "../components/Header";
import { useCart } from "../context/CartContext";
import './SurRonLightBee.css';

export default function SurRonLightBee() {
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications'>('overview');
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 900px)").matches;
  });
  const [showStickyBar, setShowStickyBar] = useState(false);

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

  useEffect(() => {
    if (activeTab !== "overview") {
      setShowStickyBar(false);
      return;
    }
    const element = topSentinelRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowStickyBar(!entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [activeTab]);

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
      <div ref={topSentinelRef} />
      {activeTab === "overview" && showStickyBar && (
        <div className="controller-sticky-bar">
          <div className="controller-sticky-title">Kit for Sur-Ron Light Bee</div>
          <div className="controller-sticky-right">
            <div className="controller-sticky-price">$825.00</div>
            <button className="controller-sticky-cta" onClick={handleBuy}>
              Buy
            </button>
          </div>
        </div>
      )}
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
            <div className="surron-full-width-container surron-desktop-only">
              <img 
                src="/content-box60.png" 
                alt="Kit for Sur-Ron Light Bee" 
                className="surron-full-width-image"
              />
            </div>

            <div className="surron-full-width-container surron-mobile-only">
              <img
                src="/content-box.png"
                alt="Kit for Sur-Ron Light Bee Mobile"
                className="surron-full-width-image"
              />
            </div>

            <div className="surron-buy-plate surron-desktop-only">
              <div className="surron-buy-info">
                <h3 className="surron-buy-title">Kit for Sur-Ron Light Bee</h3>
                <p className="surron-buy-price">$825.00</p>
              </div>
              <button className="surron-buy-button" onClick={handleBuy}>Buy</button>
            </div>

            <section className="surron-kit-section surron-mobile-only">
              <h2 className="surron-kit-title">What in the kit?</h2>
              <div className="surron-kit-cards" aria-label="Kit items">
                <div className="surron-kit-card">
                  <img className="surron-kit-card-image" src="/miniature12.png" alt="Nucular controller P24F" />
                  <div className="surron-kit-card-title">Nucular controller P24F</div>
                </div>
                <div className="surron-kit-card">
                  <img className="surron-kit-card-image" src="/miniature15.png" alt="On-board computer" />
                  <div className="surron-kit-card-title">On-board computer</div>
                </div>
                <div className="surron-kit-card">
                  <img className="surron-kit-card-image" src="/miniature2.png" alt="Controller assembly kit" />
                  <div className="surron-kit-card-title">Controller assembly kit</div>
                </div>
                <div className="surron-kit-card">
                  <img className="surron-kit-card-image" src="/miniature5.png" alt="On-board computer mounting kit" />
                  <div className="surron-kit-card-title">On-board computer mounting kit</div>
                </div>
                <div className="surron-kit-card">
                  <img className="surron-kit-card-image" src="/miniature3.png" alt="Wiring for connection to Sur-Ron Light Bee" />
                  <div className="surron-kit-card-title">Wiring for connection to Sur-Ron Light Bee</div>
                </div>
                <div className="surron-kit-card">
                  <img className="surron-kit-card-image" src="/miniature11.png" alt="CAN wire for On-board computer" />
                  <div className="surron-kit-card-title">CAN wire for On-board computer</div>
                </div>
              </div>

              <div className="surron-install-guide">
                <svg width="24" height="17" viewBox="0 0 24 17" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.0813 4.58932C9.8442 4.45698 9.55329 4.45837 9.31753 4.59298C9.08177 4.72759 8.93673 4.9751 8.93673 5.24281V11.7982C8.93673 12.0659 9.08177 12.3134 9.31753 12.4481C9.55329 12.5827 9.8442 12.5841 10.0813 12.4517L15.9533 9.174C16.1928 9.04037 16.3406 8.79085 16.3406 8.52052C16.3406 8.25019 16.1928 8.00067 15.9533 7.86703L10.0813 4.58932ZM14.0253 8.52052L10.4686 10.5059V6.53517L14.0253 8.52052Z" fill="#F36F25" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.919 16.9999L11.9999 17L12.081 16.9999C12.1335 16.9998 12.2105 16.9995 12.3089 16.9991C12.5058 16.9982 12.7887 16.9964 13.1335 16.9928C13.8227 16.9855 14.761 16.971 15.7553 16.942C16.7484 16.9131 17.8036 16.8694 18.725 16.8035C19.6249 16.7391 20.4619 16.6495 20.9804 16.5134L20.9911 16.5105C21.6015 16.341 22.1556 16.0164 22.5973 15.5694C23.039 15.1225 23.3527 14.569 23.5067 13.965C23.5109 13.9487 23.5145 13.9323 23.5175 13.9158C23.8445 12.1356 24.0058 10.33 23.9994 8.5211C24.0109 6.68474 23.8496 4.85126 23.5175 3.04403C23.5145 3.02755 23.5109 3.01118 23.5067 2.99494C23.3527 2.39089 23.039 1.83744 22.5973 1.39048C22.1556 0.943528 21.6015 0.618899 20.9911 0.449384C20.9822 0.446913 20.9732 0.444601 20.9642 0.442448C20.4518 0.319628 19.6203 0.238106 18.7201 0.179267C17.8002 0.119132 16.746 0.0793357 15.7534 0.0529004C14.7596 0.0264353 13.8218 0.0132193 13.1327 0.00661386C12.7881 0.00330977 12.5054 0.0016565 12.3086 0.000829144C12.2102 0.000415468 12.1333 0.000208152 12.0809 0.000104315L11.9999 0L11.919 0.000114412C11.8665 0.000228287 11.7895 0.000455438 11.6911 0.000908844C11.4942 0.00181548 11.2113 0.00362713 10.8665 0.00724745C10.1773 0.014485 9.239 0.0289657 8.24467 0.0579673C7.25155 0.0869332 6.19635 0.130554 5.27503 0.196512C4.37513 0.260937 3.53806 0.350423 3.01954 0.486534L3.00894 0.489478C2.3985 0.658993 1.84444 0.983622 1.40273 1.43058C0.961023 1.87754 0.647306 2.43099 0.493269 3.03504C0.489125 3.05129 0.485535 3.06767 0.482507 3.08415C0.152979 4.87769 -0.00833983 6.6971 0.000572185 8.51955C-0.0109093 10.3557 0.150422 12.189 0.482512 13.9961C0.486999 14.0205 0.492715 14.0447 0.499638 14.0685C0.669458 14.6538 0.990202 15.1862 1.43088 15.6143C1.87156 16.0424 2.41728 16.3517 3.01531 16.5123L3.01956 16.5134C3.53808 16.6495 4.37513 16.7391 5.27503 16.8035C6.19635 16.8694 7.25155 16.9131 8.24467 16.942C9.239 16.971 10.1773 16.9855 10.8665 16.9928C11.2113 16.9964 11.4942 16.9982 11.6911 16.9991C11.7895 16.9995 11.8665 16.9998 11.919 16.9999ZM11.9224 1.50365L12 1.50354L12.0778 1.50364L12.302 1.50435C12.4964 1.50517 12.7763 1.50681 13.1178 1.51008C13.801 1.51663 14.7295 1.52973 15.7118 1.55589C16.6952 1.58207 17.7269 1.62121 18.6184 1.67948C19.5184 1.73832 20.2177 1.81353 20.5873 1.89985C20.9331 1.99832 21.2469 2.18353 21.4977 2.43733C21.7462 2.68879 21.9243 2.99885 22.0148 3.33743C22.3271 5.04611 22.4787 6.77937 22.4676 8.51533L22.4676 8.52275C22.4738 10.2326 22.3223 11.9395 22.0148 13.6225C21.9243 13.9611 21.7462 14.2711 21.4977 14.5226C21.245 14.7783 20.9283 14.9644 20.5793 15.0623C20.218 15.1562 19.5205 15.239 18.6135 15.3039C17.7234 15.3677 16.6928 15.4105 15.7098 15.4392C14.7281 15.4678 13.8001 15.4821 13.1171 15.4893C12.7757 15.4929 12.496 15.4947 12.3017 15.4956C12.2046 15.496 12.1289 15.4962 12.0776 15.4964L12 15.4965L11.9224 15.4964C11.8711 15.4962 11.7954 15.496 11.6983 15.4956C11.504 15.4947 11.2243 15.4929 10.8829 15.4893C10.1999 15.4821 9.2719 15.4678 8.29016 15.4392C7.3072 15.4105 6.27655 15.3677 5.38647 15.3039C4.47675 15.2388 3.77781 15.1557 3.41745 15.0615C3.07438 14.9689 2.76133 14.7913 2.50843 14.5456C2.26336 14.3076 2.08278 14.0134 1.98283 13.6899C1.67211 11.9853 1.52138 10.2564 1.53246 8.52477L1.53241 8.51633C1.52374 6.79342 1.67529 5.07335 1.98517 3.37751C2.07572 3.03894 2.25378 2.72888 2.50227 2.47743C2.75501 2.22169 3.07171 2.03559 3.42066 1.93771C3.78196 1.84385 4.47945 1.761 5.38647 1.69607C6.27655 1.63234 7.3072 1.58951 8.29016 1.56084C9.2719 1.53221 10.1999 1.51787 10.8829 1.5107C11.2243 1.50712 11.504 1.50532 11.6983 1.50443C11.7954 1.50398 11.8711 1.50376 11.9224 1.50365Z" fill="#F36F25" />
                </svg>
                <span>Installation guide</span>
              </div>
            </section>

            <div className="surron-buy-plate surron-mobile-only buy-plate">
              <div className="surron-buy-info buy-info">
                <h3 className="surron-buy-title buy-title">Kit for Sur-Ron Light Bee</h3>
                <p className="surron-buy-price buy-price">$825.00</p>
              </div>
              <button className="surron-buy-button buy-button" onClick={handleBuy}>Buy</button>
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
