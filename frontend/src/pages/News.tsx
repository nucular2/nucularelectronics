import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function News() {
  return (
    <>
      <Header variant="white" />
      <div className="page-content-white">
        <div className="news-layout">
          <h1 className="news-title">News</h1>

          <div className="news-grid">
            <article className="news-card">
              <Link to="/news/protection-of-controllers" className="news-image-wrapper">
                <img
                  src="/new1.png"
                  alt="Protection of controllers"
                  className="news-image"
                />
              </Link>
              <div className="news-meta">June 20, 2022</div>
              <h2 className="news-card-title">Protection of controllers</h2>
              <p className="news-card-text">
                New circuit engineering and improved protection of controllers
                from our users.
              </p>
            </article>

            <article className="news-card">
              <div className="news-image-wrapper">
                <img
                  src="/new2.png"
                  alt="Price increase"
                  className="news-image"
                />
              </div>
              <div className="news-meta">June 5, 2022</div>
              <h2 className="news-card-title">Price increase</h2>
              <p className="news-card-text">
                Updating the cost of controllers. The sadness and grief news
                about the reasons for the price ...
              </p>
            </article>
          </div>

          <div className="news-grid-small">
            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new3.png"
                  alt="Big/Bug update!"
                  className="news-image"
                />
              </div>
              <div className="news-meta">May 28, 2022</div>
              <h2 className="news-card-title">Big/Bug update!</h2>
              <p className="news-card-text">
                The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).
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
              <h2 className="news-card-title">Brief news for the year</h2>
              <p className="news-card-text">
                The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ...
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
              <h2 className="news-card-title">Protection of controllers</h2>
              <p className="news-card-text">
                New circuit engineering and improved protection of controllers from our users.
              </p>
            </article>
          </div>

          <div className="news-grid-small">
            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new6.png"
                  alt="Protection of controllers"
                  className="news-image"
                />
              </div>
              <div className="news-meta">June 20, 2022</div>
              <h2 className="news-card-title">Protection of controllers</h2>
              <p className="news-card-text">
                New circuit engineering and improved protection of controllers from our users.
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new7.png"
                  alt="Price increase"
                  className="news-image"
                />
              </div>
              <div className="news-meta">June 5, 2022</div>
              <h2 className="news-card-title">Price increase</h2>
              <p className="news-card-text">
                Updating the cost of controllers. The sadness and grief news about the reasons for the price ...
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new8.png"
                  alt="Brief news for the year"
                  className="news-image"
                />
              </div>
              <div className="news-meta">April 3, 2022</div>
              <h2 className="news-card-title">Brief news for the year</h2>
              <p className="news-card-text">
                The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ...
              </p>
            </article>
          </div>

          <div className="news-grid-small">
            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new9.png"
                  alt="Protection of controllers"
                  className="news-image"
                />
              </div>
              <div className="news-meta">May 15, 2022</div>
              <h2 className="news-card-title">Protection of controllers</h2>
              <p className="news-card-text">
                New circuit engineering and improved protection of controllers from our users.
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new10.png"
                  alt="Price increase"
                  className="news-image"
                />
              </div>
              <div className="news-meta">April 29, 2022</div>
              <h2 className="news-card-title">Price increase</h2>
              <p className="news-card-text">
                Updating the cost of controllers. The sadness and grief news about the reasons for the price ...
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new11.png"
                  alt="Brief news for the year"
                  className="news-image"
                />
              </div>
              <div className="news-meta">May 20, 2022</div>
              <h2 className="news-card-title">Brief news for the year</h2>
              <p className="news-card-text">
                The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ...
              </p>
            </article>
          </div>

          <div className="news-grid-small">
            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new12.png"
                  alt="Big/Bug update!"
                  className="news-image"
                />
              </div>
              <div className="news-meta">April 25, 2022</div>
              <h2 className="news-card-title">Big/Bug update!</h2>
              <p className="news-card-text">
                The big update of the Controller (v0.8.1) and the On-board Computer (v0.70).
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new13.png"
                  alt="Brief news for the year"
                  className="news-image"
                />
              </div>
              <div className="news-meta">April 3, 2022</div>
              <h2 className="news-card-title">Brief news for the year</h2>
              <p className="news-card-text">
                The uLight controller, rules of sales and guarantees. New casing for 24f, waiting time and a ...
              </p>
            </article>

            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new14.png"
                  alt="Price increase"
                  className="news-image"
                />
              </div>
              <div className="news-meta">June 5, 2022</div>
              <h2 className="news-card-title">Price increase</h2>
              <p className="news-card-text">
                Updating the cost of controllers. The sadness and grief news about the reasons for the price ...
              </p>
            </article>
          </div>
          <div className="news-show-more">
            <a href="#" className="news-show-more-link">Show more</a>
          </div>
        </div>
      </div>
    </>
  );
}
