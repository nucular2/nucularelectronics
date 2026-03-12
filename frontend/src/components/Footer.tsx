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
          <svg width="119" height="28" viewBox="0 0 119 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 3.73333L0 18.6667H5.91111L5.91111 4.66667L14.3111 13.084V0H3.73334C1.67147 -1.80253e-07 1.48577e-06 1.67147 1.30551e-06 3.73333Z" fill="#222"/>
            <path d="M24.8889 24.2667V9.33333H18.9778V23.3333L10.5778 14.9161V28H21.1556C23.2174 28 24.8889 26.3285 24.8889 24.2667Z" fill="#222"/>
            <path d="M86.7544 23.3333V4.66668H82.2889V23.3333H86.7544Z" fill="#222"/>
            <path d="M47.4705 12.5428C46.8611 13.6728 46.5565 14.9942 46.5565 16.5066C46.5565 18.0192 46.8611 19.0294 47.4705 20.1594C48.0973 21.2895 49.1543 22.2582 50.2512 22.8667C51.3653 23.4751 52.4411 23.68 53.8687 23.68C55.6793 23.68 57.2027 23.1932 58.4389 22.2196C59.675 21.246 60.4846 19.9073 60.8675 18.2036H56.1146C55.7142 19.3162 54.9394 19.8726 53.7904 19.8726C52.9721 19.8726 52.3192 19.5596 51.8317 18.9337C51.3442 18.2905 51.1005 17.6888 51.1005 16.5066C51.1005 15.3245 51.3442 14.4204 51.8317 13.7946C52.3192 13.1513 52.9721 12.8297 53.7904 12.8297C54.9394 12.8297 55.7142 13.386 56.1146 14.4987H60.8675C60.4846 12.7601 59.675 11.4127 58.4389 10.4565C57.2202 9.50033 55.6968 9.02222 53.8687 9.02222C52.4411 9.02222 51.1701 9.32644 50.0559 9.93498C48.959 10.5435 48.0973 11.4127 47.4705 12.5428Z" fill="#222"/>
            <path d="M43.4533 23.3333V9.3268H38.9876V16.588C38.9876 17.5616 38.7352 18.3179 38.2303 18.8568C37.7254 19.3957 37.0377 19.6652 36.1672 19.6652C35.3141 19.6652 34.6351 19.3957 34.1302 18.8568C33.6254 18.3179 33.3729 17.5616 33.3729 16.588V9.3268H28.9333V17.1878C28.9333 18.4569 29.1684 19.5609 29.6384 20.4997C30.1085 21.4385 30.7701 22.16 31.6232 22.6642C32.4763 23.151 33.46 23.3944 34.5742 23.3944C35.5143 23.3944 36.3674 23.2032 37.1334 22.8207C37.9169 22.4208 38.5349 21.8992 38.9876 21.256V23.3333H43.4533Z" fill="#222"/>
            <path d="M78.4293 9.3268V23.3333H73.9637V21.2446C73.5106 21.8878 72.8926 22.4094 72.1091 22.8092C71.3431 23.1917 70.4899 23.383 69.5499 23.383C68.4357 23.383 67.452 23.1396 66.5989 22.6528C65.7458 22.1486 65.0843 21.4272 64.6141 20.4883C64.144 19.5495 63.909 18.4455 63.909 17.1764V9.3268H68.3487V16.4889C68.3487 17.4625 68.6011 18.3064 69.106 18.8454C69.6109 19.3843 70.2899 19.6538 71.143 19.6538C72.0135 19.6538 72.7013 19.3843 73.2062 18.8454C73.7111 18.3064 73.9637 17.4625 73.9637 16.4889V9.3268H78.4293Z" fill="#222"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M89.8863 16.3218C89.8863 14.8266 90.165 13.6728 90.7221 12.5428C91.2968 11.4127 92.071 10.5435 93.0461 9.93498C94.0212 9.32644 95.109 9.02222 96.311 9.02222C97.3378 9.02222 98.2346 9.23081 99.0003 9.64808C99.7838 10.0654 100.385 10.5188 100.802 11.1968V9.33333H105.268V23.3333H100.802V21.3079C100.368 21.9859 99.7579 22.5981 98.9744 23.0153C98.2085 23.4326 97.3117 23.6412 96.2842 23.6412C95.1005 23.6412 94.0212 23.337 93.0461 22.7284C92.071 22.1026 91.2968 21.2246 90.7221 20.0946C90.165 18.9471 89.8863 17.817 89.8863 16.3218ZM100.802 16.3218C100.802 15.2091 100.489 14.5161 99.8622 13.8727C99.2531 13.2295 98.5041 12.9079 97.6165 12.9079C96.7289 12.9079 95.9715 13.2295 95.3442 13.8727C94.7352 14.4987 94.4307 15.2091 94.4307 16.3218C94.4307 17.4345 94.7352 18.13 95.3442 18.7907C95.9715 19.434 96.7289 19.7556 97.6165 19.7556C98.5041 19.7556 99.2531 19.434 99.8622 18.7907C100.489 18.1474 100.802 17.4345 100.802 16.3218Z" fill="#222"/>
            <path d="M115.706 9.88191C114.923 10.3339 114.27 10.9598 113.748 11.7595V9.33333H109.282V23.3333H113.748V16.6377C113.748 15.4381 114.027 14.6036 114.584 14.1342C115.141 13.6474 115.977 13.4039 117.091 13.4039H118.222V9.17778C117.265 9.17778 116.49 9.41249 115.706 9.88191Z" fill="#222"/>
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
