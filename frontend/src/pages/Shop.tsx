import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../components/Header";
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import ChevronDown from '../components/icons/ChevronDown';
import { defaultShopCmsConfig, type ShopCmsConfig } from '../cms/shopConfig';
import './Shop.css';

export default function Shop() {
  const [activeTab, setActiveTab] = useState('Components');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTabsSticky, setIsTabsSticky] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [shopConfig, setShopConfig] = useState<ShopCmsConfig>(defaultShopCmsConfig);
  const [activeBannerId, setActiveBannerId] = useState<string>('center');
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const bannerRefs = useRef<Array<HTMLDivElement | null>>([]);
  const { products } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const tabs = [
    'Components',
    'Accessories',
    'Spare parts',
    'Complete solutions',
    'Apparel'
  ];

  const filteredProducts = products.filter(product => product.category === activeTab);

  useEffect(() => {
    const getHeaderHeight = () => {
      const value = getComputedStyle(document.documentElement).getPropertyValue('--header-h').trim();
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : 100;
    };

    const update = () => {
      const el = tabsRef.current;
      if (!el) return;
      const headerH = getHeaderHeight();
      const top = el.getBoundingClientRect().top;
      setIsTabsSticky(top <= headerH + 1);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.matchMedia('(max-width: 900px)').matches);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    let canceled = false;
    void (async () => {
      try {
        const r = await fetch('/api/content/shop');
        const payload = await r.json().catch(() => null);
        const cfg = payload?.config && typeof payload.config === 'object' ? (payload.config as ShopCmsConfig) : defaultShopCmsConfig;
        if (!canceled) setShopConfig(cfg);
      } catch {
        if (!canceled) setShopConfig(defaultShopCmsConfig);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  const banners = useMemo(() => {
    const list = isMobile ? shopConfig?.banners?.mobile : shopConfig?.banners?.desktop;
    return Array.isArray(list) ? list.slice(0, 3) : [];
  }, [isMobile, shopConfig]);

  useEffect(() => {
    const center = banners.find((b: any) => String(b?.id || '').toLowerCase() === 'center');
    if (center?.id) {
      setActiveBannerId(String(center.id));
      return;
    }
    if (banners[1]?.id) {
      setActiveBannerId(String(banners[1].id));
      return;
    }
    if (banners[0]?.id) setActiveBannerId(String(banners[0].id));
  }, [banners, isMobile]);

  return (
    <>
      <Header variant="white" />
      <div className="shop-page">
        <div className={`shop-container grid-container ${isMobileMenuOpen ? 'mobile-menu-open' : ''}`}>
          <div className="shop-banners-section">
            <div className="shop-banners">
              <div className="shop-banners-track">
                {banners.map((b, idx) => (
                  <div
                    key={b.id || idx}
                    ref={(el) => {
                      bannerRefs.current[idx] = el;
                    }}
                    role="button"
                    tabIndex={0}
                    className={`shop-banner-item ${
                      String(b.id || idx) === String(activeBannerId)
                        ? 'shop-banner-item--center'
                        : 'shop-banner-item--side'
                    } shop-banner-item--clickable`}
                    onClick={() => {
                      const id = String(b.id || idx);
                      setActiveBannerId(id);
                      window.setTimeout(() => {
                        bannerRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }, 0);
                    }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter' && e.key !== ' ') return;
                      e.preventDefault();
                      const id = String(b.id || idx);
                      setActiveBannerId(id);
                      window.setTimeout(() => {
                        bannerRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                      }, 0);
                    }}
                  >
                    <img
                      className="shop-banner-img"
                      src={b.imageUrl}
                      alt={b.alt}
                      width={
                        isMobile
                          ? String(b.id || idx) === String(activeBannerId)
                            ? 320
                            : 288
                          : String(b.id || idx) === String(activeBannerId)
                          ? 1180
                          : 1062
                      }
                      height={
                        isMobile
                          ? String(b.id || idx) === String(activeBannerId)
                            ? 260
                            : 234
                          : String(b.id || idx) === String(activeBannerId)
                          ? 400
                          : 360
                      }
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h1 className="shop-title">Shop</h1>
          
          <div ref={tabsRef} className={`shop-tabs ${isTabsSticky ? 'is-sticky' : ''}`}>
            <div
              className={`shop-tabs-mobile-header ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="current-tab">{activeTab}</span>
              <ChevronDown className={`shop-tabs-chevron ${isMobileMenuOpen ? 'open' : ''}`} />
            </div>
            
            <div className={`shop-tabs-list ${isMobileMenuOpen ? 'open' : ''}`}>
              {tabs.map(tab => (
                <button 
                  key={tab} 
                  className={`shop-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="shop-grid grid-12">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="shop-card"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className={`shop-card-image-container ${!product.image ? 'placeholder' : ''}`}>
                  {product.image ? (
                    <img src={product.image} alt={product.title} className="shop-card-image" />
                  ) : (
                    <svg width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z" fill="#E9E9E9" />
                      <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                    </svg>
                  )}
                </div>
                <h3 className="shop-card-title">{product.title}</h3>
                {!product.isPreorder && (
                  <p className="shop-card-price">{product.price}</p>
                )}
                <div className="shop-card-footer">
                  {product.isPreorder ? (
                    <p className="shop-card-price preorder">{product.price}</p>
                  ) : (
                    <button 
                      className="card-button buy-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                    >
                      Add to cart
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
