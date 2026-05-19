import { useEffect, useState } from 'react';
import {
  UserCircle, Car, Plus, Pencil, Loader2, AlertCircle,
  CheckCircle, Save, X, Hash, Phone, MapPin, Mail,
} from 'lucide-react';
import { customerApi } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Vehicle {
  vehicleID: number;
  vehicleNumber: string;
  brand: string;
  model: string;
  year: number;
  vehicleType: string;
  conditionNotes: string;
}

interface Profile {
  userID: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  createdDate: string;
  vehicles: Vehicle[];
}

const VEHICLE_TYPES = ['Car', 'Bike', 'Truck', 'Van', 'SUV', 'Other'];

const BLANK_VEHICLE = {
  vehicleNumber: '',
  brand: '',
  model: '',
  year: '',
  vehicleType: 'Car',
  conditionNotes: '',
};

// ─── Component ────────────────────────────────────────────────────────────────
const CustomerProfile = () => {
  const user   = JSON.parse(localStorage.getItem('user') || '{}');
  const userId: number = user.userID ?? user.UserID ?? user.id ?? 0;

  const [profile,        setProfile]        = useState<Profile | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [success,        setSuccess]        = useState('');

  // Profile edit state
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm,    setProfileForm]    = useState({ fullName: '', phone: '', address: '' });
  const [savingProfile,  setSavingProfile]  = useState(false);

  // Add vehicle state
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [vehicleForm,    setVehicleForm]    = useState(BLANK_VEHICLE);
  const [savingVehicle,  setSavingVehicle]  = useState(false);

  // Edit vehicle state
  const [editVehicleId,  setEditVehicleId]  = useState<number | null>(null);
  const [editVehicleForm,setEditVehicleForm]= useState(BLANK_VEHICLE);
  const [savingEditVeh,  setSavingEditVeh]  = useState(false);

  // ── Load profile ────────────────────────────────────────────────
  const loadProfile = () => {
    if (!userId) { setLoading(false); setError('Session not found. Please log in.'); return; }
    customerApi.getProfile(userId)
      .then((res) => {
        const data: Profile = res.data?.data ?? res.data;
        setProfile(data);
        setProfileForm({ fullName: data.fullName, phone: data.phone, address: data.address });
      })
      .catch((err) => { console.error(err); setError('Failed to load profile.'); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProfile(); }, [userId]);

  // ── Save profile ────────────────────────────────────────────────
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setError('');
    setSuccess('');
    try {
      await customerApi.updateProfile(userId, profileForm);
      setSuccess('Profile updated successfully!');
      setEditingProfile(false);
      loadProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  // ── Add vehicle ─────────────────────────────────────────────────
  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleForm.vehicleNumber.trim()) { setError('Vehicle number is required.'); return; }
    if (!vehicleForm.brand.trim())         { setError('Brand is required.'); return; }
    if (!vehicleForm.model.trim())         { setError('Model is required.'); return; }

    setSavingVehicle(true);
    setError('');
    setSuccess('');

    const payload = {
      vehicleNumber:  vehicleForm.vehicleNumber.trim(),
      brand:          vehicleForm.brand.trim(),
      model:          vehicleForm.model.trim(),
      year:           vehicleForm.year ? Number(vehicleForm.year) : 0,
      vehicleType:    vehicleForm.vehicleType,
      conditionNotes: vehicleForm.conditionNotes.trim(),
    };

    try {
      await customerApi.addVehicle(userId, payload);
      setSuccess('Vehicle added successfully!');
      setVehicleForm(BLANK_VEHICLE);
      setShowAddVehicle(false);
      loadProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add vehicle.');
    } finally {
      setSavingVehicle(false);
    }
  };

  // ── Update vehicle ──────────────────────────────────────────────
  const handleUpdateVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editVehicleId === null) return;

    setSavingEditVeh(true);
    setError('');
    setSuccess('');

    const payload = {
      vehicleNumber:  editVehicleForm.vehicleNumber.trim(),
      brand:          editVehicleForm.brand.trim(),
      model:          editVehicleForm.model.trim(),
      year:           editVehicleForm.year ? Number(editVehicleForm.year) : 0,
      vehicleType:    editVehicleForm.vehicleType,
      conditionNotes: editVehicleForm.conditionNotes.trim(),
    };

    try {
      await customerApi.updateVehicle(userId, editVehicleId, payload);
      setSuccess('Vehicle updated!');
      setEditVehicleId(null);
      loadProfile();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update vehicle.');
    } finally {
      setSavingEditVeh(false);
    }
  };

  const startEditVehicle = (v: Vehicle) => {
    setEditVehicleId(v.vehicleID);
    setEditVehicleForm({
      vehicleNumber:  v.vehicleNumber,
      brand:          v.brand,
      model:          v.model,
      year:           String(v.year),
      vehicleType:    v.vehicleType,
      conditionNotes: v.conditionNotes,
    });
    setError('');
    setSuccess('');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={32} className="animate-spin text-blue-500" />
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center gap-2">
          <UserCircle size={22} className="text-blue-400" /> My Profile
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage your personal info and registered vehicles</p>
      </div>

      {/* Alerts */}
      {error   && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm"><AlertCircle size={16}/>{error}</div>}
      {success && <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-sm"><CheckCircle size={16}/>{success}</div>}

      {/* ── Personal Info Card ─────────────────────────────────────── */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <UserCircle size={18} className="text-blue-400" /> Personal Information
          </h2>
          {!editingProfile && (
            <button
              onClick={() => { setEditingProfile(true); setError(''); setSuccess(''); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-blue-400 bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
            >
              <Pencil size={14} /> Edit
            </button>
          )}
        </div>

        {editingProfile ? (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
                <input
                  id="profile-fullName"
                  type="text"
                  required
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-slate-500" size={15} />
                  <input
                    id="profile-phone"
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-400 mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-slate-500" size={15} />
                <input
                  id="profile-address"
                  type="text"
                  value={profileForm.address}
                  onChange={(e) => setProfileForm((p) => ({ ...p, address: e.target.value }))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setEditingProfile(false); setError(''); }}
                className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <X size={15} /> Cancel
              </button>
              <button
                id="profile-save"
                type="submit"
                disabled={savingProfile}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {savingProfile ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: UserCircle, label: 'Full Name',  value: profile?.fullName },
              { icon: Mail,       label: 'Email',      value: profile?.email    },
              { icon: Phone,      label: 'Phone',      value: profile?.phone    },
              { icon: MapPin,     label: 'Address',    value: profile?.address  },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-slate-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-white font-semibold mt-0.5">{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Vehicles Section ───────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Car size={18} className="text-blue-400" /> My Vehicles
          </h2>
          <button
            onClick={() => { setShowAddVehicle(!showAddVehicle); setError(''); setSuccess(''); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-emerald-400 bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded-xl transition-all"
          >
            <Plus size={14} /> Add Vehicle
          </button>
        </div>

        {/* Add Vehicle Form */}
        {showAddVehicle && (
          <div className="bg-slate-800 border border-emerald-500/20 rounded-2xl p-6 mb-4">
            <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-700">Add New Vehicle</h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Plate / Vehicle No.</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3.5 text-slate-500" size={14} />
                    <input
                      id="veh-vehicleNumber"
                      type="text"
                      required
                      value={vehicleForm.vehicleNumber}
                      onChange={(e) => setVehicleForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
                      placeholder="BA 1 PA 1234"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Vehicle Type</label>
                  <select
                    id="veh-type"
                    value={vehicleForm.vehicleType}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, vehicleType: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none"
                  >
                    {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Brand</label>
                  <input
                    id="veh-brand"
                    type="text"
                    required
                    value={vehicleForm.brand}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, brand: e.target.value }))}
                    placeholder="Toyota"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Model</label>
                  <input
                    id="veh-model"
                    type="text"
                    required
                    value={vehicleForm.model}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, model: e.target.value }))}
                    placeholder="Corolla"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Year</label>
                  <input
                    id="veh-year"
                    type="number"
                    min="1950"
                    max={new Date().getFullYear() + 1}
                    value={vehicleForm.year}
                    onChange={(e) => setVehicleForm((f) => ({ ...f, year: e.target.value }))}
                    placeholder="2020"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none placeholder:text-slate-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Condition Notes <span className="font-normal text-slate-600">(optional)</span></label>
                <textarea
                  id="veh-notes"
                  rows={2}
                  value={vehicleForm.conditionNotes}
                  onChange={(e) => setVehicleForm((f) => ({ ...f, conditionNotes: e.target.value }))}
                  placeholder="e.g. Minor dents, new battery..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-emerald-500 outline-none resize-none placeholder:text-slate-600"
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => { setShowAddVehicle(false); setError(''); }}
                  className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button
                  id="veh-add-submit"
                  type="submit"
                  disabled={savingVehicle}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  {savingVehicle ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Vehicles List */}
        {(!(profile?.vehicles || profile?.Vehicles) || (profile.vehicles || profile.Vehicles).length === 0) ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-10 text-center">
            <Car size={36} className="mx-auto text-slate-700 mb-3" />
            <p className="font-bold text-white">No vehicles registered</p>
            <p className="text-slate-500 text-sm mt-1">Click "Add Vehicle" to register your first vehicle.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {(profile.vehicles || profile.Vehicles).map((v: any) => (
              <div key={v.vehicleID || v.VehicleID}>
                {editVehicleId === (v.vehicleID || v.VehicleID) ? (
                  /* Inline edit form */
                  <div className="bg-slate-800 border border-blue-500/30 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-slate-700 flex items-center gap-2">
                      <Pencil size={14} className="text-blue-400" /> Editing: {v.brand || v.Brand} {v.model || v.Model}
                    </h3>
                    <form onSubmit={handleUpdateVehicle} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-400 mb-2">Plate No.</label>
                          <input type="text" required value={editVehicleForm.vehicleNumber}
                            onChange={(e) => setEditVehicleForm((f) => ({ ...f, vehicleNumber: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-400 mb-2">Type</label>
                          <select value={editVehicleForm.vehicleType}
                            onChange={(e) => setEditVehicleForm((f) => ({ ...f, vehicleType: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none">
                            {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-slate-400 mb-2">Brand</label>
                          <input type="text" required value={editVehicleForm.brand}
                            onChange={(e) => setEditVehicleForm((f) => ({ ...f, brand: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-400 mb-2">Model</label>
                          <input type="text" required value={editVehicleForm.model}
                            onChange={(e) => setEditVehicleForm((f) => ({ ...f, model: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-slate-400 mb-2">Year</label>
                          <input type="number" value={editVehicleForm.year}
                            onChange={(e) => setEditVehicleForm((f) => ({ ...f, year: e.target.value }))}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2">Condition Notes</label>
                        <textarea rows={2} value={editVehicleForm.conditionNotes}
                          onChange={(e) => setEditVehicleForm((f) => ({ ...f, conditionNotes: e.target.value }))}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none resize-none" />
                      </div>
                      <div className="flex gap-3">
                        <button type="button" onClick={() => setEditVehicleId(null)}
                          className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
                          <X size={14} /> Cancel
                        </button>
                        <button type="submit" disabled={savingEditVeh}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          {savingEditVeh ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          Save Vehicle
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* Vehicle card */
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex items-center justify-between gap-4 hover:border-slate-600 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                        <Car size={16} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="font-black text-white">{v.brand || v.Brand} {v.model || v.Model}
                          <span className="ml-2 text-xs font-bold bg-slate-700 text-slate-300 px-2 py-0.5 rounded-lg">{v.vehicleType || v.VehicleType}</span>
                        </p>
                        <p className="text-slate-400 text-xs mt-0.5">{v.vehicleNumber || v.VehicleNumber} · {v.year || v.Year}</p>
                        {(v.conditionNotes || v.ConditionNotes) && (
                          <p className="text-slate-500 text-xs mt-1 italic truncate max-w-sm">📝 {v.conditionNotes || v.ConditionNotes}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => startEditVehicle(v)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-xl transition-all shrink-0"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProfile;
