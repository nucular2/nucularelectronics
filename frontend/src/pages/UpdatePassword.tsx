import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';

export default function UpdatePassword() {
  const { session, user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(min-width: 1024px)").matches;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [passwordUpdatedAt, setPasswordUpdatedAt] = useState<Date | null>(null);

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
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setIsDesktop(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!session?.user) {
      navigate('/login?redirect=/update-password');
    }
  }, [authLoading, session?.user, navigate]);

  useEffect(() => {
    if (user?.updated_at) {
      const parsed = new Date(user.updated_at);
      if (!Number.isNaN(parsed.getTime())) {
        setPasswordUpdatedAt(parsed);
        return;
      }
    }
    try {
      const raw = localStorage.getItem("design_password_updated_at_v1");
      if (raw) {
        const parsed = new Date(raw);
        if (!Number.isNaN(parsed.getTime())) {
          setPasswordUpdatedAt(parsed);
        }
      }
    } catch (_) {}
  }, [user?.updated_at]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const resetEditState = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError(null);
    setSuccess(false);
    setShowOldPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const formatRelativeTime = (date: Date) => {
    const diffMs = date.getTime() - Date.now();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

    if (Math.abs(diffDays) < 30) {
      return rtf.format(diffDays, "day");
    }

    const diffMonths = Math.round(diffDays / 30);
    if (Math.abs(diffMonths) < 12) {
      return rtf.format(diffMonths, "month");
    }

    const diffYears = Math.round(diffMonths / 12);
    return rtf.format(diffYears, "year");
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill out this field.');
      return;
    }
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
      const now = new Date();
      setPasswordUpdatedAt(now);
      if (!user) {
        try {
          localStorage.setItem("design_password_updated_at_v1", now.toISOString());
        } catch (_) {}
      }
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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const toggleIconOff = (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              <div className="orders-mobile-bar">
                <button className="orders-mobile-link" onClick={() => navigate("/orders")}>Orders</button>
                <button className="orders-mobile-link" onClick={() => navigate("/profile")}>User info</button>
                <button className="orders-mobile-link active">Password</button>
                <button className="orders-mobile-link logout" onClick={handleSignOut}>Log out</button>
              </div>
              <h1 className="orders-title">Password</h1>

              <div className="password-form-container">
                {!isDesktop || isEditing ? (
                  <>
                    <div className="password-header-row">
                      <span className="password-label">Password</span>
                      <button
                        className="user-info-edit-btn cancel"
                        onClick={() => {
                          resetEditState();
                          if (isDesktop) setIsEditing(false);
                        }}
                      >
                        Cancel
                      </button>
                    </div>

                    {error && <div className="inline-error" style={{marginBottom: '16px'}}>{error}</div>}
                    {success && <div className="auth-success" style={{color: 'green', marginBottom: '16px'}}>Password updated successfully.</div>}

                    <form noValidate onSubmit={handleUpdatePassword} className="password-form">
                      <div className="password-input-wrapper">
                        <input
                          type={showOldPassword ? "text" : "password"}
                          placeholder="Old password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          className="user-info-input"
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
                        />
                        <button type="button" className="password-toggle-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? toggleIconOff : toggleIcon}
                        </button>
                      </div>

                      <button type="submit" className="user-info-save-btn" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="password-view-row">
                    <div className="password-view-left">
                      <div className="password-label">Password</div>
                      <div className="password-last-updated">
                        last updated{" "}
                        {passwordUpdatedAt ? formatRelativeTime(passwordUpdatedAt) : "2 months ago"}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="password-update-btn"
                      onClick={() => setIsEditing(true)}
                    >
                      Update
                    </button>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
