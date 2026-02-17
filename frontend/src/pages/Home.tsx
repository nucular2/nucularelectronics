import Header from "../components/Header";

export default function Home() {
  return (
    <>
      <Header />
      <section className="hero">
        <div className="hero-content">
          <div className="hero-text-block">
            <h1 className="hero-title">Nucular<br />electronics</h1>
            <p className="hero-subtitle">
              The hardware platform for designing light electric vehicles (LEVs), such as electric bikes, motorbikes, scooters and karting.
            </p>
          </div>
          <a href="#components" className="see-components-link">
            See the components 
            <svg className="arrow-down-long" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 1V11M6 11L1 6M6 11L11 6" stroke="#C45F2C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </section>
      <div className="scroll-up-button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      
      <div className="page-content-white">
        <section className="controllers-section">
          <h2 className="controllers-title">Controllers</h2>
          <p className="controllers-description">
            For controlling 3-phase permanent magnet electric motors (BLDC, PMSM or PMAC).
          </p>
          <div className="controllers-grid">
            {/* Card 1 */}
            <div className="controller-card">
              <div className="card-image-container">
                <img src="/мото2.png" alt="Nucular controller P24F" className="card-image" />
              </div>
              <h3 className="card-title">Nucular controller P24F</h3>
              <p className="card-power">27 kW</p>
              <div className="card-actions">
                <button className="card-button buy-button">Buy</button>
                <a href="#" className="card-link">
                  Learn more
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.23431 18.7722C8.9219 18.4685 8.9219 17.976 9.23431 17.6723L15.0686 12L9.23431 6.32775C8.92189 6.02401 8.92189 5.53155 9.23431 5.22781C9.54673 4.92407 10.0533 4.92407 10.3657 5.22781L16.7657 11.45C17.0781 11.7538 17.0781 12.2462 16.7657 12.55L10.3657 18.7722C10.0533 19.0759 9.54673 19.0759 9.23431 18.7722Z" fill="#F36F25" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="controller-card">
              <div className="card-image-container">
                <svg className="card-image" width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z" fill="#E9E9E9" />
                  <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                </svg>
              </div>
              <h3 className="card-title">Nucular controller 12F HE</h3>
              <p className="card-power">12 kW</p>
              <div className="card-actions">
                <button className="card-button preorder-button">Preorder</button>
                <span className="status-text">In development</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="controller-card">
              <div className="card-image-container">
                 <svg className="card-image" width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z" fill="#E9E9E9" />
                  <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                </svg>
              </div>
              <h3 className="card-title">Nucular controller 6F HE</h3>
              <p className="card-power">4 kW</p>
              <div className="card-actions">
                <button className="card-button preorder-button">Preorder</button>
                <span className="status-text">In development</span>
              </div>
            </div>
          </div>
        </section>

        {/* New Accessories Grid */}
        <section className="accessories-section">
          <div className="accessories-grid">
            {/* Card 1: On-board computer */}
            <div className="accessory-card">
              <h3 className="accessory-title">On-board computer</h3>
              <p className="accessory-description">For displaying basic parameters,<br />setting devices and power modes.</p>
              <div className="accessory-actions">
                <button className="card-button buy-button">Buy</button>
                <a href="#" className="card-link">
                  Learn more
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M9.23431 18.7722C8.9219 18.4685 8.9219 17.976 9.23431 17.6723L15.0686 12L9.23431 6.32775C8.92189 6.02401 8.92189 5.53155 9.23431 5.22781C9.54673 4.92407 10.0533 4.92407 10.3657 5.22781L16.7657 11.45C17.0781 11.7538 17.0781 12.2462 16.7657 12.55L10.3657 18.7722C10.0533 19.0759 9.54673 19.0759 9.23431 18.7722Z" fill="#F36F25" />
                  </svg>
                </a>
              </div>
              <div className="accessory-image-container">
                <img src="/3экран.png" alt="On-board computer" className="accessory-image" />
              </div>
            </div>

            {/* Card 2: Bluetooth module */}
            <div className="accessory-card">
              <h3 className="accessory-title">Bluetooth module<br />with App</h3>
              <p className="accessory-description">Change all settings through your smartphone<br />instead an On-board computer.</p>
              <div className="accessory-actions">
                <button className="card-button buy-button">Buy</button>
              </div>
              <div className="accessory-image-container">
                <img src="/3(2)экран.png" alt="Bluetooth module" className="accessory-image" />
              </div>
            </div>
          </div>
        </section>

        {/* BMS Section */}
        <section className="bms-section">
          <h2 className="bms-main-title">Battery Management System</h2>
          <p className="bms-main-description">
            BMS for monitor and regulate the charging and discharge of batteries.
          </p>
          <div className="bms-grid">
            {/* Card 1: BMS 16S */}
            <div className="bms-card">
              <div className="bms-card-image-container">
                 <svg className="bms-card-image" width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z" fill="#E9E9E9" />
                  <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                </svg>
              </div>
              <h3 className="bms-card-title">BMS 16S</h3>
              <p className="bms-card-description">For compact e-scooters batteries.</p>
              <div className="bms-card-actions">
                <button className="card-button preorder-button">Preorder</button>
                <span className="status-text bms-status">In development</span>
              </div>
            </div>

            {/* Card 2: BMS 24S */}
            <div className="bms-card">
              <div className="bms-card-image-container">
                 <svg className="bms-card-image" width="81" height="90" viewBox="0 0 81 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.24875e-06 12L0 60H19.2375L19.2375 15L46.575 42.0556L46.575 2.97237e-06L12.15 0C5.43975 -5.79386e-07 4.83538e-06 5.37258 4.24875e-06 12Z" fill="#E9E9E9" />
                  <path d="M81 78V30H61.7625V75L34.425 47.9445V90H68.85C75.5602 90 81 84.6274 81 78Z" fill="#E9E9E9" />
                </svg>
              </div>
              <h3 className="bms-card-title">BMS 24S</h3>
              <p className="bms-card-description">For powerful batteries.</p>
              <div className="bms-card-actions">
                <button className="card-button preorder-button">Preorder</button>
                <span className="status-text bms-status">In development</span>
              </div>
            </div>
          </div>
        </section>

        {/* uLight Controller Section */}
        <div className="ulight-section">
          <div className="ulight-content">
            <h3 className="ulight-title">uLight controller</h3>
            <p className="ulight-description">Designed to connect and control lightning equipment.</p>
            <div className="ulight-actions">
              <button className="card-button buy-button">Buy</button>
              <a href="#" className="card-link">
                Learn more
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M9.23431 18.7722C8.9219 18.4685 8.9219 17.976 9.23431 17.6723L15.0686 12L9.23431 6.32775C8.92189 6.02401 8.92189 5.53155 9.23431 5.22781C9.54673 4.92407 10.0533 4.92407 10.3657 5.22781L16.7657 11.45C17.0781 11.7538 17.0781 12.2462 16.7657 12.55L10.3657 18.7722C10.0533 19.0759 9.54673 19.0759 9.23431 18.7722Z" fill="#F36F25" />
                </svg>
              </a>
            </div>
          </div>
          <div className="ulight-image-container">
            <img src="/4экран.png" alt="uLight controller" className="ulight-image" />
          </div>
        </div>
      </div>
    </>
  );
}
