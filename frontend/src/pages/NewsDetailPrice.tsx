import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function NewsDetailPrice() {
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

          <h1 className="news-detail-title">Price increase</h1>
          <div className="news-detail-date">June 5, 2022</div>

          <div className="news-detail-image">
            <img src="/new2.png" alt="Price increase" />
          </div>

          <h2 className="news-detail-subtitle">Hello comrades!</h2>
          <p className="news-detail-text">
            Our previous mailing about price increases caused a huge stir. We closely followed your reactions and, apparently, no one remained indifferent! Our team was in shock... As one of the clients said: "You cheered me up and left no hope". We had not many options, we chose as best we could:
          </p>

          <div className="news-detail-image">
            <img src="/new5.png" alt="Protection of controllers" />
          </div>
          <p className="news-detail-text">
            But! Thanks to an operator error and a change in the component supply chain, we were able to correct this misunderstanding and provide a stock of vital components by the end of this year. So, please disregard to those strange numbers that were previously published. And if you haven't been paying attention, then keep it up.
          </p>

          <div className="footer-separator" />

          <p className="news-detail-text">
            We also want to answer a few popuar questions and clarify some points. The price increase will affect not only new pre-orders but all pre-orders placed earlier. We cannot fix the cost at the time of pre-order, therefore, payment for the order always takes place at the actual cost indicated on the website at the time you receive a notification about the readiness of the order for shipment. It's hard to believe, but in our entire history, there have even been a couple of cases when this cost was lower than the pre-order price. Yes, we wrote this to make it a little easier for you.
          </p>
          <p className="news-detail-sign">
            Thanks for your attention,<br />Nucular Team
          </p>
        </div>

        <div className="news-detail-latest">
          <h2 className="news-detail-latest-title">Latest news</h2>

          <div className="news-grid-small">
            <article className="news-card news-card--small">
              <div className="news-meta">June 5, 2022</div>
              <h3 className="news-card-title">Price increase</h3>
              <div className="news-image-wrapper news-image-wrapper--small">
                <img src="/new7.png" alt="Price increase" className="news-image" />
              </div>
              <p className="news-card-text">
                Updating the cost of controllers. The sadness and grief news
                about the reasons for the price ...
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-meta">May 20, 2022</div>
              <h3 className="news-card-title">Brief news for the year</h3>
              <div className="news-image-wrapper news-image-wrapper--small">
                <img src="/new4.png" alt="Brief news for the year" className="news-image" />
              </div>
              <p className="news-card-text">
                The uLight controller, rules of sales and guarantees. New casing
                for 24f, waiting time and a ...
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-meta">May 15, 2022</div>
              <h3 className="news-card-title">Protection of controllers</h3>
              <div className="news-image-wrapper news-image-wrapper--small">
                <img src="/new9.png" alt="Protection of controllers" className="news-image" />
              </div>
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
