import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const goPartners = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/partners');
  };

  const goNews = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/news');
  };

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-columns">
            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={goNews}>News</a></li>
                <li><a href="#">Reviews</a></li>
                <li><a href="#" onClick={goPartners}>Dealers</a></li>
                <li><a href="#" onClick={goPartners}>Contact us</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">For clients</h4>
              <ul className="footer-links">
                <li><a href="#">Pre-order</a></li>
                <li><a href="#">Payment</a></li>
                <li><a href="#">Delivery</a></li>
                <li><a href="#">Warranty</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Help</h4>
              <ul className="footer-links">
                <li><a href="#">Firmware</a></li>
                <li><a href="#">For developers</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">For partners</h4>
              <ul className="footer-links">
                <li><a href="#" onClick={goPartners}>Become a dealer</a></li>
                <li><a href="#" onClick={goPartners}>For Influencers</a></li>
                <li><a href="#" onClick={goPartners}>For OEMs</a></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-top-right">
            <div className="language-selector">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="globe-icon">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2A15.3 15.3 0 0 1 16 12C16 16.2 14.5 20.3 12 22A15.3 15.3 0 0 1 8 12C8 7.8 9.5 3.7 12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>English</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="chevron-icon">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="footer-middle">
          <div className="social-icons">
           {/* Facebook */}
           <a href="#" className="social-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 12.0611C22 6.50454 17.5229 2 12 2C6.47715 2 2 6.50454 2 12.0611C2 17.0827 5.65684 21.2452 10.4375 21.9796V14.9606H7.89844V12.0611H10.4375V9.84501C10.4375 7.33233 11.9305 5.93077 14.2146 5.93077C15.3088 5.93077 16.4531 6.12668 16.4531 6.12668V8.59419H15.1922C13.95 8.59419 13.5625 9.36987 13.5625 10.1654V12.0611H16.3359L15.8926 14.9606H13.5625V21.9796C18.3432 21.2452 22 17.0827 22 12.0611Z"/>
            </svg>
          </a>
          {/* Instagram */}
          <a href="#" className="social-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.16337C15.2044 2.16337 15.5844 2.17554 16.8497 2.23326C18.1139 2.29097 18.9733 2.49258 19.7252 2.78468C20.502 3.08643 21.1565 3.49386 21.8087 4.14605C22.4608 4.79824 22.8683 5.45277 23.17 6.22956C23.4621 6.98144 23.6637 7.84085 23.7214 9.10505C23.7791 10.3703 23.7913 10.7504 23.7913 13.9548C23.7913 17.1592 23.7791 17.5392 23.7214 18.8045C23.6637 20.0687 23.4621 20.9281 23.17 21.68C22.8683 22.4568 22.4608 23.1113 21.8087 23.7635C21.1565 24.4157 20.502 24.8231 19.7252 25.1249C18.9733 25.417 18.1139 25.6186 16.8497 25.6763C15.5844 25.734 15.2044 25.7462 12 25.7462C8.7956 25.7462 8.41561 25.734 7.15033 25.6763C5.88609 25.6186 5.02672 25.417 4.27484 25.1249C3.49805 24.8231 2.84352 24.4157 2.19133 23.7635C1.53914 23.1113 1.13168 22.4568 0.82993 21.68C0.53783 20.9281 0.33622 20.0687 0.2785 18.8045C0.22079 17.5392 0.20862 17.1592 0.20862 13.9548C0.20862 10.7504 0.22079 10.3703 0.2785 9.10505C0.33622 7.84085 0.53783 6.98144 0.82993 6.22956C1.13168 5.45277 1.53914 4.79824 2.19133 4.14605C2.84352 3.49386 3.49805 3.08643 4.27484 2.78468C5.02672 2.49258 5.88609 2.29097 7.15033 2.23326C8.41561 2.17554 8.7956 2.16337 12 2.16337ZM12 7.90956C8.66173 7.90956 5.95479 10.6165 5.95479 13.9548C5.95479 17.293 8.66173 20 12 20C15.3383 20 18.0452 17.293 18.0452 13.9548C18.0452 10.6165 15.3383 7.90956 12 7.90956ZM12 18.2327C9.63751 18.2327 7.72205 16.3172 7.72205 13.9548C7.72205 11.5923 9.63751 9.67683 12 9.67683C14.3625 9.67683 16.2779 11.5923 16.2779 13.9548C16.2779 16.3172 14.3625 18.2327 12 18.2327ZM20.1292 6.47956C19.4777 6.47956 18.9493 7.00793 18.9493 7.65947C18.9493 8.31101 19.4777 8.83938 20.1292 8.83938C20.7808 8.83938 21.3091 8.31101 21.3091 7.65947C21.3091 7.00793 20.7808 6.47956 20.1292 6.47956Z" transform="translate(0 -2) scale(0.85)"/>
            </svg>
          </a>
          {/* Youtube */}
          <a href="#" className="social-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186C23.224 5.148 22.41 4.333 21.372 4.059C19.502 3.565 12.002 3.565 12.002 3.565C12.002 3.565 4.502 3.565 2.632 4.059C1.594 4.333 0.78 5.148 0.506 6.186C0.01 8.056 0.01 12.006 0.01 12.006C0.01 12.006 0.01 15.956 0.506 17.826C0.78 18.864 1.594 19.679 2.632 19.953C4.502 20.447 12.002 20.447 12.002 20.447C12.002 20.447 19.502 20.447 21.372 19.953C22.41 19.679 23.224 18.864 23.498 17.826C23.994 15.956 23.994 12.006 23.994 12.006C23.994 12.006 23.994 8.056 23.498 6.186ZM9.547 15.572V8.44L15.82 12.006L9.547 15.572Z"/>
            </svg>
          </a>
          {/* LinkedIn */}
          <a href="#" className="social-icon">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 0H5C2.239 0 0 2.239 0 5V19C0 21.761 2.239 24 5 24H19C21.762 24 24 21.761 24 19V5C24 2.239 21.762 0 19 0ZM8 19H5V8H8V19ZM6.5 6.732C5.534 6.732 4.75 5.942 4.75 4.968C4.75 3.994 5.534 3.204 6.5 3.204C7.466 3.204 8.25 3.994 8.25 4.968C8.25 5.942 7.466 6.732 6.5 6.732ZM20 19H17V13.396C17 10.028 13 10.283 13 13.396V19H10V8H13V9.765C14.396 7.179 20 6.988 20 12.241V19Z"/>
            </svg>
          </a>
          {/* TikTok */}
           <a href="#" className="social-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.525 2.16339C12.525 3.91689 13.061 5.54889 13.974 6.92489C14.887 8.30089 16.155 9.38089 17.653 10.0249C19.151 10.6689 20.806 10.8449 22.427 10.5309C24.048 10.2169 25.558 9.42989 26.772 8.26789L26.773 8.26689L26.775 8.26489C26.177 9.87389 25.96 11.6029 26.143 13.3109C26.326 15.0189 26.903 16.6509 27.817 18.0649C28.731 19.4789 29.953 20.6289 31.371 21.4119C32.789 22.1949 34.36 22.5869 35.944 22.5539V29.7439C34.629 29.7569 33.322 29.4799 32.112 28.9329C30.902 28.3859 29.818 27.5819 28.935 26.5779C28.052 25.5739 27.391 24.3939 26.999 23.1199C26.607 21.8459 26.492 20.5089 26.663 19.1999C25.845 20.0869 24.876 20.8259 23.81 21.3759C22.744 21.9259 21.602 22.2769 20.449 22.4089C19.296 22.5409 18.154 22.4509 17.087 22.1439C16.02 21.8369 15.049 21.3189 14.23 20.6199C13.411 19.9209 12.76 19.0549 12.314 18.0709C11.868 17.0869 11.635 16.0039 11.629 14.8839C11.623 13.7639 11.844 12.6289 12.279 11.5449C12.714 10.4609 13.355 9.44989 14.165 8.56989V2.16339H12.525Z" transform="translate(-8 -2) scale(0.8)"/>
            </svg>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-logo">
           <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg">
             {/* Simple Nucular Text Logo Placeholder */}
             <text x="0" y="20" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#222">Nucular</text>
           </svg>
        </div>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <span className="copyright">© 2024 Nucular. All rights reserved.</span>
        </div>
      </div>
      </div>
    </footer>
  );
}
