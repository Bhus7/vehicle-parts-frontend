import { useEffect, useState, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import api from '../../api/axiosConfig';

// ─── Types ────────────────────────────────────────────────────────────────────
interface BreakdownItem {
  label: string;
  revenue: number;
  expenses: number;
}

interface ReportData {
  period: string;
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  invoiceCount: number;
  breakdown: BreakdownItem[];
}

type TabType = 'daily' | 'monthly' | 'yearly';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  `Rs. ${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const today = new Date().toISOString().slice(0, 10);
const thisYear = new Date().getFullYear();
const thisMonth = new Date().getMonth() + 1;

const MONTHS = [
  { value: 1, label: 'January' }, { value: 2, label: 'February' },
  { value: 3, label: 'March' },   { value: 4, label: 'April' },
  { value: 5, label: 'May' },     { value: 6, label: 'June' },
  { value: 7, label: 'July' },    { value: 8, label: 'August' },
  { value: 9, label: 'September' },{ value: 10, label: 'October' },
  { value: 11, label: 'November' },{ value: 12, label: 'December' },
];

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  title, value, sub, color, icon,
}: { title: string; value: string; sub?: string; color: string; icon: string }) {
  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 16,
        padding: '24px 28px',
        boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)',
        borderLeft: `4px solid ${color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        flex: '1 1 200px',
        minWidth: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', letterSpacing: '.03em' }}>
          {title}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: '#94a3b8' }}>{sub}</div>}
    </div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#1e293b', color: '#f1f5f9', padding: '10px 16px',
      borderRadius: 10, fontSize: 13, lineHeight: 1.8,
    }}>
      <strong style={{ display: 'block', marginBottom: 4, color: '#f29f67' }}>{label}</strong>
      {payload.map((p: any) => (
        <div key={p.dataKey}>
          <span style={{ color: p.color }}>■ </span>
          {p.name}: <strong>{fmt(p.value)}</strong>
        </div>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FinancialReports() {
  const [tab, setTab] = useState<TabType>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<ReportData | null>(null);

  // Selectors
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedYear, setSelectedYear] = useState(thisYear);
  const [selectedMonth, setSelectedMonth] = useState(thisMonth);
  const [availableYears, setAvailableYears] = useState<number[]>([thisYear]);

  // Fetch available years on mount
  useEffect(() => {
    api.get('/FinancialReports/summary')
      .then(res => {
        if (res.data?.availableYears?.length) {
          setAvailableYears(res.data.availableYears);
        }
      })
      .catch(() => {});
  }, []);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      let url = '';
      if (tab === 'daily')   url = `/FinancialReports/daily?date=${selectedDate}`;
      if (tab === 'monthly') url = `/FinancialReports/monthly?year=${selectedYear}&month=${selectedMonth}`;
      if (tab === 'yearly')  url = `/FinancialReports/yearly?year=${selectedYear}`;
      const res = await api.get(url);
      setData(res.data);
    } catch {
      setError('Failed to load report. Please ensure the API is running.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [tab, selectedDate, selectedYear, selectedMonth]);

  useEffect(() => { fetchReport(); }, [fetchReport]);

  const periodLabel =
    tab === 'daily'   ? selectedDate :
    tab === 'monthly' ? `${MONTHS.find(m => m.value === selectedMonth)?.label} ${selectedYear}` :
                        `Year ${selectedYear}`;

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>
      {/* ── Page Header ── */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-0.5px' }}>
          📊 Financial Reports
        </h1>
        <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: 14 }}>
          Generate and view daily, monthly, and yearly financial summaries.
        </p>
      </div>

      {/* ── Tab Switcher ── */}
      <div style={{
        display: 'flex', gap: 8, background: '#f1f5f9',
        borderRadius: 12, padding: 4, width: 'fit-content', marginBottom: 24,
      }}>
        {(['daily', 'monthly', 'yearly'] as TabType[]).map(t => (
          <button
            key={t}
            id={`tab-${t}`}
            onClick={() => setTab(t)}
            style={{
              padding: '8px 24px', borderRadius: 9, border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: 14, transition: 'all .2s',
              background: tab === t ? '#fff' : 'transparent',
              color: tab === t ? '#f29f67' : '#64748b',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,.12)' : 'none',
              textTransform: 'capitalize',
            }}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Filters Row ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        background: '#fff', borderRadius: 14, padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,.07)', marginBottom: 28,
        flexWrap: 'wrap',
      }}>
        <span style={{ fontWeight: 600, color: '#475569', fontSize: 14 }}>Period:</span>

        {tab === 'daily' && (
          <input
            id="filter-date"
            type="date"
            value={selectedDate}
            max={today}
            onChange={e => setSelectedDate(e.target.value)}
            style={inputStyle}
          />
        )}

        {(tab === 'monthly' || tab === 'yearly') && (
          <select
            id="filter-year"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            style={inputStyle}
          >
            {availableYears.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        )}

        {tab === 'monthly' && (
          <select
            id="filter-month"
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            style={inputStyle}
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        )}

        <button
          id="btn-generate-report"
          onClick={fetchReport}
          style={{
            padding: '9px 22px', borderRadius: 9, border: 'none',
            background: 'linear-gradient(135deg, #f29f67, #e8844a)',
            color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(242,159,103,.4)',
            transition: 'opacity .2s',
          }}
        >
          {loading ? '⏳ Loading…' : '🔄 Generate Report'}
        </button>

        {data && (
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
            Showing: <strong style={{ color: '#475569' }}>{periodLabel}</strong>
          </span>
        )}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c',
          borderRadius: 10, padding: '12px 20px', marginBottom: 24, fontSize: 14,
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── KPI Cards ── */}
      {data && (
        <>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginBottom: 28 }}>
            <KpiCard
              title="Total Revenue"
              value={fmt(data.totalRevenue)}
              sub={`${data.invoiceCount} invoice(s) issued`}
              color="#22c55e"
              icon="💰"
            />
            <KpiCard
              title="Total Expenses"
              value={fmt(data.totalExpenses)}
              sub="Purchase invoices"
              color="#f97316"
              icon="🛒"
            />
            <KpiCard
              title="Net Profit"
              value={fmt(data.netProfit)}
              sub={data.netProfit >= 0 ? '✅ Profitable' : '❌ Net loss'}
              color={data.netProfit >= 0 ? '#3b82f6' : '#ef4444'}
              icon="📈"
            />
          </div>

          {/* ── Charts Row ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
            {/* Bar Chart */}
            <div style={cardStyle}>
              <h2 style={cardTitleStyle}>Revenue vs Expenses</h2>
              <p style={{ margin: '0 0 16px', fontSize: 13, color: '#94a3b8' }}>
                Breakdown for {periodLabel}
              </p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data.breakdown}
                  margin={{ top: 5, right: 10, bottom: 5, left: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: '#94a3b8' }}
                    interval="preserveStartEnd"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `Rs.${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: 13 }}
                    formatter={(value) => <span style={{ color: '#475569' }}>{value}</span>}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="#22c55e" radius={[5, 5, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="expenses" name="Expenses" fill="#f97316" radius={[5, 5, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Detail Table ── */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Detailed Breakdown</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    {['Period', 'Revenue', 'Expenses', 'Net'].map(col => (
                      <th key={col} style={thStyle}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.breakdown.map((row, idx) => {
                    const net = row.revenue - row.expenses;
                    return (
                      <tr
                        key={row.label}
                        style={{ background: idx % 2 === 0 ? '#fff' : '#f8fafc' }}
                      >
                        <td style={tdStyle}><strong>{row.label}</strong></td>
                        <td style={{ ...tdStyle, color: '#22c55e', fontWeight: 600 }}>{fmt(row.revenue)}</td>
                        <td style={{ ...tdStyle, color: '#f97316', fontWeight: 600 }}>{fmt(row.expenses)}</td>
                        <td style={{
                          ...tdStyle, fontWeight: 700,
                          color: net >= 0 ? '#3b82f6' : '#ef4444',
                        }}>
                          {net >= 0 ? '+' : ''}{fmt(net)}
                        </td>
                      </tr>
                    );
                  })}
                  {/* Totals row */}
                  <tr style={{ background: '#1e293b', color: '#fff' }}>
                    <td style={{ ...tdStyle, color: '#fff', fontWeight: 800 }}>TOTAL</td>
                    <td style={{ ...tdStyle, color: '#4ade80', fontWeight: 800 }}>{fmt(data.totalRevenue)}</td>
                    <td style={{ ...tdStyle, color: '#fb923c', fontWeight: 800 }}>{fmt(data.totalExpenses)}</td>
                    <td style={{
                      ...tdStyle, fontWeight: 800,
                      color: data.netProfit >= 0 ? '#60a5fa' : '#f87171',
                    }}>
                      {data.netProfit >= 0 ? '+' : ''}{fmt(data.netProfit)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── Loading skeleton ── */}
      {loading && !data && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 16 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⏳</div>
          Fetching report data…
        </div>
      )}
    </div>
  );
}

// ─── Shared Styles ─────────────────────────────────────────────────────────────
const inputStyle: React.CSSProperties = {
  padding: '9px 14px', borderRadius: 9, border: '1px solid #e2e8f0',
  fontSize: 14, color: '#1e293b', background: '#f8fafc', outline: 'none',
  cursor: 'pointer',
};

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: 16, padding: '24px 28px',
  boxShadow: '0 1px 3px rgba(0,0,0,.08), 0 4px 16px rgba(0,0,0,.06)',
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: 17, fontWeight: 800, margin: '0 0 4px', color: '#1e293b',
};

const thStyle: React.CSSProperties = {
  padding: '12px 16px', textAlign: 'left', fontWeight: 700, fontSize: 12,
  color: '#64748b', letterSpacing: '.05em', textTransform: 'uppercase',
  borderBottom: '2px solid #e2e8f0',
};

const tdStyle: React.CSSProperties = {
  padding: '11px 16px', color: '#1e293b', borderBottom: '1px solid #f1f5f9',
};
