import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, X, Save, AlertCircle, CheckCircle, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { appointmentApi, vehicleApi } from '../../api/customerApi';

interface Vehicle {
  vehicleID: number;
  vehicleNumber: string;
  brand: string;
  model: string;
}

// Interface matching the backend response for appointments
interface Appointment {
  appointmentID: number;
  vehicleID: number;
  vehicleNumber?: string;
  appointmentDate: string;
  serviceType: string;
  status: string;
  notes: string;
}

const AppointmentManagement = () => {
  const getTodayLocalString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const customerId = parseInt(localStorage.getItem('customerId') || '0');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form state — matches backend DTO: { vehicleID, appointmentDate, serviceType, notes }
  const [form, setForm] = useState({
    vehicleID: '',
    appointmentDate: '',
    appointmentTime: '',
    serviceType: '',
    notes: '',
  });

  // Service type options
  const serviceTypes = [
    'General Service',
    'Oil Change',
    'Brake Inspection',
    'Tire Rotation',
    'Engine Diagnostics',
    'Battery Replacement',
    'Transmission Service',
    'AC Repair',
    'Body Work',
    'Parts Change',
    'Cleaning',
    'Other',
  ];

  useEffect(() => {
    loadAppointments();
  }, [customerId]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const [apptResponse, vehicleResponse] = await Promise.all([
        appointmentApi.getAll(customerId),
        vehicleApi.getAll(customerId)
      ]);
      const apptData = apptResponse.data?.data || apptResponse.data;
      setAppointments(Array.isArray(apptData) ? apptData : []);
      
      const vehicleData = vehicleResponse.data?.data || vehicleResponse.data;
      setVehicles(Array.isArray(vehicleData) ? vehicleData : []);
    } catch {
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setForm({ vehicleID: '', appointmentDate: '', appointmentTime: '', serviceType: '', notes: '' });
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Combine date and time into a single ISO datetime string for the backend
    let combinedDate = form.appointmentDate;
    if (form.appointmentTime) {
      combinedDate = `${form.appointmentDate}T${form.appointmentTime}:00`;
    } else {
      combinedDate = `${form.appointmentDate}T09:00:00`;
    }

    // Build the payload matching the backend DTO exactly
    const appointmentData = {
      vehicleID: form.vehicleID ? parseInt(form.vehicleID) : 0,
      appointmentDate: new Date(combinedDate).toISOString(),
      serviceType: form.serviceType,
      notes: form.notes,
    };

    try {
      await appointmentApi.create(customerId, appointmentData);
      setMessage({ type: 'success', text: 'Appointment booked successfully!' });
      setShowForm(false);
      loadAppointments();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.response?.data || 'Failed to save appointment.' });
    }
  };



  const handleDelete = async (appointmentId: number) => {
    try {
      await appointmentApi.delete(customerId, appointmentId);
      setMessage({ type: 'success', text: 'Appointment deleted successfully.' });
      setDeleteConfirm(null);
      loadAppointments();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || err.response?.data || 'Failed to delete appointment.' });
    }
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'completed': return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">My Appointments</h1>
          <p className="text-slate-400 mt-1">Book and manage your service appointments</p>
        </div>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20 w-fit"
        >
          <Plus size={18} /> Book Appointment
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

      {/* Booking Form */}
      {showForm && (
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              Book New Appointment
            </h2>
            <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Service Type *</label>
              <select
                required
                value={form.serviceType}
                onChange={e => setForm({ ...form, serviceType: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              >
                <option value="">Select a service type</option>
                {serviceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Appointment Date *</label>
              <input
                type="date"
                required
                value={form.appointmentDate}
                onChange={e => setForm({ ...form, appointmentDate: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                min={getTodayLocalString()}
                style={{ colorScheme: 'dark' }}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Preferred Time</label>
              <input
                type="time"
                value={form.appointmentTime}
                onChange={e => setForm({ ...form, appointmentTime: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                style={{ colorScheme: 'dark' }}
              />
            </div>

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

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-400 mb-2">Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors resize-none"
                placeholder="Describe the issue or service needed..."
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-700">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors">
                Cancel
              </button>
              <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-600/20">
                <Save size={18} /> Book Appointment
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointment List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-12 text-center">
          <Calendar size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Appointments</h3>
          <p className="text-slate-400 mb-6">You haven't booked any service appointments yet.</p>
          <button onClick={handleAddNew} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg inline-flex items-center gap-2 transition-colors">
            <Plus size={18} /> Book Your First Appointment
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appt) => {
            const status = appt.status || 'Pending';

            return (
              <div key={appt.appointmentID} className="bg-slate-800/70 backdrop-blur border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-14 h-14 bg-violet-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar size={24} className="text-violet-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-white">{appt.serviceType}</h3>
                        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${getStatusColor(status)}`}>
                          {status}
                        </span>
                      </div>
                      {appt.notes && <p className="text-slate-400 text-sm mt-1">{appt.notes}</p>}
                      <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(appt.appointmentDate).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {new Date(appt.appointmentDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {appt.vehicleNumber && (
                          <span className="text-slate-400">Vehicle: {appt.vehicleNumber}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {status.toLowerCase() === 'completed' && (
                      <Link to="/customer/reviews" className="px-3 py-1.5 bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 mr-2">
                         <Star size={14} /> Review
                      </Link>
                    )}
                    {deleteConfirm === appt.appointmentID ? (
                      <div className="flex gap-1">
                        <button onClick={() => handleDelete(appt.appointmentID)} className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-700">Delete</button>
                        <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1 bg-slate-600 text-white text-xs font-bold rounded hover:bg-slate-500">No</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(appt.appointmentID)}
                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete appointment"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
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

export default AppointmentManagement;
