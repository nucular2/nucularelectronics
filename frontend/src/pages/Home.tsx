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
                <div>All devices are connected by CAN-bus.</div>
                <div>
                  Components can be used separately with devices from other manufacturers using our open{" "}
                  <strong>LEVCAN protocol</strong>.
                </div>
              </div>
              <div className="levcan-title">For LEVs development companies:</div>
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
                    <svg width="40" height="40" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.4725 22C15.4725 18.395 18.395 15.4725 22 15.4725C25.605 15.4725 28.5275 18.395 28.5275 22C28.5275 25.605 25.605 28.5275 22 28.5275C18.395 28.5275 15.4725 25.605 15.4725 22ZM22 16.9231C19.1961 16.9231 16.9231 19.1961 16.9231 22C16.9231 24.8039 19.1961 27.0769 22 27.0769C24.8039 27.0769 27.0769 24.8039 27.0769 22C27.0769 19.1961 24.8039 16.9231 22 16.9231Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M11.6044 22C11.6044 16.2587 16.2587 11.6044 22 11.6044C27.7413 11.6044 32.3956 16.2587 32.3956 22C32.3956 27.7413 27.7413 32.3956 22 32.3956C16.2587 32.3956 11.6044 27.7413 11.6044 22ZM22 13.0549C17.0598 13.0549 13.0549 17.0598 13.0549 22C13.0549 26.9402 17.0598 30.9451 22 30.9451C26.9402 30.9451 30.9451 26.9402 30.9451 22C30.9451 17.0598 26.9402 13.0549 22 13.0549Z" fill="#222222" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M36.9756 28.095L36.3121 27.8022L36.9787 28.0879C37.1682 27.6459 37.4827 27.2689 37.8837 27.0034C38.2843 26.7381 38.7537 26.5956 39.2341 26.5934H39.4066C40.6248 26.5934 41.7932 26.1095 42.6546 25.248C43.5161 24.3866 44 23.2182 44 22C44 20.7818 43.5161 19.6134 42.6546 18.752C41.7932 17.8905 40.6248 17.4066 39.4066 17.4066H39.0794C38.5989 17.4044 38.1296 17.2619 37.729 16.9966C37.3669 16.7569 37.0753 16.4262 36.8826 16.0389C36.882 15.9395 36.861 15.8412 36.8209 15.7502C36.6219 15.2995 36.5626 14.7994 36.6505 14.3146C36.7382 13.831 36.9684 13.3846 37.3116 13.0328L37.3141 13.0302L37.4242 12.9202C37.8513 12.4936 38.1901 11.987 38.4213 11.4293C38.6524 10.8717 38.7714 10.274 38.7714 9.67033C38.7714 9.06668 38.6524 8.46896 38.4213 7.91133C38.1902 7.35395 37.8516 6.84755 37.4248 6.42107C36.9982 5.99399 36.4916 5.65518 35.9339 5.42402C35.3763 5.19286 34.7786 5.07388 34.1749 5.07388C33.5713 5.07388 32.9736 5.19286 32.4159 5.42402C31.8584 5.65513 31.3517 5.99412 30.9251 6.42107L30.8123 6.53383C30.4605 6.87691 30.0142 7.10708 29.5306 7.19477C29.0458 7.28267 28.5458 7.22329 28.0951 7.02435L28.0879 7.02128C27.6459 6.83184 27.2689 6.51727 27.0034 6.11631C26.7381 5.71571 26.5956 5.24634 26.5934 4.76588V4.59341C26.5934 3.37516 26.1095 2.20681 25.248 1.34538C24.3866 0.483947 23.2182 0 22 0C20.7818 0 19.6134 0.483947 18.752 1.34538C17.8905 2.20681 17.4066 3.37516 17.4066 4.59341V4.92061C17.4044 5.40106 17.2619 5.87043 16.9966 6.27103C16.7569 6.6331 16.4262 6.92472 16.0389 7.11738C15.9395 7.11795 15.8412 7.13896 15.7502 7.17911C15.2995 7.37805 14.7994 7.4374 14.3146 7.34949C13.831 7.26181 13.3847 7.03163 13.0329 6.68853L12.9202 6.57579C12.4936 6.14871 11.987 5.80991 11.4293 5.57875C10.8717 5.34759 10.274 5.22861 9.67033 5.22861C9.06668 5.22861 8.46896 5.34759 7.91133 5.57875C7.35382 5.80986 6.84732 6.14856 6.42078 6.5755C5.99384 7.00205 5.65513 7.50855 5.42402 8.06605C5.19286 8.62369 5.07388 9.22141 5.07388 9.82505C5.07388 10.4287 5.19286 11.0264 5.42402 11.5841C5.65518 12.1417 5.99399 12.6483 6.42107 13.0749L6.53381 13.1876C6.8769 13.5394 7.10708 13.9858 7.19477 14.4694C7.28267 14.9542 7.22333 15.4542 7.02439 15.905C7.01822 15.9189 7.01249 15.9331 7.00722 15.9475C6.83642 16.4118 6.52986 16.8141 6.1274 17.102C5.7271 17.3883 5.25033 17.5482 4.75848 17.5613H4.59341C3.37516 17.5613 2.20681 18.0453 1.34538 18.9067C0.483947 19.7681 0 20.9365 0 22.1547C0 23.373 0.483947 24.5413 1.34538 25.4028C2.20681 26.2642 3.37516 26.7481 4.59341 26.7481H4.92061C5.40106 26.7503 5.87043 26.8928 6.27103 27.1581C6.67199 27.4236 6.98652 27.8006 7.17597 28.2426L7.17911 28.2498C7.37805 28.7005 7.4374 29.2006 7.34949 29.6854C7.26181 30.1689 7.03164 30.6153 6.68855 30.9671L6.57551 31.0801C6.14856 31.5067 5.80986 32.0132 5.57875 32.5707C5.34759 33.1283 5.22861 33.726 5.22861 34.3297C5.22861 34.9333 5.34759 35.531 5.57875 36.0887C5.80991 36.6463 6.14871 37.1529 6.57579 37.5795C7.00228 38.0063 7.50867 38.3449 8.06605 38.576C8.62368 38.8071 9.22141 38.9261 9.82505 38.9261C10.4287 38.9261 11.0264 38.8071 11.5841 38.576C12.1416 38.3449 12.6483 38.0059 13.0749 37.5789L13.185 37.4688L13.1876 37.4662C13.5394 37.1231 13.9857 36.8929 14.4694 36.8052C14.9542 36.7173 15.4542 36.7767 15.905 36.9756C15.9189 36.9818 15.9331 36.9875 15.9475 36.9928C16.4118 37.1636 16.8141 37.4701 17.102 37.8726C17.3883 38.2729 17.5482 38.7497 17.5613 39.2415V39.4066C17.5613 40.6248 18.0453 41.7932 18.9067 42.6546C19.7681 43.5161 20.9365 44 22.1547 44C23.373 44 24.5413 43.5161 25.4028 42.6546C26.2642 41.7932 26.7481 40.6248 26.7481 39.4066V39.0794C26.7503 38.5989 26.8928 38.1296 27.1581 37.729C27.4236 37.328 27.8006 37.0135 28.2426 36.824L28.2498 36.8209C28.7005 36.6219 29.2006 36.5626 29.6854 36.6505C30.1689 36.7382 30.6153 36.9684 30.9671 37.3115L30.9698 37.3141L31.0801 37.4245C31.5067 37.8514 32.0132 38.1901 32.5707 38.4213C33.1283 38.6524 33.726 38.7714 34.3297 38.7714C34.9333 38.7714 35.531 38.6524 36.0887 38.4213C36.6462 38.1901 37.1527 37.8514 37.5792 37.4245C38.0062 36.9979 38.3449 36.4915 38.576 35.9339C38.8071 35.3763 38.9261 34.7786 38.9261 34.1749C38.9261 33.5713 38.8071 32.9736 38.576 32.4159C38.3449 31.8584 38.0059 31.3517 37.5789 30.9251L37.4688 30.815L37.4662 30.8123C37.1231 30.4605 36.8929 30.0142 36.8052 29.5306C36.7173 29.0458 36.7767 28.5458 36.9756 28.095Z" fill="#222222" />
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
