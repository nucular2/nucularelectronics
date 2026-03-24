import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Users, FolderTree, LogOut, MessageSquare } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-family)' }}>
      <aside
        style={{
          width: 280,
          background: '#fff',
          borderRight: '1px solid #eaeaea',
          display: 'flex',
          flexDirection: 'column',
          padding: 16,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 8px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: '#111',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              N
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Nucular Admin</div>
              <div style={{ fontWeight: 400, fontSize: 12, color: '#666' }}>Internal</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <NavLink
              to="/admin/dashboard-3"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 10px',
                borderRadius: 12,
                textDecoration: 'none',
                color: isActive ? '#111' : '#555',
                background: isActive ? '#f1f5f9' : 'transparent',
                fontWeight: isActive ? 600 : 500,
              })}
            >
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink
              to="/admin/catalog"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 10px',
                borderRadius: 12,
                textDecoration: 'none',
                color: isActive ? '#111' : '#555',
                background: isActive ? '#f1f5f9' : 'transparent',
                fontWeight: isActive ? 600 : 500,
              })}
            >
              <FolderTree size={18} /> Catalog
            </NavLink>
            <NavLink
              to="/admin/orders"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 10px',
                borderRadius: 12,
                textDecoration: 'none',
                color: isActive ? '#111' : '#555',
                background: isActive ? '#f1f5f9' : 'transparent',
                fontWeight: isActive ? 600 : 500,
              })}
            >
              <ShoppingCart size={18} /> Orders
            </NavLink>
            <NavLink
              to="/admin/reviews"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 10px',
                borderRadius: 12,
                textDecoration: 'none',
                color: isActive ? '#111' : '#555',
                background: isActive ? '#f1f5f9' : 'transparent',
                fontWeight: isActive ? 600 : 500,
              })}
            >
              <MessageSquare size={18} /> Reviews
            </NavLink>
            <NavLink
              to="/admin/customers"
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 10px',
                borderRadius: 12,
                textDecoration: 'none',
                color: isActive ? '#111' : '#555',
                background: isActive ? '#f1f5f9' : 'transparent',
                fontWeight: isActive ? 600 : 500,
              })}
            >
              <Users size={18} /> Customers
            </NavLink>
          </div>
        </nav>

        <button
          onClick={() => void logout()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            height: 44,
            padding: '0 12px',
            borderRadius: 12,
            border: '1px solid #eaeaea',
            background: '#fff',
            cursor: 'pointer',
            color: '#111',
            fontFamily: 'var(--font-family)',
            fontWeight: 600,
          }}
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header
          style={{
            height: 64,
            background: '#fff',
            borderBottom: '1px solid #eaeaea',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontFamily: 'var(--font-family)', color: '#111', fontWeight: 600, fontSize: 14 }}>
            {user?.email ? `Welcome, ${user.email}` : 'Welcome'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                padding: '8px 10px',
                border: '1px solid #eaeaea',
                borderRadius: 999,
                fontSize: 12,
                color: '#666',
                fontWeight: 600,
              }}
            >
              v1
            </div>
          </div>
        </header>

        <div style={{ padding: 20, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
