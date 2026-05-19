import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Phone, Car, ChevronRight, AlertCircle, UserPlus, Mail, Hash } from 'lucide-react';
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
    }, 200);
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
      setError('An error occurred while fetching customers. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const rowVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span className="text-indigo-600 font-semibold tracking-wider text-xs uppercase mb-1 block">Staff Directory</span>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 mb-1">Customer Search</h1>
          <p className="text-slate-500 text-sm">Lookup customer accounts and their registered vehicles.</p>
        </div>
        <Button variant="primary" className="gap-2 px-6 font-medium" onClick={() => navigate('/staff/register')}>
           <UserPlus size={16} />
           Register Customer
        </Button>
      </div>

      {/* Search Input Card */}
      <Card className="p-1 border border-slate-200 shadow-sm bg-white sticky top-[80px] z-10">
        <div className="flex items-center gap-3 px-3 py-1">
          <Search size={18} className="text-slate-400" />
          <input 
            className="flex-1 bg-transparent border-none outline-none text-base text-slate-800 placeholder:text-slate-400 py-1.5"
            placeholder="Search by name, email, phone, or plate number..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 px-2"
            >
              Clear
            </button>
          )}
        </div>
      </Card>

      {/* Results Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-400 tracking-wider">Searching...</p>
          </div>
        ) : error ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="p-10 border border-red-200 bg-red-50/50 text-center">
              <AlertCircle size={40} className="text-red-500 mx-auto mb-3" />
              <p className="text-red-700 font-medium text-sm">{error}</p>
            </Card>
          </motion.div>
        ) : results.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <Card className="overflow-hidden border border-slate-200 shadow-sm bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Customer Name</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Contact Details</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600">Registered Vehicles</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-600 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {results.map((customer) => (
                      <motion.tr 
                        variants={rowVariants}
                        key={customer.userID} 
                        className="group hover:bg-slate-50/50 transition-colors cursor-pointer"
                        onClick={() => navigate(`/staff/customer/${customer.userID}`)}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-base">
                              {customer.fullName[0].toUpperCase()}
                            </div>
                            <div>
                               <p className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{customer.fullName}</p>
                               <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                                 <Hash size={10} />
                                 <span>ID: {customer.userID}</span>
                               </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="space-y-1 text-sm">
                             <div className="flex items-center gap-2 text-slate-700 font-medium">
                               <Phone size={12} className="text-slate-400" />
                               {customer.phone}
                             </div>
                             <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                               <Mail size={12} />
                               {customer.email}
                             </div>
                           </div>
                        </td>
                        <td className="px-6 py-5">
                           <div className="flex flex-wrap gap-1.5">
                             {customer.vehicles && customer.vehicles.length > 0 ? (
                               customer.vehicles.map((v: string) => (
                                <span key={v} className="px-2.5 py-0.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600 flex items-center gap-1.5 group-hover:border-indigo-200 transition-colors">
                                  <Car size={11} className="text-indigo-500" /> {v}
                                </span>
                               ))
                             ) : (
                               <span className="text-xs text-slate-400 italic">No vehicles</span>
                             )}
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <Button 
                             size="sm" 
                             variant="secondary" 
                             className="font-medium border border-slate-200 bg-white"
                           >
                             View Profile <ChevronRight size={12} className="ml-1" />
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
            <Card className="p-16 text-center border-dashed border-slate-300 bg-slate-50/50">
               <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4 border border-slate-200">
                 <Search size={32} />
               </div>
               <h3 className="text-lg font-bold text-slate-700 mb-1">No customers found</h3>
               <p className="text-slate-500 max-w-sm mx-auto text-sm">We couldn't find any customers matching "{query}". Double check spelling or add a new customer.</p>
               <Button variant="outline" className="mt-6 border-slate-300 font-medium" onClick={() => setQuery('')}>
                  Clear Search
               </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearch;
