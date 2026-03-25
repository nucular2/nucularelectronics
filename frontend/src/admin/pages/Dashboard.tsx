import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Users, Package, CreditCard } from 'lucide-react';
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

type DbOrder = {
  id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
  recipient_info?: { firstName?: string; lastName?: string; email?: string } | null;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  return d.toLocaleString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
}

const Dashboard: React.FC = () => {
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

      const [{ count: totalCount, error: totalError }, { count: paidCount, error: paidError }, { count: awaitingCount, error: awaitingError }] =
        await Promise.all([
          supabase.from('orders').select('id', { count: 'exact', head: true }),
          supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'Paid'),
          supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'Awaiting payment'),
        ]);

      if (!isMounted) return;
      if (totalError || paidError || awaitingError) {
        setError(totalError?.message || paidError?.message || awaitingError?.message || 'Ошибка загрузки');
        setLoading(false);
        return;
      }

      setTotalOrders(totalCount || 0);
      setPaidOrders(paidCount || 0);
      setAwaitingPaymentOrders(awaitingCount || 0);

      const { data: paidRows, error: paidRowsError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'Paid')
        .limit(1000);

      if (!isMounted) return;
      if (paidRowsError) {
        setError(paidRowsError.message);
      } else {
        const sum = (paidRows || []).reduce((acc, row: any) => acc + Number(row.total_amount || 0), 0);
        setPaidRevenue(sum);
      }

      const { data: recent, error: recentError } = await supabase
        .from('orders')
        .select('id,created_at,total_amount,status,recipient_info')
        .order('created_at', { ascending: false })
        .limit(5);

      if (!isMounted) return;
      if (recentError) {
        setError(recentError.message);
      } else {
        setRecentOrders((recent ?? []) as DbOrder[]);
      }

      setLoading(false);
    };

    load();

    const channel = supabase
      .channel('admin-dashboard-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => load())
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
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
                  <td style={{ padding: '12px 20px', fontWeight: 600, color: '#1e88e5' }}>{o.id}</td>
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
