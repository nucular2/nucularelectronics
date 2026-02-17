import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (!user) {
    return (
      <>
        <Header variant="white" />
        <div className="auth-page">
          <div className="auth-container">
             <p>Please log in to view your profile.</p>
             <button className="auth-button" onClick={() => navigate('/login')}>Sign In</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header variant="white" />
      <div className="auth-page">
        <div className="auth-container" style={{ maxWidth: '800px', textAlign: 'left' }}>
          <h1 className="auth-title">My Profile</h1>
          
          <div className="profile-section" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '16px', color: '#333' }}>Account Details</h2>
            <div style={{ backgroundColor: '#f9f9f9', padding: '24px', borderRadius: '8px' }}>
              <p style={{ marginBottom: '8px' }}><strong>Email:</strong> {user.email}</p>
              {user.user_metadata?.full_name && (
                <p style={{ marginBottom: '8px' }}><strong>Name:</strong> {user.user_metadata.full_name}</p>
              )}
              <p style={{ marginBottom: '8px' }}><strong>User ID:</strong> {user.id}</p>
            </div>
          </div>

          <button className="auth-button" onClick={handleSignOut} style={{ maxWidth: '200px' }}>
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
