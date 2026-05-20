import { useEffect, useState } from 'react';
import { History, Loader2, AlertCircle, ShoppingBag, Wrench } from 'lucide-react';
import { customerApi } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface HistoryItem {
  // Purchase / Invoice fields
  invoiceID?:    number;
  invoiceDate?:  string;
  totalAmount?:  number;
  items?:        { partName: string; quantity: number; unitPrice: number }[];

  // Service / Appointment fields
  appointmentID?: number;
  serviceType?:   string;
  appointmentDate?: string;
  status?:        string;
  notes?:         string;

  // Generic discriminator from backend
  type?: 'purchase' | 'service';
}

// ─── Component ────────────────────────────────────────────────────────────────
const CustomerHistory = () => {
  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.userID ?? user.UserID ?? user.id ?? 0;

  const [history,  setHistory]  = useState<HistoryItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [filter,   setFilter]   = useState<'all' | 'purchase' | 'service'>('all');

  useEffect(() => {
    if (!userId) { setLoading(false); setError('Session not found.'); return; }

    customerApi.getHistory(userId)
      .then((res) => {
        const data = res.data?.data ?? res.data;
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load history.');
      })
      .finally(() => setLoading(false));
  }, [userId]);

  // Determine record type from shape if not tagged
  const getType = (item: HistoryItem): 'purchase' | 'service' =>
    item.type ?? (item.invoiceID ? 'purchase' : 'service');

  const filtered = filter === 'all'
    ? history
    : history.filter((h) => getType(h) === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History size={22} className="text-emerald-400" /> Service & Purchase History
          </h1>
          <p className="text-slate-400 text-sm mt-1">A complete log of your transactions and services</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 bg-slate-800 border border-slate-700 rounded-xl p-1">
          {(['all', 'purchase', 'service'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 size={28} className="animate-spin text-emerald-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <History size={40} className="mx-auto text-slate-700 mb-3" />
          <p className="font-bold text-white">No history yet</p>
          <p className="text-slate-500 text-sm mt-1">
            {filter === 'all'
              ? 'Your purchase and service records will appear here.'
              : `No ${filter} records found.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item, idx) => {
            const type = getType(item);
            return (
              <div
                key={item.invoiceID ?? item.appointmentID ?? idx}
                className={`bg-slate-800 border rounded-xl p-5 hover:border-opacity-60 transition-colors ${
                  type === 'purchase'
                    ? 'border-blue-500/20 hover:border-blue-500/40'
                    : 'border-emerald-500/20 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      type === 'purchase'
                        ? 'bg-blue-600/10 border border-blue-500/20'
                        : 'bg-emerald-600/10 border border-emerald-500/20'
                    }`}>
                      {type === 'purchase'
                        ? <ShoppingBag size={16} className="text-blue-400" />
                        : <Wrench size={16} className="text-emerald-400" />
                      }
                    </div>

                    {/* Content */}
                    <div>
                      {type === 'purchase' ? (
                        <>
                          <p className="font-bold text-white">
                            Invoice #{item.invoiceID}
                          </p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            📅 {item.invoiceDate ? new Date(item.invoiceDate).toLocaleDateString() : '—'}
                          </p>
                          {item.items && item.items.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {item.items.map((it, i) => (
                                <li key={i} className="text-slate-400 text-xs">
                                  • {it.partName} × {it.quantity} @ Rs. {it.unitPrice?.toFixed(2)}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-white">{item.serviceType ?? 'Service'}</p>
                          <p className="text-slate-500 text-xs mt-0.5">
                            📅 {item.appointmentDate ? new Date(item.appointmentDate).toLocaleDateString() : '—'}
                          </p>
                          {item.notes && (
                            <p className="text-slate-500 text-xs mt-1 italic">"{item.notes}"</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right side */}
                  <div className="text-right shrink-0">
                    {type === 'purchase' && item.totalAmount != null && (
                      <p className="text-lg font-black text-white">Rs. {item.totalAmount.toFixed(2)}</p>
                    )}
                    {type === 'service' && item.status && (
                      <span className={`px-2 py-0.5 rounded-lg border text-xs font-bold ${
                        item.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {item.status}
                      </span>
                    )}
                    <p className="text-xs text-slate-600 mt-1 capitalize">{type}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerHistory;
