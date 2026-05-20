import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { userApi } from '../../api/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Show success message if redirected after registration
  const justRegistered = (location.state as any)?.registered;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await userApi.login({ email, password });
      const user = response.data;

      // Persist user object (includes token, roleID, userID, etc.)
      localStorage.setItem('user', JSON.stringify(user));

      // Route based on roleID
      const rId = user.roleID ?? user.RoleID;
      if (rId === 1)      navigate('/admin');
      else if (rId === 2) navigate('/staff');
      else if (rId === 3) navigate('/customer/dashboard');
      else                navigate('/');
    } catch (err: any) {
      setError(
        err.response?.data?.message
          || err.response?.data
          || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
            <span className="text-white font-bold text-xl tracking-wider">AP</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2 text-sm font-light">Sign in to your AutoParts account</p>
        </div>

        {/* Success banner after registration */}
        {justRegistered && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm mb-6 font-medium text-center">
            ✅ Account created! Please sign in below.
          </div>
        )}

        <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 text-slate-400" size={18} strokeWidth={1.5} />
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-11 pr-4 py-3.5 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors placeholder:text-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors mt-4"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={18} strokeWidth={1.5} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 mt-8 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-slate-900 font-semibold hover:underline transition-all">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
