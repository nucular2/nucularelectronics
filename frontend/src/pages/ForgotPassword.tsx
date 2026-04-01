import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please fill out this field.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <>
      <Header variant="white" />
      <div className="auth-page">
        <div className="auth-container">
          <h1 className="auth-title">Password recovery</h1>
          
          <p className="auth-description">
            Enter the email address associated with your account, and we'll email you a link to reset your password.
          </p>

          {success && (
            <div className="auth-success-toast">
              <div className="toast-content">
                We have sent a link to reset your password to your E-mail
              </div>
              <button className="toast-close" onClick={() => setSuccess(false)}>×</button>
            </div>
          )}

          {error && (
            <div className="auth-error">
              <div className="toast-content">{error}</div>
              <button className="toast-close" onClick={() => setError(null)}>
                ×
              </button>
            </div>
          )}
          
          <form noValidate onSubmit={handleRecover} className="auth-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
            
            <button type="submit" className={`auth-button ${loading ? 'is-loading' : ''}`} disabled={loading}>
              Recover
            </button>
          </form>

          <div className="auth-footer center">
            <Link to="/login" className="auth-link highlight">I remember the password</Link>
          </div>
        </div>
      </div>
    </>
  );
}
