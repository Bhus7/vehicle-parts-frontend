import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, Package, Star, Clock, User, ArrowRight, Wrench } from 'lucide-react';
import { profileApi } from '../../api/customerApi';

const CustomerDashboard = () => {
  const [customerName, setCustomerName] = useState('Customer');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const customerId = localStorage.getItem('customerId');
        if (customerId) {
          const response = await profileApi.getProfile(parseInt(customerId));
          setCustomerName(response.data.fullName || response.data.name || 'Customer');
        }
      } catch {
        // Use stored customer data as fallback
        const stored = localStorage.getItem('customer');
        if (stored) {
          const data = JSON.parse(stored);
          setCustomerName(data.fullName || data.name || 'Customer');
        }
      }
    };
    loadProfile();
  }, []);

  // Quick action cards for the dashboard
  const quickActions = [
    {
      title: 'My Profile',
      description: 'View and update your personal information',
      icon: <User size={28} />,
      link: '/customer/profile',
      color: 'from-blue-500 to-blue-600',
      shadow: 'shadow-blue-500/20',
    },
    {
      title: 'My Vehicles',
      description: 'Manage your registered vehicles',
      icon: <Car size={28} />,
      link: '/customer/vehicles',
      color: 'from-emerald-500 to-emerald-600',
      shadow: 'shadow-emerald-500/20',
    },
    {
      title: 'Appointments',
      description: 'Book or manage service appointments',
      icon: <Calendar size={28} />,
      link: '/customer/appointments',
      color: 'from-violet-500 to-violet-600',
      shadow: 'shadow-violet-500/20',
    },
    {
      title: 'Part Requests',
      description: 'Request unavailable parts',
      icon: <Package size={28} />,
      link: '/customer/part-requests',
      color: 'from-amber-500 to-amber-600',
      shadow: 'shadow-amber-500/20',
    },
    {
      title: 'Reviews',
      description: 'Rate and review our services',
      icon: <Star size={28} />,
      link: '/customer/reviews',
      color: 'from-pink-500 to-pink-600',
      shadow: 'shadow-pink-500/20',
    },
    {
      title: 'Service History',
      description: 'View your purchase and service records',
      icon: <Clock size={28} />,
      link: '/customer/history',
      color: 'from-cyan-500 to-cyan-600',
      shadow: 'shadow-cyan-500/20',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-blue-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Wrench size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Welcome back, {customerName}!</h1>
            <p className="text-slate-400 mt-1">Manage your vehicles, appointments, and service history all in one place.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              to={action.link}
              className="group bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 shadow-lg ${action.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white">{action.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{action.title}</h3>
              <p className="text-sm text-slate-400 mb-4">{action.description}</p>
              <div className="flex items-center gap-1 text-blue-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CustomerDashboard;
