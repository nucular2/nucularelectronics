import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header({ variant = 'transparent' }: { variant?: 'transparent' | 'white' }) {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const { items } = useCart();
  const { user } = useAuth();

  const cartQuantity = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isWhite = isProductsOpen || variant === 'white';
  const logoColor = isWhite ? "#222" : "white";

  const toggleProducts = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsProductsOpen(!isProductsOpen);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  const handleShopClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/shop');
  };

  const handleSupportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/support');
  };

  const handleFirmwareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/settings/controller');
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/contact');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <header className={`main-header ${isWhite ? 'dropdown-open' : ''}`}>
      <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <svg width="169" height="40" viewBox="0 0 169 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path className="logo-path" d="M1.86502e-06 5.33333L0 26.6667H8.44444L8.44444 6.66667L20.4444 18.6914L20.4444 1.32106e-06L5.33334 0C2.38782 -2.57505e-07 2.12253e-06 2.38781 1.86502e-06 5.33333Z" fill={logoColor} />
          <path className="logo-path" d="M35.5556 34.6667V13.3333H27.1111V33.3333L15.1111 21.3087V40H30.2222C33.1677 40 35.5556 37.6122 35.5556 34.6667Z" fill={logoColor} />
          <path className="logo-path" d="M123.935 33.3333V6.66668H117.556V33.3333H123.935Z" fill={logoColor} />
          <path className="logo-path" d="M67.815 17.9183C66.9445 19.5326 66.5093 21.4202 66.5093 23.5809C66.5093 25.7417 66.9445 27.1848 67.815 28.7992C68.7104 30.4136 70.2205 31.7974 71.7874 32.6667C73.3791 33.5359 74.9158 33.8286 76.9553 33.8286C79.5419 33.8286 81.7182 33.1331 83.4841 31.7423C85.2499 30.3515 86.4065 28.4391 86.9536 26.0051H80.1637C79.5917 27.5946 78.4849 28.3894 76.8434 28.3894C75.6744 28.3894 74.7417 27.9423 74.0453 27.0482C73.3489 26.1293 73.0007 25.2698 73.0007 23.5809C73.0007 21.8921 73.3489 20.6006 74.0453 19.7065C74.7417 18.7875 75.6744 18.3281 76.8434 18.3281C78.4849 18.3281 79.5917 19.1228 80.1637 20.7124H86.9536C86.4065 18.2287 85.2499 16.3039 83.4841 14.9379C81.7431 13.5719 79.5668 12.8889 76.9553 12.8889C74.9158 12.8889 73.1002 13.3235 71.5084 14.1928C69.9415 15.0621 68.7104 16.3039 67.815 17.9183Z" fill={logoColor} />
          <path className="logo-path" d="M62.0761 33.3333V13.324H55.6966V23.6971C55.6966 25.088 55.336 26.1684 54.6147 26.9383C53.8934 27.7082 52.911 28.0932 51.6674 28.0932C50.4487 28.0932 49.4787 27.7082 48.7575 26.9383C48.0362 26.1684 47.6756 25.088 47.6756 23.6971V13.324H41.3333V24.554C41.3333 26.367 41.6691 27.9442 42.3406 29.2853C43.0122 30.6265 43.9573 31.6572 45.176 32.3774C46.3947 33.0729 47.7999 33.4206 49.3917 33.4206C50.7347 33.4206 51.9535 33.1474 53.0478 32.601C54.167 32.0297 55.0499 31.2846 55.6966 30.3657V33.3333H62.0761Z" fill={logoColor} />
          <path className="logo-path" d="M112.042 13.324V33.3333H105.662V30.3494C105.015 31.2683 104.132 32.0134 103.013 32.5846C101.919 33.131 100.7 33.4042 99.3571 33.4042C97.7653 33.4042 96.3601 33.0565 95.1414 32.3611C93.9227 31.6409 92.9776 30.6102 92.306 29.269C91.6345 27.9278 91.2987 26.3507 91.2987 24.5377V13.324H97.641V23.5556C97.641 24.9464 98.0016 26.152 98.7229 26.922C99.4442 27.6919 100.414 28.0768 101.633 28.0768C102.876 28.0768 103.859 27.6919 104.58 26.922C105.301 26.152 105.662 24.9464 105.662 23.5556V13.324H112.042Z" fill={logoColor} />
          <path className="logo-path" fillRule="evenodd" clipRule="evenodd" d="M128.409 23.3168C128.409 21.1809 128.807 19.5326 129.603 17.9183C130.424 16.3039 131.53 15.0621 132.923 14.1928C134.316 13.3235 135.87 12.8889 137.587 12.8889C139.054 12.8889 140.335 13.1869 141.429 13.783C142.548 14.3791 143.407 15.0268 144.003 15.9954V13.3333H150.383V33.3333H144.003V30.4398C143.382 31.4084 142.511 32.283 141.392 32.879C140.298 33.4751 139.017 33.7732 137.549 33.7732C135.858 33.7732 134.316 33.3385 132.923 32.4692C131.53 31.5751 130.424 30.3209 129.603 28.7065C128.807 27.0673 128.409 25.4528 128.409 23.3168ZM144.003 23.3168C144.003 21.7273 143.556 20.7372 142.66 19.8182C141.79 18.8993 140.72 18.4398 139.452 18.4398C138.184 18.4398 137.102 18.8993 136.206 19.8182C135.336 20.7124 134.901 21.7273 134.901 23.3168C134.901 24.9064 135.336 25.9 136.206 26.8438C137.102 27.7628 138.184 28.2222 139.452 28.2222C140.72 28.2222 141.79 27.7628 142.66 26.8438C143.556 25.9249 144.003 24.9064 144.003 23.3168Z" fill={logoColor} />
          <path className="logo-path" d="M165.295 14.117C164.176 14.7627 163.243 15.6568 162.497 16.7993V13.3333H156.118V33.3333H162.497V23.7681C162.497 22.0544 162.895 20.8623 163.691 20.1917C164.487 19.4963 165.681 19.1485 167.272 19.1485H168.889V13.1111C167.521 13.1111 166.414 13.4464 165.295 14.117Z" fill={logoColor} />
        </svg>
      </div>
      <nav className="main-nav">
        <a href="#" className="nav-link" onClick={toggleProducts}>
          Products 
          <svg className={`nav-arrow ${isProductsOpen ? 'open' : ''}`} width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path className="arrow-path" d="M1 1L5 5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
        <a href="#" className="nav-link" onClick={handleShopClick}>Shop</a>
        <a href="#" className="nav-link" onClick={handleSupportClick}>Support</a>
        <a href="#" className="nav-link" onClick={handleFirmwareClick}>Firmware</a>
        <a href="#" className="nav-link">News</a>
        <a href="#" className="nav-link" onClick={handleContactClick}>Contact us</a>
      </nav>
      <div className="header-actions">
        <div className="cart-icon-container" onClick={handleCartClick} style={{ cursor: 'pointer' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M7.05595 7.13953V5.86047C7.05595 3.1761 9.26953 1 12.0001 1C14.7307 1 16.9443 3.1761 16.9443 5.86047V7.13953H19.2287C20.713 7.13953 21.9511 8.25504 22.0802 9.70876L22.9889 19.9413C23.135 21.5857 21.8165 23 20.1374 23H3.86263C2.18352 23 0.865028 21.5857 1.01106 19.9413L1.91977 9.70876C2.04886 8.25504 3.28696 7.13953 4.77134 7.13953H7.05595ZM8.61727 5.86047C8.61727 4.0238 10.1318 2.53488 12.0001 2.53488C13.8684 2.53488 15.383 4.0238 15.383 5.86047V7.13953H8.61727V5.86047ZM7.05595 8.67442V10.9767C7.05595 11.4006 7.40546 11.7442 7.83661 11.7442C8.26776 11.7442 8.61727 11.4006 8.61727 10.9767V8.67442H15.383V10.9767C15.383 11.4006 15.7325 11.7442 16.1636 11.7442C16.5948 11.7442 16.9443 11.4006 16.9443 10.9767V8.67442H19.2287C19.9034 8.67442 20.4662 9.18147 20.5248 9.84225L21.4335 20.0748C21.4999 20.8223 20.9006 21.4651 20.1374 21.4651H3.86263C3.0994 21.4651 2.50008 20.8223 2.56646 20.0748L3.47517 9.84225C3.53385 9.18147 4.09662 8.67442 4.77134 8.67442H7.05595Z" fill={logoColor} />
          </svg>
          {cartQuantity > 0 && <span className="cart-count">{cartQuantity}</span>}
        </div>
        <div className="profile-icon-container" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M6 9C6 6.23858 8.23858 4 11 4C13.7614 4 16 6.23858 16 9C16 11.7614 13.7614 14 11 14C8.23858 14 6 11.7614 6 9ZM11 5.57895C9.11061 5.57895 7.57895 7.1106 7.57895 9C7.57895 10.8894 9.11061 12.4211 11 12.4211C12.8894 12.4211 14.4211 10.8894 14.4211 9C14.4211 7.1106 12.8894 5.57895 11 5.57895Z" fill={logoColor} />
            <path fillRule="evenodd" clipRule="evenodd" d="M11 0C4.92487 0 0 4.92487 0 11C0 17.0751 4.92487 22 11 22C17.0751 22 22 17.0751 22 11C22 4.92487 17.0751 0 11 0ZM1.53488 11C1.53488 5.77256 5.77256 1.53488 11 1.53488C16.2274 1.53488 20.4651 5.77256 20.4651 11C20.4651 13.0499 19.8134 14.9477 18.706 16.4973C17.772 15.5377 16.5233 15 15.2225 15H6.77749C5.4767 15 4.22802 15.5377 3.29403 16.4973C2.18655 14.9477 1.53488 13.0499 1.53488 11ZM4.35955 17.7448C6.0681 19.4271 8.41283 20.4651 11 20.4651C13.5872 20.4651 15.9319 19.4271 17.6404 17.7448C16.9978 17.0657 16.1286 16.6844 15.2225 16.6844H6.77749C5.87135 16.6844 5.00217 17.0657 4.35955 17.7448Z" fill={logoColor} />
          </svg>
        </div>
      </div>
      {isProductsOpen && (
        <div className="dropdown-overlay open">
          <div className="dropdown-content">
            <div className="dropdown-column">
              <h4 className="dropdown-title">Components</h4>
              <a href="#" className="dropdown-link">Controllers</a>
              <a href="#" className="dropdown-link">On-board computer</a>
              <a href="#" className="dropdown-link">uLight controller</a>
              <a href="#" className="dropdown-link">Motors</a>
              <a href="#" className="dropdown-link">Bluetooth module with App</a>
              <a href="#" className="dropdown-link soon">BMS (soon)</a>
            </div>
            <div className="dropdown-column">
              <h4 className="dropdown-title">Complete solutions</h4>
              <a href="#" className="dropdown-link">For Sur-Ron Light Bee</a>
              <a href="#" className="dropdown-link">For Talaria Sting MX3 | MX4</a>
              <a href="#" className="dropdown-link">For Talaria XXX</a>
              <a href="#" className="dropdown-link">For Electric scooters</a>
              <a href="#" className="dropdown-link">For E-bikes</a>
              <a href="#" className="dropdown-link">For Motorcycles</a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
