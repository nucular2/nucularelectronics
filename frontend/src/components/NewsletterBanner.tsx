import React from "react";

export default function NewsletterBanner() {
  return (
    <section className="newsletter-banner">
      <div className="newsletter-inner">
        <h2 className="newsletter-title">Join our newsletter</h2>
        <p className="newsletter-subtitle">
          We will notify you of the release of new features and firmware for the Nucular platform.
        </p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            className="newsletter-input"
            placeholder="E-mail"
            aria-label="E-mail"
          />
          <button type="submit" className="newsletter-button">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
