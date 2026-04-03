import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { RefreshCw } from 'lucide-react';

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
  user_id: string;
  created_at: string;
  total_amount: number;
  status: OrderStatus;
  items?: any;
  recipient_info?: any;
  shipping_address?: any;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  contacts?: any;
};

function formatDateTime(value: string) {
  const d = new Date(value);
  return d.toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function money(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(n) ? `$${n.toFixed(2)}` : '$0.00';
}

function displayOrderNumber(order: DbOrder) {
  const crmNumber = order?.contacts?.crm?.number;
  if (crmNumber) return String(crmNumber);
  const id = typeof order?.id === 'string' ? order.id : '';
  return id.includes('-') ? id.split('-')[0].toUpperCase() : id;
}

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState<DbOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const syncFromCrm = async () => {
    if (!id) return;
    setSyncing(true);
    setError(null);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        await logout();
        return;
      }
      const r = await fetch('/api/retailcrm/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ orderIds: [id] }),
      });
      if (r.status === 401 || r.status === 403) {
        await logout();
        return;
      }
      if (!r.ok) {
        const text = await r.text();
        setError(text || 'Ошибка синхронизации CRM');
        return;
      }
      const payload = await r.json().catch(() => null);
      const upd = payload?.updates?.[id];
      if (upd?.status || upd?.contacts) {
        setOrder((prev) => (prev ? { ...prev, status: upd.status || prev.status, contacts: upd.contacts || prev.contacts } : prev));
      }
    } catch (e: any) {
      setError(e?.message || 'Ошибка синхронизации CRM');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const token = sessionData?.session?.access_token;
        if (!token) {
          await logout();
          return;
        }
        const r = await fetch('/api/admin/order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id }),
        });
        if (r.status === 401 || r.status === 403) {
          await logout();
          return;
        }
        const payload = await r.json();
        if (!r.ok) {
          setError(payload?.message || 'Ошибка загрузки');
          setOrder(null);
          return;
        }
        if (cancelled) return;
        setOrder(payload?.order as DbOrder);
        void syncFromCrm();
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки');
        setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [id, logout]);

  const items = useMemo(() => (Array.isArray(order?.items) ? order?.items : []), [order?.items]);

  if (!id) {
    return (
      <div className="admin-card">
        <div className="admin-card-title">Заказ не найден</div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
            Order {order ? `#${displayOrderNumber(order)}` : `#${id}`}
          </div>
          <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 14 }}>
            {order?.created_at ? formatDateTime(order.created_at) : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button type="button" className="admin-button" onClick={() => void syncFromCrm()} disabled={syncing}>
            <RefreshCw size={18} /> {syncing ? 'Синхронизация…' : 'Sync CRM'}
          </button>
          <button type="button" className="admin-button" onClick={() => navigate('/admin/orders')}>
            Back
          </button>
        </div>
      </div>

      {loading ? <div className="admin-card">Загрузка…</div> : null}
      {error ? (
        <div className="admin-card">
          <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: '#fca5a5' }}>{error}</div>
        </div>
      ) : null}

      {order ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="admin-card">
              <div className="admin-card-title" style={{ marginBottom: 12 }}>Итого</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <div className="admin-muted">Status</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'rgba(231, 233, 238, 0.96)' }}>{order.status}</div>
                <div className="admin-muted">Total</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'rgba(231, 233, 238, 0.96)' }}>{money(order.total_amount)}</div>
                <div className="admin-muted">User</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>{order.user_id}</div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-title" style={{ marginBottom: 12 }}>Товары</div>
              {items.length === 0 ? (
                <div className="admin-muted">Нет позиций</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {items.map((it: any, idx: number) => (
                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 12, alignItems: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'rgba(231, 233, 238, 0.96)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {it?.title || it?.name || 'Item'}
                        </div>
                        <div className="admin-muted" style={{ fontSize: 12 }}>
                          {it?.sku ? `SKU ${it.sku}` : it?.productId ? `Product ${it.productId}` : ''}
                        </div>
                      </div>
                      <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 14 }}>
                        x{Number(it?.quantity || 1)}
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, color: 'rgba(231, 233, 238, 0.96)' }}>
                        {money(Number(it?.price || 0) * Number(it?.quantity || 1))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="admin-card">
              <div className="admin-card-title" style={{ marginBottom: 12 }}>Клиент</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <div className="admin-muted">Name</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>{order.customer_name || `${order?.recipient_info?.firstName || ''} ${order?.recipient_info?.lastName || ''}`.trim() || '—'}</div>
                <div className="admin-muted">Email</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>{order?.recipient_info?.email || '—'}</div>
                <div className="admin-muted">Phone</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>{order.customer_phone || order?.recipient_info?.phone || '—'}</div>
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-title" style={{ marginBottom: 12 }}>Доставка</div>
              <div className="admin-muted" style={{ fontFamily: 'var(--font-family)', fontSize: 14, lineHeight: 1.5 }}>
                {order.customer_address ||
                  (order.shipping_address
                    ? [
                        order.shipping_address?.country,
                        order.shipping_address?.city,
                        order.shipping_address?.street,
                        order.shipping_address?.buildingName,
                        order.shipping_address?.flat,
                        order.shipping_address?.zipCode,
                      ]
                        .filter(Boolean)
                        .join(', ')
                    : '—')}
              </div>
            </div>

            <div className="admin-card">
              <div className="admin-card-title" style={{ marginBottom: 12 }}>Оплата / CRM</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <div className="admin-muted">CRM id</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>{order?.contacts?.crm?.id ?? '—'}</div>
                <div className="admin-muted">CRM number</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>{order?.contacts?.crm?.number ?? '—'}</div>
                <div className="admin-muted">Paid at</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>
                  {order?.contacts?.payment?.paidAt || order?.contacts?.crm?.paidAt || order?.contacts?.crm?.fullPaidAt || '—'}
                </div>
                <div className="admin-muted">Payment status</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600 }}>
                  {order?.contacts?.payment?.status || (Array.isArray(order?.contacts?.crm?.paymentStatuses) ? order.contacts.crm.paymentStatuses.join(', ') : '—')}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
