import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search, Calendar, Download, Eye, Edit2, Trash } from 'lucide-react';

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // No orders for now
  const filteredOrders: any[] = [];

  const exportToExcel = () => {
    if (filteredOrders.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(filteredOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(data, `orders_${new Date().toISOString()}.xlsx`);
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px', color: '#333' }}>Управление заказами</h1>

      {/* Filters */}
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'end' }}>
        
        <div style={{ flex: 1, minWidth: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' }}>Поиск</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
            <input 
              type="text" 
              placeholder="Номер заказа, имя клиента..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '10px 10px 10px 40px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <div style={{ width: '200px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' }}>Статус</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
          >
            <option value="All">Все статусы</option>
            <option value="Pending">Ожидает</option>
            <option value="Processing">В обработке</option>
            <option value="Shipped">Отправлен</option>
            <option value="Delivered">Доставлен</option>
            <option value="Cancelled">Отменен</option>
          </select>
        </div>

        <div style={{ width: '300px', display: 'flex', gap: '8px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' }}>От</label>
            <input 
              type="date" 
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' }}>До</label>
            <input 
              type="date" 
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button 
          onClick={exportToExcel}
          disabled={filteredOrders.length === 0}
          style={{ background: filteredOrders.length === 0 ? '#ccc' : '#2ecc71', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: filteredOrders.length === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, height: '40px' }}
        >
          <Download size={18} /> Экспорт
        </button>
      </div>

      {/* Orders Table */}
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', color: '#666', fontSize: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Заказ</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Клиент</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Дата</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Сумма</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Статус</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '16px 24px', color: '#1e88e5', fontWeight: 500 }}>{order.id}</td>
                  <td style={{ padding: '16px 24px', color: '#333' }}>{order.customer}</td>
                  <td style={{ padding: '16px 24px', color: '#666' }}>{order.date}</td>
                  <td style={{ padding: '16px 24px', color: '#333', fontWeight: 600 }}>${order.total.toLocaleString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: order.status === 'Pending' ? '#fff3e0' : order.status === 'Processing' ? '#e3f2fd' : order.status === 'Shipped' ? '#e8f5e9' : '#ffebee',
                      color: order.status === 'Pending' ? '#fb8c00' : order.status === 'Processing' ? '#1e88e5' : order.status === 'Shipped' ? '#43a047' : '#c62828',
                      display: 'inline-block',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button title="Просмотр" style={{ background: '#3498db', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                        <Eye size={16} />
                      </button>
                      <button title="Редактировать" style={{ background: '#f39c12', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button title="Удалить" style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '8px', borderRadius: '4px', cursor: 'pointer' }}>
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  Заказы не найдены
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
