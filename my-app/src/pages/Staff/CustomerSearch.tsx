import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Car, ChevronRight, AlertCircle, UserPlus, Mail, Hash, Filter, ArrowUpDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { staffApi } from '../../api/api';
import { Card, Button } from '../../components/ui-components';

const CustomerSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await staffApi.searchCustomers(query);
      setResults(response.data);
    } catch (err) {
      console.error('Search failed', err);
      setError('System failure while querying customer nodes. Please verify network status.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const rowVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-indigo-500 font-bold tracking-[0.2em] text-[10px] uppercase mb-2 block">Database Access</span>
          <h1 className="text-4xl font-outfit font-bold text-white mb-2">Customer Registry</h1>
          <p className="text-slate-400">Query and manage identity records across the AutoParts network.</p>
        </div>
        <Button variant="primary" className="gap-2 px-8" onClick={() => navigate('/staff/register')}>
           <UserPlus size={18} />
           Provision Customer
        </Button>
      </div>

      <Card className="p-2 border-white/5 bg-slate-900/40 sticky top-[100px] z-10 backdrop-blur-xl">
        <div className="flex items-center gap-4 px-4 py-2">
          <Search size={20} className="text-indigo-500" />
          <input 
            className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder:text-slate-600 py-2"
            placeholder="Search by identity, contact string, or vehicle plate..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="hidden md:flex items-center gap-2">
             <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global</div>
             <Filter size={18} className="text-slate-600 hover:text-white cursor-pointer transition-colors" />
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">Executing Query...</p>
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-12 border-rose-500/20 bg-rose-500/5 text-center">
              <AlertCircle size={48} className="text-rose-500 mx-auto mb-4" />
              <p className="text-rose-400 font-bold">{error}</p>
            </Card>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <Card className="overflow-hidden border-white/5">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-2">Citizen Identity <ArrowUpDown size={12} /></div>
                      </th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Contact Vector</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Fleet Data</th>
                      <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Operations</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {results.map((customer) => (
                      <motion.tr 
                        variants={rowVariants}
                        key={customer.userID} 
                        className="group hover:bg-white/[0.02] transition-colors cursor-pointer"
                        onClick={() => navigate(`/staff/customer/${customer.userID}`)}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 font-bold text-lg">
                              {customer.fullName[0]}
                            </div>
                            <div>
                               <p className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{customer.fullName}</p>
                               <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono mt-0.5">
                                 <Hash size={10} />
                                 <span>{customer.userID.toString().padStart(6, '0')}</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="space-y-1">
                             <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                               <Phone size={12} className="text-indigo-500" />
                               {customer.phone}
                             </div>
                             <div className="flex items-center gap-2 text-[10px] text-slate-500">
                               <Mail size={12} />
                               {customer.email}
                             </div>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="flex flex-wrap gap-2">
                             {customer.vehicles && customer.vehicles.length > 0 ? (
                               customer.vehicles.map((v: string) => (
                                <span key={v} className="px-3 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 flex items-center gap-2 group-hover:border-indigo-500/30 transition-colors">
                                  <Car size={12} className="text-indigo-500" /> {v}
                                </span>
                               ))
                             ) : (
                               <span className="text-[10px] text-slate-700 italic uppercase">No craft registered</span>
                             )}
                           </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                           <Button 
                             size="sm" 
                             variant="secondary" 
                             className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0"
                           >
                             Full Profile <ChevronRight size={14} className="ml-1" />
                           </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-24 text-center border-dashed border-white/5 bg-transparent">
               <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center text-slate-700 mx-auto mb-6 border border-white/5">
                 <Search size={40} />
               </div>
               <h3 className="text-xl font-bold text-white mb-2">No results matched your query</h3>
               <p className="text-slate-500 max-w-sm mx-auto text-sm">Attempt to identify by different parameters or initiate a new customer provisioning protocol.</p>
               <Button variant="outline" className="mt-8 gap-2 border-white/10" onClick={() => setQuery('')}>
                  Clear Query
               </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearch;
