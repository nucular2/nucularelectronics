import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

export default function UpdatePassword() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      // If accessed directly without login, redirect to login
      // But if it's a recovery flow (magic link), user might be logged in via that link
      // For now, assume dashboard usage. 
      // If recovery flow, the user is logged in automatically by the link.
      // So checking !user is correct.
      navigate('/login?redirect=/update-password');
    }
  }, [user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 7) {
      setError('Password must be at least 7 characters long.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // 1. Verify old password (optional but requested by UI)
      if (user?.email) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: oldPassword,
        });

        if (signInError) {
          throw new Error("Incorrect old password.");
        }
      }

      // 2. Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err: any) {
      setError(err.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  const toggleIcon = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const toggleIconOff = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
       <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.11 1 12C2.73 7.89 7 4 12 4C13.6 4 15.11 4.39 16.46 5.09L17.94 17.94ZM9.9 4.24L2.5 11.64" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M1 1L23 23" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <>
      <Header variant="white" />
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-layout">
            <aside className="orders-sidebar">
              <div className="orders-sidebar-title">Orders</div>
              <nav className="orders-nav">
                <button className="orders-nav-item" onClick={() => navigate("/orders")}>Orders</button>
                <button className="orders-nav-item" onClick={() => navigate("/profile")}>
                  User info
                </button>
                <button className="orders-nav-item active">
                  Password
                </button>
                <button className="orders-nav-item logout" onClick={handleSignOut}>
                  Log out
                </button>
              </nav>
            </aside>

            <main className="orders-content">
              <h1 className="orders-title">Password</h1>

              <div className="password-form-container">
                <div className="password-header-row">
                    <span className="password-label">Password</span>
                    <button className="user-info-edit-btn cancel" onClick={() => {
                        setOldPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                        setError(null);
                        setSuccess(false);
                    }}>Cancel</button>
                </div>

                {error && <div className="auth-error" style={{marginBottom: '16px'}}>{error}</div>}
                {success && <div className="auth-success" style={{color: 'green', marginBottom: '16px'}}>Password updated successfully.</div>}

                <form onSubmit={handleUpdatePassword} className="password-form">
                  <div className="password-input-wrapper">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      placeholder="Old password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="user-info-input" // Reuse style
                      required
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => setShowOldPassword(!showOldPassword)}>
                      {showOldPassword ? toggleIconOff : toggleIcon}
                    </button>
                  </div>

                  <div className="password-input-wrapper">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="user-info-input"
                      required
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => setShowNewPassword(!showNewPassword)}>
                      {showNewPassword ? toggleIconOff : toggleIcon}
                    </button>
                  </div>
                  
                  <div className="password-hint">Password must contain at least 7 characters</div>

                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="New password again"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="user-info-input"
                      required
                    />
                    <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                      {showConfirmPassword ? toggleIconOff : toggleIcon}
                    </button>
                  </div>

                  <button type="submit" className="user-info-save-btn" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </button>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
