import { useEffect, useState } from 'react';
import { Package, Plus, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { customerApi } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vehicle {
  vehicleID: number;
  brand: string;
  model: string;
  vehicleNumber: string;
}

interface PartRequest {
  requestID?: number;
  id?: number;
  vehicleID: number;
  partName: string;
  notes?: string;
  status: string;
  createdDate?: string;
  requestDate?: string;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    Pending:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Approved:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Ordered:   'bg-violet-500/10 text-violet-400 border-violet-500/20',
    Fulfilled: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg border text-xs font-bold ${map[status] ?? 'bg-slate-700 text-slate-400 border-slate-600'}`}>
      {status}
    </span>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const CustomerPartRequestsPage = () => {
  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.userID ?? user.UserID ?? user.id ?? 0;

  const [requests,   setRequests]   = useState<PartRequest[]>([]);
  const [vehicles,   setVehicles]   = useState<Vehicle[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');
  const [success,    setSuccess]    = useState('');
  const [showForm,   setShowForm]   = useState(false);

  // Form state
  const [vehicleID, setVehicleID] = useState<number>(0);
  const [partName,  setPartName]  = useState('');
  const [category,  setCategory]  = useState('General');
  const [quantity,  setQuantity]  = useState<number>(1);
  const [notes,     setNotes]     = useState('');

  // ── Load data ──────────────────────────────────────────────────
  const loadData = () => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      customerApi.getPartRequests(userId),
      customerApi.getVehicles(userId),
    ])
      .then(([reqRes, vehRes]) => {
        const reqs = reqRes.data?.data ?? reqRes.data;
        const vehs = vehRes.data?.data ?? vehRes.data;
        setRequests(Array.isArray(reqs) ? reqs : []);
        setVehicles(Array.isArray(vehs) ? vehs : []);
        if (vehs?.length > 0) setVehicleID(vehs[0].vehicleID);
      })
      .catch((err) => { console.error(err); setError('Failed to load part requests.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [userId]);

  // ── Submit request ─────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleID)       { setError('Please select a vehicle.'); return; }
    if (!partName.trim()) { setError('Part name is required.'); return; }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      vehicleID,
      partName: partName.trim(),
      category: category,
      quantity: quantity,
      notes: notes.trim(),
    };

    try {
      await customerApi.submitPartRequest(userId, payload);
      setSuccess(`Request for "${partName}" submitted successfully!`);
      setPartName('');
      setCategory('General');
      setQuantity(1);
      setNotes('');
      setShowForm(false);
      loadData();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to submit request.';
      setError(typeof msg === 'string' ? msg : 'Failed to submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Package size={22} className="text-violet-400" /> Part Requests
          </h1>
          <p className="text-slate-400 text-sm mt-1">Request unavailable parts — we'll source them for you</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl transition-colors text-sm"
        >
          <Plus size={16} /> New Request
        </button>
      </div>

      {/* Alerts */}
      {error   && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"><AlertCircle size={16}/>{error}</div>}
      {success && <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm"><CheckCircle size={16}/>{success}</div>}

      {/* Request Form */}
      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-700">Submit Part Request</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Vehicle Selector */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Vehicle</label>
              {vehicles.length === 0 ? (
                <p className="text-slate-500 text-sm">No vehicles found. Add one in My Profile.</p>
              ) : (
                <select
                  id="part-vehicleID"
                  value={vehicleID}
                  onChange={(e) => setVehicleID(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.vehicleID} value={v.vehicleID}>
                      {v.brand} {v.model} — {v.vehicleNumber}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Part Name */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Part Name / Description</label>
              <input
                id="part-name"
                type="text"
                required
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="e.g. Front brake rotor, Alternator belt..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Category</label>
                <select
                  id="part-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                >
                  <option value="General">General</option>
                  <option value="Engine">Engine</option>
                  <option value="Transmission">Transmission</option>
                  <option value="Brakes">Brakes</option>
                  <option value="Suspension">Suspension</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Body">Body</option>
                  <option value="Interior">Interior</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Quantity</label>
                <input
                  id="part-quantity"
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none"
                />
              </div>
            </div>

            {/* Notes / Description */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Description / Notes <span className="font-normal text-slate-500">(optional)</span></label>
              <textarea
                id="part-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specific details, brand preference, or condition notes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-violet-500 outline-none placeholder:text-slate-600 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button
                id="part-submit"
                type="submit"
                disabled={submitting || vehicles.length === 0}
                className="flex-1 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 size={28} className="animate-spin text-violet-500" /></div>
      ) : requests.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <Package size={40} className="mx-auto text-slate-700 mb-3" />
          <p className="font-bold text-white">No part requests yet</p>
          <p className="text-slate-500 text-sm mt-1">Click "New Request" to request an unavailable part.</p>
        </div>
      ) : (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-900/60">
              <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="text-left px-5 py-3">Part Name</th>
                <th className="text-left px-5 py-3">Notes</th>
                <th className="text-left px-5 py-3">Vehicle</th>
                <th className="text-left px-5 py-3">Date</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => {
                const veh  = vehicles.find((v) => v.vehicleID === req.vehicleID);
                const date = req.createdDate || req.requestDate;
                const id   = req.requestID ?? req.id ?? idx;
                return (
                  <tr key={id} className="border-t border-slate-700/50 hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4 font-bold text-white">{req.partName}</td>
                    <td className="px-5 py-4 text-slate-400 text-sm max-w-xs truncate" title={req.notes}>
                      {req.notes || '—'}
                    </td>
                    <td className="px-5 py-4 text-slate-400 text-sm">
                      {veh ? `${veh.brand} ${veh.model}` : `Vehicle #${req.vehicleID}`}
                    </td>
                    <td className="px-5 py-4 text-slate-500 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} />
                        {date ? new Date(date).toLocaleDateString() : '—'}
                      </div>
                    </td>
                    <td className="px-5 py-4">{statusBadge(req.status)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerPartRequestsPage;
