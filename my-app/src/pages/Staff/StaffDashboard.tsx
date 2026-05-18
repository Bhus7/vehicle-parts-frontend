import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Calendar, AlertTriangle, ArrowRight, TrendingUp, Zap, ChevronRight, Bell, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { staffApi } from '../../api/api';
import { Card, Button } from '../../components/ui-components';

const StaffDashboard = () => {
  const navigate = useNavigate();
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Synchronizing Data...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Total Customers', value: stats?.totalCustomers, icon: Users, color: 'indigo', trend: '+12.5%' },
    { label: 'Revenue Generated', value: `Rs. ${stats?.totalSales.toFixed(2)}`, icon: DollarSign, color: 'emerald', trend: '+8.2%' },
    { label: 'Active Service', value: stats?.pendingAppointments, icon: Calendar, color: 'amber', trend: '-2.4%' },
    { label: 'Inventory Alerts', value: stats?.lowStockAlerts, icon: AlertTriangle, color: 'rose', trend: 'Critical' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-indigo-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-2 block">Enterprise Overview</span>
          <h1 className="text-4xl font-outfit font-bold text-white mb-2">Systems Health</h1>
          <p className="text-slate-400">Live operational metrics and service performance.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2">
            <Activity size={18} />
            Diagnostics
          </Button>
          <Button variant="primary" className="gap-2 shadow-indigo-500/20">
            <Zap size={18} />
            Live Sync
          </Button>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="group relative overflow-hidden">
               {/* Ambient Glow */}
               <div className={`absolute -right-4 -top-4 w-24 h-24 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 bg-${stat.color}-500`} />
               
               <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
                       <stat.icon size={24} />
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-white/5 ${stat.trend.includes('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stat.trend}
                    </span>
                 </div>
                 <h3 className="text-3xl font-black text-white mb-1 group-hover:translate-x-1 transition-transform">{stat.value}</h3>
                 <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none">{stat.label}</p>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Recent Operations */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-outfit text-white flex items-center gap-3">
              Operational Logs
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </h2>
            <Link to="/staff/search" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 group">
              VIEW ARCHIVES <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <Card className="overflow-hidden border-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-white/[0.02] border-b border-white/5">
                   <tr>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Event Signature</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Resource</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                     <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                    {stats?.recentSales && stats.recentSales.length > 0 ? (
                      stats.recentSales.map((sale: any) => (
                        <tr 
                          key={sale.salesInvoiceID} 
                          onClick={() => navigate(`/staff/invoice/${sale.salesInvoiceID}`)}
                          className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                        >
                           <td className="px-6 py-4">
                              <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">Sales Invoice</p>
                              <p className="text-[10px] text-slate-600 font-mono">#{sale.salesInvoiceID}</p>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-xs font-medium text-slate-400">{sale.customerName}</span>
                           </td>
                           <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                sale.paymentStatus.toLowerCase() === 'paid'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {sale.paymentStatus}
                              </span>
                           </td>
                           <td className="px-6 py-4">
                              <span className="text-xs font-mono text-slate-500">{new Date(sale.salesDate).toLocaleDateString()}</span>
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
                          No recent sales transactions recorded.
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Quick Commands */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-xl font-bold font-outfit text-white">Quick Deployment</h2>
          <div className="space-y-4">
             {[
               { title: 'New Customer', desc: 'Secure profile establishment', icon: Users, to: '/staff/register', color: 'indigo' },
               { title: 'Terminal POS', desc: 'Execute transaction protocols', icon: Zap, to: '/staff/sales', color: 'pink' },
               { title: 'Analytics', desc: 'Financial data processing', icon: TrendingUp, to: '/staff/reports', color: 'emerald' },
             ].map((action, i) => (
               <Link key={i} to={action.to} className="block group">
                 <Card className="p-5 border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.03] transition-all duration-300">
                    <div className="flex items-center gap-4">
                       <div className={`w-10 h-10 rounded-xl bg-${action.color}-500/10 flex items-center justify-center text-${action.color}-400 group-hover:scale-110 transition-transform`}>
                          <action.icon size={20} />
                       </div>
                       <div className="flex-1">
                          <h4 className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-wider">{action.title}</h4>
                          <p className="text-[10px] font-medium text-slate-500">{action.desc}</p>
                       </div>
                       <ArrowRight size={16} className="text-slate-700 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                 </Card>
               </Link>
             ))}
          </div>

          <Card className="p-6 bg-gradient-to-br from-indigo-600 to-pink-600 border-none shadow-xl shadow-indigo-500/20">
             <div className="flex items-start justify-between mb-8">
               <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white">
                 <Bell size={24} className="animate-bounce" />
               </div>
               <span className="text-[10px] font-black bg-white/20 px-2 py-1 rounded text-white italic">PRO FEATURE</span>
             </div>
             <h3 className="text-lg font-black text-white mb-2 font-outfit">SaaS Integration Active</h3>
             <p className="text-xs text-white/70 leading-relaxed mb-6">Your backend API is fully synchronized with the enterprise cloud nodes.</p>
             <Button variant="secondary" className="w-full bg-white text-indigo-600 hover:bg-white/90 border-none shadow-none">
                CONFIGURE NODES
             </Button>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StaffDashboard;
