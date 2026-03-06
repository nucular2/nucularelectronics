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

  const goContact = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/contact');
  };

  const goPreorder = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/shop'); // Pre-order usually leads to shop
  };

  const goPayment = (e: React.MouseEvent) => {
    e.preventDefault();
    // navigate('/payment'); // No payment page yet
  };

  const goDelivery = (e: React.MouseEvent) => {
    e.preventDefault();
    // navigate('/delivery'); // No delivery page yet
  };

  const goWarranty = (e: React.MouseEvent) => {
    e.preventDefault();
    // navigate('/warranty'); // No warranty page yet
  };

  const goSupport = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/support');
  };

  const goFirmware = (e: React.MouseEvent) => {
    e.preventDefault();
    // navigate('/firmware'); // No firmware page yet
  };

  const goDevelopers = (e: React.MouseEvent) => {
    e.preventDefault();
    // navigate('/developers'); // No developers page yet
  };

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-columns">
            <div className="footer-column">
              <h4 className="footer-title">Company</h4>
              <ul className="footer-links">
                <li><a href="/news" onClick={goNews}>News</a></li>
                <li><a href="/reviews" onClick={goReviews}>Reviews</a></li>
                <li><a href="/partners" onClick={goPartners}>For partners</a></li>
                <li><a href="/contact" onClick={goContact}>Contact us</a></li>
              </ul>
              <div className="trustpilot-widget">
                <span style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>Excellent</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>4.5</span>
                  <span style={{ fontSize: '16px', color: '#111' }}>out of 5</span>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#00b67a" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: '4px' }}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  <span style={{ fontWeight: 700, fontSize: '16px', color: '#111', marginLeft: '4px' }}>Trustpilot</span>
                </div>
              </div>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">For clients</h4>
              <ul className="footer-links">
                <li><a href="/shop" onClick={goPreorder}>Pre-order</a></li>
                <li><a href="#">Payment</a></li>
                <li><a href="#">Delivery</a></li>
                <li><a href="#">Warranty</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">Help</h4>
              <ul className="footer-links">
                <li><a href="/support" onClick={goSupport}>Support</a></li>
                <li><a href="#">Firmware</a></li>
                <li><a href="#">For developers</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4 className="footer-title">For partners</h4>
              <ul className="footer-links">
                <li><a href="/partners" onClick={goPartners}>Become a dealer</a></li>
                <li><a href="/partners" onClick={goPartners}>For Influencers</a></li>
                <li><a href="/partners" onClick={goPartners}>For OEMs</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-top-right">
            <div className="language-selector">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="globe-icon">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 2A15.3 15.3 0 0 1 16 12C16 16.2 14.5 20.3 12 22A15.3 15.3 0 0 1 8 12C8 7.8 9.5 3.7 12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>English</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="chevron-icon">
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            <div className="social-icons">
             {/* Facebook */}
             <a href="https://www.facebook.com/nuculartech" target="_blank" rel="noopener noreferrer" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12.0611C22 6.50454 17.5229 2 12 2C6.47715 2 2 6.50454 2 12.0611C2 17.0827 5.65684 21.2452 10.4375 21.9796V14.9606H7.89844V12.0611H10.4375V9.84501C10.4375 7.33233 11.9305 5.93077 14.2146 5.93077C15.3088 5.93077 16.4531 6.12668 16.4531 6.12668V8.59419H15.1922C13.95 8.59419 13.5625 9.36987 13.5625 10.1654V12.0611H16.3359L15.8926 14.9606H13.5625V21.9796C18.3432 21.2452 22 17.0827 22 12.0611Z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/nuculartech" target="_blank" rel="noopener noreferrer" className="social-icon">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.16337C15.2044 2.16337 15.5844 2.17554 16.8497 2.23326C18.1139 2.29097 18.9733 2.49258 19.7252 2.78468C20.502 3.08643 21.1565 3.49386 21.8087 4.14605C22.4608 4.79824 22.8683 5.45277 23.17 6.22956C23.4621 6.98144 23.6637 7.84085 23.7214 9.10505C23.7791 10.3703 23.7913 10.7504 23.7913 13.9548C23.7913 17.1592 23.7791 17.5392 23.7214 18.8045C23.6637 20.0687 23.4621 20.9281 23.17 21.68C22.8683 22.4568 22.4608 23.1113 21.8087 23.7635C21.1565 24.4157 20.502 24.8231 19.7252 25.1249C18.9733 25.417 18.1139 25.6186 16.8497 25.6763C15.5844 25.734 15.2044 25.7462 12 25.7462C8.7956 25.7462 8.41561 25.734 7.15033 25.6763C5.88609 25.6186 5.02672 25.417 4.27484 25.1249C3.49805 24.8231 2.84352 24.4157 2.19133 23.7635C1.53914 23.1113 1.13168 22.4568 0.82993 21.68C0.53783 20.9281 0.33622 20.0687 0.2785 18.8045C0.22079 17.5392 0.20862 17.1592 0.20862 13.9548C0.20862 10.7504 0.22079 10.3703 0.2785 9.10505C0.33622 7.84085 0.53783 6.98144 0.82993 6.22956C1.13168 5.45277 1.53914 4.79824 2.19133 4.14605C2.84352 3.49386 3.49805 3.08643 4.27484 2.78468C5.02672 2.49258 5.88609 2.29097 7.15033 2.23326C8.41561 2.17554 8.7956 2.16337 12 2.16337ZM12 7.90956C8.66173 7.90956 5.95479 10.6165 5.95479 13.9548C5.95479 17.293 8.66173 20 12 20C15.3383 20 18.0452 17.293 18.0452 13.9548C18.0452 10.6165 15.3383 7.90956 12 7.90956ZM12 18.2327C9.63751 18.2327 7.72205 16.3172 7.72205 13.9548C7.72205 11.5923 9.63751 9.67683 12 9.67683C14.3625 9.67683 16.2779 11.5923 16.2779 13.9548C16.2779 16.3172 14.3625 18.2327 12 18.2327ZM20.1292 6.47956C19.4777 6.47956 18.9493 7.00793 18.9493 7.65947C18.9493 8.31101 19.4777 8.83938 20.1292 8.83938C20.7808 8.83938 21.3091 8.31101 21.3091 7.65947C21.3091 7.00793 20.7808 6.47956 20.1292 6.47956Z" transform="translate(0 -2) scale(0.85)"/>
              </svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/nucular" target="_blank" rel="noopener noreferrer" className="social-icon">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0H5C2.239 0 0 2.239 0 5V19C0 21.761 2.239 24 5 24H19C21.762 24 24 21.761 24 19V5C24 2.239 21.762 0 19 0ZM8 19H5V8H8V19ZM6.5 6.732C5.534 6.732 4.75 5.942 4.75 4.968C4.75 3.994 5.534 3.204 6.5 3.204C7.466 3.204 8.25 3.994 8.25 4.968C8.25 5.942 7.466 6.732 6.5 6.732ZM20 19H17V13.396C17 10.028 13 10.283 13 13.396V19H10V8H13V9.765C14.396 7.179 20 6.988 20 12.241V19Z"/>
              </svg>
            </a>
            {/* Youtube */}
            <a href="https://www.youtube.com/@NucularElectronics" target="_blank" rel="noopener noreferrer" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186C23.224 5.148 22.41 4.333 21.372 4.059C19.502 3.565 12.002 3.565 12.002 3.565C12.002 3.565 4.502 3.565 2.632 4.059C1.594 4.333 0.78 5.148 0.506 6.186C0.01 8.056 0.01 12.006 0.01 12.006C0.01 12.006 0.01 15.956 0.506 17.826C0.78 18.864 1.594 19.679 2.632 19.953C4.502 20.447 12.002 20.447 12.002 20.447C19.502 20.447 21.372 19.953C22.41 19.679 23.224 18.864 23.498 17.826C23.994 15.956 23.994 12.006 23.994 12.006C23.994 12.006 23.994 8.056 23.498 6.186ZM9.547 15.572V8.44L15.82 12.006L9.547 15.572Z"/>
              </svg>
            </a>
            {/* TikTok */}
             <a href="https://www.tiktok.com/@nuculartech" target="_blank" rel="noopener noreferrer" className="social-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.525 2.16339C12.525 3.91689 13.061 5.54889 13.974 6.92489C14.887 8.30089 16.155 9.38089 17.653 10.0249C19.151 10.6689 20.806 10.8449 22.427 10.5309C24.048 10.2169 25.558 9.42989 26.772 8.26789L26.773 8.26689L26.775 8.26489C26.177 9.87389 25.96 11.6029 26.143 13.3109C26.326 15.0189 26.903 16.6509 27.817 18.0649C28.731 19.4789 29.953 20.6289 31.371 21.4119C32.789 22.1949 34.36 22.5869 35.944 22.5539V29.7439C34.629 29.7569 33.322 29.4799 32.112 28.9329C30.902 28.3859 29.818 27.5819 28.935 26.5779C28.052 25.5739 27.391 24.3939 26.999 23.1199C26.607 21.8459 26.492 20.5089 26.663 19.1999C25.845 20.0869 24.876 20.8259 23.81 21.3759C22.744 21.9259 21.602 22.2769 20.449 22.4089C19.296 22.5409 18.154 22.4509 17.087 22.1439C16.02 21.8369 15.049 21.3189 14.23 20.6199C13.411 19.9209 12.76 19.0549 12.314 18.0709C11.868 17.0869 11.635 16.0039 11.629 14.8839C11.623 13.7639 11.844 12.6289 12.279 11.5449C12.714 10.4609 13.355 9.44989 14.165 8.56989V2.16339H12.525Z" transform="translate(-8 -2) scale(0.8)"/>
              </svg>
            </a>
          </div>
          </div>
        </div>

      <div className="footer-bottom">
        <div className="footer-logo">
           <svg width="169" height="40" viewBox="0 0 169 40" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M1.86502e-06 5.33333L0 26.6667H8.44444L8.44444 6.66667L20.4444 18.6914L20.4444 1.32106e-06L5.33334 0C2.38782 -2.57505e-07 2.12253e-06 2.38781 1.86502e-06 5.33333Z" fill="#111"></path>
             <path d="M35.5556 34.6667V13.3333H27.1111V33.3333L15.1111 21.3087V40H30.2222C33.1677 40 35.5556 37.6122 35.5556 34.6667Z" fill="#111"></path>
             <path d="M123.935 33.3333V6.66668H117.556V33.3333H123.935Z" fill="#111"></path>
             <path d="M67.815 17.9183C66.9445 19.5326 66.5093 21.4202 66.5093 23.5809C66.5093 25.7417 66.9445 27.1848 67.815 28.7992C68.7104 30.4136 70.2205 31.7974 71.7874 32.6667C73.3791 33.5359 74.9158 33.8286 76.9553 33.8286C79.5419 33.8286 81.7182 33.1331 83.4841 31.7423C85.2499 30.3515 86.4065 28.4391 86.9536 26.0051H80.1637C79.5917 27.5946 78.4849 28.3894 76.8434 28.3894C75.6744 28.3894 74.7417 27.9423 74.0453 27.0482C73.3489 26.1293 73.0007 25.2698 73.0007 23.5809C73.0007 21.8921 73.3489 20.6006 74.0453 19.7065C74.7417 18.7875 75.6744 18.3281 76.8434 18.3281C78.4849 18.3281 79.5917 19.1228 80.1637 20.7124H86.9536C86.4065 18.2287 85.2499 16.3039 83.4841 14.9379C81.7431 13.5719 79.5668 12.8889 76.9553 12.8889C74.9158 12.8889 73.1002 13.3235 71.5084 14.1928C69.9415 15.0621 68.7104 16.3039 67.815 17.9183Z" fill="#111"></path>
             <path d="M62.0761 33.3333V13.324H55.6966V23.6971C55.6966 25.088 55.336 26.1684 54.6147 26.9383C53.8934 27.7082 52.911 28.0932 51.6674 28.0932C50.4487 28.0932 49.4787 27.7082 48.7575 26.9383C48.0362 26.1684 47.6756 25.088 47.6756 23.6971V13.324H41.3333V24.554C41.3333 26.367 41.6691 27.9442 42.3406 29.2853C43.0122 30.6265 43.9573 31.6572 45.176 32.3774C46.3947 33.0729 47.7999 33.4206 49.3917 33.4206C50.7347 33.4206 51.9535 33.1474 53.0478 32.601C54.167 32.0297 55.0499 31.2846 55.6966 30.3657V33.3333H62.0761Z" fill="#111"></path>
             <path d="M112.042 13.324V33.3333H105.662V30.3494C105.015 31.2683 104.132 32.0134 103.013 32.5846C101.919 33.131 100.7 33.4042 99.3571 33.4042C97.7653 33.4042 96.3601 33.0565 95.1414 32.3611C93.9227 31.6409 92.9776 30.6102 92.306 29.269C91.6345 27.9278 91.2987 26.3507 91.2987 24.5377V13.324H97.641V23.5556C97.641 24.9464 98.0016 26.152 98.7229 26.922C99.4442 27.6919 100.414 28.0768 101.633 28.0768C102.876 28.0768 103.859 27.6919 104.58 26.922C105.301 26.152 105.662 24.9464 105.662 23.5556V13.324H112.042Z" fill="#111"></path>
             <path fillRule="evenodd" clipRule="evenodd" d="M128.409 23.3168C128.409 21.1809 128.807 19.5326 129.603 17.9183C130.424 16.3039 131.53 15.0621 132.923 14.1928C134.316 13.3235 135.87 12.8889 137.587 12.8889C139.054 12.8889 140.335 13.1869 141.429 13.783C142.548 14.3791 143.407 15.0268 144.003 15.9954V13.3333H150.383V33.3333H144.003V30.4398C143.382 31.4084 142.511 32.283 141.392 32.879C140.298 33.4751 139.017 33.7732 137.549 33.7732C135.858 33.7732 134.316 33.3385 132.923 32.4692C131.53 31.5751 130.424 30.3209 129.603 28.7065C128.807 27.0673 128.409 25.4528 128.409 23.3168ZM144.003 23.3168C144.003 21.7273 143.556 20.7372 142.66 19.8182C141.79 18.8993 140.72 18.4398 139.452 18.4398C138.184 18.4398 137.102 18.8993 136.206 19.8182C135.336 20.7124 134.901 21.7273 134.901 23.3168C134.901 24.9064 135.336 25.9 136.206 26.8438C137.102 27.7628 138.184 28.2222 139.452 28.2222C140.72 28.2222 141.79 27.7628 142.66 26.8438C143.556 25.9249 144.003 24.9064 144.003 23.3168Z" fill="#111"></path>
             <path d="M165.295 14.117C164.176 14.7627 163.243 15.6568 162.497 16.7993V13.3333H156.118V33.3333H162.497V23.7681C162.497 22.0544 162.895 20.8623 163.691 20.1917C164.487 19.4963 165.681 19.1485 167.272 19.1485H168.889V13.1111C167.521 13.1111 166.414 13.4464 165.295 14.117Z" fill="#111"></path>
           </svg>
        </div>
        <div className="footer-bottom-links">
          <a href="#">Careers</a>
          <a href="#">Terms and Conditions</a>
          <a href="#">Privacy policy</a>
          <span className="copyright">© 2025 Nucular Limited. All Rights Reserved.</span>
        </div>
      </div>
      </div>
    </footer>
  );
}
