import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check local storage on mount
    const storedAuth = localStorage.getItem('admin_auth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
      setUser('Дмитрий');
    }
  }, []);

  const login = (username: string, pass: string) => {
    // Fixed credentials as requested
    if (username === 'дмитрий' && pass === '123456') {
      setIsAuthenticated(true);
      setUser('Дмитрий');
      localStorage.setItem('admin_auth', 'true');
      console.log(`[Admin Log] Login successful: ${username} at ${new Date().toISOString()}`);
      return true;
    }
    console.warn(`[Admin Log] Login failed: ${username} at ${new Date().toISOString()}`);
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('admin_auth');
    console.log(`[Admin Log] Logout: ${user} at ${new Date().toISOString()}`);
    navigate('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);

  return isAuthenticated ? <>{children}</> : null;
};
