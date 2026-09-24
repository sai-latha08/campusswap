import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, CheckCircle2, XCircle, Clock, AlertTriangle,
  ArrowLeft, RefreshCw, Filter, ShieldCheck, UserX, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Resolution modal state
  const [selectedReport, setSelectedReport] = useState(null);
  const [newStatus, setNewStatus] = useState('resolved');
  const [actionTaken, setActionTaken] = useState('none');
  const [resolutionNote, setResolutionNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      let url = '/admin/reports?limit=30';
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setReports(res.data.data.reports || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load incident reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [statusFilter]);

  const handleResolveSubmit = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    setActionLoading(true);
    try {
      const res = await api.patch(`/admin/reports/${selectedReport._id}/resolve`, {
        status: newStatus,
        resolutionNote: resolutionNote.trim(),
        actionTaken,
      });

      if (res.data.success) {
        toast.success(`Report marked as ${newStatus}`);
        setReports((prev) =>
          prev.map((r) => (r._id === selectedReport._id ? res.data.data.report : r))
        );
        setSelectedReport(null);
        setResolutionNote('');
        setActionTaken('none');
      }
    } catch (err) {
      toast.error('Failed to resolve report');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <span className="badge-minimal text-[10px] text-red-600">Open Incident</span>;
      case 'under_review':
        return <span className="badge-minimal text-[10px] text-amber-700">Under Review</span>;
      case 'resolved':
        return <span className="badge-minimal text-[10px]">Resolved</span>;
      case 'dismissed':
        return <span className="badge-minimal text-[10px] text-zinc-400">Dismissed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/admin"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Admin Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2.5">
            <ShieldAlert size={24} className="text-zinc-900" /> Incident Resolution & Safety
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Total Incident Claims Logged: <strong className="text-zinc-800">{total}</strong>
          </p>
        </div>

        <button
          onClick={fetchReports}
          className="p-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-zinc-400 mr-1 flex items-center gap-1">
          <Filter size={11} /> Status:
        </span>
        {[
          { id: 'all', label: 'All Incidents' },
          { id: 'open', label: 'Open' },
          { id: 'under_review', label: 'Under Review' },
          { id: 'resolved', label: 'Resolved' },
          { id: 'dismissed', label: 'Dismissed' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              statusFilter === tab.id
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((rep) => (
            <div
              key={rep._id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-5 hover:border-zinc-300 transition-all"
            >
              <div className="space-y-2.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  {getStatusBadge(rep.status)}
                  <span className="badge-minimal text-[10px]">
                    Violation: {rep.reason}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    Logged on {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-zinc-50 rounded-xl p-3 border border-zinc-200/70">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Reported By:</span>
                    <strong className="text-zinc-800">{rep.reporter?.name}</strong> ({rep.reporter?.college})
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Target of Claim:</span>
                    {rep.reportedUser ? (
                      <strong className="text-zinc-800">{rep.reportedUser.name} ({rep.reportedUser.email})</strong>
                    ) : rep.item ? (
                      <strong className="text-zinc-800">Listing: {rep.item.title}</strong>
                    ) : (
                      <span className="text-zinc-500">Platform Activity</span>
                    )}
                  </div>
                </div>

                {rep.description && (
                  <p className="text-xs text-zinc-600 bg-white border border-zinc-200 rounded-xl p-3 italic">
                    "{rep.description}"
                  </p>
                )}

                {rep.resolutionNote && (
                  <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-800">
                    <strong className="text-zinc-900">Resolution Note:</strong> {rep.resolutionNote}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="shrink-0">
                <button
                  onClick={() => {
                    setSelectedReport(rep);
                    setNewStatus(rep.status === 'open' ? 'resolved' : rep.status);
                    setResolutionNote(rep.resolutionNote || '');
                  }}
                  className="btn-primary text-xs py-1.5 px-3.5"
                >
                  Manage Incident
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <CheckCircle2 size={32} className="mx-auto text-zinc-400 mb-2" />
          <h3 className="font-semibold text-zinc-900 text-sm">All clear!</h3>
          <p className="text-xs text-zinc-400 mt-1">No reports matching the selected filter.</p>
        </div>
      )}

      {/* Resolution Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 max-w-lg w-full shadow-xl space-y-4">
            <h3 className="text-base font-bold text-zinc-900 font-display">
              Resolve Incident: {selectedReport.reason}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 tracking-tight mb-1">
                  Incident Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                >
                  <option value="under_review">Under Review (Investigating)</option>
                  <option value="resolved">Resolved (Action Taken / Complete)</option>
                  <option value="dismissed">Dismissed (False Alarm / Inconclusive)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 tracking-tight mb-1">
                  Corrective Action
                </label>
                <select
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                >
                  <option value="none">No Penalty (Warning / Note only)</option>
                  <option value="penalty">Penalize Reported User (-10 Trust Score)</option>
                  <option value="deactivate_item">Deactivate Reported Item Listing</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 tracking-tight mb-1">
                  Moderator Resolution Note (Sent to reporter)
                </label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Explain the outcome and steps taken..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="btn-secondary text-xs py-1.5 px-3.5"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveSubmit}
                disabled={actionLoading}
                className="btn-primary text-xs py-1.5 px-3.5"
              >
                {actionLoading ? 'Updating...' : 'Save Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
