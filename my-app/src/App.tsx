import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/admin/Layout/MainLayout';
import Dashboard from './pages/admin/Dashboard';
import PartsInventory from './pages/admin/PartsInventory';
import VendorsDirectory from './pages/admin/VendorsDirectory';
import NewPurchaseOrder from './pages/admin/NewPurchaseOrder';
import PurchaseHistory from './pages/admin/PurchaseHistory';
import StaffManagement from './pages/admin/StaffManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="parts" element={<PartsInventory />} />
          <Route path="vendors" element={<VendorsDirectory />} />
          <Route path="purchase/new" element={<NewPurchaseOrder />} />
          <Route path="purchase/history" element={<PurchaseHistory />} />
          <Route path="staff" element={<StaffManagement />} />
        </Route>
        {/* Redirect root to admin dashboard for now */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
