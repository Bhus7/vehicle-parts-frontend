import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Car, Calendar, ShoppingBag, ArrowLeft, Clock, Shield, ExternalLink, ChevronRight, User } from 'lucide-react';
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
        <p className="text-slate-500 font-medium animate-pulse uppercase tracking-widest text-[10px]">Loading customer profile...</p>
      </div>
    </div>
  );

  if (!customer) return (
    <Card className="p-20 text-center flex flex-col items-center border-dashed border-slate-200 bg-white shadow-sm">
       <User size={48} className="text-slate-400 mb-6" />
       <h2 className="text-2xl font-bold text-slate-800 mb-2">Customer Not Found</h2>
       <p className="text-slate-500 mb-8">The requested customer record does not exist.</p>
       <Button variant="primary" onClick={() => window.history.back()}>
          Go Back
       </Button>
    </Card>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20"
    >
      <div className="flex items-center justify-between">
        <Link to="/staff/search" className="group flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200/50 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
             <ArrowLeft size={14} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Customers</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 items-start">
        {/* Profile Identity Card */}
        <motion.div variants={{ hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } }}>
          <Card className="p-8 text-center sticky top-[100px] bg-white border border-slate-200 shadow-sm">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl font-black text-white shadow-sm">
                <User size={64} className="text-indigo-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 mb-1 uppercase tracking-tight">{customer.fullName}</h2>
            <p className="text-indigo-600 font-mono text-[10px] uppercase font-black tracking-[0.2em] mb-8">Customer ID: {customer.userID.toString().padStart(6, '0')}</p>
            
            <div className="space-y-4 text-left border-t border-slate-100 pt-8">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-450 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                   <Mail size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                   <p className="text-sm font-bold text-slate-800">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-450 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                   <Phone size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</p>
                   <p className="text-sm font-bold text-slate-800">{customer.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-450 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                   <MapPin size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                   <p className="text-sm font-bold text-slate-800">{customer.address}</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Content Section */}
        <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="space-y-6">
          <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 w-fit">
            <button 
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
              }`}
              onClick={() => setActiveTab('history')}
            >
              Activity History
            </button>
            <button 
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                activeTab === 'vehicles' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-800'
              }`}
              onClick={() => setActiveTab('vehicles')}
            >
              Registered Vehicles
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
                  <Card key={v.vehicleID} className="p-6 group border border-slate-200 hover:border-indigo-200 bg-white shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-650 group-hover:scale-105 transition-transform">
                        <Car size={32} />
                      </div>
                      <span className="px-3 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                         {v.vehicleType}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-850 mb-1 uppercase italic tracking-tighter">{v.vehicleNumber}</h3>
                    <p className="text-sm font-bold text-slate-500 mb-4">{v.brand} {v.model} • {v.year}</p>
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                       <span className="text-[10px] font-black text-slate-400 uppercase">Vehicle Info</span>
                       <ChevronRight className="text-slate-400 group-hover:text-indigo-600 transition-colors" size={16} />
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
                         <div className="absolute left-0 top-0 bottom-0 w-px bg-slate-200 group-last:bottom-full group-last:h-6" />
                         <div className={`absolute left-[-4px] top-6 w-2 h-2 rounded-full ${isAppointment ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.3)]' : 'bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]'}`} />
                         
                         <Card className="p-6 hover:bg-slate-50/50 transition-colors border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                               <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${isAppointment ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-pink-550/10 border-pink-100 text-pink-600'}`}>
                                     {isAppointment ? <Calendar size={20} /> : <ShoppingBag size={20} />}
                                  </div>
                                  <div>
                                     <h4 className="text-sm font-semibold text-slate-800 uppercase tracking-tight">{isAppointment ? 'Appointment' : 'Parts Purchase'}</h4>
                                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.appointmentDate || item.salesDate).toLocaleDateString()}</p>
                                  </div>
                                </div>
                               <div className="text-right">
                                  {isAppointment ? (
                                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-200">
                                       {item.status}
                                    </span>
                                  ) : (
                                    <p className="text-lg font-black text-slate-800 tracking-tighter font-mono">Rs. {item.finalAmount.toFixed(2)}</p>
                                  )}
                               </div>
                            </div>
                            
                            <div className="bg-slate-50 px-5 py-4 rounded-xl border border-slate-200">
                               {isAppointment ? (
                                 <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-700">{item.serviceType}</p>
                                    <p className="text-xs text-slate-500 leading-relaxed italic">"{item.notes}"</p>
                                 </div>
                               ) : (
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                       <span className="text-[10px] font-mono text-slate-450">REF: #{item.salesInvoiceID}</span>
                                       {item.discountAmount > 0 && <span className="text-[10px] font-bold text-pink-650 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded">LOYALTY CREDIT</span>}
                                    </div>
                                    <Link to={`/staff/invoice/${item.salesInvoiceID}`}>
                                      <Button variant="ghost" size="sm" className="h-8 group/btn text-slate-600 hover:bg-slate-100">
                                         View Details <ExternalLink size={12} className="ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
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
                  <Card className="p-12 text-center border-dashed border-slate-200 bg-white shadow-sm">
                     <Clock size={32} className="text-slate-350 mx-auto mb-4" />
                     <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No history found</p>
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
