import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Car, Calendar, ShoppingBag, ArrowLeft, Clock, Shield, ExternalLink, ChevronRight, FileText } from 'lucide-react';
import { staffApi } from '../../api/api';
import { Card, Button } from '../../components/ui-components';

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'history'>('history');

  useEffect(() => {
    if (id) loadCustomerDetails();
  }, [id]);

  const loadCustomerDetails = async () => {
    try {
      const response = await staffApi.getCustomer(parseInt(id!));
      setCustomer(response.data);
    } catch (error) {
      console.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse uppercase tracking-widest text-[10px]">Accessing Secure Records...</p>
      </div>
    </div>
  );

  if (!customer) return (
    <Card className="p-20 text-center flex flex-col items-center border-dashed border-white/5">
       <Shield size={48} className="text-slate-700 mb-6" />
       <h2 className="text-2xl font-bold text-white mb-2">Registry Mismatch</h2>
       <p className="text-slate-500 mb-8">The requested digital identity does not exist in the current node.</p>
       <Button variant="primary" onClick={() => window.history.back()}>
          Return to Registry
       </Button>
    </Card>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto pb-20"
    >
      <div className="flex items-center justify-between">
        <Link to="/staff/search" className="group flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
             <ArrowLeft size={16} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Return to Archives</span>
        </Link>
        <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="gap-2">
               <FileText size={16} /> Export Dossier
            </Button>
            <Button variant="primary" size="sm" className="gap-2">
               <Shield size={16} /> Verify Hash
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Profile Identity Card */}
        <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
          <Card className="p-8 text-center sticky top-[100px]">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center text-4xl font-black text-white shadow-2xl shadow-indigo-500/30">
                {customer.fullName[0]}
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-emerald-400 shadow-xl">
                 <Shield size={20} />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-tight">{customer.fullName}</h2>
            <p className="text-indigo-500 font-mono text-[10px] uppercase font-black tracking-[0.2em] mb-8">Verified Node: {customer.userID.toString().padStart(6, '0')}</p>
            
            <div className="space-y-4 text-left border-t border-white/5 pt-8">
              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                   <Mail size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Communication Channel</p>
                   <p className="text-sm font-bold text-slate-200">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                   <Phone size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Direct Contact</p>
                   <p className="text-sm font-bold text-slate-200">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-all">
                   <MapPin size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Geo-Coordinates</p>
                   <p className="text-sm font-bold text-slate-200">{customer.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                 <div className="flex-1 p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-center">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Tenure</p>
                    <p className="text-lg font-black text-white">{Math.floor((new Date().getTime() - new Date(customer.createdDate).getTime()) / (1000 * 60 * 60 * 24 * 30))}M</p>
                 </div>
                 <div className="flex-1 p-4 rounded-2xl bg-pink-500/5 border border-pink-500/10 text-center">
                    <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Fleet</p>
                    <p className="text-lg font-black text-white">{customer.vehicles.length}</p>
                 </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content Section */}
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-6">
          <div className="flex p-1.5 rounded-2xl bg-slate-900/50 border border-white/5 backdrop-blur-xl w-fit">
            <button 
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-white'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Activity Logs
            </button>
            <button 
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'vehicles' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-slate-500 hover:text-white'
              }`}
              onClick={() => setActiveTab('vehicles')}
            >
              Vehicle Assets
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'vehicles' ? (
              <motion.div 
                key="vehicles"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {customer.vehicles.map((v: any) => (
                  <Card key={v.vehicleID} className="p-6 group border-white/5 hover:border-indigo-500/30 transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        <Car size={32} />
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                         {v.vehicleType}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white mb-1 uppercase italic tracking-tighter">{v.vehicleNumber}</h3>
                    <p className="text-sm font-bold text-slate-500 mb-4">{v.brand} {v.model} • {v.year}</p>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-600 uppercase">Registered Asset</span>
                       <ChevronRight className="text-slate-800" size={16} />
                    </div>
                  </Card>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {[...customer.appointments, ...customer.sales]
                  .sort((a, b) => new Date(b.appointmentDate || b.salesDate).getTime() - new Date(a.appointmentDate || a.salesDate).getTime())
                  .map((item: any, idx: number) => {
                    const isAppointment = !!item.appointmentID;
                    return (
                      <div key={idx} className="relative pl-8 group">
                         {/* Timeline Line */}
                         <div className="absolute left-0 top-0 bottom-0 w-px bg-white/5 group-last:bottom-full group-last:h-6" />
                         <div className={`absolute left-[-4px] top-6 w-2 h-2 rounded-full ${isAppointment ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]'}`} />
                         
                         <Card className="p-6 hover:bg-white/[0.02] transition-colors border-white/5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                               <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isAppointment ? 'bg-amber-500/10 text-amber-500' : 'bg-pink-500/10 text-pink-400'}`}>
                                     {isAppointment ? <Calendar size={20} /> : <ShoppingBag size={20} />}
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-black text-white uppercase tracking-tight">{isAppointment ? 'Service Interaction' : 'Module Acquisition'}</h4>
                                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{new Date(item.appointmentDate || item.salesDate).toLocaleDateString()}</p>
                                  </div>
                               </div>
                               <div className="text-right">
                                  {isAppointment ? (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                       {item.status}
                                    </span>
                                  ) : (
                                    <p className="text-lg font-black text-white tracking-tighter">${item.finalAmount.toFixed(2)}</p>
                                  )}
                               </div>
                            </div>
                            
                            <div className="bg-slate-900 px-5 py-4 rounded-xl border border-white/5">
                               {isAppointment ? (
                                 <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-300">{item.serviceType}</p>
                                    <p className="text-xs text-slate-600 leading-relaxed italic">"{item.notes}"</p>
                                 </div>
                               ) : (
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-mono text-slate-500">REF: #{item.salesInvoiceID}</span>
                                       {item.discountAmount > 0 && <span className="text-[10px] font-black text-pink-500 border border-pink-500/30 px-2 py-0.5 rounded">LOYALTY CREDIT</span>}
                                    </div>
                                    <Link to={`/staff/invoice/${item.salesInvoiceID}`}>
                                      <Button variant="ghost" size="sm" className="h-8 group/btn">
                                         Audit <ExternalLink size={12} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                      </Button>
                                    </Link>
                                 </div>
                               )}
                            </div>
                         </Card>
                      </div>
                    );
                  })}
                
                {customer.appointments.length === 0 && customer.sales.length === 0 && (
                  <Card className="p-12 text-center border-dashed border-white/5 bg-transparent">
                     <Clock size={32} className="text-slate-800 mx-auto mb-4" />
                     <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Zero transactional data found</p>
                  </Card>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CustomerDetails;
