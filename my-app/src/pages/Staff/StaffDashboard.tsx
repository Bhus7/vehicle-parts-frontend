import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, Calendar, Package, ArrowRight, ChevronRight, ShoppingBag } from 'lucide-react';
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
      console.error('Failed to load stats', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-xs font-semibold tracking-wider">Loading Dashboard...</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Registered Customers', value: stats?.totalCustomers ?? 0, icon: Users, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
    { label: 'Parts in Inventory', value: stats?.totalProducts ?? 0, icon: Package, color: 'text-sky-600 bg-sky-50 border-sky-100' },
    { label: 'Sales Revenue', value: `Rs. ${(stats?.totalRevenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { label: 'Scheduled Appointments', value: stats?.totalAppointments ?? 0, icon: Calendar, color: 'text-amber-600 bg-amber-50 border-amber-100' },
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-indigo-600 font-semibold tracking-wider text-xs uppercase mb-1 block">Staff Portal</span>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 mb-1">Welcome Back</h1>
          <p className="text-slate-500 text-sm">Here is a quick overview of today's store performance and recent activities.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/staff/sales">
            <Button variant="primary" className="gap-2 shadow-sm font-medium">
              <ShoppingBag size={16} />
              New Sale
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants}>
            <Card className="border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200">
               <div className="p-5 flex items-center justify-between">
                 <div className="space-y-1.5">
                   <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider leading-none">{stat.label}</p>
                   <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
                 </div>
                 <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${stat.color}`}>
                    <stat.icon size={22} />
                 </div>
               </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-8">
        {/* Recent Transactions */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-outfit text-slate-800">
              Recent Sales Invoices
            </h2>
            <Link to="/staff/search" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group">
              Search Customers <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <Card className="border border-slate-200/80 shadow-sm overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-slate-50 border-b border-slate-200">
                   <tr>
                     <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">Invoice ID</th>
                     <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">Customer</th>
                     <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">Amount</th>
                     <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">Payment</th>
                     <th className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-slate-600">Date</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-slate-700">
                    {stats?.recentInvoices && stats.recentInvoices.length > 0 ? (
                      stats.recentInvoices.map((invoice: any) => (
                        <tr 
                          key={invoice.invoiceId} 
                          onClick={() => navigate(`/staff/invoice/${invoice.invoiceId}`)}
                          className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                        >
                           <td className="px-5 py-3.5">
                              <span className="text-sm font-semibold text-indigo-600 hover:underline">#{invoice.invoiceId}</span>
                           </td>
                           <td className="px-5 py-3.5">
                              <span className="text-sm font-medium text-slate-700">{invoice.customerName}</span>
                           </td>
                           <td className="px-5 py-3.5">
                              <span className="text-sm font-semibold text-slate-800">Rs. {invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                           </td>
                           <td className="px-5 py-3.5">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                invoice.status.toLowerCase() === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {invoice.status}
                              </span>
                           </td>
                           <td className="px-5 py-3.5">
                              <span className="text-xs text-slate-500">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-5 py-10 text-center text-slate-400 text-sm italic">
                          No recent sales invoices recorded.
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Quick Operations panel */}
        <motion.div variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-bold font-outfit text-slate-800">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-3.5">
             {[
               { title: 'Register Customer', desc: 'Add customer with vehicle details', icon: Users, to: '/staff/register', color: 'text-indigo-600 bg-indigo-50' },
               { title: 'Create Sales Invoice', desc: 'Sell parts and record payment', icon: ShoppingBag, to: '/staff/sales', color: 'text-emerald-600 bg-emerald-50' },
             ].map((action, i) => (
               <Link key={i} to={action.to} className="block group">
                 <Card className="p-4 border border-slate-200/80 shadow-sm hover:border-indigo-300 hover:shadow-md hover:bg-slate-50/50 transition-all duration-200">
                    <div className="flex items-center gap-3.5">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-105 transition-transform`}>
                          <action.icon size={20} />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">{action.title}</h4>
                          <p className="text-xs text-slate-500 truncate">{action.desc}</p>
                       </div>
                       <ArrowRight size={16} className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                 </Card>
               </Link>
             ))}
          </div>

          {/* Simple, natural help card */}
          <Card className="p-5 border border-indigo-100 bg-gradient-to-br from-indigo-50/60 to-indigo-100/30 rounded-2xl">
             <h3 className="text-sm font-bold text-indigo-900 mb-1 font-outfit">Need Assistance?</h3>
             <p className="text-xs text-indigo-700/80 leading-relaxed mb-3">
               If you need to update stock alerts or manage backend configuration, please contact the administrator.
             </p>
             <div className="text-[10px] font-semibold text-indigo-600/70 uppercase tracking-wider">
               AutoParts Enterprise Portal v1.2
             </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default StaffDashboard;
