import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, AlertCircle, DollarSign, Award } from 'lucide-react';
import { staffApi } from '../../api/api';

const Reports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await staffApi.getReports();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Generating reports...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Intelligence Reports</h1>
        <p className="text-muted">Business insights on high spenders, loyal regulars, and pending collections.</p>
      </div>

      <div className="reports-grid">
        {/* High Spenders */}
        <section className="report-card glass">
          <div className="report-header">
            <div className="icon-box purple"><TrendingUp size={24} /></div>
            <div>
              <h3>High Spenders</h3>
              <p className="text-muted">Top 5 by lifetime value</p>
            </div>
          </div>
          <div className="report-list">
            {data?.highSpenders.map((user: any, idx: number) => (
              <div key={user.userID} className="report-item">
                <span className="rank">#{idx + 1}</span>
                <div className="item-info">
                  <p className="item-name">{user.fullName}</p>
                  <p className="item-meta">ID: {user.userID}</p>
                </div>
                <div className="item-value success">${user.totalSpent.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Regular Customers */}
        <section className="report-card glass">
          <div className="report-header">
            <div className="icon-box blue"><Users size={24} /></div>
            <div>
              <h3>Regular Customers</h3>
              <p className="text-muted">Top 5 by total visits</p>
            </div>
          </div>
          <div className="report-list">
            {data?.regulars.map((user: any, idx: number) => (
              <div key={user.userID} className="report-item">
                <div className="item-info">
                  <p className="item-name">{user.fullName}</p>
                  <p className="item-meta">Total visits: {user.visitCount}</p>
                </div>
                <div className="item-icon"><Award size={20} className="gold" /></div>
              </div>
            ))}
          </div>
        </section>

        {/* Pending Credits */}
        <section className="report-card glass full-width">
          <div className="report-header">
            <div className="icon-box red"><AlertCircle size={24} /></div>
            <div>
              <h3>Pending Credits</h3>
              <p className="text-muted">Customers with unpaid invoices</p>
            </div>
          </div>
          <div className="pending-table">
            <table>
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data?.pendingPayments.length > 0 ? (
                  data.pendingPayments.map((p: any) => (
                    <tr key={p.salesInvoiceID}>
                      <td>#{p.salesInvoiceID}</td>
                      <td>{p.customerName}</td>
                      <td className="error">${p.finalAmount.toFixed(2)}</td>
                      <td>{p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'N/A'}</td>
                      <td><span className="badge-red">Unpaid</span></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-muted">No pending payments found. Good job!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <style>{`
        .reports-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-top: 2rem;
        }
        .report-card {
          padding: 2rem;
          border-radius: 24px;
        }
        .full-width {
          grid-column: span 2;
        }
        .report-header {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          margin-bottom: 2rem;
        }
        .icon-box {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .icon-box.purple { background: rgba(168, 85, 247, 0.1); color: #a855f7; }
        .icon-box.blue { background: rgba(59, 130, 246, 0.1); color: #3b82f6; }
        .icon-box.red { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        
        .report-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .report-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
        }
        .rank {
          font-weight: 800;
          color: var(--primary);
          font-size: 1.1rem;
          width: 30px;
        }
        .item-info {
          flex: 1;
        }
        .item-name { font-weight: 600; }
        .item-meta { font-size: 0.8rem; color: var(--text-muted); }
        .item-value { font-weight: 800; font-size: 1.1rem; }
        .success { color: var(--success); }
        .error { color: var(--error); font-weight: 700; }
        .gold { color: #f59e0b; }
        
        .pending-table {
          margin-top: 1rem;
          overflow: hidden;
          border-radius: 12px;
          border: 1px solid var(--border);
        }
        table { width: 100%; border-collapse: collapse; }
        th { text-align: left; padding: 1rem; background: rgba(255,255,255,0.05); color: var(--text-muted); font-size: 0.8rem; }
        td { padding: 1rem; border-top: 1px solid var(--border); }
        .badge-red {
          background: rgba(239, 68, 68, 0.1);
          color: var(--error);
          padding: 2px 10px;
          border-radius: 50px;
          font-size: 0.75rem;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
};

export default Reports;
