import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import { User, ShoppingBag, LayoutDashboard, History, LogOut, BarChart3 } from 'lucide-react';

// Admin Imports
import MainLayout from './components/admin/Layout/MainLayout';
import Dashboard from './pages/admin/Dashboard';
import PartsInventory from './pages/admin/PartsInventory';
import VendorsDirectory from './pages/admin/VendorsDirectory';
import NewPurchaseOrder from './pages/admin/NewPurchaseOrder';
import PurchaseHistory from './pages/admin/PurchaseHistory';
import StaffManagement from './pages/admin/StaffManagement';

// Staff Imports
import LandingPage from './pages/LandingPage';
import RegisterCustomer from './pages/Staff/RegisterCustomer';
import SalesTerminal from './pages/Staff/SalesTerminal';
import CustomerSearch from './pages/Staff/CustomerSearch';
import CustomerDetails from './pages/Staff/CustomerDetails';
import Reports from './pages/Staff/Reports';
import StaffDashboard from './pages/Staff/StaffDashboard';
import InvoiceView from './pages/Staff/InvoiceView';

// Auth & Customer Imports
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CartPage from './pages/Customer/CartPage';

import './App.css';

// Staff Layout Component
function StaffLayout() {
  return (
    <div className="flex min-h-screen bg-slate-900 font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 flex flex-col h-screen sticky top-0 z-40 overflow-hidden">
        <div className="p-8">
          <Link to="/staff" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
               <span className="font-black text-white text-xl italic">A</span>
            </div>
            <h2 className="text-xl font-bold font-outfit tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              AutoParts
            </h2>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          <div className="px-4 py-2 mb-2">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Core Navigation</p>
          </div>
          
          <Link to="/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 group text-slate-400 hover:text-white">
            <LayoutDashboard size={20} className="group-hover:text-indigo-400 transition-colors" />
            <span className="font-semibold text-sm">Overview</span>
          </Link>
          
          <Link to="/staff/register" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 group text-slate-400 hover:text-white">
            <User size={20} className="group-hover:text-indigo-400 transition-colors" />
            <span className="font-semibold text-sm">Registration</span>
          </Link>
          
          <Link to="/staff/sales" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 group text-slate-400 hover:text-white">
            <ShoppingBag size={20} className="group-hover:text-indigo-400 transition-colors" />
            <span className="font-semibold text-sm">Sales Terminal</span>
          </Link>
          
          <Link to="/staff/search" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 group text-slate-400 hover:text-white">
            <History size={20} className="group-hover:text-indigo-400 transition-colors" />
            <span className="font-semibold text-sm">Service History</span>
          </Link>
          
          <Link to="/staff/reports" className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all hover:bg-white/5 group text-slate-400 hover:text-white">
            <BarChart3 size={20} className="group-hover:text-indigo-400 transition-colors" />
            <span className="font-semibold text-sm">Analytics</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5">
          <button className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 font-bold text-sm">
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <header className="h-[80px] bg-slate-900/50 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-xl border border-white/5 md:w-[400px]">
             <History size={18} className="text-slate-500" />
             <input type="text" placeholder="Global search commands..." className="bg-transparent border-none outline-none text-sm text-slate-300 placeholder:text-slate-600 w-full" />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-sm font-bold text-white">Samyog Jung</span>
               <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500">Service Lead</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center border-4 border-slate-800 shadow-xl overflow-hidden group cursor-pointer ring-2 ring-indigo-500/20">
               <span className="text-white font-black group-hover:scale-110 transition-transform">SJ</span>
            </div>
          </div>
        </header>
        
        <div className="p-8 lg:p-12 overflow-x-hidden">
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
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth & Public Customer Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
