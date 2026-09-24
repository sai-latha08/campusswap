import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ShieldAlert, CheckCircle2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const REPORT_REASONS = [
  'Inappropriate Content',
  'Fake Listing',
  'Scam',
  'Harassment',
  'Misleading Information',
  'Item Damage',
  'Non-delivery',
  'Spam',
  'Other',
];

export default function ReportModal({
  isOpen,
  onClose,
  reportedUserId,
  reportedUserName,
  itemId,
  itemTitle,
  onSuccess,
}) {
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/reports', {
        reportedUserId: reportedUserId || undefined,
        itemId: itemId || undefined,
        reason,
        description: description.trim(),
      });

      if (res.data.success) {
        toast.success('Report submitted. Our moderation team will investigate.');
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
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
          <div className="bg-gradient-to-br from-rose-600 to-red-700 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-xl bg-white/20 backdrop-blur-md">
                <AlertTriangle size={22} className="text-white" />
              </span>
              <div>
                <h3 className="text-xl font-bold font-display">Report Safety Concern</h3>
                <p className="text-xs text-rose-100 mt-0.5">
                  Protecting the integrity and trust of our campus community
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Target Information */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600">
              <span className="font-bold text-slate-800 block mb-0.5">Reporting Target:</span>
              {itemTitle && <div>📦 Listing: <strong className="text-slate-800">{itemTitle}</strong></div>}
              {reportedUserName && <div>👤 Student: <strong className="text-slate-800">{reportedUserName}</strong></div>}
            </div>

            {/* Reason Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Violation Category
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-sm text-slate-800 outline-none transition-all bg-white"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Explain Details (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide context, dates, or messages that help moderators understand the situation..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 text-sm text-slate-800 placeholder-slate-400 outline-none resize-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm shadow-md shadow-rose-100 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    <ShieldAlert size={16} /> Submit Report
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
