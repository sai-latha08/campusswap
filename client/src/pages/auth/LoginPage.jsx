import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { setCredentials } from '../../store/authSlice';
import Logo from '../../components/common/Logo';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', formData);
      if (res.data.success) {
        dispatch(setCredentials({
          user: res.data.data.user,
          token: res.data.data.token,
        }));
        toast.success(`Welcome back, ${res.data.data.user.name}!`);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-[#faf6f0]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Card Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1f2] border border-[#fecdd3] text-xs font-semibold text-[#881337] mb-4">
            <Sparkles size={13} className="text-[#881337]" />
            <span>Verified Student Access</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-display">Sign In to CampusSwap</h2>
          <p className="text-sm text-stone-500 mt-1.5">
            Access your skills, gear rentals, barter trades, and campus trust score.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-8 border border-[#e7ded3] shadow-sm">
          {error && (
            <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                Campus Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="student@university.edu"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 tracking-tight">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Footer link */}
          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500">
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold text-[#881337] hover:underline inline-flex items-center gap-1">
                Register Free <ArrowRight size={12} />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
