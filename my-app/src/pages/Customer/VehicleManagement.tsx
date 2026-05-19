import { useState, useEffect } from 'react';
import { Car, Plus, Pencil, X, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { vehicleApi } from '../../api/customerApi';

// Interface matching backend response for vehicles
interface Vehicle {
  vehicleID?: number;
  vehicleId?: number;
  vehicleNumber: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
  conditionNotes: string;
}

const VehicleManagement = () => {
  const customerId = parseInt(localStorage.getItem('customerId') || '0');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Form state — matches backend DTO: { vehicleNumber, brand, model, year, vehicleType, conditionNotes }
  const [form, setForm] = useState({
    vehicleNumber: '',
    brand: '',
    model: '',
    year: '',
    vehicleType: '',
    conditionNotes: '',
  });

  // Load vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, [customerId]);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await vehicleApi.getAll(customerId);
      const data = response.data?.data || response.data;
      setVehicles(Array.isArray(data) ? data : []);
    } catch {
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset form and open for new vehicle
  const handleAddNew = () => {
    setForm({ vehicleNumber: '', brand: '', model: '', year: '', vehicleType: '', conditionNotes: '' });
    setEditingVehicle(null);
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  // Open form for editing
  const handleEdit = (vehicle: Vehicle) => {
    setForm({
      vehicleNumber: vehicle.vehicleNumber || '',
      brand: vehicle.brand || '',
      model: vehicle.model || '',
      year: vehicle.year?.toString() || '',
      vehicleType: vehicle.vehicleType || '',
      conditionNotes: vehicle.conditionNotes || '',
    });
    setEditingVehicle(vehicle);
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  // Submit form (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Build the payload matching the backend DTO exactly
    const vehicleData = {
      vehicleNumber: form.vehicleNumber,
      brand: form.brand,
      model: form.model,
      year: form.year ? parseInt(form.year) : 0,
      vehicleType: form.vehicleType,
      conditionNotes: form.conditionNotes,
    };

    try {
      if (editingVehicle) {
        const vId = editingVehicle.vehicleID || editingVehicle.vehicleId;
        await vehicleApi.update(customerId, vId!, vehicleData);
        setMessage({ type: 'success', text: 'Vehicle updated successfully!' });
      } else {
        await vehicleApi.create(customerId, vehicleData);
        setMessage({ type: 'success', text: 'Vehicle added successfully!' });
      }
      setShowForm(false);
      loadVehicles();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.response?.data || 'Failed to save vehicle.' });
    }
  };



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Vehicles</h1>
          <p className="text-slate-400 mt-1">Manage your registered vehicles</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20 w-fit"
        >
          <Plus size={18} /> Add Vehicle
        </button>
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

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Vehicle Number *</label>
              <input
                type="text"
                required
                value={form.vehicleNumber}
                onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="BA 1 PA 1234"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Brand *</label>
              <input
                type="text"
                required
                value={form.brand}
                onChange={e => setForm({ ...form, brand: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="Toyota"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Model *</label>
              <input
                type="text"
                required
                value={form.model}
                onChange={e => setForm({ ...form, model: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="Camry"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Year *</label>
              <input
                type="number"
                required
                value={form.year}
                onChange={e => setForm({ ...form, year: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="2018"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Vehicle Type *</label>
              <select
                required
                value={form.vehicleType}
                onChange={e => setForm({ ...form, vehicleType: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Select type</option>
                <option value="Car">Car</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Motorcycle">Motorcycle</option>
                <option value="Bus">Bus</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Condition Notes</label>
              <input
                type="text"
                value={form.conditionNotes}
                onChange={e => setForm({ ...form, conditionNotes: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                placeholder="e.g., Minor dent on left door"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
                <Save size={18} /> {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-12 text-center">
          <Car size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Vehicles Registered</h3>
          <p className="text-slate-400 mb-6">Add your first vehicle to get started with service tracking.</p>
          <button onClick={handleAddNew} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg inline-flex items-center gap-2 transition-colors">
            <Plus size={18} /> Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {vehicles.map((vehicle) => {
            const vId = vehicle.vehicleID || vehicle.vehicleId;
            return (
            <div key={vId} className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <Car size={24} className="text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{vehicle.brand} {vehicle.model}</h3>
                    <p className="text-sm text-slate-400">{vehicle.year} · {vehicle.vehicleType || 'Vehicle'}</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(vehicle)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit vehicle">
                    <Pencil size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Vehicle No.</span>
                  <p className="text-white font-semibold mt-1">{vehicle.vehicleNumber || '—'}</p>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Condition</span>
                  <p className="text-white font-semibold mt-1">{vehicle.conditionNotes || 'Good'}</p>
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

export default VehicleManagement;
