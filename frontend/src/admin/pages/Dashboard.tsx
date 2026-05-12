import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Users, Package, CreditCard } from 'lucide-react';
import { getSupabaseAccessTokenOrThrow } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

type OrderStatus =
  | 'New'
  | 'Processing'
  | 'Awaiting payment'
  | 'Paid'
  | 'Shipped'
  | 'Awaiting pickup'
  | 'Delivered'
  | 'Canceled';

type DbOrder = {
  id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
  recipient_info?: { firstName?: string; lastName?: string; email?: string } | null;
  contacts?: any;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  return d.toLocaleString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

function displayOrderNumber(order: DbOrder) {
  const crmNumber = order?.contacts?.crm?.number;
  if (crmNumber) return String(crmNumber);
  const id = typeof order?.id === 'string' ? order.id : '';
  return id.includes('-') ? id.split('-')[0].toUpperCase() : id;
}

const Dashboard: React.FC = () => {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState(0);
  const [paidOrders, setPaidOrders] = useState(0);
  const [awaitingPaymentOrders, setAwaitingPaymentOrders] = useState(0);
  const [paidRevenue, setPaidRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState<DbOrder[]>([]);

  const averageCheck = useMemo(() => {
    if (paidOrders <= 0) return 0;
    return paidRevenue / paidOrders;
  }, [paidRevenue, paidOrders]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let token = '';
        try {
          token = await getSupabaseAccessTokenOrThrow();
        } catch {
          await logout();
          return;
        }
        const r = await fetch('/api/admin/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({}),
        });
        if (r.status === 401 || r.status === 403) {
          await logout();
          return;
        }
        const payload = await r.json();
        if (!r.ok) {
          setError(payload?.message || 'Ошибка загрузки');
          return;
        }
        if (!isMounted) return;
        setTotalOrders(payload?.totalOrders || 0);
        setPaidOrders(payload?.paidOrders || 0);
        setAwaitingPaymentOrders(payload?.awaitingPaymentOrders || 0);
        setPaidRevenue(payload?.paidRevenue || 0);
        setRecentOrders((payload?.recentOrders ?? []) as DbOrder[]);
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    const t = window.setInterval(() => load(), 15000);

    return () => {
      isMounted = false;
      window.clearInterval(t);
    };
  }, []);

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
            <div style={{ fontSize: '14px', color: '#666' }}>Ожидают оплату</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {loading ? '…' : awaitingPaymentOrders}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#e8f5e9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#43a047' }}>
            <ShoppingCart size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Заказов всего</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {loading ? '…' : totalOrders}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#fff3e0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fb8c00' }}>
            <CreditCard size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Оплачено</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {loading ? '…' : paidOrders}
            </div>
          </div>
        </div>

        <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '50px', height: '50px', background: '#f3e5f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8e24aa' }}>
            <Package size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', color: '#666' }}>Средний чек</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              ${loading ? '…' : averageCheck.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, color: '#555', fontSize: '18px' }}>Последние заказы</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {error ? <span style={{ color: '#c62828', fontSize: '14px' }}>{error}</span> : null}
            <div style={{ fontSize: '12px', color: '#999' }}>Обновляется автоматически</div>
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', color: '#666', fontSize: '14px', textAlign: 'left' }}>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>ID Заказа</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Клиент</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Дата</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Сумма</th>
              <th style={{ padding: '12px 20px', fontWeight: 600 }}>Статус</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.length > 0 ? (
              recentOrders.map((o) => (
                <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 20px', fontWeight: 600, color: '#1e88e5' }}>{displayOrderNumber(o)}</td>
                  <td style={{ padding: '12px 20px', color: '#333' }}>
                    {`${o.recipient_info?.firstName || ''} ${o.recipient_info?.lastName || ''}`.trim() ||
                      o.recipient_info?.email ||
                      '—'}
                  </td>
                  <td style={{ padding: '12px 20px', color: '#666' }}>{formatDateTime(o.created_at)}</td>
                  <td style={{ padding: '12px 20px', color: '#333', fontWeight: 600 }}>${Number(o.total_amount || 0).toFixed(2)}</td>
                  <td style={{ padding: '12px 20px', color: '#333' }}>{o.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                  {loading ? 'Загрузка…' : 'Заказы отсутствуют'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
