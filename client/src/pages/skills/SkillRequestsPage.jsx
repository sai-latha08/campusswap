import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Inbox, Send, CheckCircle2,
  Calendar, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function SkillRequestsPage() {
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheduling Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '16:00',
    endTime: '17:00',
    mode: 'online',
    meetingLink: '',
    location: '',
    notes: '',
  });
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes] = await Promise.all([
        api.get('/skill-requests/received'),
        api.get('/skill-requests/sent'),
      ]);
      if (recRes.data.success) setReceivedRequests(recRes.data.data.requests);
      if (sentRes.data.success) setSentRequests(sentRes.data.data.requests);
    } catch (err) {
      toast.error('Failed to load skill requests');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const res = await api.patch(`/skill-requests/${requestId}/status`, { status });
      if (res.data.success) {
        toast.success(`Request ${status}!`);
        setReceivedRequests(
          receivedRequests.map((r) => (r._id === requestId ? res.data.data.skillRequest : r))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update request');
    }
  };

  const handleOpenScheduleModal = (request) => {
    setSelectedRequest(request);
    setScheduleModalOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    setScheduling(true);
    try {
      const res = await api.post('/skill-sessions', {
        skillRequestId: selectedRequest._id,
        skillId: selectedRequest.skill?._id,
        date: scheduleData.date,
        startTime: scheduleData.startTime,
        endTime: scheduleData.endTime,
        mode: scheduleData.mode,
        meetingLink: scheduleData.meetingLink,
        location: scheduleData.location,
        notes: scheduleData.notes,
      });

      if (res.data.success) {
        toast.success('Session scheduled successfully!');
        setScheduleModalOpen(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to schedule session.';
      toast.error(msg);
    } finally {
      setScheduling(false);
    }
  };

  const requestsToDisplay = activeTab === 'received' ? receivedRequests : sentRequests;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">Skill Exchange Requests</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage incoming requests to learn from you and track requests you've sent to mentors.
          </p>
        </div>

        <Link
          to="/skills/sessions"
          className="btn-primary self-start sm:self-auto text-xs py-2 px-3.5"
        >
          <Calendar size={13} /> View Scheduled Sessions
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'received'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Inbox size={14} />
          Received as Mentor ({receivedRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'sent'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Send size={14} />
          Sent as Learner ({sentRequests.length})
        </button>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : requestsToDisplay.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <Inbox size={32} className="text-zinc-400 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-900 text-sm">
            No {activeTab} skill requests
          </h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
            {activeTab === 'received'
              ? 'When students request to learn from you, they will appear here.'
              : 'Explore the skills catalog and send a request to a mentor!'}
          </p>
          {activeTab === 'sent' && (
            <Link
              to="/skills"
              className="btn-primary mt-4 inline-flex text-xs py-2 px-3.5"
            >
              Explore Skills
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {requestsToDisplay.map((req) => {
            const partner = activeTab === 'received' ? req.requester : req.teacher;
            return (
              <div
                key={req._id}
                className="p-5 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:border-zinc-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-sm flex items-center justify-center shrink-0">
                    {partner?.name?.charAt(0)?.toUpperCase()}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 text-sm">{partner?.name}</h3>
                      <span className="text-xs text-zinc-400">•</span>
                      <span className="badge-minimal text-[10px]">
                        {req.skill?.name}
                      </span>
                      <span className="badge-minimal text-[10px]">
                        {req.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-500 mt-1">
                      {partner?.college} {partner?.branch ? `• ${partner.branch}` : ''}
                    </p>

                    {req.description && (
                      <p className="text-xs text-zinc-600 mt-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 italic">
                        "{req.description}"
                      </p>
                    )}

                    <div className="flex items-center gap-4 mt-2.5 text-xs text-zinc-500 font-medium">
                      <span>Mode: <strong className="text-zinc-800 capitalize">{req.preferredMode}</strong></span>
                      {req.preferredTime && (
                        <span>Time: <strong className="text-zinc-800">{req.preferredTime}</strong></span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 w-full md:w-auto shrink-0">
                  {activeTab === 'received' && req.status === 'pending' && (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'accepted')}
                        className="btn-primary flex-1 text-xs py-1.5 px-3"
                      >
                        <CheckCircle2 size={13} /> Accept
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                        className="btn-secondary flex-1 text-xs py-1.5 px-3 text-red-600 hover:bg-red-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {req.status === 'accepted' && (
                    <button
                      onClick={() => handleOpenScheduleModal(req)}
                      className="btn-primary w-full text-xs py-1.5 px-3"
                    >
                      <Calendar size={13} /> Schedule Session
                    </button>
                  )}

                  <Link
                    to={`/users/${partner?._id}`}
                    className="btn-secondary w-full text-xs py-1.5 px-3 text-center"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─── Schedule 1-on-1 Session Modal ───────────────────────────── */}
      <AnimatePresence>
        {scheduleModalOpen && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900 font-display">
                  Schedule 1-on-1 Skill Session
                </h3>
                <button onClick={() => setScheduleModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X size={16} />
                </button>
              </div>

              <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 mb-4 text-xs text-zinc-700">
                <div><span className="font-semibold text-zinc-900">Skill:</span> {selectedRequest.skill?.name}</div>
                <div><span className="font-semibold text-zinc-900">Mentor:</span> {selectedRequest.teacher?.name}</div>
                <div><span className="font-semibold text-zinc-900">Learner:</span> {selectedRequest.requester?.name}</div>
              </div>

              <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Session Date
                  </label>
                  <input
                    type="date"
                    required
                    value={scheduleData.date}
                    onChange={(e) => setScheduleData({ ...scheduleData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleData.startTime}
                      onChange={(e) => setScheduleData({ ...scheduleData, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                      End Time
                    </label>
                    <input
                      type="time"
                      required
                      value={scheduleData.endTime}
                      onChange={(e) => setScheduleData({ ...scheduleData, endTime: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Mode
                  </label>
                  <select
                    value={scheduleData.mode}
                    onChange={(e) => setScheduleData({ ...scheduleData, mode: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  >
                    <option value="online">Online (Google Meet)</option>
                    <option value="in-person">In-Person (Campus Spot)</option>
                  </select>
                </div>

                {scheduleData.mode === 'online' ? (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                      Meeting Link (Google Meet / Zoom)
                    </label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/abc-def-xyz"
                      value={scheduleData.meetingLink}
                      onChange={(e) => setScheduleData({ ...scheduleData, meetingLink: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                      Campus Meeting Spot
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Library 2nd Floor Study Room"
                      value={scheduleData.location}
                      onChange={(e) => setScheduleData({ ...scheduleData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Session Topics / Agenda
                  </label>
                  <textarea
                    rows={2}
                    value={scheduleData.notes}
                    onChange={(e) => setScheduleData({ ...scheduleData, notes: e.target.value })}
                    placeholder="Specific questions or topics to review..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setScheduleModalOpen(false)}
                    className="btn-secondary text-xs px-3.5 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={scheduling}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    {scheduling ? 'Scheduling...' : 'Confirm & Schedule'}
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
