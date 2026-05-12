import React, { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { getSupabaseAccessTokenOrThrow } from '../../lib/supabase';
import { useAuth } from '../context/AuthContext';

type Period = '6m' | '30d';

type ChartPoint = {
  name: string;
  paidOrders: number;
  awaitingOrders: number;
  paidRevenue: number;
};

type OrderStatus =
  | 'New'
  | 'Processing'
  | 'Awaiting payment'
  | 'Paid'
  | 'Shipped'
  | 'Awaiting pickup'
  | 'Delivered'
  | 'Canceled';

function formatNumber(value: number) {
  return value.toLocaleString('en-US');
}

function formatMoney(value: number) {
  if (!Number.isFinite(value)) return '$0.00';
  return `$${value.toFixed(2)}`;
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="admin-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
        <div className="admin-card-title">{title}</div>
        {subtitle ? <div className="admin-card-subtitle">{subtitle}</div> : null}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard3() {
  const { logout } = useAuth();
  const [period, setPeriod] = useState<Period>('6m');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{
    totalOrders: number;
    paidOrders: number;
    awaitingPaymentOrders: number;
    paidRevenue: number;
    countsByStatus: Record<OrderStatus, number>;
    series: ChartPoint[];
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
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
          body: JSON.stringify({ period }),
        });
        if (r.status === 401 || r.status === 403) {
          await logout();
          return;
        }
        const payload = await r.json();
        if (!r.ok) {
          setError(payload?.message || 'Ошибка загрузки');
          setStats(null);
          return;
        }
        if (cancelled) return;
        setStats({
          totalOrders: payload?.totalOrders || 0,
          paidOrders: payload?.paidOrders || 0,
          awaitingPaymentOrders: payload?.awaitingPaymentOrders || 0,
          paidRevenue: payload?.paidRevenue || 0,
          countsByStatus: (payload?.countsByStatus || {}) as Record<OrderStatus, number>,
          series: (Array.isArray(payload?.series) ? payload.series : []).map((p: any) => ({
            name: String(p?.name || ''),
            paidOrders: Number(p?.paidOrders || 0),
            awaitingOrders: Number(p?.awaitingOrders || 0),
            paidRevenue: Number(p?.paidRevenue || 0),
          })),
        });
      } catch (e: any) {
        setError(e?.message || 'Ошибка загрузки');
        setStats(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [period]);

  const chartSeries = useMemo<ChartPoint[]>(
    () =>
      stats?.series?.length
        ? stats.series
        : period === '30d'
        ? Array.from({ length: 30 }).map((_, i) => ({ name: String(i + 1), paidOrders: 0, awaitingOrders: 0, paidRevenue: 0 }))
        : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((name) => ({ name, paidOrders: 0, awaitingOrders: 0, paidRevenue: 0 })),
    [stats, period]
  );

  const paidOrders = stats?.paidOrders || 0;
  const awaitingOrders = stats?.awaitingPaymentOrders || 0;
  const totalOrders = stats?.totalOrders || 0;
  const paidRevenue = stats?.paidRevenue || 0;
  const averagePaid = paidOrders > 0 ? paidRevenue / paidOrders : 0;

  const kpis = useMemo(
    () => [
      { label: 'Paid orders', value: paidOrders, hint: 'Статус Paid' },
      { label: 'Awaiting payment', value: awaitingOrders, hint: 'Ожидают оплату' },
      { label: 'Paid revenue', value: paidRevenue, hint: 'Сумма Paid' },
      { label: 'Avg paid check', value: averagePaid, hint: 'Paid revenue / paid orders' },
    ],
    [paidOrders, awaitingOrders, paidRevenue, averagePaid]
  );

  const statusBars = useMemo(() => {
    const c = stats?.countsByStatus;
    if (!c) return [];
    const rows: Array<{ name: string; count: number; percent: number }> = [
      { name: 'Paid', count: c['Paid'] || 0, percent: totalOrders ? Math.round(((c['Paid'] || 0) / totalOrders) * 100) : 0 },
      { name: 'Awaiting payment', count: c['Awaiting payment'] || 0, percent: totalOrders ? Math.round(((c['Awaiting payment'] || 0) / totalOrders) * 100) : 0 },
      { name: 'Processing', count: c['Processing'] || 0, percent: totalOrders ? Math.round(((c['Processing'] || 0) / totalOrders) * 100) : 0 },
    ];
    return rows;
  }, [stats, totalOrders]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
            Overview Dashboard
          </div>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 400, fontSize: 14 }} className="admin-muted">
            Here, take a look at your visitors.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setPeriod('30d')}
            className={period === '30d' ? 'admin-button active' : 'admin-button'}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setPeriod('6m')}
            className={period === '6m' ? 'admin-button active' : 'admin-button'}
          >
            6 Months
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 18, alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <Card title="Orders by status" subtitle="Сводка по статусам">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {statusBars.map((b) => {
                const percent = Math.min(100, Math.max(0, b.percent));
                return (
                  <div key={b.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: 'rgba(231, 233, 238, 0.92)', fontWeight: 500 }}>
                        {b.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">
                        {formatNumber(b.count)} ({percent}%)
                      </div>
                    </div>
                    <div style={{ width: '100%', height: 8, borderRadius: 999, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'rgba(96, 165, 250, 0.92)' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Paid orders" subtitle={period === '30d' ? 'Last 30 days' : 'Last 6 months'}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 }}>
                <div className="admin-muted" style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Paid</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
                  {loading ? '…' : formatNumber(paidOrders)}
                </div>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 }}>
                <div className="admin-muted" style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Awaiting</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
                  {loading ? '…' : formatNumber(awaitingOrders)}
                </div>
              </div>
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.22} />
                      <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'rgba(231,233,238,0.62)' }}
                    tickFormatter={(v: string) => (typeof v === 'string' && v.length >= 10 ? v.slice(5) : v)}
                  />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(11, 16, 26, 0.92)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                      fontFamily: 'var(--font-family)',
                    }}
                    labelStyle={{ color: 'rgba(231,233,238,0.72)' }}
                  />
                  <Area type="monotone" dataKey="paidOrders" stroke="#60a5fa" strokeWidth={2} fill="url(#visitorsFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Orders trend" subtitle={period === '30d' ? 'Paid vs Awaiting (daily)' : 'Paid vs Awaiting (monthly)'}>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(231,233,238,0.62)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'rgba(231,233,238,0.62)' }} width={30} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid rgba(255,255,255,0.10)',
                      background: 'rgba(11, 16, 26, 0.92)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.55)',
                      fontFamily: 'var(--font-family)',
                    }}
                    labelStyle={{ color: 'rgba(231,233,238,0.72)' }}
                  />
                  <Bar dataKey="paidOrders" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="awaitingOrders" fill="rgba(52, 211, 153, 0.75)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#60a5fa', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">Paid</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(52, 211, 153, 0.75)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">Awaiting</span>
              </div>
            </div>
          </Card>

          <Card title="Total orders" subtitle="All time">
            <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 40, color: 'rgba(231, 233, 238, 0.96)' }}>
              {loading ? '…' : formatNumber(totalOrders)}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title="KPIs" subtitle="Orders & revenue">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {kpis.map((k) => (
                <div
                  key={k.label}
                  style={{
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14,
                    padding: 14,
                    background: 'rgba(255,255,255,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">{k.label}</div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 22, fontWeight: 800, color: 'rgba(231, 233, 238, 0.96)' }}>
                    {k.label === 'Paid revenue' || k.label === 'Avg paid check' ? formatMoney(Number(k.value)) : formatNumber(Number(k.value))}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">
                    {'hint' in k ? (k as any).hint : ''}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {error ? (
            <Card title="Ошибка" subtitle="Данные не загрузились">
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, lineHeight: 1.5, color: '#fca5a5' }}>{error}</div>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
