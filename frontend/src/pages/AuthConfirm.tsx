import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { supabase } from '../lib/supabase';

export default function AuthConfirm() {
  const [status, setStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [message, setMessage] = useState<string>('Confirming your account…');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Supabase will set the session when coming from email link.
    // We just check the session and show a friendly message.
    const run = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setStatus('success');
          setMessage('Your email has been confirmed. Welcome!');
          // Optionally redirect after a short delay
          setTimeout(() => navigate('/orders'), 2000);
        } else {
          // If no session, try to refresh (in case hash params exist)
          const { data, error } = await supabase.auth.refreshSession();
          if (data?.session?.user) {
            setStatus('success');
            setMessage('Your email has been confirmed. Welcome!');
            setTimeout(() => navigate('/orders'), 2000);
          } else {
            setStatus('error');
            setMessage('Confirmation link is invalid or expired. Please log in or request a new link.');
          }
        }
      } catch (e: any) {
        setStatus('error');
        setMessage(e?.message || 'Confirmation failed. Please try logging in.');
      }
    };
    run();
  }, [navigate, location]);

  return (
    <>
      <Header variant="white" />
      <div style={{ maxWidth: 640, margin: '80px auto', textAlign: 'center', fontFamily: 'var(--font-family)' }}>
        <h1 style={{ marginBottom: 16 }}>Email confirmation</h1>
        <p style={{ color: status === 'error' ? '#c00' : '#222' }}>{message}</p>
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '10px 20px', borderRadius: 8, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
          >
            Go to login
          </button>
        </div>
      </div>
    </>
  );
}
