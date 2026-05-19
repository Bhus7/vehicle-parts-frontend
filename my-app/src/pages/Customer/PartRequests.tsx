import { useState, useEffect } from 'react';
import { Package, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { partRequestApi, vehicleApi } from '../../api/customerApi';

interface Vehicle {
  vehicleID: number;
  vehicleNumber: string;
  brand: string;
  model: string;
}

const PartRequests = () => {
  const customerId = parseInt(localStorage.getItem('customerId') || '0');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadData = async () => {
    try {
      const [vehicleRes, reqRes] = await Promise.all([
        vehicleApi.getAll(customerId),
        partRequestApi.getAll(customerId)
      ]);
      const vehicleData = vehicleRes.data?.data || vehicleRes.data;
      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
      const reqData = reqRes.data?.data || reqRes.data;
      setRequests(Array.isArray(reqData) ? reqData : []);
    } catch {
      setVehicles([]);
      setRequests([]);
    }
  };

  useEffect(() => {
    if (customerId) loadData();
  }, [customerId]);

  // Form state — matches backend DTO: { vehicleID, partName }
  const [form, setForm] = useState({
    vehicleID: '',
    partName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    // Build the payload matching the backend DTO exactly
    const requestData = {
      vehicleID: form.vehicleID ? parseInt(form.vehicleID) : 0,
      partName: form.partName,
    };

    try {
      await partRequestApi.create(customerId, requestData);
      setMessage({ type: 'success', text: 'Part request submitted successfully!' });
      setForm({ vehicleID: '', partName: '' });
      loadData();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.response?.data || 'Failed to submit part request.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Part Requests</h1>
        <p className="text-slate-400 mt-1">Can't find a part in our catalog? Submit a request and we'll source it for you.</p>
      </div>

      {/* Status Message */}
      {message.text && (
        <div className={`p-4 rounded-lg flex items-center gap-3 text-sm ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/30 text-green-400'
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Request Form */}
      <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-8 max-w-3xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
            <Package size={24} className="text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Request a Part</h2>
            <p className="text-sm text-slate-400">Fill in the details below</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Vehicle *</label>
            <select
              required
              value={form.vehicleID}
              onChange={e => setForm({ ...form, vehicleID: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
            >
              <option value="">Select a vehicle</option>
              {vehicles.map(v => (
                <option key={v.vehicleID} value={v.vehicleID}>
                  {v.brand} {v.model} ({v.vehicleNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-400 mb-2">Part Name *</label>
            <input
              type="text"
              required
              value={form.partName}
              onChange={e => setForm({ ...form, partName: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              placeholder="e.g., Water Pump, Brake Pads, Air Filter"
            />
          </div>

          <div className="pt-4 border-t border-slate-700">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-lg shadow-blue-600/20"
            >
              <Save size={18} /> {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>

      {/* Part Requests List */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-white mb-6">Your Past Requests</h2>
        {requests.length === 0 ? (
          <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-8 text-center">
            <p className="text-slate-400">You haven't submitted any part requests yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req, index) => {
              const status = req.status || 'Pending';
              let statusColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
              if (status.toLowerCase() === 'completed' || status.toLowerCase() === 'fulfilled') {
                statusColor = 'bg-green-500/10 text-green-400 border-green-500/30';
              } else if (status.toLowerCase() === 'rejected' || status.toLowerCase() === 'cancelled') {
                statusColor = 'bg-red-500/10 text-red-400 border-red-500/30';
              }
              
              const vehicle = vehicles.find(v => v.vehicleID === req.vehicleID);
              const vehicleText = vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.vehicleNumber})` : `Vehicle ID: ${req.vehicleID}`;
              
              return (
                <div key={req.requestID || index} className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package size={20} className="text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-lg font-bold text-white">{req.partName}</h3>
                          <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${statusColor}`}>
                            {status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-400">
                          <span>For: {vehicleText}</span>
                          {req.requestDate && (
                            <span>Requested on: {new Date(req.requestDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartRequests;
