import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import CardBase from "../components/cards/CardBase";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const productId = Number(id);
  const product = products.find((p) => p.id === productId) || products[0];

  const isP24F = product.id === 1;
  const displayTitle = isP24F ? "Nucular controller P24F" : product.title;
  const displayCode = isP24F ? "NUCP24F" : product.title.toUpperCase();
  const displayPrice = isP24F ? "$610.00" : product.price;

  const colorOptions = ["#C1121C", "#F3752C", "#48A43F", "#13447C", "#0A0A0D"];
  const images = ["/мото2.png", "/miniature11.png", "/miniature12.png", "/miniature13.png"];
  const [mainImage, setMainImage] = useState<string>(images[0]);

  return (
    <>
      <Header variant="white" />
      <div className="product-page">
        <div className="product-container">
          <button className="product-back-link" onClick={() => navigate("/shop")}>
            <span className="product-back-arrow">←</span>
            <span>Back to shop</span>
          </button>

          <div className="product-main">
            <div className="product-gallery">
              <div className="product-main-image">
                <img src={mainImage} alt={displayTitle} />
              </div>
              <div className="product-thumbnails">
                {images.map((src) => (
                  <button
                    key={src}
                    className={`product-thumbnail${mainImage === src ? " active" : ""}`}
                    onClick={() => setMainImage(src)}
                    aria-label="Select image"
                  >
                    <img src={src} alt={displayTitle} />
                  </button>
                ))}
              </div>
            </div>

            <div className="product-info">
              <div className="product-variant-tabs">
                <button className="product-variant-tab active">P24F</button>
                <button className="product-variant-tab">12F</button>
                <button className="product-variant-tab">6F</button>
              </div>

              <h1 className="product-title">{displayTitle}</h1>
              <p className="product-code">{displayCode}</p>
              <p className="product-price">{displayPrice}</p>

              <div className="product-color-section">
                <span className="product-color-label">Color — Black</span>
                <div className="product-color-dots">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      className="product-color-dot"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="product-actions">
                <button
                  className="product-primary-button"
                  onClick={() => addToCart(product)}
                >
                  Add to cart
                </button>
                <button className="product-secondary-button">
                  Learn more
                </button>
              </div>

              <div className="product-benefits">
                <div className="product-benefit">
                  <div className="product-benefit-icon">
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.21967 0.21967C0.512563 -0.0732233 0.987437 -0.0732233 1.28033 0.21967L21.2803 20.2197C21.5732 20.5126 21.5732 20.9874 21.2803 21.2803C20.9874 21.5732 20.5126 21.5732 20.2197 21.2803L17.4393 18.5H2.75C1.23122 18.5 0 17.2688 0 15.75V5.75C0 4.47904 0.862192 3.40946 2.03359 3.09425L0.21967 1.28033C-0.0732233 0.987437 -0.0732233 0.512563 0.21967 0.21967ZM3.43934 4.5H2.75C2.05964 4.5 1.5 5.05964 1.5 5.75V8H6.93934L3.43934 4.5ZM8.43934 9.5H1.5V15.75C1.5 16.4404 2.05964 17 2.75 17H15.9393L8.43934 9.5Z" fill="#222222" />
                      <path d="M21.5 5.75V16.25C21.5 16.6642 21.1642 17 20.75 17C20.3358 17 20 16.6642 20 16.25V9.5H13.25C12.8358 9.5 12.5 9.16421 12.5 8.75C12.5 8.33579 12.8358 8 13.25 8H20V5.75C20 5.05964 19.4404 4.5 18.75 4.5H8.25C7.83579 4.5 7.5 4.16421 7.5 3.75C7.5 3.33579 7.83579 3 8.25 3H18.75C20.2688 3 21.5 4.23122 21.5 5.75Z" fill="#222222" />
                    </svg>
                  </div>
                  <div className="product-benefit-text">
                    <div className="product-benefit-title">Not prepayment for placing a pre-order</div>
                  </div>
                </div>
                <div className="product-benefit">
                  <div className="product-benefit-icon">
                    <svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M0.767442 0C0.343595 0 0 0.34538 0 0.771429V13.1143C0 13.5403 0.343595 13.8857 0.767442 13.8857H2.35334C2.15717 14.2715 2.04651 14.7085 2.04651 15.1714C2.04651 16.7336 3.30636 18 4.86047 18C6.41457 18 7.67442 16.7336 7.67442 15.1714C7.67442 14.7085 7.56376 14.2715 7.36759 13.8857H14.6324C14.4362 14.2715 14.3256 14.7085 14.3256 15.1714C14.3256 16.7336 15.5854 18 17.1395 18C18.6936 18 19.9535 16.7336 19.9535 15.1714C19.9535 14.7085 19.8428 14.2715 19.6467 13.8857H21.2326C21.6564 13.8857 22 13.5403 22 13.1143V7.97143C22 7.78728 21.9345 7.60921 21.8152 7.46939L19.184 4.38368C19.0382 4.21269 18.8254 4.11429 18.6013 4.11429H15.8605V0.771429C15.8605 0.34538 15.5169 0 15.093 0H0.767442ZM20.4651 12.3429V8.2568L18.2484 5.65714H15.8605V12.3429H20.4651ZM17.1395 13.8857C16.4331 13.8857 15.8605 14.4613 15.8605 15.1714C15.8605 15.8815 16.4331 16.4571 17.1395 16.4571C17.8459 16.4571 18.4186 15.8815 18.4186 15.1714C18.4186 14.4613 17.8459 13.8857 17.1395 13.8857ZM3.5814 15.1714C3.5814 14.4613 4.15405 13.8857 4.86047 13.8857C5.56688 13.8857 6.13953 14.4613 6.13953 15.1714C6.13953 15.8815 5.56688 16.4571 4.86047 16.4571C4.15405 16.4571 3.5814 15.8815 3.5814 15.1714ZM14.3256 12.3429H1.53488V1.54286H14.3256V12.3429Z" fill="#222222" />
                    </svg>
                  </div>
                  <div className="product-benefit-text">
                    <div className="product-benefit-title">Worldwide delivery by courier services</div>
                  </div>
                </div>
                <div className="product-benefit">
                  <div className="product-benefit-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM10.2564 2.69515C6.10695 3.46785 2.90936 6.94763 2.56555 11.2326H7.17257C7.37842 8.14651 8.45126 5.18846 10.2564 2.69515ZM13.7436 2.69515C15.5487 5.18846 16.6216 8.14651 16.8274 11.2326H21.4345C21.0906 6.94763 17.893 3.46785 13.7436 2.69515ZM15.2888 11.2326C15.0654 8.19783 13.917 5.30431 12 2.94284C10.083 5.30431 8.93463 8.19783 8.71122 11.2326H15.2888ZM8.71123 12.7674H15.2888C15.0653 15.8021 13.917 18.6956 12 21.0571C10.083 18.6956 8.93465 15.8021 8.71123 12.7674ZM7.17258 12.7674H2.56555C2.90936 17.0524 6.10699 20.5322 10.2564 21.3049C8.4513 18.8116 7.37845 15.8535 7.17258 12.7674ZM13.7436 21.3049C15.5487 18.8116 16.6216 15.8535 16.8274 12.7674H21.4345C21.0906 17.0524 17.893 20.5322 13.7436 21.3049Z" fill="#222222" />
                    </svg>
                  </div>
                  <div className="product-benefit-text">
                    <div className="product-benefit-title">Worldwide warranty up to 3-years</div>
                  </div>
                </div>
              </div>

              <div className="product-help-section">
                <div className="product-help-question">Have you questions?</div>
                <button className="product-help-link">Terms and Conditions</button>
              </div>
            </div>
          </div>

          <div className="product-overview-section">
            <h2 className="product-overview-title">Overview</h2>
            <p className="product-overview-text">
              A powerful ARM microprocessor provides precise and smooth control
              of the BLDC motor. The controller settings are widely configured —
              you can set parameters, power strokes of the gas throttle, fully
              customized to your needs. The controller achieves an efficiency of
              98% due to the powerful MOS transistors and special PWM
              algorithms. Compact size allows you to install it in any suitable
              place on vehicles with different dimensions — from scooters to
              ATVs or golf carts.
            </p>
          </div>

          <div className="product-specs-section">
            <h2 className="product-specs-title">Specifications</h2>
            <div className="product-specs-list">
              <div className="product-specs-row">
                <span className="product-specs-label">Maximum power</span>
                <span className="product-specs-value">27 kW</span>
              </div>
              <div className="product-specs-row">
                <span className="product-specs-label">Nominal power</span>
                <span className="product-specs-value">10 kW</span>
              </div>
              <div className="product-specs-row">
                <span className="product-specs-label">Voltage range</span>
                <span className="product-specs-value">30–90V</span>
              </div>
              <div className="product-specs-row">
                <span className="product-specs-label">Phase current, max</span>
                <span className="product-specs-value">500A</span>
              </div>
              <div className="product-specs-row">
                <span className="product-specs-label">Battery current, max</span>
                <span className="product-specs-value">350A</span>
              </div>
              <div className="product-specs-row">
                <span className="product-specs-label">Supply out</span>
                <span className="product-specs-value">12V 3A</span>
              </div>
              <div className="product-specs-row">
                <span className="product-specs-label">Operating temperature range</span>
                <span className="product-specs-value">−30ºC to 80ºC</span>
              </div>
            </div>
            <button className="product-specs-compare">Compare all controllers</button>
          </div>

          <div className="product-kit-section">
            <h2 className="product-kit-title">In the kit</h2>
            <div className="product-kit-grid">
              <div className="product-kit-card">
                <div className="product-kit-card-title">
                  Controller P24F with compound potting and the latest firmware
                </div>
              </div>
              <div className="product-kit-card">
                <div className="product-kit-card-title">
                  Covers for battery and phase wires with screws
                </div>
              </div>
              <div className="product-kit-card">
                <div className="product-kit-card-title">
                  Screws for M6 terminals of phase wires
                </div>
              </div>
              <div className="product-kit-card">
                <div className="product-kit-card-title">
                  CAN-wire JWPF-PHD 120 cm (47.2 inch) for connection to the On-board computer
                </div>
              </div>
            </div>
          </div>

          <div className="product-docs-section">
            <h2 className="product-docs-title">Documentation</h2>
            <div className="product-docs-row">
              <div className="product-docs-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M10.0813 8.08932C9.8442 7.95698 9.55329 7.95837 9.31753 8.09298C9.08177 8.22759 8.93673 8.4751 8.93673 8.74281V15.2982C8.93673 15.5659 9.08177 15.8134 9.31753 15.9481C9.55329 16.0827 9.8442 16.0841 10.0813 15.9517L15.9533 12.674C16.1928 12.5404 16.3406 12.2908 16.3406 12.0205C16.3406 11.7502 16.1928 11.5007 15.9533 11.367L10.0813 8.08932ZM14.0253 12.0205L10.4686 14.0059V10.0352L14.0253 12.0205Z" fill="#F36F25"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.919 20.4999L11.9999 20.5L12.081 20.4999C12.1335 20.4998 12.2105 20.4995 12.3089 20.4991C12.5058 20.4982 12.7887 20.4964 13.1335 20.4928C13.8227 20.4855 14.761 20.471 15.7553 20.442C16.7484 20.4131 17.8036 20.3694 18.725 20.3035C19.6249 20.2391 20.4619 20.1495 20.9804 20.0134L20.9911 20.0105C21.6015 19.841 22.1556 19.5164 22.5973 19.0694C23.039 18.6225 23.3527 18.069 23.5067 17.465C23.5109 17.4487 23.5145 17.4323 23.5175 17.4158C23.8445 15.6356 24.0058 13.83 23.9994 12.0211C24.0109 10.1847 23.8496 8.35126 23.5175 6.54403C23.5145 6.52755 23.5109 6.51118 23.5067 6.49494C23.3527 5.89089 23.039 5.33744 22.5973 4.89048C22.1556 4.44353 21.6015 4.1189 20.9911 3.94938C20.9822 3.94691 20.9732 3.9446 20.9642 3.94245C20.4518 3.81963 19.6203 3.73811 18.7201 3.67927C17.8002 3.61913 16.746 3.57934 15.7534 3.5529C14.7596 3.52644 13.8218 3.51322 13.1327 3.50661C12.7881 3.50331 12.5054 3.50166 12.3086 3.50083C12.2102 3.50042 12.1333 3.50021 12.0809 3.5001L11.9999 3.5L11.919 3.50011C11.8665 3.50023 11.7895 3.50046 11.6911 3.50091C11.4942 3.50182 11.2113 3.50363 10.8665 3.50725C10.1773 3.51448 9.239 3.52897 8.24467 3.55797C7.25155 3.58693 6.19635 3.63055 5.27503 3.69651C4.37513 3.76094 3.53806 3.85042 3.01954 3.98653L3.00894 3.98948C2.3985 4.15899 1.84444 4.48362 1.40273 4.93058C0.961023 5.37754 0.647306 5.93099 0.493269 6.53504C0.489125 6.55129 0.485535 6.56767 0.482507 6.58415C0.152979 8.37769 -0.00833983 10.1971 0.000572185 12.0195C-0.0109093 13.8557 0.150422 15.689 0.482512 17.4961C0.486999 17.5205 0.492715 17.5447 0.499638 17.5685C0.669458 18.1538 0.990202 18.6862 1.43088 19.1143C1.87156 19.5424 2.41728 19.8517 3.01531 20.0123L3.01956 20.0134C3.53808 20.1495 4.37513 20.2391 5.27503 20.3035C6.19635 20.3694 7.25155 20.4131 8.24467 20.442C9.239 20.471 10.1773 20.4855 10.8665 20.4928C11.2113 20.4964 11.4942 20.4982 11.6911 20.4991C11.7895 20.4995 11.8665 20.4998 11.919 20.4999ZM11.9224 5.00365L12 5.00354L12.0778 5.00364L12.302 5.00435C12.4964 5.00517 12.7763 5.00681 13.1178 5.01008C13.801 5.01663 14.7295 5.02973 15.7118 5.05589C16.6952 5.08207 17.7269 5.12121 18.6184 5.17948C19.5184 5.23832 20.2177 5.31353 20.5873 5.39985C20.9331 5.49832 21.2469 5.68353 21.4977 5.93733C21.7462 6.18879 21.9243 6.49885 22.0148 6.83743C22.3271 8.54611 22.4787 10.2794 22.4676 12.0153L22.4676 12.0227C22.4738 13.7326 22.3223 15.4395 22.0148 17.1225C21.9243 17.4611 21.7462 17.7711 21.4977 18.0226C21.245 18.2783 20.9283 18.4644 20.5793 18.5623C20.218 18.6562 19.5205 18.739 18.6135 18.8039C17.7234 18.8677 16.6928 18.9105 15.7098 18.9392C14.7281 18.9678 13.8001 18.9821 13.1171 18.9893C12.7757 18.9929 12.496 18.9947 12.3017 18.9956C12.2046 18.996 12.1289 18.9962 12.0776 18.9964L12 18.9965L11.9224 18.9964C11.8711 18.9962 11.7954 18.996 11.6983 18.9956C11.504 18.9947 11.2243 18.9929 10.8829 18.9893C10.1999 18.9821 9.2719 18.9678 8.29016 18.9392C7.3072 18.9105 6.27655 18.8677 5.38647 18.8039C4.47675 18.7388 3.77781 18.6557 3.41745 18.5615C3.07438 18.4689 2.76133 18.2913 2.50843 18.0456C2.26336 17.8076 2.08278 17.5134 1.98283 17.1899C1.67211 15.4853 1.52138 13.7564 1.53246 12.0248L1.53241 12.0163C1.52374 10.2934 1.67529 8.57335 1.98517 6.87751C2.07572 6.53894 2.25378 6.22888 2.50227 5.97743C2.75501 5.72169 3.07171 5.53559 3.42066 5.43771C3.78196 5.34385 4.47945 5.261 5.38647 5.19607C6.27655 5.13234 7.3072 5.08951 8.29016 5.06084C9.2719 5.03221 10.1999 5.01787 10.8829 5.0107C11.2243 5.00712 11.504 5.00532 11.6983 5.00443C11.7954 5.00398 11.8711 5.00376 11.9224 5.00365Z" fill="#F36F25"/>
                </svg>
              </div>
              <div className="product-docs-text">See the documentation</div>
            </div>
          </div>

          <div className="product-add-section">
            <h2 className="product-add-title">Add it to the controller</h2>
            <CardBase className="product-add-card" height={490}>
              <div className="product-add-image">
                <img className="card-image" src="/miniature15.png" alt="On-board computer" />
              </div>
              <div className="product-add-name">On-board computer</div>
              <div className="product-add-price">$110.00</div>
              <button className="product-add-cta">Add to cart</button>
            </CardBase>
          </div>

          <div className="product-reviews-section">
            <h2 className="product-reviews-title">Reviews</h2>
            <div className="product-reviews-list">
              <CardBase className="product-review-card" height={218}>
                <div className="product-review-text">
                  A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, …
                </div>
                <div className="product-review-meta">
                  <img className="product-review-flag" src="/flag.png" width={24} height={24} alt="USA" />
                  <span>USA, Alex Smith</span>
                </div>
              </CardBase>
              <CardBase className="product-review-card" height={218}>
                <div className="product-review-text">
                  Lighting control: controller turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of…
                </div>
                <div className="product-review-meta">
                  <img className="product-review-flag" src="/flag2.png" width={24} height={24} alt="Germany" />
                  <span>Germany, Max Stoun</span>
                </div>
              </CardBase>
              <CardBase className="product-review-card" height={218}>
                <div className="product-review-text">
                  A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, …
                </div>
                <div className="product-review-meta">
                  <img className="product-review-flag" src="/flag3.png" width={24} height={24} alt="Norway" />
                  <span>Norway, Anna Orlova</span>
                </div>
              </CardBase>
              <CardBase className="product-review-card" height={218}>
                <div className="product-review-text">
                  The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the …
                </div>
                <div className="product-review-meta">
                  <img className="product-review-flag" src="/flag4.png" width={24} height={24} alt="France" />
                  <span>France, Robert Jonson</span>
                </div>
              </CardBase>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
