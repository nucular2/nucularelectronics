import React, { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Users, FolderTree, LogOut, MessageSquare, Newspaper, Home as HomeIcon, Moon, Sun, Image as ImageIcon } from 'lucide-react';
import '../admin.css';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window === 'undefined') return 'dark';
    return window.localStorage.getItem('admin_theme') === 'light' ? 'light' : 'dark';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('admin_theme', theme);
  }, [theme]);

  return (
    <div className={theme === 'light' ? 'admin-shell admin-shell--light' : 'admin-shell'}>
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-left">
            <div className="admin-brand-badge">N</div>
            <div className="admin-brand-name">
              <div className="admin-brand-title">Nucular Admin</div>
              <div className="admin-brand-subtitle">Internal</div>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
          <NavLink
            to="/admin/catalog"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <FolderTree size={18} /> Catalog
          </NavLink>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <ShoppingCart size={18} /> Orders
          </NavLink>
          <NavLink
            to="/admin/reviews"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <MessageSquare size={18} /> Reviews
          </NavLink>
          <NavLink
            to="/admin/news"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <Newspaper size={18} /> News
          </NavLink>
          <NavLink
            to="/admin/home"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <HomeIcon size={18} /> Home
          </NavLink>
          <NavLink
            to="/admin/shop"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <ImageIcon size={18} /> Shop banners
          </NavLink>
          <NavLink
            to="/admin/customers"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <Users size={18} /> Customers
          </NavLink>
        </nav>

        <button
          onClick={() => void logout()}
          className="admin-logout"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-text">
            {user?.email ? `Welcome, ${user.email}` : 'Welcome'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              type="button"
              className="admin-button"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              style={{ width: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="admin-badge">v1</div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
