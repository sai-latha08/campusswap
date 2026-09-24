import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, X, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function ReviewModal({
  isOpen,
  onClose,
  targetUser,
  transactionType, // 'skill' | 'rental' | 'barter'
  referenceId,
  transactionTitle,
  onSuccess
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!targetUser?._id && !targetUser?.id) {
      toast.error('User information missing');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post('/reviews', {
        reviewedUserId: targetUser._id || targetUser.id,
        type: transactionType,
        referenceId,
        rating,
        comment: comment.trim(),
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Review submitted successfully! Trust score updated.');
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const getRatingLabel = (score) => {
    switch (score) {
      case 5: return '🌟 Outstanding & Highly Recommended!';
      case 4: return '👍 Very Good Experience';
      case 3: return '👌 Decent & Satisfactory';
      case 2: return '⚠️ Had Some Issues';
      case 1: return '❌ Poor Experience';
      default: return '';
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3 mb-1">
              <span className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Star size={20} className="fill-amber-300 text-amber-300" />
              </span>
              <div>
                <h3 className="text-xl font-bold font-display">Leave a Review</h3>
                <p className="text-xs text-indigo-100 mt-0.5">
                  Your feedback shapes our verified campus trust network
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Target User Info */}
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                {targetUser?.profileImage ? (
                  <img src={targetUser.profileImage} alt={targetUser.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  targetUser?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-slate-800 text-sm truncate">{targetUser?.name}</div>
                <div className="text-xs text-slate-500 truncate">
                  {transactionTitle ? `Transaction: ${transactionTitle}` : `${transactionType?.toUpperCase()} Exchange`}
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  <ShieldCheck size={12} /> Verified Peer
                </span>
              </div>
            </div>

            {/* Star Rating Picker */}
            <div className="text-center py-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Select Your Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1.5 focus:outline-none transition-transform hover:scale-125"
                    >
                      <Star
                        size={32}
                        className={`${
                          active
                            ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                            : 'text-slate-300 hover:text-amber-200'
                        } transition-colors`}
                      />
                    </button>
                  );
                })}
              </div>
              <p className="text-xs font-semibold text-indigo-600 mt-2">
                {getRatingLabel(hoverRating || rating)}
              </p>
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Share Your Experience (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Mention punctuality, item condition, knowledge clarity, or communication..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-100 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} /> Submit Review
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
