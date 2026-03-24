import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../admin.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.ok) {
      navigate('/admin');
    } else {
      setError(result.message || 'Неверный логин или пароль');
    }
  };

  return (
    <div className="admin-login-shell">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center' }}>
          <h2 className="admin-login-title">Административная панель</h2>
          <p className="admin-login-subtitle">Вход в систему</p>
        </div>
        
        {error && (
          <div className="admin-alert">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: 20 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 12, fontWeight: 600 }} className="admin-muted">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-input"
              required
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
              required
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
