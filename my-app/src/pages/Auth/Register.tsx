import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Car, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { authApi } from '../../api/customerApi';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [address, setAddress] = useState('');

  const [vehicleMake, setVehicleMake] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleYear, setVehicleYear] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const registerData: any = {
        fullName: name,
        email,
        phone,
        password,
        confirmPassword,
        address,
        vehicleNumber: plateNumber,
        brand: vehicleMake,
        model: vehicleModel,
        year: vehicleYear ? parseInt(vehicleYear) : 0,
        vehicleType,
        conditionNotes
      };

      await authApi.register(registerData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 relative overflow-hidden">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-slate-400">Join AutoParts to easily manage your vehicles and orders.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{typeof error === 'string' ? error : 'Registration failed.'}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-400 text-sm">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">

            {/* ── LEFT COLUMN: Personal Info ── */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <User size={18} className="text-blue-500" /> Personal Info
              </h3>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
                <input required type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="John Doe" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="555-0198" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="123 Main St, City" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Password</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="••••••••" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Confirm Password</label>
                <input required type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="••••••••" />
              </div>
            </div>
            {/* ── END LEFT COLUMN ── */}

            {/* ── RIGHT COLUMN: Vehicle Info ── */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <Car size={18} className="text-blue-500" /> Primary Vehicle
              </h3>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Make / Brand</label>
                <input required type="text" value={vehicleMake} onChange={e => setVehicleMake(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Toyota" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Model</label>
                <input required type="text" value={vehicleModel} onChange={e => setVehicleModel(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Camry" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Year</label>
                  <input required type="number" value={vehicleYear} onChange={e => setVehicleYear(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="2018" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Plate Number</label>
                  <input required type="text" value={plateNumber} onChange={e => setPlateNumber(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="XYZ-123" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Vehicle Type</label>
                <select required value={vehicleType} onChange={e => setVehicleType(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none">
                  <option value="">Select type</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Truck">Truck</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Condition Notes</label>
                <input type="text" value={conditionNotes} onChange={e => setConditionNotes(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Any existing issues?" />
              </div>
            </div>
            {/* ── END RIGHT COLUMN ── */}

          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-700">
            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
              {loading ? 'Creating Account...' : 'Register Account'} <ArrowRight size={18} />
            </button>
          </div>

        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Already have an account? <Link to="/login" className="text-blue-500 hover:text-blue-400 font-bold">Sign In</Link>
        </p>

      </div>
    </div>
  );
};

export default Register;