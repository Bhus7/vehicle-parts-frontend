import { useState, useEffect } from 'react';
import { Clock, Calendar, Car, Package, Search, Wrench, Filter, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { historyApi } from '../../api/customerApi';

// Interface matching backend response for history
interface HistoryAppointment {
  appointmentID: number;
  appointmentDate: string;
  serviceType: string;
  status: string;
  notes: string;
  vehicleNumber: string;
}

interface HistoryPurchase {
  invoiceID?: number;
  purchaseDate?: string;
  date?: string;
  totalAmount?: number;
  amount?: number;
  items?: any[];
  description?: string;
}

interface HistoryResponse {
  customerName: string;
  appointments: HistoryAppointment[];
  purchases: HistoryPurchase[];
}

const ServiceHistory = () => {
  const customerId = parseInt(localStorage.getItem('customerId') || '0');
  const [history, setHistory] = useState<HistoryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'appointments' | 'purchases'>('all');

  useEffect(() => {
    loadHistory();
  }, [customerId]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const response = await historyApi.getHistory(customerId);
      const data = response.data?.data || response.data;
      setHistory(data);
    } catch {
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered appointments
  const filteredAppointments = () => {
    if (!history?.appointments) return [];
    if (filterType === 'purchases') return [];
    const query = searchQuery.toLowerCase();
    return history.appointments.filter(appt =>
      !query ||
      appt.serviceType?.toLowerCase().includes(query) ||
      appt.notes?.toLowerCase().includes(query) ||
      appt.vehicleNumber?.toLowerCase().includes(query) ||
      appt.status?.toLowerCase().includes(query)
    );
  };

  // Get filtered purchases
  const filteredPurchases = () => {
    if (!history?.purchases) return [];
    if (filterType === 'appointments') return [];
    const query = searchQuery.toLowerCase();
    return history.purchases.filter(purchase =>
      !query ||
      purchase.description?.toLowerCase().includes(query)
    );
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': case 'paid': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  // Summary counts
  const totalAppointments = history?.appointments?.length || 0;
  const totalPurchases = history?.purchases?.length || 0;
  const totalPurchaseAmount = history?.purchases?.reduce((sum, p) => sum + (p.totalAmount || p.amount || 0), 0) || 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Service History</h1>
        <p className="text-slate-400 mt-1">
          View your complete purchase and service history
          {history?.customerName && <span> — <strong className="text-slate-300">{history.customerName}</strong></span>}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-500/10 rounded-lg flex items-center justify-center">
              <Wrench size={20} className="text-violet-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Appointments</p>
              <p className="text-2xl font-bold text-white">{totalAppointments}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-blue-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Purchases</p>
              <p className="text-2xl font-bold text-white">{totalPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Package size={20} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</p>
              <p className="text-2xl font-bold text-white">Rs. {totalPurchaseAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-slate-500" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/70 border border-slate-700/50 rounded-lg px-10 py-3 text-white focus:border-blue-500 outline-none transition-colors"
            placeholder="Search by service type, notes, vehicle..."
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-3 text-slate-500" size={18} />
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value as any)}
            className="bg-slate-800/70 border border-slate-700/50 rounded-lg pl-10 pr-8 py-3 text-white focus:border-blue-500 outline-none transition-colors appearance-none min-w-[180px]"
          >
            <option value="all">All Records</option>
            <option value="appointments">Appointments Only</option>
            <option value="purchases">Purchases Only</option>
          </select>
        </div>
      </div>

      {/* History Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : !history || (totalAppointments === 0 && totalPurchases === 0) ? (
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-12 text-center">
          <Clock size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No History Yet</h3>
          <p className="text-slate-400">Your purchase and service history will appear here once you start using our services.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Appointments Section */}
          {filteredAppointments().length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Wrench size={18} className="text-violet-400" /> Service Appointments
              </h2>
              <div className="space-y-3">
                {filteredAppointments().map((appt) => (
                  <div key={appt.appointmentID} className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Wrench size={20} className="text-violet-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap mb-1">
                            <h3 className="text-base font-bold text-white">{appt.serviceType}</h3>
                            <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(appt.status)}`}>
                              {appt.status}
                            </span>
                          </div>
                          {appt.notes && <p className="text-sm text-slate-400">{appt.notes}</p>}
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-2 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Calendar size={13} />
                              {new Date(appt.appointmentDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </span>
                            {appt.vehicleNumber && (
                              <span className="flex items-center gap-1">
                                <Car size={13} />
                                Vehicle: {appt.vehicleNumber}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {appt.status?.toLowerCase() === 'completed' && (
                        <div className="mt-3 md:mt-0 md:ml-4 flex-shrink-0">
                          <Link to="/customer/reviews" className="px-4 py-2 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
                             <Star size={16} /> Review
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Purchases Section */}
          {filteredPurchases().length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Package size={18} className="text-blue-400" /> Purchase History
              </h2>
              <div className="space-y-3">
                {filteredPurchases().map((purchase, index) => (
                  <div key={purchase.invoiceID || index} className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-5 hover:border-slate-600 transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-white">
                            {purchase.description || `Purchase #${purchase.invoiceID || index + 1}`}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                            {(purchase.purchaseDate || purchase.date) && (
                              <span className="flex items-center gap-1">
                                <Calendar size={13} />
                                {new Date(purchase.purchaseDate || purchase.date || '').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {(purchase.totalAmount || purchase.amount) ? (
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">Rs. {(purchase.totalAmount || purchase.amount || 0).toLocaleString()}</p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results for current filter */}
          {filteredAppointments().length === 0 && filteredPurchases().length === 0 && (
            <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-12 text-center">
              <Clock size={48} className="mx-auto text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Matching Records</h3>
              <p className="text-slate-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;
