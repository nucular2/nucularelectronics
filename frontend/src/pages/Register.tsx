import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedPolicy) {
      setError('You must accept the privacy policy to register.');
      return;
    }
    if (password.length < 7) {
      setError('Password must be at least 7 characters long.');
      return;
    }

    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Depending on Supabase settings, email confirmation might be required.
      // If auto-confirm is on, we can redirect to login or profile.
      // For now, let's redirect to login with a message or profile if session is established.
      navigate('/login');
    }
  };

  return (
    <>
      <Header variant="white" />
      <div className="auth-page">
        <div className="auth-container">
          <h1 className="auth-title">Registration</h1>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleRegister} className="auth-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
                required
              />
            </div>
            
            <div className="form-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

            <div className="form-group checkbox-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-label">
                  By creating an account you accept our <Link to="/privacy-policy" className="highlight">Privacy policy</Link>
                </span>
              </label>
            </div>

            <button type="submit" className="auth-button" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link highlight">Sign in</Link>
          </div>
        </div>
      </div>
    </>
  );
}
