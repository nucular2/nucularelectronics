import Header from "../components/Header";

export default function Contact() {
  return (
    <>
      <Header variant="white" />
      <div className="page-content-white contact-page">
        <div className="contact-layout">
          <div className="contact-left">
            <h1 className="contact-title">Contact us</h1>
            <p className="contact-subtitle">
              If you have questions, suggestions or you need technical support, write to us.
            </p>
            <div className="contact-company">Nucular Limited</div>
            <div className="contact-address">
              Hollywood Centre,<br />
              No. 77-91 Queen&apos;s Road West,<br />
              Sheung Wan, Hong Kong
            </div>
            <div className="contact-socials">
              <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <img src="/фейс.png" alt="Facebook" />
              </a>
              <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <img src="/inst.png" alt="Instagram" />
              </a>
              <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <img src="/twit.png" alt="Twitter" />
              </a>
              <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <img src="/ut.png" alt="YouTube" />
              </a>
            </div>
          </div>
          <div className="contact-form">
            <input
              className="contact-input"
              type="email"
              placeholder="E-mail"
            />
            <input
              className="contact-input"
              type="text"
              placeholder="Name"
            />
            <input
              className="contact-input"
              type="text"
              placeholder="Country"
            />
            <textarea
              className="contact-textarea"
              placeholder="Your message"
            />
            <button className="contact-send-button">Send</button>
          </div>
        </div>
      </div>
    </>
  );
}
