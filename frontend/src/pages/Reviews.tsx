import { useState, useEffect } from 'react';
import Header from '../components/Header';

const reviewsData = [
  {
    id: 1,
    category: 'uLight controller',
    product: 'uLight controller',
    text: 'Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of..',
    author: 'Germany, Max Stoun',
    flag: '/flag2.png',
    link: '/reviews/ulight',
    image: '/uLight controller.png'
  },
  {
    id: 2,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'USA, Alex Smith',
    flag: '/flag.png',
    image: '/miniature.png'
  },
  {
    id: 3,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'Norway, Anna Orlova',
    flag: '/flag3.png',
    image: '/content-box3.png'
  },
  {
    id: 4,
    category: 'uLight controller',
    product: 'uLight controller',
    text: 'Lighting control controller: turn signals, brake light, headlight or LED strip. Easy connection to the controller and the display. If necessary, you can connect to the uLight all the peripherals of..',
    author: 'Germany, Max Stoun',
    flag: '/flag2.png',
    link: '/reviews/ulight',
    image: '/uLight controller.png'
  },
  {
    id: 5,
    category: 'On-board computer',
    product: 'On-board computer',
    text: 'The on-board computer is equipped with the large sunlight resistant screen to display main parameters, driving modes settings, software updates for all system components, battery control, and the ..',
    author: 'France, Robert Jonson',
    flag: '/flag.png',
    image: '/content-box2.png'
  },
  {
    id: 6,
    category: 'Controllers',
    product: 'Nucular controller P24F',
    text: 'A powerful ARM microprocessor provides precise and smooth control of the BLDC motor. The controller settings are widely configured — you can set parameters, power strokes of the gas throttle, ...',
    author: 'USA, Alex Smith',
    flag: '/flag.png',
    image: '/miniature.png'
  },
  {
    id: 7,
    category: 'Controllers',
    product: 'Nucular controller 6F',
    text: 'Small but mighty. Perfect for my light electric scooter. The app connectivity is a game changer for tuning settings on the fly.',
    author: 'UK, John Doe',
    flag: '/flag.png',
    image: '/content-box5.png'
  },
  {
    id: 8,
    category: 'BMS',
    product: 'Nucular BMS',
    text: 'Keeps my battery pack perfectly balanced. The monitoring features give me peace of mind. Robust construction and reliable performance.',
    author: 'Australia, Sarah Connor',
    flag: '/flag2.png',
    image: '/content-box6.png'
  },
  {
    id: 9,
    category: 'On-board computer',
    product: 'On-board computer',
    text: 'The best display on the market. Customizable screens are awesome. It integrates perfectly with the controller.',
    author: 'Italy, Marco Polo',
    flag: '/flag3.png',
    image: '/content-box2.png'
  },
  {
    id: 10,
    category: 'Controllers',
    product: 'Nucular controller 24F',
    text: 'Built like a tank. Handles high currents without overheating. The regenerative braking is very effective and adjustable.',
    author: 'Sweden, Sven Svensson',
    flag: '/flag4.png',
    image: '/miniature.png'
  }
];

