import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../components/Header";
import CardBase from "../components/cards/CardBase";
import CollapsibleSection from "../components/CollapsibleSection";
import { products } from "../data/products";
import { useCart } from "../context/CartContext";


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const productId = Number(id);
  const product = products.find((p) => p.id === productId) || products[0];

  const isP24F = product.id === 1;
  const isOnBoardComputer = product.id === 2;
  const isULight = product.id === 3;
  const isAdapter = product.id === 6;
  const isKitSurRon = product.id === 15;
  const isBaseballCap = product.id === 18;

  const displayTitle = isP24F ? "Nucular controller P24F" : product.title;
  const displayCode = isP24F
    ? "NUCP24F"
    : isOnBoardComputer
    ? "NUCD"
    : isULight
    ? "uLight controller"
    : isAdapter
    ? "NUCSURAD"
    : isKitSurRon
    ? "NUCP24FSUR"
    : isBaseballCap
    ? "7459066"
    : product.title.toUpperCase();
  const displayPrice = isP24F ? "$610.00" : product.price;

  const controllerSpecs = [
    { label: "Maximum power", value: "27 kW" },
    { label: "Nominal power", value: "10 kW" },
    { label: "Voltage range", value: "30–90V" },
    { label: "Phase current, max", value: "500A" },
    { label: "Battery current, max", value: "350A" },
    { label: "Supply out", value: "12V 3A" },
    { label: "Operating temperature range", value: "−30ºC to 80ºC" },
  ];

  const onBoardSpecs = [
    { label: "LCD size", value: "2.9\"" },
    { label: "FSTN", value: "monochrome" },
    { label: "Screen resolution", value: "240x128 px" },
    { label: "RGB-button backlight", value: "yes" },
    { label: "MicroSD slot", value: "yes" },
    { label: "USB-charger", value: "5.2V 2A" },
    { label: "Password protection", value: "yes" },
    { label: "Language", value: "English" },
    { label: "Class", value: "IP54" },
  ];
  const uLightSpecs = [
    { label: "Size", value: "55x30x13 mm" },
    { label: "Weight", value: "25 g" },
    { label: "Input", value: "10–15V" },
    { label: "The current of one channel", value: "3A, 6 outputs" },
    { label: "Total current", value: "~10A" },
    { label: "Digital inputs", value: "6" },
    { label: "Thermosensor inputs", value: "2" },
    { label: "Digital outputs", value: "2" },
    { label: "CAN bus connectors", value: "3" },
  ];

  const adapterSpecs = [
    { label: "Size", value: "250 mm" },
    { label: "Weight", value: "25 g" },
  ];

  const baseballCapSpecs = [
    { label: "Color", value: "Black" },
    { label: "Size", value: "Free" },
  ];

  const uLightOverviewText =
    "Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of the controller via CAN bus without using the display.";

  const adapterOverviewText =
    "ABS plastic adapter for installing the Controller P24F on the Sur-Ron Light Bee. In the kit: plastic ABS adapter with mounts, mounting screw kit, phase wires extensions with heat shrink and bolts for connection.";

  const kitSurRonOverviewText =
    "Plug & Ride Kit for Sur-Ron Light Bee. Up to 30% more power оn standard 60V battery and up to 300% on 72V battery. Сonnection to the standard wiring instead of the factory controller. All systems (kickstand, fall sensor, throttle, and key) will work. Headlights, brake light, and turn signals on road versions also will work. You can use \"Eco/Sport\" switch to set it up two different power modes. But the speedometer on this switch will not work, this function will be performed on our On-board computer.";

  const baseballCapOverviewText =
    "The ultrasoft design is flexible and abrasion resistant, while the inner sweatband includes quilted padding for extra comfort and moisture wicking. The visor is fully made from recycled plastic bottles. 100% Cotton.";

  const specs = isOnBoardComputer
    ? onBoardSpecs
    : isULight
    ? uLightSpecs
    : isAdapter
    ? adapterSpecs
    : isBaseballCap
    ? baseballCapSpecs
    : controllerSpecs;

  const controllerKitItems = [
    { title: "Controller P24F with compound potting and the latest firmware", quantity: "1 pcs" },
    { title: "Covers for battery and phase wires with screws", quantity: "2 pcs" },
    { title: "Screws for M6 terminals of phase wires", quantity: "3 pcs" },
    { title: "CAN-wire JWPF-PHD 120 cm (47.2 inch) for connection to the On-board computer", quantity: "1 pcs" },
  ];

  const onBoardKitItems = [
    { title: "On-board computer with the latest firmware in English", quantity: "1 pcs" },
    { title: "Pins for crimping", quantity: "5 pcs" },
  ];
  const uLightKitItems = [
    { title: "uLight controller with the latest firmware", quantity: "1 pcs" },
    { title: "PHD 2.0 4P connector", quantity: "1 pcs" },
  ];

  const adapterKitItems = [
    { title: "Plastic ABS adapter with mounts", quantity: "1 pcs" },
    { title: "Mounting screw kit", quantity: "1 pcs" },
    { title: "Phase wires extensions with heat shrink and bolts for connection", quantity: "3 pcs" },
  ];

  const kitSurRonKitItems = [
    { title: "Nucular controller P24F with the latest firmware for Sur-Ron", quantity: "1 pcs" },
    { title: "On-board computer with a mount for fork stem", quantity: "1 pcs" },
    { title: "Plastic adapter for mounting", quantity: "1 pcs" },
  ];

  const kitItems = isOnBoardComputer
    ? onBoardKitItems
    : isULight
    ? uLightKitItems
    : isAdapter
    ? adapterKitItems
    : isKitSurRon
    ? kitSurRonKitItems
    : controllerKitItems;

  const recommendedControllers = products.filter((p) =>
    [1, 4, 5].includes(p.id)
  );

  const compatibleControllers = products.filter((p) => [1, 4].includes(p.id));
  const apparelProducts = products.filter((p) => p.category === "Apparel");

  const colorOptions = ["#C1121C", "#F3752C", "#48A43F", "#13447C", "#0A0A0D"];

  const images = isP24F
    ? ["/мото2.png", "/miniature11.png", "/miniature12.png", "/miniature13.png"]
    : product.image
    ? [product.image]
    : ["/мото2.png"];

  const [mainImage, setMainImage] = useState<string>(images[0]);

  const [isOverviewOpen, setIsOverviewOpen] = useState(true);
  const [isSpecsOpen, setIsSpecsOpen] = useState(true);
  const [isKitOpen, setIsKitOpen] = useState(true);
  const [isCompatOpen, setIsCompatOpen] = useState(true);
  const [isDocsOpen, setIsDocsOpen] = useState(true);
  const [isReviewsOpen, setIsReviewsOpen] = useState(true);


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
              {isP24F && (
                <div className="product-variant-tabs">
                  <button className="product-variant-tab active">P24F</button>
                  <button className="product-variant-tab">12F</button>
                  <button className="product-variant-tab">6F</button>
                </div>
              )}

              <h1 className="product-title">
                {isAdapter ? (
                  <>
                    Adapter for Sur-Ron
                    <br />
                    Light Bee
                  </>
                ) : isKitSurRon ? (
                  <>
                    Kit for Sur-Ron Light
                    <br />
                    Bee
                  </>
                ) : (
                  displayTitle
                )}
              </h1>
              <p className="product-code">{displayCode}</p>
              <p className="product-price">{displayPrice}</p>

              {!isOnBoardComputer && !isULight && !isAdapter && !isBaseballCap && (
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
              )}

              <div className="product-actions">
                {isBaseballCap ? (
                  <button
                    className="product-primary-button"
                    onClick={() => {
                      addToCart(product);
                      navigate("/cart");
                    }}
                  >
                    Go to cart
                  </button>
                ) : (
                  <>
                    <button
                      className="product-primary-button"
                      onClick={() => addToCart(product)}
                    >
                      Add to cart
                    </button>
                    <button className="product-secondary-button">
                      Learn more
                    </button>
                  </>
                )}
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


          <CollapsibleSection
            title="Overview"
            className="product-overview-section"
            titleClassName="product-overview-title"
            isOpen={isOverviewOpen}
            onToggle={() => setIsOverviewOpen(!isOverviewOpen)}
          >
            <p className="product-overview-text">
              {isOnBoardComputer
                ? "The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the charging state of the devices via USB."
                : isULight
                ? uLightOverviewText
                : isAdapter
                ? adapterOverviewText
                : isKitSurRon
                ? kitSurRonOverviewText
                : isBaseballCap
                ? baseballCapOverviewText
                : "A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, fully customized to your needs. The controller achieves an efficiency of 98% due to the powerful MOS transistors and special PWM algorithms. Compact size allows you to install it in any suitable place on vehicles with different dimensions — from scooters to ATVs or golf carts."}
            </p>
          </CollapsibleSection>

          <CollapsibleSection
            title="Specifications"
            className="product-specs-section"
            titleClassName="product-specs-title"
            isOpen={isSpecsOpen}
            onToggle={() => setIsSpecsOpen(!isSpecsOpen)}
          >
            <div className="product-specs-list">
              {specs.map((row) => (
                <div key={row.label} className="product-specs-row">
                  <span className="product-specs-label">{row.label}</span>
                  <span className="product-specs-value">{row.value}</span>
                </div>
              ))}
            </div>
            <button className="product-specs-compare">Compare all controllers</button>
          </CollapsibleSection>

          {!isBaseballCap && (
            <CollapsibleSection
              title="In the kit"
              className="product-kit-section"
              titleClassName="product-kit-title"
              isOpen={isKitOpen}
              onToggle={() => setIsKitOpen(!isKitOpen)}
            >
              <div className="product-kit-grid">
                {kitItems.map((item) => (
                  <div key={item.title} className="product-kit-card">
                    <div className="product-kit-card-title">{item.title}</div>
                    <div className="product-kit-quantity">{item.quantity}</div>
                  </div>
                ))}
              </div>
              {isOnBoardComputer && (
                <div className="product-kit-note">
                  <span>If you don’t have a crimping tool need to order </span>
                  <a href="#">Crimped wires for the Display</a>
                </div>
              )}
            </CollapsibleSection>
          )}

          {isAdapter && (
            <CollapsibleSection
              title="Compatibility"
              className="product-compat-section"
              titleClassName="product-compat-title"
              isOpen={isCompatOpen}
              onToggle={() => setIsCompatOpen(!isCompatOpen)}
            >
              <div className="product-compat-grid">
                {compatibleControllers.map((item) => (
                  <CardBase
                    key={item.id}
                    className="product-compat-card"
                    width={246}
                    height={230}
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="product-compat-image">
                      {item.image ? (
                        <img className="card-image" src={item.image} alt={item.title} />
                      ) : (
                        <div className="product-compat-placeholder">
                          <svg
                            width="81"
                            height="90"
                            viewBox="0 0 81 90"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z"
                              fill="#E9E9E9"
                            />
                            <path
                              d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z"
                              fill="#E9E9E9"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="product-compat-name">{item.title}</div>
                  </CardBase>
                ))}
              </div>
            </CollapsibleSection>
          )}

          {!isAdapter && !isBaseballCap && (
            <CollapsibleSection
              title="Documentation"
              className="product-docs-section"
              titleClassName="product-docs-title"
              isOpen={isDocsOpen}
              onToggle={() => setIsDocsOpen(!isDocsOpen)}
            >
              <div className="product-docs-row">
                <div className={`product-docs-icon${isULight ? " product-docs-icon-ulight" : ""}`}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M10.0813 8.08932C9.8442 7.95698 9.55329 7.95837 9.31753 8.09298C9.08177 8.22759 8.93673 8.4751 8.93673 8.74281V15.2982C8.93673 15.5659 9.08177 15.8134 9.31753 15.9481C9.55329 16.0827 9.8442 16.0841 10.0813 15.9517L15.9533 12.674C16.1928 12.5404 16.3406 12.2908 16.3406 12.0205C16.3406 11.7502 16.1928 11.5007 15.9533 11.367L10.0813 8.08932ZM14.0253 12.0205L10.4686 14.0059V10.0352L14.0253 12.0205Z" fill="#F36F25"/>
                    <path fillRule="evenodd" clipRule="evenodd" d="M11.919 20.4999L11.9999 20.5L12.081 20.4999C12.1335 20.4998 12.2105 20.4995 12.3089 20.4991C12.5058 20.4982 12.7887 20.4964 13.1335 20.4928C13.8227 20.4855 14.761 20.471 15.7553 20.442C16.7484 20.4131 17.8036 20.3694 18.725 20.3035C19.6249 20.2391 20.4619 20.1495 20.9804 20.0134L20.9911 20.0105C21.6015 19.841 22.1556 19.5164 22.5973 19.0694C23.039 18.6225 23.3527 18.069 23.5067 17.465C23.5109 17.4487 23.5145 17.4323 23.5175 17.4158C23.8445 15.6356 24.0058 13.83 23.9994 12.0211C24.0109 10.1847 23.8496 8.35126 23.5175 6.54403C23.5145 6.52755 23.5109 6.51118 23.5067 6.49494C23.3527 5.89089 23.039 5.33744 22.5973 4.89048C22.1556 4.44353 21.6015 4.1189 20.9911 3.94938C20.9822 3.94691 20.9732 3.9446 20.9642 3.94245C20.4518 3.81963 19.6203 3.73811 18.7201 3.67927C17.8002 3.61913 16.746 3.57934 15.7534 3.5529C14.7596 3.52644 13.8218 3.51322 13.1327 3.50661C12.7881 3.50331 12.5054 3.50166 12.3086 3.50083C12.2102 3.50042 12.1333 3.50021 12.0809 3.5001L11.9999 3.5L11.919 3.50011C11.8665 3.50023 11.7895 3.50046 11.6911 3.50091C11.4942 3.50182 11.2113 3.50363 10.8665 3.50725C10.1773 3.51448 9.239 3.52897 8.24467 3.55797C7.25155 3.58693 6.19635 3.63055 5.27503 3.69651C4.37513 3.76094 3.53806 3.85042 3.01954 3.98653L3.00894 3.98948C2.3985 4.15899 1.84444 4.48362 1.40273 4.93058C0.961023 5.37754 0.647306 5.93099 0.493269 6.53504C0.489125 6.55129 0.485535 6.56767 0.482507 6.58415C0.152979 8.37769 -0.00833983 10.1971 0.000572185 12.0195C-0.0109093 13.8557 0.150422 15.689 0.482512 17.4961C0.486999 17.5205 0.492715 17.5447 0.499638 17.5685C0.669458 18.1538 0.990202 18.6862 1.43088 19.1143C1.87156 19.5424 2.41728 19.8517 3.01531 20.0123L3.01956 20.0134C3.53808 20.1495 4.37513 20.2391 5.27503 20.3035C6.19635 20.3694 7.25155 20.4131 8.24467 20.442C9.239 20.471 10.1773 20.4855 10.8665 20.4928C11.2113 20.4964 11.4942 20.4982 11.6911 20.4991C11.7895 20.4995 11.8665 20.4998 11.919 20.4999ZM11.9224 5.00365L12 5.00354L12.0778 5.00365C12.1068 5.00407 12.1554 5.00478 12.2223 5.00624C12.3557 5.00916 12.5512 5.0134 12.7845 5.02058C13.2509 5.03493 13.8824 5.05927 14.5445 5.09786C15.1585 5.13364 15.7032 5.18731 16.0336 5.26389C16.3642 5.34053 16.4805 5.43997 16.4913 5.5682C16.502 5.69639 16.3986 5.79527 16.0722 5.86725C15.7461 5.93915 15.2074 5.98666 14.6033 6.01571C13.9515 6.04707 13.3332 6.06456 12.8763 6.07147C12.648 6.07492 12.457 6.07599 12.3265 6.07639C12.2613 6.07659 12.2138 6.07666 12.1853 6.07669L12.1086 6.07675L12.032 6.07669C12.0035 6.07666 11.956 6.07659 11.8908 6.07639C11.7602 6.07599 11.5692 6.07492 11.3409 6.07147C10.8841 6.06456 10.2657 6.04707 9.61394 6.01571C9.00984 5.98666 8.47118 5.93915 8.14502 5.86725C7.81861 5.79527 7.71521 5.69639 7.72594 5.5682C7.73673 5.43997 7.85303 5.34053 8.18359 5.26389C8.51408 5.18731 9.05877 5.13364 9.67272 5.09786C10.3348 5.05927 10.9664 5.03493 11.4328 5.02058C11.666 5.0134 11.8615 5.00916 11.995 5.00624C12.0619 5.00478 12.1104 5.00407 12.1394 5.00365H12.0309H11.9224ZM2.00845 19.0069C1.98625 18.9856 1.96541 18.9631 1.94602 18.9392C1.72778 18.6695 1.62638 18.3636 1.58356 17.9547C1.55496 17.6817 1.54716 17.3879 1.54637 17.0673C1.54516 16.577 1.54625 16.0232 1.54807 15.426C1.55171 14.2312 1.55776 12.8715 1.55627 11.4398C1.55328 8.57723 1.5233 5.69837 2.00035 5.52985C2.10264 5.49372 2.22234 5.48512 2.37893 5.50021C2.53585 5.51534 2.73038 5.55422 2.97825 5.62584C3.47271 5.76869 4.14876 6.03264 4.97746 6.55178C6.63666 7.59123 8.92576 9.60098 10.8267 11.7618L11.9967 13.092L13.1678 11.7628C15.0705 9.60268 17.3619 7.59278 19.0229 6.55268C19.8524 6.03323 20.5292 5.76903 21.0242 5.62604C21.2723 5.55433 21.467 5.5154 21.624 5.50025C21.7808 5.48512 21.9006 5.49373 22.0029 5.52988C22.4774 5.6975 22.4496 8.5672 22.4468 11.4399C22.4454 12.8716 22.4514 14.2312 22.455 15.426C22.4569 16.0233 22.458 16.5771 22.4568 17.0673C22.4559 17.388 22.4482 17.6817 22.4196 17.9548C22.3768 18.3637 22.2754 18.6696 22.0571 18.9393C22.0377 18.9632 22.0169 18.9857 21.9947 19.007L2.00845 19.0069Z" fill="#F36F25"/>
                  </svg>
                  {(isULight || isKitSurRon) && (
                    <svg
                      width="18"
                      height="22"
                      viewBox="0 0 18 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.88571 11.2558C4.45967 11.2558 4.11429 11.5994 4.11429 12.0233C4.11429 12.4471 4.45967 12.7907 4.88571 12.7907H13.1143C13.5403 12.7907 13.8857 12.4471 13.8857 12.0233C13.8857 11.5994 13.5403 11.2558 13.1143 11.2558H4.88571Z"
                        fill="#F36F25"
                      />
                      <path
                        d="M4.11429 16.1163C4.11429 15.6924 4.45967 15.3488 4.88571 15.3488H13.1143C13.5403 15.3488 13.8857 15.6924 13.8857 16.1163C13.8857 16.5401 13.5403 16.8837 13.1143 16.8837H4.88571C4.45967 16.8837 4.11429 16.5401 4.11429 16.1163Z"
                        fill="#F36F25"
                      />
                      <path
                        d="M4.88571 7.16279C4.45967 7.16279 4.11429 7.50639 4.11429 7.93023C4.11429 8.35408 4.45967 8.69767 4.88571 8.69767H6.94286C7.36891 8.69767 7.71429 8.35408 7.71429 7.93023C7.71429 7.50639 7.36891 7.16279 6.94286 7.16279H4.88571Z"
                        fill="#F36F25"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0.828469 0.824188C1.35893 0.296469 2.07839 0 2.82857 0H11.0571C11.2617 0 11.458 0.0808553 11.6026 0.224779L17.7741 6.36431L17.7823 6.37263C17.917 6.5108 18 6.69925 18 6.90698V19.186C18 19.9324 17.702 20.6481 17.1715 21.1758C16.6411 21.7035 15.9216 22 15.1714 22H2.82857C2.07839 22 1.35893 21.7035 0.828469 21.1758C0.298009 20.6481 0 19.9324 0 19.186V2.81395C0 2.06765 0.298009 1.35191 0.828469 0.824188ZM2.82857 1.53488H10.2857V6.90698C10.2857 7.33082 10.6311 7.67442 11.0571 7.67442H16.4571V19.186C16.4571 19.5253 16.3217 19.8506 16.0806 20.0905C15.8394 20.3304 15.5124 20.4651 15.1714 20.4651H2.82857C2.48758 20.4651 2.16055 20.3304 1.91943 20.0905C1.67832 19.8506 1.54286 19.5253 1.54286 19.186V2.81395C1.54286 2.47472 1.67832 2.14939 1.91943 1.90951C2.16055 1.66964 2.48758 1.53488 2.82857 1.53488ZM11.8286 2.62021L15.3662 6.13953H11.8286V2.62021Z"
                        fill="#F36F25"
                      />
                    </svg>
                  )}
                </div>
                <div className="product-docs-text">See the documentation</div>
              </div>
            </CollapsibleSection>
          )}

          {(isAdapter || isKitSurRon || isBaseballCap) && (
            <div className="product-apparel-section">
              <h2 className="product-apparel-title">Apparel</h2>
              <div className="product-apparel-row">
                {apparelProducts.concat(apparelProducts[0]).map((item, index) => (
                  <CardBase
                    key={`${item.id}-${index}`}
                    className="product-apparel-card"
                    width={380}
                    height={490}
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="product-apparel-image">
                      {item.image ? (
                        <img className="card-image" src={item.image} alt={item.title} />
                      ) : (
                        <div className="product-apparel-placeholder">
                          <svg
                            width="81"
                            height="90"
                            viewBox="0 0 81 90"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z"
                              fill="#E9E9E9"
                            />
                            <path
                              d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z"
                              fill="#E9E9E9"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="product-apparel-name">{item.title}</div>
                    <div className="product-apparel-price">{item.price}</div>
                    <button
                      className="product-apparel-cta"
                      onClick={(event) => {
                        event.stopPropagation();
                        addToCart(item);
                      }}
                    >
                      Add to cart
                    </button>
                  </CardBase>
                ))}
              </div>
            </div>
          )}

          {!isAdapter && !isKitSurRon && !isBaseballCap && (
            <div className="product-add-section">
              <h2 className="product-add-title">
                {isOnBoardComputer ? "Recommended products" : "Add it to the controller"}
              </h2>
              {isOnBoardComputer ? (
                <div className="product-add-grid">
                  {recommendedControllers.map((item) => (
                    <CardBase
                      key={item.id}
                      className="product-add-card"
                      height={420}
                      onClick={() => navigate(`/product/${item.id}`)}
                    >
                      <div className="product-add-image">
                        {item.image ? (
                          <img className="card-image" src={item.image} alt={item.title} />
                        ) : (
                          <div className="product-add-image-placeholder">
                            <svg
                              width="81"
                              height="90"
                              viewBox="0 0 81 90"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z"
                                fill="#E9E9E9"
                              />
                              <path
                                d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z"
                                fill="#E9E9E9"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="product-add-name">{item.title}</div>
                      <div className="product-add-price">{item.price}</div>
                    </CardBase>
                  ))}
                </div>
              ) : (
                <div className="product-add-grid">
                  <CardBase className="product-add-card">
                    <div className="product-add-image">
                      <img className="card-image" src="/miniature15.png" alt="On-board computer" />
                    </div>
                    <div className="product-add-name">On-board computer</div>
                    <div className="product-add-price">$110.00</div>
                    <button className="product-add-cta">Add to cart</button>
                  </CardBase>
                </div>
              )}
            </div>
          )}

          {!isBaseballCap && (
            <CollapsibleSection
              title="Reviews"
              className="product-reviews-section"
              titleClassName="product-reviews-title"
              isOpen={isReviewsOpen}
              onToggle={() => setIsReviewsOpen(!isReviewsOpen)}
            >
              <div className="product-reviews-list">
                <CardBase className="product-review-card" height={218}>
                  <div className="product-review-text">
                    A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...
                  </div>
                  <div className="product-review-meta">
                    <img className="product-review-flag" src="/flag.png" width={24} height={24} alt="USA" />
                    <span>USA, Alex Smith</span>
                  </div>
                </CardBase>
                <CardBase className="product-review-card" height={218}>
                  <div className="product-review-text">
                    Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of...
                  </div>
                  <div className="product-review-meta">
                    <img className="product-review-flag" src="/flag2.png" width={24} height={24} alt="Germany" />
                    <span>Germany, Max Stoun</span>
                  </div>
                </CardBase>
                <CardBase className="product-review-card" height={218}>
                  <div className="product-review-text">
                    A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...
                  </div>
                  <div className="product-review-meta">
                    <img className="product-review-flag" src="/flag3.png" width={24} height={24} alt="Norway" />
                    <span>Norway, Anna Orlova</span>
                  </div>
                </CardBase>
                <CardBase className="product-review-card" height={218}>
                  <div className="product-review-text">
                    The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the ...
                  </div>
                  <div className="product-review-meta">
                    <img className="product-review-flag" src="/flag4.png" width={24} height={24} alt="France" />
                    <span>France, Robert Jonson</span>
                  </div>
                </CardBase>
              </div>
            </CollapsibleSection>
          )}
        </div>
      </div>
    </>
  );
}
