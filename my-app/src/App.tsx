import { BrowserRouter, Routes, Route, Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
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
import PartRequests from './pages/Customer/PartRequests';
import CustomerRequests from './pages/admin/CustomerRequests';

import './App.css';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles: string[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userStr);
  
  let userRole = '';
  const roleId = user.roleID ?? user.RoleID;
  if (roleId === 1) userRole = 'Admin';
  else if (roleId === 2) userRole = 'Staff';
  else if (roleId === 3) userRole = 'Customer';

  const isAllowed = allowedRoles.some(r => r.toLowerCase() === userRole.toLowerCase());
  
  if (!isAllowed) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Staff Layout Component
function StaffLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  const getRoleName = (roleId: number) => {
    if (roleId === 1) return 'Admin';
    if (roleId === 2) return 'Staff';
    if (roleId === 3) return 'Customer';
    return 'Service Lead';
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path === '/staff') return location.pathname === '/staff';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] font-sans text-slate-800 selection:bg-indigo-500/10">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-white border-r border-slate-200/80 flex flex-col h-screen sticky top-0 z-40 overflow-hidden">
        <div className="p-8">
          <Link to="/staff" className="group flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
               <span className="font-black text-white text-xl italic">A</span>
            </div>
            <h2 className="text-xl font-bold font-outfit tracking-tight text-slate-800">
              AutoParts
            </h2>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <div className="px-4 py-2 mb-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">Core Navigation</p>
          </div>
          
          <Link 
            to="/staff" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/staff') 
                ? 'bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600 rounded-l-none' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <LayoutDashboard size={18} className={isActive('/staff') ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="text-sm">Overview</span>
          </Link>
          
          <Link 
            to="/staff/register" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/staff/register') 
                ? 'bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600 rounded-l-none' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <User size={18} className={isActive('/staff/register') ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="text-sm">Registration</span>
          </Link>
          
          <Link 
            to="/staff/sales" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/staff/sales') 
                ? 'bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600 rounded-l-none' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ShoppingBag size={18} className={isActive('/staff/sales') ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="text-sm">Sales Terminal</span>
          </Link>
          
          <Link 
            to="/staff/search" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/staff/search') 
                ? 'bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600 rounded-l-none' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <History size={18} className={isActive('/staff/search') ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="text-sm">Service History</span>
          </Link>
          
          <Link 
            to="/staff/reports" 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              isActive('/staff/reports') 
                ? 'bg-indigo-50 text-indigo-600 font-semibold border-l-4 border-indigo-600 rounded-l-none' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <BarChart3 size={18} className={isActive('/staff/reports') ? 'text-indigo-600' : 'text-slate-400'} />
            <span className="text-sm">Analytics</span>
          </Link>
        </nav>
 
        <div className="p-4 border-t border-slate-100">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all duration-200 font-semibold text-sm">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
 
      {/* Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Top Header */}
        <header className="h-[80px] bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200/80 md:w-[400px]">
             <History size={16} className="text-slate-400" />
             <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm text-slate-700 placeholder:text-slate-400 w-full" />
          </div>
 
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-sm font-bold text-slate-800">{user.fullName || user.FullName || 'Guest User'}</span>
               <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">{getRoleName(user.roleID || user.RoleID)}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden cursor-pointer shadow-sm">
               <span>{getInitials(user.fullName || user.FullName)}</span>
            </div>
          </div>
        </header>
        
        <div className="p-8 lg:p-10 overflow-x-hidden">
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
        <Route path="/customer/requests" element={
          <ProtectedRoute allowedRoles={['Customer']}>
            <PartRequests />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['Admin']}>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="parts" element={<PartsInventory />} />
          <Route path="vendors" element={<VendorsDirectory />} />
          <Route path="requests" element={<CustomerRequests />} />
          <Route path="purchase/new" element={<NewPurchaseOrder />} />
          <Route path="purchase/history" element={<PurchaseHistory />} />
          <Route path="staff" element={<StaffManagement />} />
        </Route>

        {/* Staff Routes */}
        <Route path="/staff" element={
          <ProtectedRoute allowedRoles={['Staff']}>
            <StaffLayout />
          </ProtectedRoute>
        }>
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
