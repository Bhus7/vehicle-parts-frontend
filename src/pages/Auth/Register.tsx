import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Car, Lock, Mail, Phone, MapPin, Hash, ChevronRight, Loader2 } from 'lucide-react';
import { userApi } from '../../api/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address: string;
  vehicleNumber: string;
  brand: string;
  model: string;
  year: string;
  vehicleType: string;
  conditionNotes: string;
}

const VEHICLE_TYPES = ['Car', 'Bike', 'Truck', 'Van', 'SUV', 'Other'];

const INITIAL_FORM: RegisterForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  address: '',
  vehicleNumber: '',
  brand: '',
  model: '',
  year: '',
  vehicleType: 'Car',
  conditionNotes: '',
};

// ─── Component ────────────────────────────────────────────────────────────────
const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterForm>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1); // two-step form

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Validate step 1 (personal info)
  const validateStep1 = (): string => {
    if (!form.fullName.trim())          return 'Full name is required.';
    if (!form.email.trim())             return 'Email address is required.';
    if (!form.phone.trim())             return 'Phone number is required.';
    if (!form.address.trim())           return 'Address is required.';
    if (form.password.length < 6)       return 'Password must be at least 6 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleNextStep = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vehicle number is the only required field in step 2
    if (!form.vehicleNumber.trim()) {
      setError('Vehicle (plate) number is required.');
      return;
    }
    if (!form.brand.trim() || !form.model.trim()) {
      setError('Vehicle brand and model are required.');
      return;
    }

    setLoading(true);
    setError('');

    // Build payload matching backend contract
    const payload = {
      fullName:        form.fullName.trim(),
      email:           form.email.trim(),
      phone:           form.phone.trim(),
      password:        form.password,
      confirmPassword: form.confirmPassword,
      address:         form.address.trim(),
      vehicleNumber:   form.vehicleNumber.trim(),
      brand:           form.brand.trim(),
      model:           form.model.trim(),
      year:            form.year ? Number(form.year) : 0,
      vehicleType:     form.vehicleType,
      conditionNotes:  form.conditionNotes.trim(),
    };

    try {
      await userApi.register(payload);
      navigate('/login', { state: { registered: true } });
    } catch (err: any) {
      const msg = err.response?.data?.message
        || err.response?.data
        || 'Registration failed. Please try again.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
            <span className="text-white font-bold text-xl tracking-wider">AP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create your Account</h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Join AutoParts to manage vehicles, appointments & part requests.</p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-8 max-w-md mx-auto">
          <div className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all ${step === 1 ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 1 ? 'bg-slate-900 text-white' : 'bg-emerald-500 text-white'}`}>
              {step === 1 ? '1' : '✓'}
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Step 1</p>
              <p className={`text-sm font-medium ${step === 1 ? 'text-slate-900' : 'text-slate-500'}`}>Personal Info</p>
            </div>
          </div>
          <ChevronRight size={16} className="text-slate-300 shrink-0" />
          <div className={`flex-1 flex items-center gap-3 p-3 rounded-xl border transition-all ${step === 2 ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 2 ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-400'}`}>
              2
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Step 2</p>
              <p className={`text-sm font-medium ${step === 2 ? 'text-slate-900' : 'text-slate-400'}`}>Vehicle Details</p>
            </div>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm mb-6 font-medium text-center">
            {error}
          </div>
        )}

        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100">

          {/* ── STEP 1: Personal Info ─────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                <User size={18} className="text-slate-400" /> Personal Information
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <input
                      id="reg-fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <input
                      id="reg-phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="98XXXXXXXX"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <input
                      id="reg-address"
                      name="address"
                      type="text"
                      required
                      autoComplete="street-address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Kathmandu, Nepal"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Password row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <input
                      id="reg-password"
                      name="password"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Min 6 characters"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <input
                      id="reg-confirmPassword"
                      name="confirmPassword"
                      type="password"
                      required
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-6"
              >
                Next: Vehicle Details <ChevronRight size={18} strokeWidth={1.5} />
              </button>
            </div>
          )}

          {/* ── STEP 2: Vehicle Details ───────────────────────────── */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-4 flex items-center gap-2">
                <Car size={18} className="text-slate-400" /> Primary Vehicle Details
              </h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Plate / Vehicle No.</label>
                  <div className="relative">
                    <Hash className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                    <input
                      id="reg-vehicleNumber"
                      name="vehicleNumber"
                      type="text"
                      required
                      value={form.vehicleNumber}
                      onChange={handleChange}
                      placeholder="BA 1 PA 1234"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Vehicle Type</label>
                  <select
                    id="reg-vehicleType"
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors text-slate-900"
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Brand / Make</label>
                  <input
                    id="reg-brand"
                    name="brand"
                    type="text"
                    required
                    value={form.brand}
                    onChange={handleChange}
                    placeholder="Toyota"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Model</label>
                  <input
                    id="reg-model"
                    name="model"
                    type="text"
                    required
                    value={form.model}
                    onChange={handleChange}
                    placeholder="Corolla"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Year of Manufacture</label>
                <input
                  id="reg-year"
                  name="year"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear() + 1}
                  value={form.year}
                  onChange={handleChange}
                  placeholder="e.g. 2020"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Condition Notes <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span></label>
                <textarea
                  id="reg-conditionNotes"
                  name="conditionNotes"
                  rows={3}
                  value={form.conditionNotes}
                  onChange={handleChange}
                  placeholder="e.g. Minor scratches on rear bumper..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors resize-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="px-6 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  id="reg-submit"
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Creating Account...</>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-slate-900 font-semibold hover:underline transition-colors">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
