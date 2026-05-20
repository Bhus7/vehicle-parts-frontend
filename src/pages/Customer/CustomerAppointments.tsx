import { useEffect, useState } from 'react';
import {
  CalendarCheck, Plus, Trash2, Loader2, AlertCircle,
  Car, CheckCircle, Clock, XCircle,
} from 'lucide-react';
import { customerApi } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vehicle {
  vehicleID: number;
  brand: string;
  model: string;
  vehicleNumber: string;
}

interface Appointment {
  appointmentID: number;
  vehicleID: number;
  appointmentDate: string;
  serviceType: string;
  notes: string;
  status: string;
}

const SERVICE_TYPES = [
  'Oil Change', 'Brake Service', 'Tyre Rotation', 'Engine Diagnostics',
  'Battery Replacement', 'AC Service', 'Full Inspection', 'Other',
];

// ─── Status Badge Helper ──────────────────────────────────────────────────────
const statusBadge = (status: string) => {
  const map: Record<string, { cls: string; icon: React.ReactNode }> = {
    Pending:   { cls: 'bg-amber-500/10 text-amber-400 border-amber-500/20',   icon: <Clock size={11} /> },
    Confirmed: { cls: 'bg-blue-500/10 text-blue-400 border-blue-500/20',      icon: <CheckCircle size={11} /> },
    Completed: { cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: <CheckCircle size={11} /> },
    Cancelled: { cls: 'bg-red-500/10 text-red-400 border-red-500/20',         icon: <XCircle size={11} /> },
  };
  const s = map[status] ?? { cls: 'bg-slate-700 text-slate-400', icon: null };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-xs font-bold ${s.cls}`}>
      {s.icon} {status}
    </span>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const CustomerAppointments = () => {
  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.userID ?? user.UserID ?? user.id ?? 0;

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vehicles,     setVehicles]     = useState<Vehicle[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [submitting,   setSubmitting]   = useState(false);
  const [error,        setError]        = useState('');
  const [success,      setSuccess]      = useState('');
  const [showForm,     setShowForm]     = useState(false);

  // Form state
  const [vehicleID,    setVehicleID]    = useState<number>(0);
  const [apptDate,     setApptDate]     = useState('');
  const [serviceType,  setServiceType]  = useState(SERVICE_TYPES[0]);
  const [notes,        setNotes]        = useState('');

  // ── Fetch data ──────────────────────────────────────────────────
  const loadData = () => {
    if (!userId) return;
    setLoading(true);
    Promise.all([
      customerApi.getAppointments(userId),
      customerApi.getVehicles(userId),
    ])
      .then(([apptRes, vehRes]) => {
        const appts = apptRes.data?.data ?? apptRes.data;
        const vehs  = vehRes.data?.data  ?? vehRes.data;
        setAppointments(Array.isArray(appts) ? appts : []);
        setVehicles(Array.isArray(vehs)  ? vehs  : []);
        if (vehs?.length > 0) setVehicleID(vehs[0].vehicleID);
      })
      .catch((err) => { console.error(err); setError('Failed to load appointments.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, [userId]);

  // ── Book appointment ────────────────────────────────────────────
  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleID) { setError('Please select a vehicle.'); return; }
    if (!apptDate)  { setError('Please pick a date & time.'); return; }

    setSubmitting(true);
    setError('');
    setSuccess('');

    const payload = {
      vehicleID,
      appointmentDate: new Date(apptDate).toISOString(),
      serviceType,
      notes: notes.trim(),
    };

    try {
      await customerApi.bookAppointment(userId, payload);
      setSuccess('Appointment booked successfully!');
      setApptDate('');
      setNotes('');
      setShowForm(false);
      loadData();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to book appointment.';
      setError(typeof msg === 'string' ? msg : 'Failed to book appointment.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Cancel appointment ──────────────────────────────────────────
  const handleCancel = async (apptId: number) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await customerApi.cancelAppointment(userId, apptId);
      setSuccess('Appointment cancelled.');
      loadData();
    } catch (err: any) {
      setError('Failed to cancel appointment.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <CalendarCheck size={22} className="text-blue-400" /> Appointments
          </h1>
          <p className="text-slate-400 text-sm mt-1">Book and manage your service appointments</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-sm"
        >
          <Plus size={16} /> Book Appointment
        </button>
      </div>

      {/* Alerts */}
      {error   && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"><AlertCircle size={16}/>{error}</div>}
      {success && <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm"><CheckCircle size={16}/>{success}</div>}

      {/* Book Form */}
      {showForm && (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-5 pb-3 border-b border-slate-700">New Appointment</h2>
          <form onSubmit={handleBook} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Vehicle */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Select Vehicle</label>
                {vehicles.length === 0 ? (
                  <p className="text-slate-500 text-sm">No vehicles found. Add one in My Profile.</p>
                ) : (
                  <select
                    id="appt-vehicleID"
                    value={vehicleID}
                    onChange={(e) => setVehicleID(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                  >
                    {vehicles.map((v) => (
                      <option key={v.vehicleID} value={v.vehicleID}>
                        {v.brand} {v.model} — {v.vehicleNumber}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Service Type</label>
                <select
                  id="appt-serviceType"
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                >
                  {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Date & Time */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Date & Time</label>
              <input
                id="appt-date"
                type="datetime-local"
                required
                value={apptDate}
                onChange={(e) => setApptDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Notes <span className="font-normal text-slate-600">(optional)</span></label>
              <textarea
                id="appt-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe the issue or any special requests..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none resize-none placeholder:text-slate-600"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
                Cancel
              </button>
              <button
                id="appt-submit"
                type="submit"
                disabled={submitting || vehicles.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {submitting ? <><Loader2 size={16} className="animate-spin" /> Booking...</> : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List */}
      {loading ? (
        <div className="flex items-center justify-center h-40"><Loader2 size={28} className="animate-spin text-blue-500" /></div>
      ) : appointments.length === 0 ? (
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-12 text-center">
          <CalendarCheck size={40} className="mx-auto text-slate-700 mb-3" />
          <p className="font-bold text-white">No appointments yet</p>
          <p className="text-slate-500 text-sm mt-1">Click "Book Appointment" to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((appt) => {
            const veh = vehicles.find((v) => v.vehicleID === appt.vehicleID);
            const isPast = new Date(appt.appointmentDate) < new Date();
            const displayStatus = (isPast && appt.status !== 'Cancelled') ? 'Completed' : appt.status;
            return (
              <div key={appt.appointmentID} className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-500/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Car size={16} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-white">{appt.serviceType}</p>
                    <p className="text-slate-400 text-xs mt-0.5">
                      {veh ? `${veh.brand} ${veh.model} — ${veh.vehicleNumber}` : `Vehicle #${appt.vehicleID}`}
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      📅 {new Date(appt.appointmentDate).toLocaleString()}
                    </p>
                    {appt.notes && <p className="text-slate-500 text-xs mt-1 italic">"{appt.notes}"</p>}
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-center">
                  {statusBadge(displayStatus)}
                  {displayStatus === 'Pending' && (
                    <button
                      onClick={() => handleCancel(appt.appointmentID)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Cancel appointment"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerAppointments;
