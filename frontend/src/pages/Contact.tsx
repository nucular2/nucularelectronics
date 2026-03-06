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
              <a href="https://www.facebook.com/nuculartech" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12.0611C22 6.50454 17.5229 2 12 2C6.47715 2 2 6.50454 2 12.0611C2 17.0827 5.65684 21.2452 10.4375 21.9796V14.9606H7.89844V12.0611H10.4375V9.84501C10.4375 7.33233 11.9305 5.93077 14.2146 5.93077C15.3088 5.93077 16.4531 6.12668 16.4531 6.12668V8.59419H15.1922C13.95 8.59419 13.5625 9.36987 13.5625 10.1654V12.0611H16.3359L15.8926 14.9606H13.5625V21.9796C18.3432 21.2452 22 17.0827 22 12.0611Z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/nuculartech" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2.16337C15.2044 2.16337 15.5844 2.17554 16.8497 2.23326C18.1139 2.29097 18.9733 2.49258 19.7252 2.78468C20.502 3.08643 21.1565 3.49386 21.8087 4.14605C22.4608 4.79824 22.8683 5.45277 23.17 6.22956C23.4621 6.98144 23.6637 7.84085 23.7214 9.10505C23.7791 10.3703 23.7913 10.7504 23.7913 13.9548C23.7913 17.1592 23.7791 17.5392 23.7214 18.8045C23.6637 20.0687 23.4621 20.9281 23.17 21.68C22.8683 22.4568 22.4608 23.1113 21.8087 23.7635C21.1565 24.4157 20.502 24.8231 19.7252 25.1249C18.9733 25.417 18.1139 25.6186 16.8497 25.6763C15.5844 25.734 15.2044 25.7462 12 25.7462C8.7956 25.7462 8.41561 25.734 7.15033 25.6763C5.88609 25.6186 5.02672 25.417 4.27484 25.1249C3.49805 24.8231 2.84352 24.4157 2.19133 23.7635C1.53914 23.1113 1.13168 22.4568 0.82993 21.68C0.53783 20.9281 0.33622 20.0687 0.2785 18.8045C0.22079 17.5392 0.20862 17.1592 0.20862 13.9548C0.20862 10.7504 0.22079 10.3703 0.2785 9.10505C0.33622 7.84085 0.53783 6.98144 0.82993 6.22956C1.13168 5.45277 1.53914 4.79824 2.19133 4.14605C2.84352 3.49386 3.49805 3.08643 4.27484 2.78468C5.02672 2.49258 5.88609 2.29097 7.15033 2.23326C8.41561 2.17554 8.7956 2.16337 12 2.16337ZM12 7.90956C8.66173 7.90956 5.95479 10.6165 5.95479 13.9548C5.95479 17.293 8.66173 20 12 20C15.3383 20 18.0452 17.293 18.0452 13.9548C18.0452 10.6165 15.3383 7.90956 12 7.90956ZM12 18.2327C9.63751 18.2327 7.72205 16.3172 7.72205 13.9548C7.72205 11.5923 9.63751 9.67683 12 9.67683C14.3625 9.67683 16.2779 11.5923 16.2779 13.9548C16.2779 16.3172 14.3625 18.2327 12 18.2327ZM20.1292 6.47956C19.4777 6.47956 18.9493 7.00793 18.9493 7.65947C18.9493 8.31101 19.4777 8.83938 20.1292 8.83938C20.7808 8.83938 21.3091 8.31101 21.3091 7.65947C21.3091 7.00793 20.7808 6.47956 20.1292 6.47956Z" transform="translate(0 -2) scale(0.85)"/>
                </svg>
              </a>
              <a href="https://twitter.com/nuculartech" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/@NucularElectronics" className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.186C23.224 5.148 22.41 4.333 21.372 4.059C19.502 3.565 12.002 3.565 12.002 3.565C12.002 3.565 4.502 3.565 2.632 4.059C1.594 4.333 0.78 5.148 0.506 6.186C0.01 8.056 0.01 12.006 0.01 12.006C0.01 12.006 0.01 15.956 0.506 17.826C0.78 18.864 1.594 19.679 2.632 19.953C4.502 20.447 12.002 20.447 12.002 20.447C19.502 20.447 21.372 19.953C22.41 19.679 23.224 18.864 23.498 17.826C23.994 15.956 23.994 12.006 23.994 12.006C23.994 12.006 23.994 8.056 23.498 6.186ZM9.547 15.572V8.44L15.82 12.006L9.547 15.572Z"/>
                </svg>
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
