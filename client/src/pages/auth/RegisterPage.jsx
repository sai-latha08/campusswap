import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Building, GraduationCap,
  Calendar, MapPin, UserPlus, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { setCredentials } from '../../store/authSlice';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    college: '',
    branch: '',
    year: '1',
    location: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.college) {
      setError('Please fill in all required fields (Name, Email, Password, College).');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        dispatch(setCredentials({
          user: res.data.data.user,
          token: res.data.data.token,
        }));
        toast.success('Registration successful! Welcome to CampusSwap.');
        navigate('/dashboard');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 py-16 bg-[#faf6f0]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1f2] border border-[#fecdd3] text-xs font-semibold text-[#881337] mb-4">
            <Sparkles size={13} className="text-[#881337]" />
            <span>Join Verified Campus Network</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 font-display">Create Your Student Account</h2>
          <p className="text-sm text-stone-500 mt-1.5">
            Join your campus peers to learn, share, rent items, and build your trust score.
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
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                  Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Maya Chen"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                  Campus Email <span className="text-rose-600">*</span>
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
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                Password <span className="text-rose-600">*</span> (min. 6 characters)
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                />
              </div>
            </div>

            {/* College & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                  College / University <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    placeholder="e.g. Stanford University"
                    required
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                  Major / Branch
                </label>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Year & Campus Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                  Academic Year
                </label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                  >
                    <option value="1">1st Year (Freshman)</option>
                    <option value="2">2nd Year (Sophomore)</option>
                    <option value="3">3rd Year (Junior)</option>
                    <option value="4">4th Year (Senior)</option>
                    <option value="5">5th Year / Masters</option>
                    <option value="6">PhD / Postgrad</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 tracking-tight mb-1.5">
                  Campus / Hostel Location
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. North Quad, Hall 4"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#faf6f0] border border-[#e7ded3] rounded-xl text-sm text-stone-900 placeholder-stone-400 focus:bg-white focus:border-[#881337] focus:ring-1 focus:ring-[#881337] transition-all outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-2.5 text-sm"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating Student Account...</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    <span>Create Free Account</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer link */}
          <div className="mt-6 pt-6 border-t border-stone-100 text-center">
            <p className="text-xs text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[#881337] hover:underline inline-flex items-center gap-1">
                Sign In <ArrowRight size={12} />
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
