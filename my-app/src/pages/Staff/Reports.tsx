import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, AlertCircle, Award, FileText, Download, Calendar, BarChart2, Info } from 'lucide-react';
import { staffApi } from '../../api/api';
import { Card, Button } from '../../components/ui-components';

const Reports = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPrintPreview, setShowPrintPreview] = useState(false);

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

  const handleSavePDF = () => {
    const element = document.getElementById('print-dossier');
    if (!element) return;

    const runExport = () => {
      const opt = {
        margin:       0.5,
        filename:     `AutoParts_Performance_Report_${new Date().toISOString().split('T')[0]}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      
      // @ts-ignore
      window.html2pdf().from(element).set(opt).save();
    };

    // @ts-ignore
    if (window.html2pdf) {
      runExport();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = runExport;
      document.body.appendChild(script);
    }
  };

  const getRiskStatus = (dueDateStr: string | null) => {
    if (!dueDateStr) {
      return { 
        label: 'PENDING', 
        className: 'bg-amber-50 text-amber-700 border border-amber-200' 
      };
    }
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);
    
    if (today > dueDate) {
      return { 
        label: 'OVERDUE', 
        className: 'bg-rose-50 text-rose-700 border border-rose-200' 
      };
    } else {
      return { 
        label: 'DUE', 
        className: 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
      };
    }
  };

  const getPrintRiskStatus = (dueDateStr: string | null) => {
    if (!dueDateStr) {
      return { 
        label: 'PENDING', 
        className: 'bg-amber-50 text-amber-700 border border-amber-200' 
      };
    }
    const dueDate = new Date(dueDateStr);
    const today = new Date();
    today.setHours(0,0,0,0);
    dueDate.setHours(0,0,0,0);
    
    if (today > dueDate) {
      return { 
        label: 'OVERDUE', 
        className: 'bg-rose-50 text-rose-700 border border-rose-200' 
      };
    } else {
      return { 
        label: 'DUE', 
        className: 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
      };
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
      className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-pink-600 font-bold tracking-[0.2em] text-[10px] uppercase mb-2 block">Business Intelligence</span>
          <h1 className="text-3xl font-outfit font-bold text-slate-800 mb-2">Performance Audit</h1>
          <p className="text-slate-500 text-sm">Deep-dive into high-value accounts and collection risks.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50" onClick={() => setShowPrintPreview(true)}>
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
          <Card className="h-full bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 font-outfit">High Value Accounts</h3>
                </div>
                <TrendingUp className="text-emerald-500 opacity-20 group-hover:opacity-100 transition-opacity" size={24} />
              </div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Top 5 Lifecycle Revenue</p>
            </div>
            
            <div className="p-4 space-y-2 bg-white">
              {data?.highSpenders.map((user: any, idx: number) => (
                <div key={user.userID} className="group/item flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-150">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs ${
                    idx === 0 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-850">{user.fullName}</p>
                    <p className="text-[10px] text-slate-450 font-mono">UID: {user.userID}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">Rs. {user.totalSpent.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">Certified VIP</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Regular Customers */}
        <motion.div variants={itemVariants}>
          <Card className="h-full bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600">
                  <Users size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 font-outfit">Retention Heroes</h3>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Top 5 Engagement Frequency</p>
            </div>

            <div className="p-4 space-y-2 bg-white">
              {data?.regulars.map((user: any, idx: number) => (
                <div key={user.userID} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-150">
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 font-black text-xs">
                    {user.fullName.split(' ').map((n: any) => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800">{user.fullName}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-pink-600 rounded-full" style={{ width: `${(user.visitCount / 20) * 100}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-400">{user.visitCount} SESSIONS</span>
                    </div>
                  </div>
                  <Award size={20} className={idx < 3 ? 'text-amber-500 drop-shadow-[0_0_4px_rgba(245,158,11,0.25)]' : 'text-slate-350'} />
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Pending Credits */}
        <motion.div variants={itemVariants} className="xl:col-span-2">
          <Card className="bg-white border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                    <AlertCircle size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 font-outfit">Outstanding Collections</h3>
                </div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Receivables Risk Analysis</p>
              </div>
              <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-orange-50 border border-orange-100">
                <Info size={16} className="text-orange-650" />
                <p className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Follow-up required for {data?.pendingPayments.length} entries</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Invoice Ref</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Beneficiary</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Amount Due</th>
                    <th className="px-8 py-5 text-xs font-bold uppercase tracking-wider text-slate-600">Risk Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data?.pendingPayments.length > 0 ? (
                    data.pendingPayments.map((p: any) => (
                      <tr key={p.salesInvoiceID} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                           <div className="flex items-center gap-3">
                             <FileText size={16} className="text-slate-400 group-hover:text-amber-500 transition-colors" />
                             <span className="text-xs font-mono font-bold text-slate-800">#{p.salesInvoiceID}</span>
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{p.customerName}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-sm font-black text-rose-600">Rs. {p.finalAmount.toFixed(2)}</span>
                        </td>
                        <td className="px-8 py-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${getRiskStatus(p.dueDate).className}`}>
                             {getRiskStatus(p.dueDate).label}
                           </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
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

      {/* High-Fidelity Print Preview Overlay Modal */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8 no-print">
          {/* Inject Dynamic Print-Only CSS safeguarding background styles and visibility */}
          <style dangerouslySetInnerHTML={{__html: `
            @media print {
              body * {
                visibility: hidden !important;
              }
              #print-dossier, #print-dossier * {
                visibility: visible !important;
              }
              #print-dossier {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                background: white !important;
                color: #0f172a !important;
                box-shadow: none !important;
                border: none !important;
                padding: 1.5in 0.5in 0.5in 0.5in !important;
              }
              .no-print {
                display: none !important;
              }
            }
          `}} />

          <div className="max-w-4xl w-full bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Control Dashboard */}
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-800 font-outfit uppercase tracking-wider">Report Print Center</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Verify layout formatting before committing to physical dossier print.</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  onClick={() => setShowPrintPreview(false)}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-none text-xs px-4 py-2"
                >
                  Close Preview
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleSavePDF}
                  className="gap-2 text-xs px-5 py-2 font-black shadow-lg shadow-indigo-500/20"
                >
                  <Download size={14} />
                  Save as PDF
                </Button>
              </div>
            </div>

            {/* Print Area Preview Sheet */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-950/50 flex justify-center">
              <div 
                id="print-dossier" 
                className="w-[8.5in] min-h-[11in] bg-white text-slate-900 p-12 shadow-xl border border-slate-200 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  {/* Print Document Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">AutoParts Enterprise</h1>
                      <p className="text-xs font-black text-slate-500 tracking-[0.2em] uppercase mt-1">Intelligence Division</p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded bg-slate-900 text-white text-[9px] font-black tracking-widest uppercase">Verified Dossier</span>
                      <p className="text-[9px] font-mono text-slate-500 mt-2">GEN: {new Date().toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Document Purpose Summary */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">Performance Audit Summary</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      This formal business dossier compiles recent life-cycle spending profiles, client retention sessions, and current accounts receivable collection risks directly extracted from the enterprise core nodes. Authorized staff access only.
                    </p>
                  </div>

                  {/* High Spenders List Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">1. High Lifecycle Revenue Spenders</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase">
                          <th className="py-2">Rank</th>
                          <th className="py-2">UID Reference</th>
                          <th className="py-2">Client Full Name</th>
                          <th className="py-2 text-right">Lifecycle Spent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data?.highSpenders.map((user: any, idx: number) => (
                          <tr key={user.userID} className="font-medium text-slate-700">
                            <td className="py-2.5 font-bold">#{idx + 1}</td>
                            <td className="py-2.5 font-mono text-[10px]">USR-0{user.userID}</td>
                            <td className="py-2.5 font-bold text-slate-900">{user.fullName}</td>
                            <td className="py-2.5 text-right font-black text-slate-900">Rs. {user.totalSpent.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Regular Spenders Section */}
                  <div className="mb-8">
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">2. Top Engagement Frequency</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase">
                          <th className="py-2">Rank</th>
                          <th className="py-2">UID Reference</th>
                          <th className="py-2">Client Full Name</th>
                          <th className="py-2 text-right">Engagement Sessions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data?.regulars.map((user: any, idx: number) => (
                          <tr key={user.userID} className="font-medium text-slate-700">
                            <td className="py-2.5 font-bold">#{idx + 1}</td>
                            <td className="py-2.5 font-mono text-[10px]">USR-0{user.userID}</td>
                            <td className="py-2.5 font-bold text-slate-900">{user.fullName}</td>
                            <td className="py-2.5 text-right font-black text-slate-900">{user.visitCount} Completed Visits</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pending Collections Section */}
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 pb-1 border-b border-slate-200">3. Outstanding Credit Ledger</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-300 text-slate-500 font-bold uppercase">
                          <th className="py-2">Invoice Ref</th>
                          <th className="py-2">Beneficiary</th>
                          <th className="py-2 text-right">Outstanding due</th>
                          <th className="py-2 text-right">Risk Assessment</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data?.pendingPayments.length > 0 ? (
                          data.pendingPayments.map((p: any) => (
                            <tr key={p.salesInvoiceID} className="font-medium text-slate-700">
                              <td className="py-2.5 font-mono text-[10px]">#INV-0{p.salesInvoiceID}</td>
                              <td className="py-2.5 font-bold text-slate-900">{p.customerName}</td>
                              <td className="py-2.5 text-right font-black text-slate-900">Rs. {p.finalAmount.toFixed(2)}</td>
                              <td className="py-2.5 text-right"><span className={`text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${getPrintRiskStatus(p.dueDate).className}`}>{getPrintRiskStatus(p.dueDate).label}</span></td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="py-6 text-center text-slate-400 italic">No credit risks detected. Ledger is fully settled.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer and Security Seal */}
                <div className="border-t border-slate-200 pt-6 mt-8 flex justify-between items-center text-[9px] font-mono text-slate-400">
                  <p>SECRET // ENTERPRISE DATA CLASSIFIED</p>
                  <p>AUDIT SIGNATURE STAMPED</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Reports;
