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

  const goReviews = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/reviews');
  };

  const goSupport = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/support');
  };

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/contact');
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
                <li><a href="#" onClick={goReviews}>Reviews</a></li>
                <li><a href="#" onClick={goPartners}>For partners</a></li>
                <li><a href="#" onClick={goContact}>Contact us</a></li>
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
                <li><a href="#" onClick={goSupport}>Support</a></li>
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

        <div className="footer-middle-row">
           <div className="trustpilot-widget">
               <strong>Excellent</strong> 4.5 out of 5 <span style={{ color: '#00b67a', fontSize: '20px' }}>★</span> <strong>Trustpilot</strong>
           </div>
           <div className="social-icons">
           {/* Facebook */}
           <a href="https://www.facebook.com/nuculartech" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/social.png" alt="Facebook" />
          </a>
          {/* Instagram */}
          <a href="https://www.instagram.com/nuculartech" target="_blank" rel="noopener noreferrer" className="social-icon">
             <img src="/social2.png" alt="Instagram" />
          </a>
          {/* LinkedIn */}
          <a href="https://www.linkedin.com/company/nucular" target="_blank" rel="noopener noreferrer" className="social-icon">
             <img src="/social3.png" alt="LinkedIn" />
          </a>
          {/* Youtube */}
          <a href="https://www.youtube.com/@NucularElectronics" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/social4.png" alt="YouTube" />
          </a>
          {/* TikTok */}
           <a href="https://www.tiktok.com/@nuculartech" target="_blank" rel="noopener noreferrer" className="social-icon">
            <img src="/social5.png" alt="TikTok" />
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
          <a href="/careers">Careers</a>
          <a href="/terms">Terms and Conditions</a>
          <a href="/privacy">Privacy policy</a>
          <span className="copyright">© 2025 Nucular Limited. All Rights Reserved.</span>
        </div>
      </div>
      </div>
    </footer>
  );
}
