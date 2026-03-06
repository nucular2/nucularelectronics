import Header from '../components/Header';

export default function ReviewDetail() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh', paddingBottom: '40px' }}>
      <Header variant="white" />
      <div style={{ paddingTop: '80px', width: '100%', overflowX: 'hidden', display: 'flex', justifyContent: 'center' }}>
        <img 
          src="/отзывы9.svg" 
          alt="Review Detail" 
          style={{ width: '100%', maxWidth: '414px', height: 'auto', display: 'block' }} 
        />
      </div>
    </div>
  );
}
