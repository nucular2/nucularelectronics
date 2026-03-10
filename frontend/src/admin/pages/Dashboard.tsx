import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShoppingCart, Users, Package, CreditCard } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: '#333' }}>Дашборд</h1>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#e3f2fd', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1e88e5' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Посещений (30 дней)</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>0</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43a047' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Заказов всего</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>0</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#fff3e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb8c00' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Общая выручка</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>$0</div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#f3e5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e24aa' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Средний чек</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>$0</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        
        {/* Visits Chart */}
        <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginBottom: '20px', color: '#555', fontSize: '18px' }}>Динамика посещений</h3>
          <div style={{ height: '300px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
            Нет данных для отображения
          </div>
        </div>

      </div>

      {/* Recent Orders Table */}
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#555', fontSize: '18px' }}>Последние заказы</h3>
          <button style={{ background: 'none', border: '1px solid #ddd', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}>Показать все</button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', color: '#666', fontSize: '14px', textAlign: 'left' }}>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>ID Заказа</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Клиент</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Дата</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Сумма</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Статус</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                Заказы отсутствуют
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
