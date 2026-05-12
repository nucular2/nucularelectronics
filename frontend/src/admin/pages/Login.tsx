import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import '../admin.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('admin_theme') === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('admin_theme', theme);
  }, [theme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Заполните поле');
      return;
    }
    try {
      const result = await login(email, password);
      if (result.ok) {
        navigate('/admin');
      } else {
        setError(result.message || 'Неверный логин или пароль');
      }
    } catch (e: any) {
      setError(e?.message || 'Неверный логин или пароль');
    }
  };

  return (
    <div className={theme === 'light' ? 'admin-login-shell admin-login-shell--light' : 'admin-login-shell'}>
      <div className="admin-login-card">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="admin-button"
            onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
            style={{ width: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 10 }}>
          <h2 className="admin-login-title">Административная панель</h2>
          <p className="admin-login-subtitle">Вход в систему</p>
        </div>
        
        {error && (
          <div className="admin-alert">{error}</div>
        )}

        <form noValidate onSubmit={handleSubmit}>
          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 600 }} className="admin-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
            />
          </div>
          
          <div style={{ marginTop: 16 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 600 }} className="admin-muted">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="admin-primary"
            style={{ marginTop: 20 }}
          >
            Войти
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
