import React, { useEffect, useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Search, Calendar, Download, Eye, Edit2, Trash } from 'lucide-react';
import { supabase } from '../../lib/supabase';

type OrderStatus =
  | 'New'
  | 'Processing'
  | 'Awaiting payment'
  | 'Paid'
  | 'Shipped'
  | 'Awaiting pickup'
  | 'Delivered'
  | 'Canceled';

type PaymentFilter = 'All' | 'Paid' | 'NotPaid' | 'AwaitingPayment';

type DbOrder = {
  id: string;
  user_id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
  recipient_info?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  } | null;
  contacts?: any;
};

function formatDate(value: string) {
  const d = new Date(value);
  return d.toLocaleDateString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

function isPaid(order: DbOrder) {
  if (order.status === 'Paid') return true;
  const status = order?.contacts?.payment?.status || order?.contacts?.crm?.paymentStatuses?.[0];
  return String(status || '').toLowerCase() === 'paid';
}

function paidAt(order: DbOrder) {
  return (
    order?.contacts?.payment?.paidAt ||
    order?.contacts?.crm?.paidAt ||
    order?.contacts?.crm?.fullPaidAt ||
    null
  );
}

function displayOrderNumber(order: DbOrder) {
  const crmNumber = order?.contacts?.crm?.number;
  return crmNumber ? String(crmNumber) : order.id;
}

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<DbOrder[]>([]);

  const filteredOrders = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const startDate = dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null;
    const endDate = dateRange.end ? new Date(dateRange.end + 'T23:59:59') : null;
    return orders.filter((o) => {
      if (term) {
        const hay = [
          o.id,
          o.recipient_info?.firstName,
          o.recipient_info?.lastName,
          o.recipient_info?.email,
          o.recipient_info?.phone,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!hay.includes(term)) return false;
      }
      if (statusFilter !== 'All' && o.status !== statusFilter) return false;
      if (paymentFilter === 'Paid' && !isPaid(o)) return false;
      if (paymentFilter === 'NotPaid' && isPaid(o)) return false;
      if (paymentFilter === 'AwaitingPayment' && o.status !== 'Awaiting payment') return false;
      if (startDate) {
        const created = new Date(o.created_at);
        if (created < startDate) return false;
      }
      if (endDate) {
        const created = new Date(o.created_at);
        if (created > endDate) return false;
      }
      return true;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, dateRange.start, dateRange.end]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('orders')
        .select('id,user_id,created_at,total_amount,status,recipient_info,contacts')
        .order('created_at', { ascending: false })
        .limit(500);
      if (!isMounted) return;
      if (error) {
        setError(error.message);
        setOrders([]);
      } else {
        setOrders((data ?? []) as DbOrder[]);
      }
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel('admin-orders-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const exportToExcel = () => {
    if (filteredOrders.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(
      filteredOrders.map((o) => ({
        id: o.id,
        customer: `${o.recipient_info?.firstName || ''} ${o.recipient_info?.lastName || ''}`.trim(),
        email: o.recipient_info?.email || '',
        phone: o.recipient_info?.phone || '',
        date: formatDate(o.created_at),
        total: o.total_amount,
        status: o.status,
        paid: isPaid(o) ? 'yes' : 'no',
        paidAt: paidAt(o) ? formatDate(paidAt(o)) : '',
      }))
    );
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
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
          >
            <option value="All">Все статусы</option>
            <option value="New">New</option>
            <option value="Processing">Processing</option>
            <option value="Awaiting payment">Awaiting payment</option>
            <option value="Paid">Paid</option>
            <option value="Shipped">Shipped</option>
            <option value="Awaiting pickup">Awaiting pickup</option>
            <option value="Delivered">Delivered</option>
            <option value="Canceled">Canceled</option>
          </select>
        </div>

        <div style={{ width: '220px' }}>
          <label style={{ display: 'block', marginBottom: '8px', color: '#666', fontSize: '14px' }}>Оплата</label>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box' }}
          >
            <option value="All">Все</option>
            <option value="Paid">Оплачено</option>
            <option value="NotPaid">Не оплачено</option>
            <option value="AwaitingPayment">Ожидают оплату</option>
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
        {error && (
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #eee', color: '#c62828' }}>
            {error}
          </div>
        )}
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', color: '#666', fontSize: '14px', textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Заказ</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Клиент</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Дата</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Сумма</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Статус</th>
              <th style={{ padding: '16px 24px', fontWeight: 600 }}>Оплата</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '16px 24px', color: '#1e88e5', fontWeight: 500 }}>{displayOrderNumber(order)}</td>
                  <td style={{ padding: '16px 24px', color: '#333' }}>
                    {`${order.recipient_info?.firstName || ''} ${order.recipient_info?.lastName || ''}`.trim() ||
                      order.recipient_info?.email ||
                      '—'}
                  </td>
                  <td style={{ padding: '16px 24px', color: '#666' }}>{formatDate(order.created_at)}</td>
                  <td style={{ padding: '16px 24px', color: '#333', fontWeight: 600 }}>${Number(order.total_amount || 0).toLocaleString()}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background:
                        order.status === 'Awaiting payment'
                          ? '#fff3e0'
                          : order.status === 'Processing'
                          ? '#e3f2fd'
                          : order.status === 'Shipped' || order.status === 'Delivered' || order.status === 'Paid'
                          ? '#e8f5e9'
                          : order.status === 'Canceled'
                          ? '#ffebee'
                          : '#f1f1f1',
                      color:
                        order.status === 'Awaiting payment'
                          ? '#fb8c00'
                          : order.status === 'Processing'
                          ? '#1e88e5'
                          : order.status === 'Shipped' || order.status === 'Delivered' || order.status === 'Paid'
                          ? '#43a047'
                          : order.status === 'Canceled'
                          ? '#c62828'
                          : '#555',
                      display: 'inline-block',
                      minWidth: '80px',
                      textAlign: 'center'
                    }}>
                      {order.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: '#333' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {isPaid(order) ? (
                        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                          <circle cx="10" cy="10" r="10" fill="#27AE60" />
                          <path
                            d="M5.5 10.2L8.4 13.1L14.7 6.9"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                          <circle cx="10" cy="10" r="10" fill="#999" />
                          <path
                            d="M6.5 6.5L13.5 13.5M13.5 6.5L6.5 13.5"
                            stroke="#fff"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      )}
                      {isPaid(order) ? 'Оплачен' : 'Не оплачен'}
                      {paidAt(order) ? (
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          {formatDate(paidAt(order))}
                        </span>
                      ) : null}
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
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  {loading ? 'Загрузка…' : 'Заказы не найдены'}
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
