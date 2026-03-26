import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useReviews } from "../context/ReviewsContext";
import { useCart } from "../context/CartContext";
import { products as productsData } from "../data/products";
import AnimatedSpecsText from "../components/AnimatedSpecsText";
import NewsletterBanner from "../components/NewsletterBanner";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const { reviews } = useReviews();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const p24fProduct = useMemo(() => {
    return (
      productsData.find((p) => p.id === 1) ?? {
        id: 1,
        category: "Components",
        title: "Nucular controller P24F",
        price: "$610.00",
        image: "/мото2.png",
      }
    );
  }, []);

  const onBoardProduct = useMemo(() => {
    return (
      productsData.find((p) => p.id === 2) ?? {
        id: 2,
        category: "Components",
        title: "On-board computer",
        price: "$110.00",
        image: "/miniature.png",
      }
    );
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  // Reviews Data
  const reviewsData = [
    {
      id: 1,
      title: "Nucular controller P24F",
      description: "A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set ...",
      author: "USA, Alex Smith",
      flag: "/flag.png",
      link: "#"
    },
    {
      id: 2,
      title: "uLight controller",
      description: "Lighting control signals, brake light and LED strip. Easy connection and necessary ...",
      author: "Germany, Max Stoun",
      flag: "/flag2.png",
      link: "/reviews/ulight"
    },
    {
      id: 3,
      title: "Nucular controller 6F",
      description: "Compact and reliable controller for small electric vehicles. Perfect for e-bikes and scooters...",
      author: "France, Hans Muller",
      flag: "/flag3.png",
      link: "#"
    }
  ];

  // News Data
  const newsData = [
    {
      id: 1,
      title: "Protection of controllers",
      date: "June 20, 2022",
      image: "/new1.png",
      text: "New circuit engineering and improved protection of controllers from our users."
    },
    {
      id: 2,
      title: "Price increase",
      date: "June 5, 2022",
      image: "/new2.png",
      text: "Updating the cost of controllers. The sadness and grief news about the reasons for the price ..."
    },
    {
      id: 3,
      title: "Big/Bug update!",
      date: "May 28, 2022",
      image: "/new3.png",
      text: "The big update of the Controller (v0.8.1) and the On-board Computer (v0.70)."
    },
    {
      id: 4,
      title: "Discount on pre-order",
      date: "May 24, 2022",
      image: "/new4.png",
      text: "Until the end of spring, you can order a controller with a 15% discount."
    },
    {
      id: 5,
      title: "Protection of controllers",
      date: "May 15, 2022",
      image: "/new5.png",
      text: "New circuit engineering and improved protection of controllers from our users."
    },
    {
      id: 6,
      title: "Protection of controllers",
      date: "June 20, 2022",
      image: "/new6.png",
      text: "New circuit engineering and improved protection of controllers from our users."
    },
    {
      id: 7,
      title: "Price increase",
      date: "June 5, 2022",
      image: "/new7.png",
      text: "Updating the cost of controllers. The sadness and grief news about the reasons for the price ..."
    },
    {
      id: 8,
      title: "Brief news for the year",
      date: "April 3, 2022",
      image: "/new8.png",
      text: "The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ..."
    },
    {
      id: 9,
      title: "Protection of controllers",
      date: "May 15, 2022",
      image: "/new9.png",
      text: "New circuit engineering and improved protection of controllers from our users."
    },
    {
      id: 10,
      title: "Price increase",
      date: "April 29, 2022",
      image: "/new10.png",
      text: "Updating the cost of controllers. The sadness and grief news about the reasons for the price ..."
    },
    {
      id: 11,
      title: "Brief news for the year",
      date: "May 20, 2022",
      image: "/new11.png",
      text: "The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ..."
    },
    {
      id: 12,
      title: "Big/Bug update!",
      date: "April 25, 2022",
      image: "/new12.png",
      text: "The big update of the Controller (v0.8.1) and the On-board Computer (v0.70)."
    },
    {
      id: 13,
      title: "Brief news for the year",
      date: "April 3, 2022",
      image: "/new13.png",
      text: "The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ..."
    },
    {
      id: 14,
      title: "Price increase",
      date: "June 5, 2022",
      image: "/new14.png",
      text: "Updating the cost of controllers. The sadness and grief news about the reasons for the price ..."
    }
  ];

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
            <div className="hero-content">
              <a href="#components" className="see-components-link">
                See the components
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8 0C8.42758 0 8.77419 0.346618 8.77419 0.774194V13.3567L14.6784 7.45256C14.9807 7.15022 15.4709 7.15022 15.7732 7.45256C16.0756 7.7549 16.0756 8.2451 15.7732 8.54744L8.54744 15.7732C8.2451 16.0756 7.7549 16.0756 7.45256 15.7732L0.226756 8.54744C-0.0755853 8.2451 -0.0755853 7.7549 0.226756 7.45256C0.529097 7.15022 1.01929 7.15022 1.32163 7.45256L7.22581 13.3567V0.774194C7.22581 0.346618 7.57242 0 8 0Z" fill="#F36F25" />
                </svg>
              </a>
            </div>
          </div>

          <div className="page-content-white">
            <section className="controllers-section" id="components">
              <h2 className="controllers-title">Controllers</h2>
              <p className="controllers-description">
                For controlling 3-phase permanent magnet electric motors (BLDC, PMSM or PMAC).
              </p>
              <div className="controllers-grid">
                <div className="controller-card">
                  <div className="card-image-container">
                    <img src={p24fProduct.image || "/мото2.png"} alt="Nucular controller P24F" className="card-image" />
                  </div>
                  <h3 className="card-title">Nucular controller P24F</h3>
                  <p className="card-power">27 kW</p>
                  <div className="card-actions">
                    <button
                      type="button"
                      className="card-button buy-button"
                      onClick={() => {
                        addToCart(p24fProduct as any);
                        navigate("/cart");
                      }}
                    >
                      Buy
                    </button>
                    <a
                      href="/product/1"
                      className="card-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/product/1");
                      }}
                    >
                      Learn more
                    </a>
                  </div>
                </div>

                <div className="controller-card">
                  <div className="card-image-container">
                    <svg className="card-image" width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 12L0 60H19.2375L19.2375 15L46.575 42.0556V0H12.15C5.43975 0 0 5.37258 0 12Z" fill="#E9E9E9" />
                      <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                    </svg>
                  </div>
                  <h3 className="card-title">Nucular controller 12F HE</h3>
                  <p className="card-power">12 kW</p>
                  <div className="card-actions">
                    <button type="button" className="card-button preorder-button" disabled>
                      Preorder
                    </button>
                    <span className="status-text">In development</span>
                  </div>
                </div>

                <div className="controller-card">
                  <div className="card-image-container">
                    <svg className="card-image" width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 12L0 60H19.2375L19.2375 15L46.575 42.0556V0H12.15C5.43975 0 0 5.37258 0 12Z" fill="#E9E9E9" />
                      <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                    </svg>
                  </div>
                  <h3 className="card-title">Nucular controller 6F HE</h3>
                  <p className="card-power">4 kW</p>
                  <div className="card-actions">
                    <button type="button" className="card-button preorder-button" disabled>
                      Preorder
                    </button>
                    <span className="status-text">In development</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="accessories-section">
              <div className="accessories-grid">
                <div className="accessory-card">
                  <h3 className="accessory-title">On-board computer</h3>
                  <p className="accessory-description">
                    For displaying basic parameters,
                    <br />
                    setting devices and power modes.
                  </p>
                  <div className="accessory-actions">
                    <a
                      href="/product/2"
                      className="card-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/product/2");
                      }}
                    >
                      Learn more
                    </a>
                    <button
                      type="button"
                      className="card-button buy-button"
                      onClick={() => {
                        addToCart(onBoardProduct as any);
                        navigate("/cart");
                      }}
                    >
                      Buy
                    </button>
                  </div>
                  <div className="accessory-image-container">
                    <img src="/3экран.png" alt="On-board computer" className="accessory-image" />
                  </div>
                </div>

                <div className="accessory-card">
                  <h3 className="accessory-title">
                    Bluetooth module
                    <br />
                    with App
                  </h3>
                  <p className="accessory-description">
                    Change all settings through your smartphone
                    <br />
                    instead an On-board computer.
                  </p>
                  <div className="accessory-actions">
                    <button type="button" className="card-button buy-button" disabled>
                      Buy
                    </button>
                  </div>
                  <div className="accessory-image-container">
                    <img src="/3(2)экран.png" alt="Bluetooth module" className="accessory-image" />
                  </div>
                </div>
              </div>
            </section>

            <section className="bms-section">
              <div className="bms-banner">
                <div className="bms-content-left">
                  <div className="bms-title">Battery Management System</div>
                  <div className="bms-description">BMS for monitor and regulate the charging and discharge of batteries.</div>
                  <div className="bms-actions">
                    <button type="button" className="card-button preorder-button" disabled>
                      Preorder
                    </button>
                    <span className="status-text bms-status">In development</span>
                  </div>
                </div>
                <div className="bms-content-right">
                  <div className="bms-placeholder">
                    <svg width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 12L0 60H19.2375L19.2375 15L46.575 42.0556V0H12.15C5.43975 0 0 5.37258 0 12Z" fill="#E9E9E9" />
                      <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                    </svg>
                  </div>
                </div>
              </div>
            </section>

            <section className="home-ulight-section">
              <div className="home-ulight-banner">
                <img src="/4экран.png" alt="uLight controller" className="home-ulight-image" />
                <div className="home-ulight-content">
                  <div className="home-ulight-title">uLight controller</div>
                  <div className="home-ulight-description">Designed to connect and control lightning equipment.</div>
                  <div className="home-ulight-actions">
                    <button
                      type="button"
                      className="card-button buy-button"
                      onClick={() => {
                        const product = productsData.find((p) => p.id === 3);
                        if (product) {
                          addToCart(product);
                          navigate("/cart");
                        } else {
                          navigate("/shop");
                        }
                      }}
                    >
                      Buy
                    </button>
                    <a
                      href="/product/3"
                      className="card-link"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/product/3");
                      }}
                    >
                      Learn more
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <section className="levcan-section">
              <div className="levcan-lead">
                <div>
                  All devices are connected by <strong>CAN-bus.</strong>
                </div>
                <div>
                  Components can be used separately with devices from other manufacturers
                  <br />
                  using our open <strong>LEVCAN protocol</strong>.
                </div>
              </div>
              <div className="levcan-title">
                For LEVs
                <br />
                development
                <br />
                companies:
              </div>
              <div className="levcan-grid">
                <div className="levcan-item">
                  <div className="levcan-icon">
                    <svg width="40" height="40" viewBox="0 0 29 44" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                      <path d="M14.4999 15.4727C14.9071 15.4727 15.2372 15.7974 15.2372 16.1979V21.6997L17.9704 24.3884C18.2584 24.6716 18.2584 25.1308 17.9704 25.4141C17.6825 25.6973 17.2157 25.6973 16.9278 25.4141L13.9786 22.513C13.8403 22.377 13.7627 22.1925 13.7627 22.0001V16.1979C13.7627 15.7974 14.0928 15.4727 14.4999 15.4727Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M14.5 11.6045C8.66355 11.6045 3.93219 16.2588 3.93219 22.0001C3.93219 27.7414 8.66355 32.3957 14.5 32.3957C20.3364 32.3957 25.0678 27.7414 25.0678 22.0001C25.0678 16.2588 20.3364 11.6045 14.5 11.6045ZM5.40676 22.0001C5.40676 17.0599 9.47794 13.055 14.5 13.055C19.522 13.055 23.5932 17.0599 23.5932 22.0001C23.5932 26.9403 19.522 30.9451 14.5 30.9451C9.47794 30.9451 5.40676 26.9403 5.40676 22.0001Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M4.92649 11.287L5.58671 4.18003C5.69163 3.03889 6.22636 1.97714 7.08588 1.20385C7.9455 0.430481 9.06794 0.00111145 10.2329 3.22171e-05L18.7847 3.18595e-05C19.953 -0.00424649 21.0806 0.422513 21.9448 1.1961C22.8094 1.97003 23.3474 3.0348 23.4526 4.18003L24.1163 11.3242C27.1119 13.9372 29 17.7517 29 22C29 26.2685 27.094 30.0991 24.0735 32.7131L23.4133 39.82C23.3081 40.9652 22.77 42.03 21.9055 42.8039C21.0414 43.5774 19.914 44.0042 18.7457 44H10.2346C9.06634 44.0042 7.93891 43.5774 7.07483 42.8039C6.21036 42.0301 5.67235 40.9654 5.56708 39.8203L4.90511 32.6946C1.89701 30.081 -2.57492e-05 26.2585 -2.57492e-05 22C-2.57492e-05 17.7315 1.906 13.901 4.92649 11.287ZM18.7891 1.45057C19.5889 1.44738 20.3608 1.7394 20.9524 2.26893C21.5439 2.79846 21.9121 3.52772 21.9841 4.3113L22.5234 10.1172C20.2258 8.61291 17.4669 7.73633 14.5 7.73633C11.551 7.73633 8.80769 8.60231 6.51842 10.0899L7.0553 4.31057C7.12703 3.5297 7.49289 2.8034 8.08105 2.27425C8.66912 1.74517 9.43697 1.4514 10.2339 1.45058H18.7861L18.7891 1.45057ZM6.03786 12.2588C6.08693 12.2271 6.13202 12.1897 6.17212 12.1474C8.4298 10.2988 11.3329 9.18688 14.5 9.18688C21.6937 9.18688 27.5254 14.9235 27.5254 22C27.5254 25.8988 25.7553 29.3909 22.9624 31.7409C22.9131 31.7728 22.8678 31.8104 22.8276 31.8529C20.5699 33.7014 17.6669 34.8132 14.5 34.8132C7.30623 34.8132 1.47455 29.0766 1.47455 22C1.47455 18.1011 3.24484 14.6089 6.03786 12.2588ZM6.4975 33.8966L7.03557 39.6887C7.10755 40.4723 7.47574 41.2015 8.06728 41.7311C8.65882 42.2606 9.43075 42.5526 10.2306 42.5494L10.2335 42.5494L18.7468 42.5494L18.7498 42.5494C19.5496 42.5526 20.3215 42.2606 20.913 41.7311C21.5046 41.2015 21.8727 40.473 21.9447 39.6894L22.4815 33.9102C20.1923 35.3978 17.4489 36.2638 14.5 36.2638C11.542 36.2638 8.79097 35.3925 6.4975 33.8966Z" fill="#222222" />
                    </svg>
                  </div>
                  <div className="levcan-item-text">Save a lot of time for your company.</div>
                </div>
                <div className="levcan-item">
                  <div className="levcan-icon">
                    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                      <path d="M2.21726 10.2158C2.50693 9.92806 2.97659 9.92806 3.26626 10.2158L16.5769 24.4316L25.9425 15.1281C26.2322 14.8403 26.7019 14.8403 26.9915 15.1281L44.5165 32.5369V25.4737C44.5165 25.0667 44.8486 24.7368 45.2582 24.7368C45.6679 24.7368 46 25.0667 46 25.4737V37.2632C46 37.6701 45.6679 38 45.2582 38H33.3901C32.9804 38 32.6484 37.6701 32.6484 37.2632C32.6484 36.8562 32.9804 36.5263 33.3901 36.5263H40.5004L26.467 22.5859L17.1014 31.8894C16.8117 32.1772 16.3421 32.1772 16.0524 31.8894L2.21726 17.1526C1.92758 16.8649 1.92758 16.3983 2.21726 16.1106C2.50693 15.8228 2.97659 15.8228 3.26626 16.1106L16.5769 30.3264L25.9425 21.0228C26.2322 20.7351 26.7019 20.7351 26.9915 21.0228L42.5985 36.5263H44.5165V34.621L26.467 16.6912L17.1014 25.9947C16.8117 26.2825 16.3421 26.2825 16.0524 25.9947L2.21726 11.2579C1.92758 10.9701 1.92758 10.5036 2.21726 10.2158Z" fill="#222222" />
                    </svg>
                  </div>
                  <div className="levcan-item-text">Reduction in the cost of development.</div>
                </div>
                <div className="levcan-item">
                  <div className="levcan-icon">
                    <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                      <path fillRule="evenodd" clipRule="evenodd" d="M17.4725 24C17.4725 20.395 20.395 17.4725 24 17.4725C27.605 17.4725 30.5275 20.395 30.5275 24C30.5275 27.605 27.605 30.5275 24 30.5275C20.395 30.5275 17.4725 27.605 17.4725 24ZM24 18.9231C21.1961 18.9231 18.9231 21.1961 18.9231 24C18.9231 26.8039 21.1961 29.0769 24 29.0769C26.8039 29.0769 29.0769 26.8039 29.0769 24C29.0769 21.1961 26.8039 18.9231 24 18.9231Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M13.6044 24C13.6044 18.2587 18.2587 13.6044 24 13.6044C29.7413 13.6044 34.3956 18.2587 34.3956 24C34.3956 29.7413 29.7413 34.3956 24 34.3956C18.2587 34.3956 13.6044 29.7413 13.6044 24ZM24 15.0549C19.0598 15.0549 15.0549 19.0598 15.0549 24C15.0549 28.9402 19.0598 32.9451 24 32.9451C28.9402 32.9451 32.9451 28.9402 32.9451 24C32.9451 19.0598 28.9402 15.0549 24 15.0549Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M38.9756 30.095L38.3121 29.8022L38.9787 30.0879C39.1682 29.6459 39.4827 29.2689 39.8837 29.0034C40.2843 28.7381 40.7537 28.5956 41.2341 28.5934H41.4066C42.6248 28.5934 43.7932 28.1095 44.6546 27.248C45.5161 26.3866 46 25.2182 46 24C46 22.7818 45.5161 21.6134 44.6546 20.752C43.7932 19.8905 42.6248 19.4066 41.4066 19.4066H41.0794C40.5989 19.4044 40.1296 19.2619 39.729 18.9966C39.3669 18.7569 39.0753 18.4262 38.8826 18.0389C38.882 17.9395 38.861 17.8412 38.8209 17.7502C38.6219 17.2995 38.5626 16.7994 38.6505 16.3146C38.7382 15.831 38.9684 15.3846 39.3116 15.0328L39.3141 15.0302L39.4242 14.9202C39.8513 14.4936 40.1901 13.987 40.4213 13.4293C40.6524 12.8717 40.7714 12.274 40.7714 11.6703C40.7714 11.0667 40.6524 10.469 40.4213 9.91133C40.1902 9.35395 39.8516 8.84755 39.4248 8.42107C38.9982 7.99399 38.4916 7.65518 37.9339 7.42402C37.3763 7.19286 36.7786 7.07388 36.1749 7.07388C35.5713 7.07388 34.9736 7.19286 34.4159 7.42402C33.8584 7.65513 33.3517 7.99412 32.9251 8.42107L32.8123 8.53383C32.4605 8.87691 32.0142 9.10708 31.5306 9.19477C31.0458 9.28267 30.5458 9.22329 30.0951 9.02435L30.0879 9.02128C29.6459 8.83184 29.2689 8.51727 29.0034 8.11631C28.7381 7.71571 28.5956 7.24634 28.5934 6.76588V6.59341C28.5934 5.37516 28.1095 4.20681 27.248 3.34538C26.3866 2.48395 25.2182 2 24 2C22.7818 2 21.6134 2.48395 20.752 3.34538C19.8905 4.20681 19.4066 5.37516 19.4066 6.59341V6.92061C19.4044 7.40106 19.2619 7.87043 18.9966 8.27103C18.7569 8.6331 18.4262 8.92472 18.0389 9.11738C17.9395 9.11795 17.8412 9.13896 17.7502 9.17911C17.2995 9.37805 16.7994 9.4374 16.3146 9.34949C15.831 9.26181 15.3847 9.03163 15.0329 8.68853L14.9202 8.57579C14.4936 8.14871 13.987 7.80991 13.4293 7.57875C12.8717 7.34759 12.274 7.22861 11.6703 7.22861C11.0667 7.22861 10.469 7.34759 9.91133 7.57875C9.35382 7.80986 8.84732 8.14856 8.42078 8.5755C7.99384 9.00205 7.65513 9.50855 7.42402 10.0661C7.19286 10.6237 7.07388 11.2214 7.07388 11.8251C7.07388 12.4287 7.19286 13.0264 7.42402 13.5841C7.65518 14.1417 7.99399 14.6483 8.42107 15.0749L8.53381 15.1876C8.8769 15.5394 9.10708 15.9858 9.19477 16.4694C9.28267 16.9542 9.22333 17.4542 9.02439 17.905C9.01822 17.9189 9.01249 17.9331 9.00722 17.9475C8.83642 18.4118 8.52986 18.8141 8.1274 19.102C7.7271 19.3883 7.25033 19.5482 6.75848 19.5613H6.59341C5.37516 19.5613 4.20681 20.0453 3.34538 20.9067C2.48395 21.7681 2 22.9365 2 24.1547C2 25.373 2.48395 26.5413 3.34538 27.4028C4.20681 28.2642 5.37516 28.7481 6.59341 28.7481H6.92061C7.40106 28.7503 7.87043 28.8928 8.27103 29.1581C8.67199 29.4236 8.98652 29.8006 9.17597 30.2426L9.17911 30.2498C9.37805 30.7005 9.4374 31.2006 9.34949 31.6854C9.26181 32.1689 9.03164 32.6153 8.68855 32.9671L8.57551 33.0801C8.14856 33.5067 7.80986 34.0132 7.57875 34.5707C7.34759 35.1283 7.22861 35.726 7.22861 36.3297C7.22861 36.9333 7.34759 37.531 7.57875 38.0887C7.80991 38.6463 8.14871 39.1529 8.57579 39.5795C9.00228 40.0063 9.50867 40.3449 10.0661 40.576C10.6237 40.8071 11.2214 40.9261 11.8251 40.9261C12.4287 40.9261 13.0264 40.8071 13.5841 40.576C14.1416 40.3449 14.6483 40.0059 15.0749 39.5789L15.185 39.4688L15.1876 39.4662C15.5394 39.1231 15.9857 38.8929 16.4694 38.8052C16.9542 38.7173 17.4542 38.7767 17.905 38.9756C17.9189 38.9818 17.9331 38.9875 17.9475 38.9928C18.4118 39.1636 18.8141 39.4701 19.102 39.8726C19.3883 40.2729 19.5482 40.7497 19.5613 41.2415V41.4066C19.5613 42.6248 20.0453 43.7932 20.9067 44.6546C21.7681 45.5161 22.9365 46 24.1547 46C25.373 46 26.5413 45.5161 27.4028 44.6546C28.2642 43.7932 28.7481 42.6248 28.7481 41.4066V41.0794C28.7503 40.5989 28.8928 40.1296 29.1581 39.729C29.4236 39.328 29.8006 39.0135 30.2426 38.824L30.2498 38.8209C30.7005 38.6219 31.2006 38.5626 31.6854 38.6505C32.1689 38.7382 32.6153 38.9684 32.9671 39.3115L32.9698 39.3141L33.0801 39.4245C33.5067 39.8514 34.0132 40.1901 34.5707 40.4213C35.1283 40.6524 35.726 40.7714 36.3297 40.7714C36.9333 40.7714 37.531 40.6524 38.0887 40.4213C38.6462 40.1901 39.1527 39.8514 39.5792 39.4245C40.0062 38.9979 40.3449 38.4915 40.576 37.9339C40.8071 37.3763 40.9261 36.7786 40.9261 36.1749C40.9261 35.5713 40.8071 34.9736 40.576 34.4159C40.3449 33.8584 40.0059 33.3517 39.5789 32.9251L39.4688 32.815L39.4662 32.8123C39.1231 32.4605 38.8929 32.0142 38.8052 31.5306C38.7173 31.0458 38.7767 30.5458 38.9756 30.095Z" fill="#222222" />
                    </svg>
                  </div>
                  <div className="levcan-item-text">Hardware improvements and technical support.</div>
                </div>
                <div className="levcan-item">
                  <div className="levcan-icon">
                    <svg width="40" height="40" viewBox="0 0 40 36" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                      <path d="M10.7447 25.0986C11.1739 25.0986 11.522 25.4472 11.522 25.877C11.5219 26.3067 11.1738 26.6554 10.7447 26.6554H6.60008C6.17091 26.6554 5.82286 26.3067 5.82278 25.877C5.82278 25.4472 6.17087 25.0986 6.60008 25.0986H10.7447Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M35.3926 19.2676C37.9277 19.2677 40 21.3013 40 23.831V31.4366C40 33.9663 37.9277 35.9999 35.3926 36H4.6074C2.0723 35.9999 0 33.9663 0 31.4366V23.831C0 21.3013 2.0723 19.2677 4.6074 19.2676H35.3926ZM1.69897 32.4507C2.12221 33.6275 3.25709 34.4788 4.6074 34.4789H35.3926C36.7429 34.4788 37.8778 33.6275 38.301 32.4507H1.69897ZM4.6074 20.7887C2.89218 20.7888 1.51899 22.1603 1.51899 23.831V30.9296H38.481V23.831C38.481 22.1603 37.1078 20.7888 35.3926 20.7887H4.6074Z" fill="#222222" />
                      <path d="M10.7447 5.83099C11.1739 5.83099 11.522 6.17956 11.522 6.60937C11.5219 7.03913 11.1738 7.38776 10.7447 7.38776H6.60008C6.17091 7.38776 5.82286 7.03913 5.82278 6.60937C5.82278 6.17956 6.17087 5.83099 6.60008 5.83099H10.7447Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M35.3926 0C37.9277 0.000105999 40 2.03369 40 4.56338V12.169C40 14.6987 37.9277 16.7323 35.3926 16.7324H4.6074C2.0723 16.7323 0 14.6987 0 12.169V4.56338C0 2.03369 2.0723 0.000105741 4.6074 0H35.3926ZM1.69897 13.1831C2.12221 14.3599 3.25709 15.2112 4.6074 15.2113H35.3926C36.7429 15.2112 37.8778 14.3599 38.301 13.1831H1.69897ZM4.6074 1.52113C2.89218 1.52123 1.51899 2.89272 1.51899 4.56338V11.662H38.481V4.56338C38.481 2.89272 37.1078 1.52123 35.3926 1.52113H4.6074Z" fill="#222222" />
                    </svg>
                  </div>
                  <div className="levcan-item-text">Own proprietary software, not VESC.</div>
                </div>
              </div>
            </section>

            <section className="home-category-section">
              <div className="home-category-grid">
                <img src="/category-card210.svg" alt="Accessories" className="home-category-card" width={580} height={380} />
                <img src="/category-card211.svg" alt="Spare parts" className="home-category-card" width={580} height={380} />
              </div>
            </section>

            <section className="advantages-section">
              <div className="advantages-title">Our advantages</div>
              <div className="advantages-subtitle">
                We work hard every day to make you happier and your e-bike more
                <br />
                powerful and faster.
              </div>
              <div className="advantages-grid">
                <div className="adv-card">
                  <div className="adv-number">01.</div>
                  <div className="adv-title">
                    Worldwide courier <span className="adv-accent">shipping</span>
                  </div>
                  <div className="adv-text">We guarantee delivery of your order.</div>
                </div>
                <div className="adv-card">
                  <div className="adv-number">02.</div>
                  <div className="adv-title">
                    Faster and friendly technical <span className="adv-accent">support</span>
                  </div>
                  <div className="adv-text">Be sure we'll help you in any situation.</div>
                </div>
                <div className="adv-card">
                  <div className="adv-number">03.</div>
                  <div className="adv-title">
                    Regularly updated <span className="adv-accent">firmware</span>
                  </div>
                  <div className="adv-text">You can suggest new features and vote on other user's ideas.</div>
                </div>
                <div className="adv-card">
                  <div className="adv-number">04.</div>
                  <div className="adv-title">
                    The worldwide <span className="adv-accent">warranty</span> is up to 3 years
                  </div>
                  <div className="adv-text">We'll repair your device if stuff happens.</div>
                </div>
              </div>
            </section>

            <section className="solutions-section">
              <div className="solutions-title">Complete solutions</div>
              <div className="solutions-grid">
                {[
                  { title: "For Sur-Ron Light Bee", desc: "Up to 30% more power on standard battery.", img: "/kit1.png" },
                  { title: "For Talaria Sting", desc: "Up to 12 kW of power on standard battery.", img: "/kit2.png" },
                  { title: "For Talaria XXX", desc: "Up to 30kW on 74V battery.", img: "/kit3.png" },
                  { title: "For Apollo RFN", desc: "Up to 12kW on stock battery.", img: "/kit4.png" },
                  { title: "For E Ride SS Pro", desc: "Up to 12kW on stock battery.", img: "/kit5.png" },
                  { title: "For Arctic Leopard EXT 650", desc: "Up to 25 kW of power on a custom battery.", img: "/kit6.png" },
                ].map((card) => (
                  <div key={card.title} className="solution-card">
                    <div className="solution-card-content">
                      <div className="solution-card-title">{card.title}</div>
                      <div className="solution-card-desc">{card.desc}</div>
                      <div className="solution-card-actions">
                        <button type="button" className="card-button buy-button" onClick={() => navigate("/shop")}>
                          Buy
                        </button>
                        <a
                          href="/shop"
                          className="card-link solution-card-link"
                          onClick={(e) => {
                            e.preventDefault();
                            navigate("/shop");
                          }}
                        >
                          Learn more
                        </a>
                      </div>
                    </div>
                    <img src={card.img} alt={card.title} className="solution-card-image" width={580} height={500} />
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Desktop News Section */}
          <div style={{ 
            width: '100%',
            margin: '0',
            padding: '40px 0',
            background: '#ffffff'
          }}>
            <div className="grid-container" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--home-section-header-mb)'
              }}>
                <h2 style={{ 
                  fontSize: 'var(--home-section-title-fs)', 
                  fontWeight: 700, 
                  margin: 0, 
                  color: '#111', 
                  fontFamily: 'var(--font-family)' 
                }}>News</h2>
                <a href="/news" style={{ 
                  color: '#F36F25', 
                  textDecoration: 'none', 
                  fontSize: 'var(--home-section-link-fs)', 
                  fontWeight: 500, 
                  fontFamily: 'var(--font-family)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}>
                  All news
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9L5 5L1 1" stroke="#F36F25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <div className="desktop-news-scroll" style={{ 
                display: 'flex',
                overflowX: 'auto',
                gap: 'var(--home-slider-gap)',
                paddingBottom: 'var(--home-section-header-mb)',
                height: '100%',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none'  // IE/Edge
              }}>
                <style>{`
                  .desktop-news-scroll::-webkit-scrollbar {
                    display: none;
                  }
                  .news-card-image-wrapper:hover .news-card-image {
                    transform: scale(1.05);
                  }
                  .news-card-image {
                    transition: transform 0.3s ease;
                  }
                `}</style>
                
                {newsData.map((news) => (
                  <article key={news.id} style={{ flex: '0 0 var(--home-card-w)', width: 'var(--home-card-w)', display: 'flex', flexDirection: 'column' }}>
                    <div className="news-card-image-wrapper" style={{ width: '100%', height: 'var(--home-card-img-h)', borderRadius: '20px', overflow: 'hidden', marginBottom: '16px', cursor: 'pointer' }}>
                      <img src={news.image} alt={news.title} className="news-card-image" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: 'var(--home-card-meta-fs)', color: '#999', marginBottom: '8px', fontFamily: 'var(--font-family)' }}>{news.date}</div>
                    <h3 style={{ fontSize: 'var(--home-card-title-fs)', fontWeight: 700, margin: '0 0 8px', color: '#111', fontFamily: 'var(--font-family)' }}>{news.title}</h3>
                    <p style={{ fontSize: 'var(--home-card-text-fs)', color: '#666', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-family)' }}>
                      {news.text}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Reviews Section */}
          <div style={{ 
            width: '100%',
            margin: '0',
            padding: '40px 0',
            background: '#ffffff'
          }}>
            <div className="grid-container" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 'var(--home-section-header-mb)'
              }}>
                <h2 style={{ 
                  fontSize: 'var(--home-section-title-fs)', 
                  fontWeight: 700, 
                  margin: 0, 
                  color: '#111', 
                  fontFamily: 'var(--font-family)' 
                }}>Reviews</h2>
                <a href="/reviews" style={{ 
                  color: '#F36F25', 
                  textDecoration: 'none', 
                  fontSize: 'var(--home-section-link-fs)', 
                  fontWeight: 500, 
                  fontFamily: 'var(--font-family)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px' 
                }}>
                  All reviews
                  <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 9L5 5L1 1" stroke="#F36F25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
              
              <div className="desktop-reviews-scroll" style={{ 
                display: 'flex',
                overflowX: 'auto',
                gap: 'var(--home-slider-gap)',
                paddingBottom: 'var(--home-section-header-mb)',
                scrollbarWidth: 'none', // Firefox
                msOverflowStyle: 'none'  // IE/Edge
              }}>
                <style>{`
                  .desktop-reviews-scroll::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                
                {reviews.slice(0, 5).map((review) => (
                  <div key={review.id} style={{ 
                    flex: '0 0 var(--home-card-w)', 
                    width: 'var(--home-card-w)', 
                    background: '#F9F9F9',
                    borderRadius: '20px',
                    padding: 'var(--home-card-pad)',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: 'var(--home-review-min-h)'
                  }}>
                    <div>
                      {/* @ts-ignore */}
                      {review.link ? (
                        /* @ts-ignore */
                        <a href={review.link} style={{ textDecoration: 'none' }}>
                          <h3 style={{ 
                            fontSize: 'var(--home-review-title-fs)', 
                            fontWeight: 700, 
                            margin: '0 0 12px', 
                            color: '#111', 
                            fontFamily: 'var(--font-family)' 
                          }}>
                            {review.product}
                          </h3>
                        </a>
                      ) : (
                        <h3 style={{ 
                          fontSize: 'var(--home-review-title-fs)', 
                          fontWeight: 700, 
                          margin: '0 0 12px', 
                          color: '#111', 
                          fontFamily: 'var(--font-family)' 
                        }}>
                          {review.product}
                        </h3>
                      )}
                      <p style={{ 
                        fontSize: 'var(--home-review-text-fs)', 
                        color: '#666', 
                        margin: 0, 
                        lineHeight: 1.5, 
                        fontFamily: 'var(--font-family)' 
                      }}>
                        {review.text}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '20px' }}>
                      <img src={review.flag} alt="Flag" style={{ width: '20px', height: '14px', borderRadius: '2px', objectFit: 'cover' }} />
                      <span style={{ fontSize: 'var(--home-review-author-fs)', color: '#999', fontFamily: 'var(--font-family)' }}>{review.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="desktop-only">
            <NewsletterBanner />
          </div>
        </div>
      ) : (
        // MOBILE VIEW
        <div style={{ width: '100%', overflowX: 'hidden', background: '#ffffff', minHeight: '100vh' }}>
          
          {/* 1. Hero Image (mobile) */}
          <div style={{ position: 'relative', width: '100%' }}>
            <img 
              src="/главнаямобилка1.png" 
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
              padding: '20px 20px 20px 20px',
              scrollPaddingLeft: '20px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}>
              {/* Card 1: P24F */}
              <div style={{
                flex: '0 0 280px',
                width: '280px',
                background: '#F6F6F6',
                borderRadius: '20px',
                padding: '20px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '380px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <img src="/miniature.svg" alt="P24F" style={{ height: '180px', objectFit: 'contain', mixBlendMode: 'multiply' }} />
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
                background: '#F6F6F6',
                borderRadius: '20px',
                padding: '20px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '380px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', height: '180px', alignItems: 'center' }}>
                  <svg width="54" height="60" viewBox="0 0 54 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8.00001L0 40H12.6667L12.6667 10L30.6666 28.0374V0H8C3.58133 -3.86256e-07 3.1838e-06 3.58172 2.79752e-06 8.00001Z" fill="#E9E9E9"/>
                    <path d="M53.3334 52V20H40.6667V50L22.6667 31.9626V60H45.3334C49.7521 60 53.3334 56.4183 53.3334 52Z" fill="#E9E9E9"/>
                  </svg>
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
                background: '#F6F6F6',
                borderRadius: '20px',
                padding: '20px',
                scrollSnapAlign: 'start',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '380px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px', height: '180px', alignItems: 'center' }}>
                  <svg width="54" height="60" viewBox="0 0 54 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 8.00001L0 40H12.6667L12.6667 10L30.6666 28.0374V0H8C3.58133 -3.86256e-07 3.1838e-06 3.58172 2.79752e-06 8.00001Z" fill="#E9E9E9"/>
                    <path d="M53.3334 52V20H40.6667V50L22.6667 31.9626V60H45.3334C49.7521 60 53.3334 56.4183 53.3334 52Z" fill="#E9E9E9"/>
                  </svg>
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
          
          {/* 3. Bottom Image (content-box92.svg) */}
          <div style={{ width: '100%' }}>
            <img 
              src="/content-box92.svg" 
              alt="Footer Content" 
              style={{ width: '100%', display: 'block', height: 'auto' }} 
            />
          </div>

          {/* 4. Features Slider (4 Cards) */}
          <div style={{ 
            display: 'flex',
            overflowX: 'auto',
            gap: '16px',
            padding: '20px 20px 40px 20px', // Added horizontal padding for scroll snap and spacing
            scrollPaddingLeft: '20px',
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
              display: 'flex',
              overflowX: 'auto',
              gap: '16px',
              padding: '20px 20px 20px 20px',
              scrollPaddingLeft: '20px',
              background: '#ffffff',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              scrollSnapType: 'x mandatory'
            }}>
              {[
                "/мото11.png",
                "/мото22.png",
                "/мото33.png",
                "/мото44.png",
                "/мото66.png",
                "/мото77.png"
              ].map((src, index) => (
                <img 
                  key={index}
                  src={src} 
                  alt={`Complete Solution ${index + 1}`} 
                  style={{ 
                    height: '320px', 
                    width: 'auto', 
                    maxWidth: 'none', 
                    display: 'block',
                    borderRadius: '20px',
                    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
                    scrollSnapAlign: 'start'
                  }} 
                />
              ))}
            </div>
          </div>

          {/* 7. News Slider */}
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
              padding: '20px 20px 20px 20px',
              scrollPaddingLeft: '20px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}>
              {newsData.map((news) => (
                <div key={news.id} style={{ 
                  flex: '0 0 280px',
                  width: '280px',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  padding: '0px',
                  background: 'transparent',
                  borderRadius: '0px',
                  boxShadow: 'none'
                }}>
                  <div style={{ width: '100%', height: '185px', borderRadius: '20px', overflow: 'hidden' }}>
                    <img src={news.image} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', color: '#999', marginBottom: '8px', fontFamily: 'var(--font-family)' }}>{news.date}</div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px', color: '#111', lineHeight: 1.3, fontFamily: 'var(--font-family)' }}>{news.title}</h3>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-family)' }}>
                      {news.text.length > 80 ? news.text.slice(0, 80) + '...' : news.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 8. Reviews Slider */}
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
              padding: '20px 20px 20px 20px',
              scrollPaddingLeft: '20px',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none'
            }}>
              {reviewsData.slice(0, 3).map((review) => (
                <div key={review.id} style={{ 
                  flex: '0 0 280px',
                  width: '280px',
                  height: '213px',
                  padding: '20px',
                  borderRadius: '20px',
                  background: '#F6F6F6',
                  scrollSnapAlign: 'start',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 'none'
                }}>
                  <div>
                    <a href={review.link} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#111', fontFamily: 'var(--font-family)' }}>{review.title}</h3>
                    </a>
                    <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: 1.5, fontFamily: 'var(--font-family)' }}>
                      {review.description}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={review.flag} alt="Flag" style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-family)' }}>{review.author}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <NewsletterBanner />

        </div>
      )}
      <Footer />
    </div>
  );
}