export default function Reviews() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All reviews');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 900px)');
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener('change', updateMatch);
    return () => mediaQuery.removeEventListener('change', updateMatch);
  }, []);

  const categories = ['All reviews', 'Controllers', 'On-board computer', 'BMS', 'uLight controller'];

  if (!isMobile) {
    // DESKTOP VERSION
    return (
      <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '40px' }}>
        <Header variant="white" />
        
        <div style={{ width: '100%', maxWidth: '1180px', minHeight: '1570px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'flex-start', paddingTop: '80px', paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box' }}>
          
          {/* Left Sidebar */}
          <div style={{ width: '200px', flexShrink: 0, paddingTop: '0' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 700, margin: '0 0 40px 0', fontFamily: 'var(--font-family)' }}>Reviews</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '40px' }}>
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    fontSize: '16px',
                    fontWeight: selectedCategory === cat ? 700 : 500,
                    color: selectedCategory === cat ? '#F36F25' : '#111',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                    transition: 'color 0.2s'
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
            
            <button style={{
              background: '#F36F25',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '0 20px',
              height: '44px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'var(--font-family)',
              whiteSpace: 'nowrap',
              width: '100%'
            }}>
              Leave feedback
            </button>
          </div>

          {/* Right Content */}
          <div style={{ width: '880px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {selectedCategory === 'All reviews' ? (
              <img src="/отзывы2.svg" alt="All Reviews" style={{ width: '100%', display: 'block' }} />
            ) : selectedCategory === 'Controllers' ? (
              <img src="/отзывы3.svg" alt="Controller Reviews" style={{ width: '100%', display: 'block' }} />
            ) : (
              // Fallback for other categories (using filtered data if needed, or placeholder)
              reviewsData
              .filter(review => review.category === selectedCategory)
              .map((review) => (
              <div key={review.id} style={{
                background: '#F6F6F6',
                borderRadius: '20px',
                padding: '32px',
                display: 'flex',
                gap: '32px',
                alignItems: 'flex-start',
                minHeight: '214px',
                boxSizing: 'border-box'
              }}>
                <div style={{ width: '150px', height: '150px', flexShrink: 0, background: '#fff', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Placeholder for product image - using flag as placeholder for now or add product images */}
                  <img src={review.image} alt={review.product} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                   {/* @ts-ignore */}
                   {review.link ? (
                    /* @ts-ignore */
                    <a href={review.link} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#222', fontFamily: 'var(--font-family)', lineHeight: '1.2' }}>
                        {review.product}
                      </h3>
                    </a>
                  ) : (
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#222', fontFamily: 'var(--font-family)', lineHeight: '1.2' }}>
                      {review.product}
                    </h3>
                  )}
                  <p style={{ fontSize: '14px', color: '#666', margin: '0 0 16px', lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
                    {review.text}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img src={review.flag} alt="Flag" style={{ width: '20px', height: '14px', borderRadius: '2px', objectFit: 'cover' }} />
                    <span style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-family)' }}>{review.author}</span>
                  </div>
                </div>
              </div>
            ))
            )}
            
            {(selectedCategory !== 'All reviews' && selectedCategory !== 'Controllers') && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button style={{
                background: 'transparent',
                border: 'none',
                color: '#F36F25',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: 'var(--font-family)'
              }}>
                Show more
              </button>
            </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  // MOBILE VERSION
  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '40px' }}>
      <Header variant="white" />
      
      <div style={{ padding: '0 20px', paddingTop: '100px' }}>
        
        {/* Header Section: Title and Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '32px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-family)' }}>Reviews</h1>
          <button style={{
            background: '#F36F25',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '0 20px',
            height: '44px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'var(--font-family)',
            whiteSpace: 'nowrap'
          }}>
            Leave feedback
          </button>
        </div>

        {/* Accordion / Dropdown */}
        <div style={{ marginBottom: '24px', position: 'relative' }}>
          <div 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer', 
              fontSize: '18px', 
              fontWeight: 600,
              color: '#111',
              fontFamily: 'var(--font-family)',
              userSelect: 'none'
            }}
          >
            {selectedCategory}
            <svg 
              width="12" height="7" viewBox="0 0 12 7" fill="none" 
              style={{ 
                transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', 
                transition: 'transform 0.3s ease' 
              }}
            >
              <path d="M1 1L6 6L11 1" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div style={{
              marginTop: '12px',
              background: '#fff',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              padding: '8px 0',
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '200px', // Adjusted width so it doesn't span full width unnecessarily
              zIndex: 10
            }}>
              {categories.map((cat) => (
                <div
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setIsMenuOpen(false); }}
                  style={{
                    padding: '12px 20px',
                    fontSize: '16px',
                    color: selectedCategory === cat ? '#F36F25' : '#111',
                    fontWeight: selectedCategory === cat ? 600 : 400,
                    cursor: 'pointer',
                    fontFamily: 'var(--font-family)',
                    background: selectedCategory === cat ? '#fff' : 'transparent'
                  }}
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {reviewsData
            .filter(review => selectedCategory === 'All reviews' || review.category === selectedCategory)
            .map((review) => (
            <div key={review.id} style={{
              background: '#f9f9f9',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              minHeight: '213px', // Match the height from home page if desired, or auto
              justifyContent: 'space-between'
            }}>
              <div>
                {/* @ts-ignore */}
                {review.link ? (
                  /* @ts-ignore */
                  <a href={review.link} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#111', fontFamily: 'var(--font-family)' }}>
                      {review.product}
                    </h3>
                  </a>
                ) : (
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px', color: '#111', fontFamily: 'var(--font-family)' }}>
                    {review.product}
                  </h3>
                )}
                <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
                  {review.text}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <img src={review.flag} alt="Flag" style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
                <span style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-family)' }}>{review.author}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
