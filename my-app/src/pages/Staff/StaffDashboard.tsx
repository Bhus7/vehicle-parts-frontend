import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { staffApi } from '../../api/api';

const StaffDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await staffApi.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1>Welcome, Staff</h1>
        <p className="text-muted">Here is what's happening at AutoParts today.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon blue">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <p className="text-muted">Total Customers</p>
            <h3>{stats?.totalCustomers}</h3>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon green">
            <DollarSign size={24} />
          </div>
          <div className="stat-info">
            <p className="text-muted">Total Sales</p>
            <h3>${stats?.totalSales.toFixed(2)}</h3>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon yellow">
            <Calendar size={24} />
          </div>
          <div className="stat-info">
            <p className="text-muted">Active Appointments</p>
            <h3>{stats?.pendingAppointments}</h3>
          </div>
        </div>

        <div className="stat-card glass">
          <div className="stat-icon red">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-info">
            <p className="text-muted">Stock Alerts</p>
            <h3>{stats?.lowStockAlerts}</h3>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h3>Quick Actions</h3>
        <div className="action-cards">
          <Link to="/staff/register" className="action-card glass">
            <div className="action-content">
              <h4>Register New Customer</h4>
              <p className="text-muted">Add a new customer and their vehicle details.</p>
            </div>
            <ArrowRight size={20} />
          </Link>

          <Link to="/staff/sales" className="action-card glass">
            <div className="action-content">
              <h4>New Parts Sale</h4>
              <p className="text-muted">Create a sales invoice and check stock.</p>
            </div>
            <ArrowRight size={20} />
          </Link>
          
          <Link to="/staff/reports" className="action-card glass">
            <div className="action-content">
              <h4>Business Reports</h4>
              <p className="text-muted">View high spenders and pending credits.</p>
            </div>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <style>{`
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .stat-card {
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-icon.blue { background: #eff6ff; color: #3b82f6; }
        .stat-icon.green { background: #f0fdf4; color: #22c55e; }
        .stat-icon.yellow { background: #fffbeb; color: #f59e0b; }
        .stat-icon.red { background: #fef2f2; color: #ef4444; }
        
        .stat-info p { font-size: 0.85rem; font-weight: 600; margin-bottom: 0.25rem; }
        .stat-info h3 { font-size: 1.5rem; font-weight: 800; }

        .quick-actions-section h3 {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .action-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .action-card {
          padding: 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s;
        }
        .action-card:hover {
          background: #f8fafc;
          border-color: var(--primary);
          transform: translateX(5px);
        }
        .action-card h4 { margin-bottom: 0.25rem; }
        .action-card p { font-size: 0.9rem; }
        .action-card svg { color: var(--primary); opacity: 0.5; }
        .action-card:hover svg { opacity: 1; }
      `}</style>
    </div>
  );
};

export default StaffDashboard;
