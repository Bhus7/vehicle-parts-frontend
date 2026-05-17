import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, Outlet } from 'react-router-dom';
import { User, Car, ShoppingBag, LayoutDashboard, History, LogOut, BarChart3 } from 'lucide-react';

// Admin Imports
import MainLayout from './components/admin/Layout/MainLayout';
import Dashboard from './pages/admin/Dashboard';
import PartsInventory from './pages/admin/PartsInventory';
import VendorsDirectory from './pages/admin/VendorsDirectory';
import NewPurchaseOrder from './pages/admin/NewPurchaseOrder';
import PurchaseHistory from './pages/admin/PurchaseHistory';
import StaffManagement from './pages/admin/StaffManagement';

// Staff Imports
import RegisterCustomer from './pages/Staff/RegisterCustomer';
import SalesTerminal from './pages/Staff/SalesTerminal';
import CustomerSearch from './pages/Staff/CustomerSearch';
import CustomerDetails from './pages/Staff/CustomerDetails';
import Reports from './pages/Staff/Reports';
import StaffDashboard from './pages/Staff/StaffDashboard';
import InvoiceView from './pages/Staff/InvoiceView';

import './App.css';

// Staff Layout Component
function StaffLayout() {
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="logo-section">
          <h2 className="gradient-text">AutoParts</h2>
        </div>
        
        <nav className="nav-links">
          <Link to="/staff" className="nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/staff/register" className="nav-item">
            <User size={20} />
            <span>Register Customer</span>
          </Link>
          <Link to="/staff/sales" className="nav-item">
            <ShoppingBag size={20} />
            <span>Sales Terminal</span>
          </Link>
          <Link to="/staff/search" className="nav-item">
            <History size={20} />
            <span>Customer History</span>
          </Link>
          <Link to="/staff/reports" className="nav-item">
            <BarChart3 size={20} />
            <span>Reports</span>
          </Link>
        </nav>

        <div className="bottom-nav">
          <button className="logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content">
        <header className="top-header glass">
          <div className="user-profile">
            <div className="avatar">K</div>
            <span>Khushi Karanjit</span>
          </div>
        </header>
        
        <div className="page-content">
          {/* Renders the nested route's element */}
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="parts" element={<PartsInventory />} />
          <Route path="vendors" element={<VendorsDirectory />} />
          <Route path="purchase/new" element={<NewPurchaseOrder />} />
          <Route path="purchase/history" element={<PurchaseHistory />} />
          <Route path="staff" element={<StaffManagement />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={<StaffLayout />}>
          <Route index element={<StaffDashboard />} />
          <Route path="register" element={<RegisterCustomer />} />
          <Route path="sales" element={<SalesTerminal />} />
          <Route path="search" element={<CustomerSearch />} />
          <Route path="customer/:id" element={<CustomerDetails />} />
          <Route path="reports" element={<Reports />} />
          <Route path="invoice/:id" element={<InvoiceView />} />
        </Route>

        {/* Redirect root to admin dashboard (or staff, or login) */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
