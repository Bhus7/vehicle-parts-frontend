import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertCircle, Award, FileText, Download, Calendar, BarChart2, Info } from 'lucide-react';
import { staffApi } from '../../api/api';
import { Card, Button } from '../../components/ui-components';

const Reports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const response = await staffApi.getReports();
      setData(response.data);
    } catch (error) {
      console.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
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
        <p className="text-slate-500 font-medium animate-pulse uppercase tracking-[0.2em] text-xs">Compiling Intelligence...</p>
      </div>
    </div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-pink-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-2 block">Business Intelligence</span>
          <h1 className="text-4xl font-outfit font-bold text-white mb-2">Performance Audit</h1>
          <p className="text-slate-400">Deep-dive into high-value accounts and collection risks.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-indigo-500/20 text-indigo-400">
            <Download size={18} />
            Export PDF
          </Button>
          <Button variant="primary" className="gap-2">
            <Calendar size={18} />
            Q2 Summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* High Spenders */}
        <motion.div variants={itemVariants}>
          <Card className="h-full group">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-outfit">High Value Accounts</h3>
                </div>
                <TrendingUp className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" size={24} />
              </div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Top 5 Lifecycle Revenue</p>
            </div>
            
            <div className="p-4 space-y-2">
              {data?.highSpenders.map((user: any, idx: number) => (
                <div key={user.userID} className="group/item flex items-center gap-4 p-4 rounded-2xl hover:bg-white/[0.03] transition-all border border-transparent hover:border-white/5">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{user.fullName}</p>
                    <p className="text-[10px] text-slate-500 font-mono">UID: {user.userID}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">${user.totalSpent.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-600 uppercase font-black tracking-tighter">Certified VIP</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Regular Customers */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <div className="p-8 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-bold text-white font-outfit">Retention Heroes</h3>
              </div>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Top 5 Engagement Frequency</p>
            </div>

            <div className="p-4 space-y-2">
              {data?.regulars.map((user: any, idx: number) => (
                <div key={user.userID} className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-indigo-400 font-black text-xs">
                    {user.fullName.split(' ').map((n: any) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{user.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-500 rounded-full" style={{ width: `${(user.visitCount / 20) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500">{user.visitCount} SESSIONS</span>
                    </div>
                  </div>
                  <Award size={20} className={idx < 3 ? 'text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]' : 'text-slate-700'} />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pending Credits */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card className="overflow-hidden">
            <div className="p-8 border-b border-white/5 bg-white/[0.02] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400">
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-white font-outfit">Outstanding Collections</h3>
                </div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Receivables Risk Analysis</p>
              </div>
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-orange-500/10 border border-orange-500/20">
                <Info size={16} className="text-orange-400" />
                <p className="text-[10px] font-bold text-orange-400 uppercase tracking-wider">Follow-up required for {data?.pendingPayments.length} entries</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 border-b border-white/5">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Invoice Ref</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Beneficiary</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Amount Due</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Maturity Date</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Risk Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.pendingPayments.length > 0 ? (
                    data.pendingPayments.map((p: any) => (
                      <tr key={p.salesInvoiceID} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                             <FileText size={16} className="text-slate-600 group-hover:text-amber-500 transition-colors" />
                             <span className="text-xs font-mono font-bold text-white">#{p.salesInvoiceID}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{p.customerName}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-black text-rose-400">${p.finalAmount.toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-xs font-medium text-slate-500 italic">
                             {p.dueDate ? new Date(p.dueDate).toLocaleDateString() : 'IMMEDIATE'}
                           </span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-rose-500/10 text-rose-500 border border-rose-500/20">
                             OVERDUE
                           </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                             <BarChart2 size={32} />
                          </div>
                          <p className="text-slate-500 italic max-w-xs">No outstanding collections found. Financial health is optimal.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Reports;
