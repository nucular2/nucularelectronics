import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { useReviews } from '../context/ReviewsContext';

export default function Reviews() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All reviews');
  const [isMobile, setIsMobile] = useState(false);
  const { reviews } = useReviews();

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
        
        <div style={{ width: '100%', maxWidth: '1180px', minHeight: '1570px', margin: '0 auto', display: 'flex', gap: '60px', alignItems: 'flex-start', paddingTop: '150px', paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box' }}>
          
          {/* Left Sidebar */}
          <div style={{ width: '240px', display: 'flex', flexDirection: 'column', gap: '40px', paddingTop: '0' }}>
            <h1 style={{ fontSize: '40px', fontWeight: 700, margin: '0 0 20px 0', fontFamily: 'var(--font-family)' }}>Reviews</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ fontSize: '16px', fontWeight: selectedCategory === 'All reviews' ? 700 : 500, color: selectedCategory === 'All reviews' ? '#F36F25' : '#111', cursor: 'pointer', fontFamily: 'var(--font-family)' }} onClick={() => setSelectedCategory('All reviews')}>All reviews</div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {categories.filter(cat => cat !== 'All reviews').map((cat) => (
                  <div
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      fontSize: '16px',
                      fontWeight: selectedCategory === cat ? 700 : 500,
                      color: selectedCategory === cat ? '#F36F25' : '#111',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-family)',
                      transition: 'color 0.2s',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {cat}
                  </div>
                ))}
              </div>
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
              width: '160px',
              marginTop: '10px'
            }}>
              Leave feedback
            </button>
          </div>

          {/* Right Content */}
          <div style={{ width: '880px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px', marginLeft: 'auto' }}>
            {reviews
              .filter(review => selectedCategory === 'All reviews' || review.category === selectedCategory)
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
            ))}
            
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
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
            whiteSpace: 'nowrap',
            width: '100%'
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
              justifyContent: 'space-between',
              alignItems: 'center', 
              gap: '8px', 
              cursor: 'pointer', 
              fontSize: '16px', 
              fontWeight: 700,
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
              width: '100%', 
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
          {reviews
            .filter(review => selectedCategory === 'All reviews' || review.category === selectedCategory)
            .map((review) => (
            <div key={review.id} style={{
              background: '#f9f9f9',
              borderRadius: '20px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}>
              <div style={{ width: '100px', height: '100px', background: '#fff', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' }}>
                <img src={review.image} alt={review.product} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* @ts-ignore */}
                {review.link ? (
                  /* @ts-ignore */
                  <a href={review.link} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#111', fontFamily: 'var(--font-family)' }}>
                      {review.product}
                    </h3>
                  </a>
                ) : (
                  <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#111', fontFamily: 'var(--font-family)' }}>
                    {review.product}
                  </h3>
                )}
                <p style={{ fontSize: '14px', color: '#666', margin: 0, lineHeight: '1.5', fontFamily: 'var(--font-family)' }}>
                  {review.text}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={review.flag} alt="Flag" style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
                  <span style={{ fontSize: '14px', color: '#999', fontFamily: 'var(--font-family)' }}>{review.author}</span>
                </div>
              </div>
            </div>
          ))}
          
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
        </div>

      </div>
    </div>
  );
}
