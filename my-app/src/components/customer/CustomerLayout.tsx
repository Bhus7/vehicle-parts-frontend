import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { userApi } from '../../api/api';
import {
  LayoutDashboard,
  CalendarCheck,
  Package,
  History,
  Star,
  UserCircle,
  LogOut,
  Car,
} from 'lucide-react';

// ─── Sidebar nav items ───────────────────────────────────────────────────────
const NAV_ITEMS = [
  { to: '/customer/dashboard',    label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/customer/appointments', label: 'Appointments',   icon: CalendarCheck   },
  { to: '/customer/parts',        label: 'Part Requests',  icon: Package         },
  { to: '/customer/history',      label: 'Service History',icon: History         },
  { to: '/customer/reviews',      label: 'Reviews',        icon: Star            },
  { to: '/customer/profile',      label: 'My Profile',     icon: UserCircle      },
];

// ─── Component ────────────────────────────────────────────────────────────────
const CustomerLayout = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');

  const getInitials = (name: string) =>
    name ? name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  const isActive = (path: string) =>
    path === '/customer/dashboard'
      ? location.pathname === path
      : location.pathname.startsWith(path);

  const handleLogout = async () => {
    try {
      // Notify backend to invalidate session/cookie
      await userApi.logout();
    } catch {
      // Proceed with client-side logout even if backend call fails
    } finally {
      // Clear localStorage
      localStorage.removeItem('user');
      // Clear all browser cookies for this domain
      document.cookie.split(';').forEach((cookie) => {
        const name = cookie.split('=')[0].trim();
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      });
      navigate('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200">

      {/* ── Sidebar ─────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 z-40">

        {/* Brand */}
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow shadow-blue-600/40 group-hover:scale-105 transition-transform">
              <span className="font-black text-white italic">A</span>
            </div>
            <div>
              <h2 className="text-base font-black text-white tracking-tight leading-none">AutoParts</h2>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Customer Portal</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold ${
                isActive(to)
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon size={17} className={isActive(to) ? 'text-blue-400' : 'text-slate-500'} />
              {label}
            </Link>
          ))}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
              {getInitials(user.fullName || user.FullName || '')}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.fullName || user.FullName || 'Customer'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email || user.Email || ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
          >
            <LogOut size={15} /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="h-16 bg-slate-900 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Car size={16} className="text-blue-400" />
            <span>Customer Portal</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="text-slate-600">Logged in as</span>
            <span className="font-bold text-white">{user.fullName || user.FullName || 'Customer'}</span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;
