import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';

interface AuthContextType {
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const adminEmails = useMemo(() => {
    const raw = (import.meta.env.VITE_ADMIN_EMAILS as string | undefined) || '';
    const emails = raw
      .split(/[,\s;]+/g)
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    return new Set(emails);
  }, []);

  const isAdmin = (u: User | null) => {
    if (!u?.email) return false;
    if (adminEmails.size === 0 && import.meta.env.DEV) return true;
    return adminEmails.has(u.email.toLowerCase());
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      const nextUser = data.session?.user ?? null;
      setUser(nextUser);
      setIsAuthenticated(isAdmin(nextUser));
      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      const nextUser = session?.user ?? null;
      setUser(nextUser);
      setIsAuthenticated(isAdmin(nextUser));
      setLoading(false);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) {
      setLoading(false);
      return false;
    }
    const nextUser = data.user ?? null;
    const ok = isAdmin(nextUser);
    if (!ok) {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
    setUser(nextUser);
    setIsAuthenticated(true);
    setLoading(false);
    return true;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ loading, isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated) {
      navigate('/admin/login', { state: { from: location } });
    }
  }, [isAuthenticated, loading, navigate, location]);

  return !loading && isAuthenticated ? <>{children}</> : null;
};
