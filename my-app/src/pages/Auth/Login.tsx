import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
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

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors">
            Sign In <ArrowRight size={18} />
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
