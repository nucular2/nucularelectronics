import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we have a session (the link from email should log the user in automatically)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If no session, maybe the link is invalid or expired
        setError('Invalid or expired password reset link.');
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 7) {
      setError('Password must be at least 7 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/profile'); // or login
    }
  };

  return (
    <>
      <Header variant="white" />
      <div className="auth-page">
        <div className="auth-container">
          <h1 className="auth-title">Password recovery</h1>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleUpdatePassword} className="auth-form">
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.11 1 12C2.73 7.89 7 4 12 4C13.6 4 15.11 4.39 16.46 5.09L17.94 17.94ZM9.9 4.24L2.5 11.64" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1L23 23" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
             <div className="form-hint">Password must contain at least 7 characters</div>

             <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password again"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.11 1 12C2.73 7.89 7 4 12 4C13.6 4 15.11 4.39 16.46 5.09L17.94 17.94ZM9.9 4.24L2.5 11.64" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M1 1L23 23" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
