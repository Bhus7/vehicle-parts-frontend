import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Car, ArrowRight } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4 py-12">
      <div className="max-w-2xl w-full bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700 relative overflow-hidden">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-slate-400">Join AutoParts to easily manage your vehicles and orders.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <User size={18} className="text-blue-500" /> Personal Info
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Full Name</label>
                <input required type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="John Doe" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
                <input required type="email" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="john@example.com" />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Phone Number</label>
                <input required type="tel" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="555-0198" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Password</label>
                  <input required type="password" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Confirm Password</label>
                  <input required type="password" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-2 flex items-center gap-2">
                <Car size={18} className="text-blue-500" /> Primary Vehicle (Optional)
              </h3>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Make / Brand</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Toyota" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-400 mb-2">Model</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="Camry" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Year</label>
                  <input type="number" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="2018" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">Plate Number</label>
                  <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-3 text-white focus:border-blue-500 outline-none" placeholder="XYZ-123" />
                </div>
              </div>
            </div>
          </div>

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
