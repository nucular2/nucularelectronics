import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Users, FolderTree, LogOut, MessageSquare, Newspaper } from 'lucide-react';
import '../admin.css';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="admin-shell">
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
