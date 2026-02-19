import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function NewsDetailProtection() {
  return (
    <>
      <Header variant="white" />
      <div className="page-content-white">
        <div className="news-detail">
          <div className="news-detail-breadcrumb">
            <Link to="/news" className="news-detail-back">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7657 5.22781C15.0781 5.53155 15.0781 6.02401 14.7657 6.32775L8.93137 12L14.7657 17.6723C15.0781 17.976 15.0781 18.4685 14.7657 18.7722C14.4533 19.0759 13.9467 19.0759 13.6343 18.7722L7.23431 12.55C6.92189 12.2462 6.92189 11.7538 7.23431 11.45L13.6343 5.22781C13.9467 4.92406 14.4533 4.92406 14.7657 5.22781Z"
                  fill="#222222"
                />
              </svg>
              <span>Back to news</span>
            </Link>
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
              <img src="/new6.png" alt="Detail photo 1" />
              <img src="/new11.png" alt="Detail photo 2" />
              <img src="/new15.png" alt="Detail photo 3" />
              <img src="/new5.png" alt="Bicycle photo" />
            </div>
            <p className="news-detail-note">
              Real-life will show how good or bad controllers are protected now! Will see! The update will be implemented in one of the following batches of 24F controllers.
            </p>
            <p className="news-detail-sign">
              Thanks for your attention,<br/>Nucular Team
            </p>
          </div>
        </div>

        <div className="news-detail-latest">
          <h2 className="news-detail-latest-title">Latest news</h2>

          <div className="news-grid-small">
            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new2.png"
                  alt="Price increase"
                  className="news-image"
                />
              </div>
              <div className="news-meta">June 5, 2022</div>
              <h3 className="news-card-title">Price increase</h3>
              <p className="news-card-text">
                Updating the cost of controllers. The sadness and grief news
                about the reasons for the price ...
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new4.png"
                  alt="Brief news for the year"
                  className="news-image"
                />
              </div>
              <div className="news-meta">May 20, 2022</div>
              <h3 className="news-card-title">Brief news for the year</h3>
              <p className="news-card-text">
                The uLight controller, rules of sales and guarantees. New casing
                for 24f, waiting time and a ...
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new5.png"
                  alt="Protection of controllers"
                  className="news-image"
                />
              </div>
              <div className="news-meta">May 15, 2022</div>
              <h3 className="news-card-title">Protection of controllers</h3>
              <p className="news-card-text">
                New circuit engineering and improved protection of controllers
                from our users.
              </p>
            </article>
          </div>
        </div>
      </div>
    </>
  );
}
