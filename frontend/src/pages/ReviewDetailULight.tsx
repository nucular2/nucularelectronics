import Header from "../components/Header";
import { Link } from "react-router-dom";

export default function ReviewDetailULight() {
  return (
    <>
      <Header variant="white" />
      <div className="page-content-white" style={{ paddingTop: '80px' }}>
        <div className="news-detail" style={{ maxWidth: '800px', margin: '0 auto', padding: '10px 20px 80px' }}>
          <div className="news-detail-breadcrumb" style={{ marginBottom: '20px' }}>
            <Link to="/reviews" className="news-detail-back" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#111', fontSize: '14px', fontWeight: 500 }}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7657 5.22781C15.0781 5.53155 15.0781 6.02401 14.7657 6.32775L8.93137 12L14.7657 17.6723C15.0781 17.976 15.0781 18.4685 14.7657 18.7722C14.4533 19.0759 13.9467 19.0759 13.6343 18.7722L7.23431 12.55C6.92189 12.2462 6.92189 11.7538 7.23431 11.45L13.6343 5.22781C13.9467 4.92406 14.4533 4.92406 14.7657 5.22781Z"
                  fill="#222222"
                />
              </svg>
              <span>Back to reviews</span>
            </Link>
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: 700, margin: '0 0 24px', color: '#111', fontFamily: 'var(--font-family)' }}>uLight controller</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', fontSize: '16px', color: '#999', fontFamily: 'var(--font-family)' }}>
            <span>June 20, 2022</span>
            <div style={{ width: '1px', height: '16px', background: '#e0e0e0' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <img src="/flag2.png" alt="Germany" style={{ width: '24px', height: '16px', borderRadius: '2px', objectFit: 'cover' }} />
              <span>Germany, Max Stoun</span>
            </div>
          </div>

          <div style={{ fontSize: '18px', lineHeight: '1.6', color: '#111', fontFamily: 'var(--font-family)' }}>
            <p style={{ marginBottom: '24px' }}>
              After 12 months of development and launch production, we present you with a new controller — Nucular P24F, which replaced the previous version of the 24F controller. Taking into account our experience and, of course, your experience, we have revised the approach to the design of the device. The new P24F has been designed from scratch and features a completely different design that offers many benefits.
            </p>
            <p style={{ marginBottom: '40px' }}>
              Let's start with the main thing — mounting the controller on the bike has become easier and more convenient due to the absence of wires. We also developed two models of mounting the controller on a plane — a regular one, and with the possibility of installing two fans for cooling. We made the files of both mounts publicly available and you can print them on a 3D printer. A simplified model of the controller case will also be available. We hope this helps you design and build your ebike.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginTop: '40px' }}>
            <div style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '20px', overflow: 'hidden' }}>
              <img src="/miniature20.svg" alt="Detail 1" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '20px', overflow: 'hidden' }}>
              <img src="/cover26.svg" alt="Detail 2" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '20px', overflow: 'hidden' }}>
              <img src="/cover21.svg" alt="Detail 3" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ aspectRatio: '1/1', background: '#f9f9f9', borderRadius: '20px', overflow: 'hidden' }}>
              <img src="/miniature20.svg" alt="Detail 4" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
