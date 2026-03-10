import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Users, FolderTree, Settings, LogOut, Package } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '250px', background: '#2c3e50', color: '#fff', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #34495e', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: '#1e91cf', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            N
          </div>
          <span style={{ fontSize: '18px', fontWeight: 600 }}>Nucular Admin</span>
        </div>

        <nav style={{ flex: 1, padding: '20px 0' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li>
              <NavLink 
                to="/admin/dashboard" 
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', color: isActive ? '#fff' : '#b8c7ce', textDecoration: 'none', background: isActive ? '#1e282c' : 'transparent', borderLeft: isActive ? '3px solid #3c8dbc' : '3px solid transparent'
                })}
              >
                <LayoutDashboard size={18} /> Дашборд
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/catalog" 
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', color: isActive ? '#fff' : '#b8c7ce', textDecoration: 'none', background: isActive ? '#1e282c' : 'transparent', borderLeft: isActive ? '3px solid #3c8dbc' : '3px solid transparent'
                })}
              >
                <FolderTree size={18} /> Каталог
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/orders" 
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', color: isActive ? '#fff' : '#b8c7ce', textDecoration: 'none', background: isActive ? '#1e282c' : 'transparent', borderLeft: isActive ? '3px solid #3c8dbc' : '3px solid transparent'
                })}
              >
                <ShoppingCart size={18} /> Заказы
              </NavLink>
            </li>
             <li>
              <NavLink 
                to="/admin/customers" 
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', color: isActive ? '#fff' : '#b8c7ce', textDecoration: 'none', background: isActive ? '#1e282c' : 'transparent', borderLeft: isActive ? '3px solid #3c8dbc' : '3px solid transparent'
                })}
              >
                <Users size={18} /> Клиенты
              </NavLink>
            </li>
          </ul>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #34495e', fontSize: '12px', color: '#7f8c8d' }}>
          v1.0.0 Nucular Admin
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <header style={{ height: '60px', background: '#fff', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px' }}>
          <div style={{ fontWeight: 500, color: '#555' }}>
            Добро пожаловать, {user}
          </div>
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
              <Settings size={20} />
            </button>
            <button 
              onClick={logout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#c0392b', fontWeight: 500 }}
            >
              <LogOut size={18} /> Выход
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div style={{ padding: '30px', overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
