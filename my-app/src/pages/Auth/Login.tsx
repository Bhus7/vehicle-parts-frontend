import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { authApi } from '../../api/customerApi';
import { userApi } from '../../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Try the role-based login first (staff/admin)
      const response = await userApi.login({ email, password });
      const user = response.data;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      // Navigate based on RoleID
      // RoleID 1: Admin, RoleID 2: Staff, RoleID 3: Customer
      const roleId = user.roleID || user.RoleID;
      if (roleId === 1) {
        navigate('/admin');
      } else if (roleId === 2) {
        navigate('/staff');
      } else if (roleId === 3) {
        // Customer login — also store customer-specific data
        localStorage.setItem('customer', JSON.stringify(user));
        localStorage.setItem('customerId', user.userId?.toString() || user.userID?.toString() || user.UserID?.toString() || user.id?.toString() || '');
        localStorage.setItem('token', user.token || user.Token || '');
        navigate('/customer/dashboard');
      } else {
        navigate('/staff');
      }
    } catch (err: any) {
      // Fallback: try customer-specific login endpoint
      try {
        const response = await authApi.login({ email, password });
        const customerData = response.data?.data || response.data;
        localStorage.setItem('customer', JSON.stringify(customerData));
        localStorage.setItem('customerId', customerData.userId?.toString() || customerData.userID?.toString() || customerData.UserID?.toString() || customerData.id?.toString() || '');
        localStorage.setItem('token', customerData.token || customerData.Token || '');
        navigate('/customer/dashboard');
      } catch (err2: any) {
        setError(err2.response?.data?.message || err2.response?.data || err.response?.data || 'Invalid email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-xl shadow-2xl border border-slate-700">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">AP</span>
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 mt-2">Sign in to your AutoParts account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle size={18} />
            <span>{typeof error === 'string' ? error : 'Login failed. Please try again.'}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
               <label className="block text-sm font-bold text-slate-400 mb-2">Email Address</label>
               <div className="relative">
                 <Mail className="absolute left-3 top-3 text-slate-500" size={18} />
                 <input 
                   type="email" 
                   required
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded px-10 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                   placeholder="john@example.com"
                 />
               </div>
            </div>
            
            <div>
               <div className="flex justify-between mb-2">
                 <label className="text-sm font-bold text-slate-400">Password</label>
                 <a href="#" className="text-sm text-blue-500 hover:text-blue-400">Forgot?</a>
               </div>
               <div className="relative">
                 <Lock className="absolute left-3 top-3 text-slate-500" size={18} />
                 <input 
                   type="password" 
                   required
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full bg-slate-900 border border-slate-700 rounded px-10 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                   placeholder="••••••••"
                 />
               </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-400 font-bold">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
