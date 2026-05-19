import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Car, CalendarCheck, Package, History, Star,
  UserCircle, Plus, ChevronRight, Loader2, AlertCircle,
} from 'lucide-react';
import { customerApi } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vehicle {
  vehicleID: number;
  vehicleNumber: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
  conditionNotes: string;
}

interface Profile {
  userID: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdDate: string;
  vehicles: Vehicle[];
}

// Quick-link card definition
interface QuickLink {
  to: string;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
}

const QUICK_LINKS: QuickLink[] = [
  { to: '/customer/appointments', label: 'Book Appointment', desc: 'Schedule a service visit',  icon: CalendarCheck, color: 'blue'   },
  { to: '/customer/parts',        label: 'Request Part',     desc: 'Submit an unavailable part', icon: Package,       color: 'violet' },
  { to: '/customer/history',      label: 'View History',     desc: 'Purchase & service logs',    icon: History,       color: 'emerald'},
  { to: '/customer/reviews',      label: 'Leave Review',     desc: 'Rate completed services',    icon: Star,          color: 'amber'  },
];

const COLOR_MAP: Record<string, string> = {
  blue:   'bg-blue-600/10   border-blue-500/20   text-blue-400',
  violet: 'bg-violet-600/10 border-violet-500/20 text-violet-400',
  emerald:'bg-emerald-600/10 border-emerald-500/20 text-emerald-400',
  amber:  'bg-amber-600/10  border-amber-500/20  text-amber-400',
};

// ─── Component ────────────────────────────────────────────────────────────────
const CustomerDashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Get userID from localStorage
  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.userID ?? user.UserID ?? user.id ?? 0;

  useEffect(() => {
    if (!userId) { setError('User session not found. Please log in again.'); setLoading(false); return; }

    customerApi.getProfile(userId)
      .then((res) => {
        // Backend wraps in { success, data }
        const data = res.data?.data ?? res.data;
        setProfile(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load your profile. Please refresh.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={36} className="animate-spin text-blue-500" />
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl">
      <AlertCircle size={20} /> {error}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ── Welcome Banner ────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-600/20 to-violet-600/10 border border-blue-500/20 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <p className="text-blue-400 text-sm font-bold uppercase tracking-widest mb-1">Welcome back</p>
          <h1 className="text-2xl font-black text-white">{profile?.fullName || (profile as any)?.FullName} 👋</h1>
          <p className="text-slate-400 text-sm mt-1">{profile?.email || (profile as any)?.Email} · {profile?.phone || (profile as any)?.Phone}</p>
        </div>
        <Link
          to="/customer/profile"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-sm font-bold"
        >
          <UserCircle size={16} /> Edit Profile
        </Link>
      </div>

      {/* ── Stats Row ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Vehicles',      value: (profile?.vehicles || (profile as any)?.Vehicles)?.length ?? 0, icon: Car,          color: 'text-blue-400'   },
          { label: 'Appointments',  value: '—',                            icon: CalendarCheck, color: 'text-violet-400' },
          { label: 'Part Requests', value: '—',                            icon: Package,       color: 'text-emerald-400'},
          { label: 'Reviews',       value: '—',                            icon: Star,          color: 'text-amber-400'  },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-slate-800 border border-slate-700 rounded-xl p-5">
            <Icon size={20} className={`${color} mb-3`} />
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* ── Quick Actions ──────────────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {QUICK_LINKS.map(({ to, label, desc, icon: Icon, color }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col gap-3 p-5 rounded-xl border ${COLOR_MAP[color]} hover:scale-[1.02] transition-all group`}
            >
              <Icon size={22} />
              <div>
                <p className="font-bold text-white text-sm">{label}</p>
                <p className="text-slate-500 text-xs mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={14} className="self-end group-hover:translate-x-1 transition-transform" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── My Vehicles ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Car size={18} className="text-blue-400" /> My Vehicles
          </h2>
          <Link
            to="/customer/profile"
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus size={14} /> Add Vehicle
          </Link>
        </div>

        {(!(profile?.vehicles || (profile as any)?.Vehicles) || (profile?.vehicles || (profile as any)?.Vehicles).length === 0) ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center text-slate-500">
            <Car size={36} className="mx-auto mb-3 text-slate-700" />
            <p className="font-bold text-white">No vehicles registered</p>
            <p className="text-sm mt-1">Go to My Profile to add your vehicles.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(profile?.vehicles || (profile as any)?.Vehicles).map((v: any) => (
              <div key={v.vehicleID || v.VehicleID} className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-blue-500/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <Car size={16} className="text-blue-400" />
                  </div>
                  <span className="text-xs font-bold bg-slate-700 text-slate-300 px-2 py-1 rounded-lg">
                    {v.vehicleType || v.VehicleType}
                  </span>
                </div>
                <h3 className="font-black text-white text-base">{v.brand || v.Brand} {v.model || v.Model}</h3>
                <p className="text-slate-400 text-xs mt-1">{v.vehicleNumber || v.VehicleNumber} · {v.year || v.Year}</p>
                {(v.conditionNotes || v.ConditionNotes) && (
                  <p className="text-slate-500 text-xs mt-2 truncate" title={v.conditionNotes || v.ConditionNotes}>
                    📝 {v.conditionNotes || v.ConditionNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
