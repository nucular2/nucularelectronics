import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function NewsDetailProtection() {
  return (
    <>
      <Header variant="white" />
      <div className="page-content-white">
        <div className="news-detail">
          <div className="news-detail-breadcrumb">
            <Link to="/news" className="news-detail-back">News</Link>
            <span className="news-detail-separator">/</span>
            <span className="news-detail-current">Protection of controllers</span>
          </div>

          <h1 className="news-detail-title">Protection of controllers</h1>
          <div className="news-detail-date">June 20, 2022</div>

          <div className="news-detail-image">
            <img src="/new1.png" alt="Protection of controllers" />
          </div>

          <h2 className="news-detail-subtitle">Hello comrades!</h2>
          <p className="news-detail-text">
            News about the future improvement protection of controllers. It took a few attempts to polish the schematic, in the final design we did throw away a few components to simplify the schematic and replaced some parts that are unavailable on the market now.
          </p>

          <h3 className="news-detail-section-title">The brain of the controller:</h3>
          <ul className="news-detail-list">
            <li>Hall input +100v/-60v protected (diode+PPTC)</li>
            <li>CAN H,L +-72v PPTC protected</li>
            <li>12V TVS 1.5kW protected + little protective (fuse‑able) area</li>
          </ul>

          <h3 className="news-detail-section-title">DC‑DC:</h3>
          <ul className="news-detail-list">
            <li>Without compound filling — 2A, with filling — 3A</li>
            <li>Short‑circuit protection</li>
            <li>Better start‑up</li>
            <li>Line regulation improved</li>
            <li>Heat dissipation improved</li>
          </ul>

          <div className="news-detail-images">
            <div className="news-detail-images-grid">
              <img src="/new12.png" alt="Detail photo 1" />
              <img src="/new13.png" alt="Detail photo 2" />
              <img src="/new15.png" alt="Detail photo 3" />
              <img src="/new9.png" alt="Bicycle photo" />
            </div>
            <p className="news-detail-note">
              Real-life will show how good or bad controllers are protected now! Will see! The update will be implemented in one of the following batches of 24F controllers.
            </p>
            <p className="news-detail-sign">
              Thanks for your attention,<br/>Nucular Team
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
