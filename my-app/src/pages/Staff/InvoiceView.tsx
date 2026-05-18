import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Printer, Mail, ArrowLeft, Check, Shield, CreditCard, Calendar, Hash, ExternalLink, User } from 'lucide-react';
import { staffApi } from '../../api/api';
import { Card, Button } from '../../components/ui-components';

const InvoiceView = () => {
  const { id } = useParams<{ id: string }>();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (id) loadInvoice();
  }, [id]);

  const loadInvoice = async () => {
    try {
      const response = await staffApi.getInvoice(parseInt(id!));
      setInvoice(response.data);
    } catch (error) {
      console.error('Failed to load invoice');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSend = async () => {
    setSending(true);
    try {
      await staffApi.sendInvoiceEmail(parseInt(id!));
      setSent(true);
      setTimeout(() => setSent(false), 3000);
    } catch (error: any) {
      console.error('Failed to send email:', error);
      const backendError = error.response?.data?.message || error.response?.data || error.message;
      alert(`Email dispatch failed: ${backendError}`);
    } finally {
      setSending(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Decrypting Transaction...</p>
    </div>
  );

  if (!invoice) return (
    <Card className="p-20 text-center border-dashed border-white/5">
       <Shield size={48} className="text-slate-800 mx-auto mb-6" />
       <h2 className="text-xl font-bold text-white mb-2">Record Not Found</h2>
       <p className="text-sm text-slate-500 mb-8">The requested invoice ID does not exist in the ledger.</p>
       <Link to="/staff/search">
          <Button variant="primary">Return to Registry</Button>
       </Link>
    </Card>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 no-print"
      >
        <Link to="/staff/search" className="group flex items-center gap-3 text-slate-500 hover:text-white transition-colors">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-all">
             <ArrowLeft size={18} />
          </div>
          <span className="text-xs font-black uppercase tracking-widest">Back to Records</span>
        </Link>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="gap-2" onClick={handlePrint}>
            <Printer size={18} /> Print Record
          </Button>
          <Button variant="primary" className="gap-2 px-8 min-w-[200px]" onClick={handleSend} isLoading={sending}>
             <AnimatePresence mode="wait">
               {sent ? (
                 <motion.div key="sent" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <Check size={18} /> Dispatched
                 </motion.div>
               ) : (
                 <motion.div key="send" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                    <Mail size={18} /> Email Client
                 </motion.div>
               )}
             </AnimatePresence>
          </Button>
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="bg-white text-slate-900 rounded-[2rem] shadow-2xl overflow-hidden print:shadow-none print:rounded-none">
          {/* Header Strip */}
          <div className="bg-slate-950 p-8 md:p-12 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
                  <span className="text-3xl font-black italic">A</span>
               </div>
               <div>
                  <h1 className="text-2xl font-black uppercase tracking-tighter">AutoParts</h1>
                  <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Enterprise Service Node</p>
               </div>
            </div>
            <div className="text-right">
               <div className="flex items-center gap-4 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 justify-end">
                  <Hash size={12} /> Transaction Ref
               </div>
               <h2 className="text-3xl font-black tracking-tighter">{invoice.salesInvoiceID.toString().padStart(6, '0')}</h2>
               <p className="text-indigo-400 font-bold text-xs mt-1 italic uppercase tracking-widest">Digital Auth Verified</p>
            </div>
          </div>

          <div className="p-8 md:p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <User size={12} className="text-indigo-600" /> Recipient Details
                  </p>
                  <h3 className="text-lg font-black uppercase tracking-tight">{invoice.customerName}</h3>
                  <div className="mt-2 space-y-1 text-sm font-medium text-slate-600">
                     <p>{invoice.customerEmail}</p>
                     <p>{invoice.customerPhone}</p>
                     <p className="text-xs italic mt-2">{invoice.customerAddress}</p>
                  </div>
               </div>

               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Calendar size={12} className="text-indigo-600" /> Transaction Date
                  </p>
                  <h3 className="text-lg font-black uppercase tracking-tight">{new Date(invoice.salesDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</h3>
                  <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-tighter italic">Auth: Node-7724-KTM</p>
               </div>

               <div className="md:col-span-2 lg:col-span-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CreditCard size={12} className="text-indigo-600" /> Payment Status
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${
                    invoice.paymentStatus.toLowerCase() === 'paid' 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${invoice.paymentStatus.toLowerCase() === 'paid' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    <span className="text-xs font-black uppercase tracking-widest">{invoice.paymentStatus}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 mt-3 uppercase">Net Settlement Required</p>
               </div>
            </div>

            <div className="overflow-hidden border border-slate-100 rounded-3xl">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Component Description</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Qty</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Unit Price</th>
                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5 font-bold text-slate-800 text-sm">{item.partName}</td>
                      <td className="px-8 py-5 text-center font-black text-slate-500 text-sm">{item.quantity}</td>
                      <td className="px-8 py-5 text-right font-bold text-slate-500 text-sm">Rs. {item.unitPrice.toFixed(2)}</td>
                      <td className="px-8 py-5 text-right font-black text-slate-900 text-sm">Rs. {item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col md:flex-row justify-between gap-12 pt-8">
              <div className="max-w-sm space-y-4">
                 <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
                    <p className="text-[10px] font-black text-amber-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Shield size={12} /> Warranty Notice
                    </p>
                    <p className="text-xs text-amber-700 leading-relaxed font-medium capitalize prose">
                      Digital signature validated. Retain this dossier for part replacement authorization. Subject to standard enterprise service terms.
                    </p>
                 </div>
                 <div className="flex items-center gap-4 text-slate-400 group cursor-pointer hover:text-indigo-600 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                       <ExternalLink size={14} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest underline decoration-indigo-200 decoration-2 underline-offset-4">Terms of service agreement</span>
                 </div>
              </div>

              <div className="w-full md:w-[320px] space-y-4">
                <div className="flex justify-between items-center text-sm font-bold text-slate-500">
                  <span className="uppercase tracking-widest text-[10px]">Net Value</span>
                  <span>Rs. {invoice.totalAmount.toFixed(2)}</span>
                </div>
                {invoice.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-sm font-bold text-emerald-600">
                    <span className="uppercase tracking-widest text-[10px]">Loyalty Offset (10%)</span>
                    <span>-Rs. {invoice.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="pt-4 border-t-2 border-slate-100 flex justify-between items-end">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Settlement Total</p>
                      <p className="text-sm font-bold text-slate-500 uppercase">NPR VALUATION</p>
                   </div>
                   <h2 className="text-4xl font-black tracking-tighter text-indigo-600">Rs. {invoice.finalAmount.toFixed(2)}</h2>
                </div>
                <div className="pt-8 text-center md:text-right">
                   <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">TS: {new Date(invoice.salesDate).toLocaleString('en-US')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InvoiceView;
