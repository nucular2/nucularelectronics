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

type Period = '6m' | '30d';

type ChartPoint = {
  name: string;
  value: number;
};

type DualChartPoint = {
  name: string;
  desktop: number;
  mobile: number;
};

function formatNumber(value: number) {
  return value.toLocaleString('en-US');
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
  const [period, setPeriod] = useState<Period>('6m');
  const [analytics, setAnalytics] = useState<{
    total: number;
    desktop: number;
    mobile: number;
    series: Array<{ name: string; value: number; desktop: number; mobile: number }>;
  } | null>(null);

  useEffect(() => {
    const days = period === '30d' ? 30 : 180;
    let cancelled = false;
    fetch(`/api/analytics/summary?days=${days}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
      })
      .then((data) => {
        if (cancelled) return;
        setAnalytics({
          total: typeof data.total === 'number' ? data.total : 0,
          desktop: typeof data.desktop === 'number' ? data.desktop : 0,
          mobile: typeof data.mobile === 'number' ? data.mobile : 0,
          series: Array.isArray(data.series) ? data.series : [],
        });
      })
      .catch(() => {
        if (cancelled) return;
        setAnalytics(null);
      });
    return () => {
      cancelled = true;
    };
  }, [period]);

  const visitors = useMemo<ChartPoint[]>(
    () => [
      { name: 'Jan', value: 180 },
      { name: 'Feb', value: 210 },
      { name: 'Mar', value: 195 },
      { name: 'Apr', value: 230 },
      { name: 'May', value: 205 },
      { name: 'Jun', value: 240 },
    ],
    []
  );

  const salesByMonth = useMemo<DualChartPoint[]>(
    () => [
      { name: 'Jan', desktop: 32, mobile: 18 },
      { name: 'Feb', desktop: 28, mobile: 20 },
      { name: 'Mar', desktop: 36, mobile: 22 },
      { name: 'Apr', desktop: 40, mobile: 24 },
      { name: 'May', desktop: 38, mobile: 26 },
      { name: 'Jun', desktop: 44, mobile: 28 },
    ],
    []
  );

  const kpis = useMemo(
    () => [
      { label: 'Session', value: 6132, delta: '+90%' },
      { label: 'Page Views', value: 11236, delta: '+40%' },
      { label: 'Average', value: 46, delta: '+22%' },
      { label: 'Bounce Rate', value: 6132, delta: '+30%' },
    ],
    []
  );

  const budgets = useMemo(
    () => [
      { name: 'Marketing', spent: 7200, limit: 10000 },
      { name: 'Operations', spent: 5400, limit: 8000 },
      { name: 'R&D', spent: 9800, limit: 12000 },
    ],
    []
  );

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
          <Card title="Budgets - Consolidated" subtitle="Showing total budgets for the last 3 months">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {budgets.map((b) => {
                const percent = Math.min(100, Math.round((b.spent / b.limit) * 100));
                return (
                  <div key={b.name} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: 'rgba(231, 233, 238, 0.92)', fontWeight: 500 }}>
                        {b.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">
                        ${formatNumber(b.spent)} / ${formatNumber(b.limit)}
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

          <Card title="Visitors" subtitle={period === '30d' ? 'Last 30 days' : 'Last 6 months'}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 }}>
                <div className="admin-muted" style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Desktop</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
                  {formatNumber(analytics?.desktop || 0)}
                </div>
              </div>
              <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 14 }}>
                <div className="admin-muted" style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Mobile</div>
                <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 28, color: 'rgba(231, 233, 238, 0.96)' }}>
                  {formatNumber(analytics?.mobile || 0)}
                </div>
              </div>
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics?.series || visitors} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  <Area type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} fill="url(#visitorsFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Sales By Month" subtitle="Showing total sales for the last 6 months">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                  <Bar dataKey="desktop" fill="#60a5fa" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="mobile" fill="rgba(52, 211, 153, 0.75)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#60a5fa', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">Desktop</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(52, 211, 153, 0.75)', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 12 }} className="admin-muted">Mobile</span>
              </div>
            </div>
          </Card>

          <Card title="Page Views" subtitle="vs Previous 30 Days">
            <div style={{ fontFamily: 'var(--font-family)', fontWeight: 800, fontSize: 40, color: 'rgba(231, 233, 238, 0.96)' }}>
              {formatNumber(analytics?.total || 0)}
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Card title="KPIs" subtitle="vs Previous 30 Days">
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
                    {formatNumber(k.value)}
                    {k.label === 'Average' ? '%' : ''}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, fontWeight: 700 }} className="admin-positive">
                    {k.delta}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Notes" subtitle="Подключение данных">
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, lineHeight: 1.5 }} className="admin-muted">
              Теперь подключены базовые счётчики посещений (desktop/mobile) через /api/analytics. Остальные блоки можно подключить к заказам и выручке.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
