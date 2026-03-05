import { useEffect, useState } from "react";
import Header from "../components/Header";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 900px)");
    const updateMatch = () => setIsMobile(mediaQuery.matches);
    updateMatch();
    mediaQuery.addEventListener("change", updateMatch);
    return () => mediaQuery.removeEventListener("change", updateMatch);
  }, []);

  // Styles for Mobile View
  const controllersSectionStyle = { overflowX: "auto" as const };
  const controllersGridStyle = {
    display: "flex",
    flexWrap: "nowrap" as const,
    gap: "16px",
    overflowX: "auto" as const,
    overflowY: "hidden" as const,
    padding: "0 16px 12px",
    scrollSnapType: "x mandatory",
    WebkitOverflowScrolling: "touch" as const,
    width: "max-content",
  };
  const controllerCardStyle = {
    flex: "0 0 280px",
    width: "280px",
    maxWidth: "280px",
    height: "373px",
    padding: "20px",
    borderRadius: "20px",
    scrollSnapAlign: "start",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "flex-start",
    textAlign: "left" as const,
  };
  const cardImageContainerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    height: "200px",
    marginBottom: "16px",
    paddingRight: "0",
    width: "100%",
  };
  const cardTextBlockStyle = {
    marginTop: "auto",
    width: "100%",
  };
  const cardImageStyle = {
    width: "220px",
    height: "220px",
    objectFit: "contain" as const,
  };
  const cardLinkStyle = { marginTop: "8px" };
  const cardActionsStyle = {
    marginTop: "12px",
    justifyContent: "flex-start",
    gap: "12px",
    width: "100%",
  };

  return (
    <div className={isMobile ? "home-mobile" : undefined}>
      <Header />
      
      {!isMobile ? (
        // DESKTOP VIEW (SVG Overlay)
        <div style={{ position: 'relative', width: '100%', maxWidth: '1680px', margin: '0 auto' }}>
          
          {/* Main Content Wrapper - Shifted down to create distance */}
          <div style={{ position: 'relative', top: '1080px' }}>
            <img 
              src="/Main.svg" 
              alt="Nucular Electronics" 
              style={{ width: '100%', display: 'block', height: 'auto' }} 
            />
            
            {/* Button 1: Buy P24F (approx x=282, y=668, w=75, h=44) */}
            <a 
              href="/cart" 
              style={{ position: 'absolute', left: '16.78%', top: '8.73%', width: '4.46%', height: '0.57%', cursor: 'pointer', zIndex: 10 }} 
              aria-label="Buy Nucular controller P24F"
            />
            
            {/* Button 2: Preorder 12F HE (approx x=682, y=668, w=110, h=44) */}
            <a 
              href="#" 
              style={{ position: 'absolute', left: '40.59%', top: '8.73%', width: '6.55%', height: '0.57%', cursor: 'pointer', zIndex: 10 }} 
              aria-label="Preorder Nucular controller 12F HE"
            />

            {/* Button 3: Preorder 6F HE (approx x=1082, y=668, w=110, h=44) */}
            <a 
              href="#" 
              style={{ position: 'absolute', left: '64.40%', top: '8.73%', width: '6.55%', height: '0.57%', cursor: 'pointer', zIndex: 10 }} 
              aria-label="Preorder Nucular controller 6F HE"
            />

            {/* Accessory 1 Buy (approx x=430.5, y=1060, w=75, h=44) */}
            <a 
              href="/cart" 
              style={{ position: 'absolute', left: '25.62%', top: '13.85%', width: '4.46%', height: '0.57%', cursor: 'pointer', zIndex: 10 }} 
              aria-label="Buy On-board computer"
            />

            {/* Accessory 2 Buy (approx x=1102.5, y=1108, w=75, h=44) */}
            <a 
              href="/cart" 
              style={{ position: 'absolute', left: '65.62%', top: '14.48%', width: '4.46%', height: '0.57%', cursor: 'pointer', zIndex: 10 }} 
              aria-label="Buy Accessory"
            />
          </div>

          {/* Black Spacer to cover the gap/top of Main.svg */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '1080px', // Covers the initial part of the page under the hero
            backgroundColor: '#000',
            zIndex: 1
          }} />
          
          {/* Restore First Picture (Hero) */}
          <img 
            src="/first.png" 
            alt="Hero"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100vw',
              maxWidth: 'none',
              paddingBottom: '50px',
              zIndex: 5 
            }} 
          />
        </div>
      ) : (
        // MOBILE VIEW (SVG Overlay)
        <div style={{ position: 'relative', width: '100%', overflowX: 'hidden' }}>
          <img 
            src="/моб1версия.svg" 
            alt="Nucular Mobile" 
            style={{ width: '100%', display: 'block', height: 'auto' }} 
          />
          
          {/* Mobile Overlay Buttons - Placeholder Positions */}
          {/* Button 1: Buy (First card) */}
          <a 
            href="/cart" 
            style={{ 
              position: 'absolute', 
              left: '5%', 
              top: '20%', // Estimate
              width: '40%', 
              height: '50px', 
              cursor: 'pointer', 
              zIndex: 10 
            }} 
            aria-label="Buy"
          />
           {/* Button 2: Buy (Second card?) */}
           <a 
            href="/cart" 
            style={{ 
              position: 'absolute', 
              left: '50%', 
              top: '20%', // Estimate
              width: '40%', 
              height: '50px', 
              cursor: 'pointer', 
              zIndex: 10 
            }} 
            aria-label="Buy"
          />
        </div>
      )}
    </div>
  );
}
