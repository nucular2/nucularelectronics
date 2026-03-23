import React, { useMemo, useState } from 'react';
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
    <div
      style={{
        background: '#fff',
        border: '1px solid #eaeaea',
        borderRadius: 14,
        padding: 20,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-family)', fontWeight: 600, fontSize: 16, color: '#111' }}>
          {title}
        </div>
        {subtitle ? (
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 400, fontSize: 12, color: '#666' }}>{subtitle}</div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

export default function Dashboard3() {
  const [period, setPeriod] = useState<Period>('6m');

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
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 28, color: '#111' }}>
            Overview Dashboard
          </div>
          <div style={{ fontFamily: 'var(--font-family)', fontWeight: 400, fontSize: 14, color: '#666' }}>
            Here, take a look at your sales.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setPeriod('30d')}
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 10,
              border: '1px solid #eaeaea',
              background: period === '30d' ? '#111' : '#fff',
              color: period === '30d' ? '#fff' : '#111',
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            30 Days
          </button>
          <button
            type="button"
            onClick={() => setPeriod('6m')}
            style={{
              height: 36,
              padding: '0 12px',
              borderRadius: 10,
              border: '1px solid #eaeaea',
              background: period === '6m' ? '#111' : '#fff',
              color: period === '6m' ? '#fff' : '#111',
              fontFamily: 'var(--font-family)',
              fontSize: 14,
              cursor: 'pointer',
            }}
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
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: '#111', fontWeight: 500 }}>
                        {b.name}
                      </div>
                      <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666' }}>
                        ${formatNumber(b.spent)} / ${formatNumber(b.limit)}
                      </div>
                    </div>
                    <div style={{ width: '100%', height: 8, borderRadius: 999, background: '#f1f5f9', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: '#111' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card title="Total Visitors" subtitle="January - June 2024">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 28, color: '#111' }}>
                {formatNumber(1260)}
              </div>
              <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                Trending up by 5.2% this month
              </div>
            </div>

            <div style={{ height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitors} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#111" stopOpacity={0.16} />
                      <stop offset="100%" stopColor="#111" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #eaeaea',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      fontFamily: 'var(--font-family)',
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#111" strokeWidth={2} fill="url(#visitorsFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Sales By Month" subtitle="Showing total sales for the last 6 months">
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesByMonth} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} width={30} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #eaeaea',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                      fontFamily: 'var(--font-family)',
                    }}
                  />
                  <Bar dataKey="desktop" fill="#111" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="mobile" fill="#e5e7eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 12, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#111', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666' }}>Desktop</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#e5e7eb', display: 'inline-block' }} />
                <span style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666' }}>Mobile</span>
              </div>
            </div>
          </Card>

          <Card title="Page Views" subtitle="vs Previous 30 Days">
            <div style={{ fontFamily: 'var(--font-family)', fontWeight: 700, fontSize: 40, color: '#111' }}>{formatNumber(11236)}</div>
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#16a34a', fontWeight: 600, marginTop: 6 }}>
              +40%
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
                    border: '1px solid #eaeaea',
                    borderRadius: 12,
                    padding: 14,
                    background: '#fff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                  }}
                >
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#666' }}>{k.label}</div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 22, fontWeight: 700, color: '#111' }}>
                    {formatNumber(k.value)}
                    {k.label === 'Average' ? '%' : ''}
                  </div>
                  <div style={{ fontFamily: 'var(--font-family)', fontSize: 12, color: '#16a34a', fontWeight: 600 }}>
                    {k.delta}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Notes" subtitle="Подключение данных">
            <div style={{ fontFamily: 'var(--font-family)', fontSize: 14, color: '#444', lineHeight: 1.5 }}>
              Сейчас тут демонстрационные цифры и графики. Дальше подключим реальные данные (заказы, выручка, трафик) через API/аналитику.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

