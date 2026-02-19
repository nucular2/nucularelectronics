import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function NewsDetailBrief() {
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

          <h1 className="news-detail-title">Brief news for the year</h1>
          <div className="news-detail-date">May 20, 2022</div>

          <div className="news-detail-image">
            <img src="/new4.png" alt="Brief news for the year" />
          </div>

          <h2 className="news-detail-subtitle">Hello comrades!</h2>
          <p className="news-detail-text">
            How are you? For a long time we had no news, well, the last mailing was almost yesterday — April 7,
            2020. We decided to correct this misunderstanding and now we will tell you about the most important and
            unimportant events that have happened to us recently.
          </p>
          <p className="news-detail-text">
            The previous year 2020 was difficult for all of us, we hope you already have immunity. While everyone
            sat on self-isolation and went out for a walk with passes, we didn&apos;t waste our time. But, despite
            our heroic efforts due to restrictions in connection with the COVID-19 epidemic and the closure of
            borders, our production plans are f....d up, or rather, they have undergone major adjustments.
          </p>

          <div className="news-detail-image">
            <img src="/плашка.png" alt="uLight controller video preview" />
          </div>
          <p className="news-detail-note">
            The uLight controllers are probably still in stock and you can{" "}
            <span className="news-detail-accent">order</span> them on our website.
          </p>
          <p className="news-detail-note">
            In the photo below, the new casing for the 24F controller, it has become smaller in length, changed its
            shape and significantly increased the number of cooling fins, now the whole surface of the casing is one
            large heat sink.
          </p>
        </div>

        <div className="news-detail-banner">
          <div className="news-detail-banner-inner">
            <p className="news-detail-banner-text">
              In English <span className="news-detail-banner-accent">Nucular</span> is a commonly used
              mispronunciation of the word &quot;nuclear&quot;. We used this word to emphasize high power density of
              our controllers
            </p>
          </div>
        </div>

        <div className="news-detail news-detail-after-banner">
          <p className="news-detail-text">
            With the new casings, we also prepare an update on controller boards. Thanks for your work on destroying
            devices! We&apos;ve addressed a lot of bugs and are adding new ways to protect against our awesome users.
            We planned to add an active protection system against butterfingers, but since the developer has only two
            hands, we had to abandon it and leave only passive protection.
          </p>

          <div className="news-detail-casing-grid">
            <div className="news-detail-casing-item">
              <img src="/new31.png" alt="New casing detail 1" className="news-detail-casing-image" />
              <p className="news-detail-casing-caption">Description</p>
            </div>
            <div className="news-detail-casing-item">
              <img src="/new32.png" alt="New casing detail 2" className="news-detail-casing-image" />
              <p className="news-detail-casing-caption">Description</p>
            </div>
          </div>

          <p className="news-detail-text">
            The casing for the 24F and 12F controllers is identical and differs only in length, so we decided to first
            make and test a new casing for the 24F, because cutting off is easier than building up. The tests went
            well, we made new casing and the next batch of 24F controllers will be with them. We are planning this
            batch for the middle of May this year. Again, if everything goes according to plan (which we definitely
            have).
          </p>

          <p className="news-detail-sign">
            Thanks for your attention,<br />Nucular Team
          </p>
        </div>

        <div className="news-detail-latest">
          <h2 className="news-detail-latest-title">Latest news</h2>

          <div className="news-grid-small">
            <article className="news-card news-card--small">
              <div className="news-image-wrapper news-image-wrapper--small">
                <img
                  src="/new9.png"
                  alt="Protection of controllers"
                  className="news-image"
                />
              </div>
              <div className="news-meta">June 20, 2022</div>
              <h3 className="news-card-title">Protection of controllers</h3>
              <p className="news-card-text">
                New circuit engineering and improved protection of controllers
                from our users.
              </p>
            </article>

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
