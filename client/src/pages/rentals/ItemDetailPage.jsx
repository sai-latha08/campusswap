import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, MapPin, ShieldCheck, Tag, Star,
  Clock, ArrowLeft, ArrowRightLeft, Sparkles,
  CheckCircle, AlertCircle, Info, Send, User, Building, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/authSlice';

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [renterNote, setRenterNote] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Barter Modal State
  const [barterModalOpen, setBarterModalOpen] = useState(false);
  const [barterData, setBarterData] = useState({
    skillId: '',
    numberOfSessions: 2,
    duration: 7,
    message: '',
  });
  const [userSkills, setUserSkills] = useState([]);
  const [submittingBarter, setSubmittingBarter] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const fetchItemDetails = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/items/${id}`);
      if (res.data.success) {
        setItem(res.data.data.item);
        setBookedRanges(res.data.data.bookedRanges || []);
      }
    } catch (err) {
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  // Calculate pricing
  const calculateTotal = () => {
    if (!startDate || !endDate || !item) return { days: 0, amount: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const ms = end - start;
    const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));

    let amount = 0;
    if (days >= 7 && item.pricePerWeek > 0) {
      const weeks = Math.floor(days / 7);
      const rem = days % 7;
      amount = weeks * item.pricePerWeek + rem * item.pricePerDay;
    } else {
      amount = days * item.pricePerDay;
    }

    return { days, amount };
  };

  const { days: totalDays, amount: totalAmount } = calculateTotal();

  // Handle Rental Booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast('Please sign in to rent campus items.', { icon: '🔒' });
      navigate('/login');
      return;
    }

    if (String(item.owner?._id) === String(currentUser?._id)) {
      toast.error('You cannot rent your own listed item.');
      return;
    }

    setBookingLoading(true);
    try {
      const res = await api.post('/rentals', {
        itemId: item._id,
        startDate,
        endDate,
        renterNote,
      });

      if (res.data.success) {
        toast.success('Rental request submitted to owner!');
        navigate('/rentals/bookings');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit rental request.';
      toast.error(msg);
    } finally {
      setBookingLoading(false);
    }
  };

  const handleOpenBarterModal = async () => {
    if (!isAuthenticated) {
      toast('Please sign in to propose a barter exchange.', { icon: '🔒' });
      navigate('/login');
      return;
    }
    try {
      const res = await api.get('/auth/me');
      if (res.data.success) {
        setUserSkills(res.data.data.user.skillsToTeach || []);
      }
    } catch (_) {}
    setBarterModalOpen(true);
  };

  const handleBarterSubmit = async (e) => {
    e.preventDefault();
    if (!barterData.skillId) {
      toast.error('Please select a skill to offer in return.');
      return;
    }

    setSubmittingBarter(true);
    try {
      const res = await api.post('/barter', {
        receiverId: item.owner._id,
        requestedItemId: item._id,
        offeredSkillId: barterData.skillId,
        numberOfSessions: parseInt(barterData.numberOfSessions, 10),
        duration: parseInt(barterData.duration, 10),
        message: barterData.message,
      });

      if (res.data.success) {
        toast.success('Skill-for-item barter proposal sent!');
        setBarterModalOpen(false);
        navigate('/barter');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send barter request.';
      toast.error(msg);
    } finally {
      setSubmittingBarter(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-64 bg-zinc-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-64 bg-zinc-200 rounded-2xl"></div>
            <div className="h-64 bg-zinc-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-zinc-900 font-display">Item Not Found</h2>
        <p className="text-zinc-500 text-xs mt-1.5">This rental listing may have been removed or relocated.</p>
        <Link to="/rentals" className="btn-primary mt-4 inline-flex text-xs">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const primaryImage = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/rentals" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-6 transition-colors">
        <ArrowLeft size={13} /> Back to Marketplace
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ─── Left Column: Images & Specs (2 cols) ────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
            <div className="h-80 sm:h-96 w-full bg-zinc-100 relative">
              <img src={primaryImage} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="badge-minimal shadow-sm">
                  {item.category}
                </span>
                <span className="badge-minimal font-bold">
                  {item.condition} Condition
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
                {item.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-zinc-500 pb-6 border-b border-zinc-100">
                <span className="flex items-center gap-1 font-medium">
                  <MapPin size={13} className="text-zinc-400" /> {item.location}
                </span>
                <span>•</span>
                <span>Security Deposit: <strong className="text-zinc-800">₹{item.securityDeposit}</strong></span>
                {item.pricePerWeek > 0 && (
                  <>
                    <span>•</span>
                    <span>Weekly Rate: <strong className="text-zinc-800">₹{item.pricePerWeek}</strong></span>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2">
                  Item Description
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Tags */}
              {item.tags && item.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {item.tags.map((tag, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-600 text-[11px] font-medium border border-zinc-200/60">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ─── Signature Barter Callout Banner ──────────────────────── */}
          <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-8 border border-zinc-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-[11px] font-medium mb-2.5">
                <Sparkles size={11} className="text-white" /> Zero-Cash Alternative
              </div>
              <h3 className="text-lg font-bold font-display text-white">
                Don't want to pay cash? Offer a Skill Instead
              </h3>
              <p className="text-zinc-400 text-xs mt-1 max-w-md leading-relaxed">
                Teach the item owner a skill (e.g., React, Python, UI/UX) in exchange for using this item for your project or semester.
              </p>
            </div>

            <button
              onClick={handleOpenBarterModal}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 text-xs font-semibold transition-all shrink-0 flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <ArrowRightLeft size={14} />
              Offer Skill Instead
            </button>
          </div>

          {/* Owner Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">
              Item Owner
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-sm flex items-center justify-center">
                  {item.owner?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 text-sm">{item.owner?.name}</h4>
                  <p className="text-xs text-zinc-500">
                    {item.owner?.college} {item.owner?.branch ? `• ${item.owner.branch}` : ''}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold text-zinc-900 block">
                  Trust Score: {item.owner?.trustScore || 50}/100
                </span>
                <Link
                  to={`/users/${item.owner?._id}`}
                  className="text-xs text-zinc-600 hover:text-zinc-900 underline underline-offset-2 mt-0.5 inline-block"
                >
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Right Column: Booking Engine Widget ─────────────────────── */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 sticky top-24 shadow-sm">
            <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-zinc-100">
              <div>
                <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">Daily Rate</span>
                <div className="text-2xl font-bold tracking-tight text-zinc-900">
                  ₹{item.pricePerDay}<span className="text-xs font-normal text-zinc-500"> / day</span>
                </div>
              </div>
              <span className="badge-minimal">
                Available to Rent
              </span>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                  Start Date (Pickup)
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                  End Date (Return)
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                  Note to Owner (Optional)
                </label>
                <textarea
                  rows={2}
                  value={renterNote}
                  onChange={(e) => setRenterNote(e.target.value)}
                  placeholder="Purpose of rental or preferred handover spot..."
                  className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>

              {/* Price Breakdown */}
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200/70 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Duration</span>
                  <span className="font-semibold text-zinc-900">{totalDays} day(s)</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Rental Total</span>
                  <span className="font-semibold text-zinc-900">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-semibold text-zinc-900">₹{item.securityDeposit}</span>
                </div>
                <div className="pt-2 border-t border-zinc-200 flex justify-between font-bold text-sm text-zinc-900">
                  <span>Total Payable</span>
                  <span className="text-zinc-900">₹{totalAmount + (item.securityDeposit || 0)}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={bookingLoading}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-sm"
              >
                <Send size={13} />
                {bookingLoading ? 'Checking Availability...' : `Request Rental (₹${totalAmount})`}
              </button>

              <p className="text-[11px] text-zinc-400 text-center">
                Anti-overlap validated. You won't be charged until owner approves.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* ─── Propose Skill Barter Modal ───────────────────────────────── */}
      <AnimatePresence>
        {barterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-zinc-900" />
                  <h3 className="text-base font-bold text-zinc-900 font-display">
                    Offer Skill Instead of Cash
                  </h3>
                </div>
                <button onClick={() => setBarterModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X size={16} />
                </button>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 mb-4 text-xs text-zinc-700">
                <div><span className="font-semibold text-zinc-900">Item:</span> {item.title}</div>
                <div><span className="font-semibold text-zinc-900">Owner:</span> {item.owner?.name} ({item.owner?.college})</div>
              </div>

              <form onSubmit={handleBarterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Skill You Can Teach in Return
                  </label>
                  <select
                    value={barterData.skillId}
                    onChange={(e) => setBarterData({ ...barterData, skillId: e.target.value })}
                    required
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  >
                    <option value="">-- Choose a skill you teach --</option>
                    {userSkills.map((s, idx) => (
                      <option key={idx} value={s.skill?._id || s.skill}>
                        {s.skill?.name || 'Skill'} ({s.experienceYears} yr exp)
                      </option>
                    ))}
                  </select>
                  {userSkills.length === 0 && (
                    <p className="text-[11px] text-zinc-500 mt-1">
                      You haven't added teachable skills yet.{' '}
                      <Link to="/skills/my-skills" className="underline font-semibold text-zinc-900">Add skills here</Link>.
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                      Teaching Sessions
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={barterData.numberOfSessions}
                      onChange={(e) => setBarterData({ ...barterData, numberOfSessions: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                      Item Usage (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={barterData.duration}
                      onChange={(e) => setBarterData({ ...barterData, duration: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Proposal Message to Owner
                  </label>
                  <textarea
                    rows={3}
                    value={barterData.message}
                    onChange={(e) => setBarterData({ ...barterData, message: e.target.value })}
                    placeholder="e.g. I can teach 3 React sessions in exchange for using your Arduino kit for 7 days..."
                    required
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setBarterModalOpen(false)}
                    className="btn-secondary text-xs px-3.5 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingBarter}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    <Send size={12} />
                    {submittingBarter ? 'Submitting...' : 'Send Barter Proposal'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
