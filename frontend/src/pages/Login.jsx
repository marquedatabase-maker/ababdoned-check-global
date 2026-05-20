import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, Mail, Lock, Loader2, ArrowRight, Sparkles, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC] relative overflow-hidden">
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" />
      
      <div className="max-w-md w-full relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="bg-slate-900 w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-2xl group transition-all hover:scale-110 hover:rotate-3">
              <Store className="text-white group-hover:scale-110 transition-transform" size={40} />
            </div>
            <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg animate-bounce">
              <Sparkles size={16} />
            </div>
          </div>
          <h2 className="text-4xl font-semibold text-slate-900 tracking-tighter mb-2">Welcome Back</h2>
          <p className="text-slate-500 font-medium text-sm">Secure access to your store's dashboard.</p>
        </div>

        <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white">
          {error && (
            <div className="bg-rose-50/80 backdrop-blur-md text-rose-600 p-4 rounded-2xl text-[11px] font-semibold uppercase tracking-wider mb-6 border border-rose-100 animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium text-sm shadow-inner"
                  placeholder="name@store.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full pl-12 pr-12 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-medium text-sm shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white py-4.5 rounded-2xl font-semibold text-base hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-70 flex items-center justify-center gap-3 group active:scale-[0.98] mt-2 overflow-hidden relative"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs font-medium">
              New merchant?{' '}
              <Link to="/register" className="text-slate-900 hover:text-primary-600 font-semibold decoration-[3px] underline underline-offset-4 transition-colors">
                Register Store
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
