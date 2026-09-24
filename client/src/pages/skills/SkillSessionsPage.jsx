import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Video, MapPin, CheckCircle,
  ExternalLink, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../store/authSlice';

export default function SkillSessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'completed'
  const currentUser = useSelector(selectCurrentUser);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skill-sessions');
      if (res.data.success) {
        setSessions(res.data.data.sessions);
      }
    } catch (err) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (sessionId, status) => {
    try {
      const res = await api.patch(`/skill-sessions/${sessionId}/status`, { status });
      if (res.data.success) {
        toast.success(`Session marked as ${status}!`);
        setSessions(
          sessions.map((s) => (s._id === sessionId ? res.data.data.session : s))
        );
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update session');
    }
  };

  const upcomingSessions = sessions.filter((s) => s.status === 'scheduled');
  const completedSessions = sessions.filter((s) => s.status === 'completed' || s.status === 'cancelled');

  const displayedSessions = activeTab === 'upcoming' ? upcomingSessions : completedSessions;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">1-on-1 Skill Sessions</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Track your scheduled learning sessions, meeting links, and completed peer lessons.
          </p>
        </div>

        <Link
          to="/skills/requests"
          className="btn-secondary self-start sm:self-auto text-xs py-2 px-3.5"
        >
          View Requests
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'upcoming'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Calendar size={14} />
          Upcoming Sessions ({upcomingSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'completed'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <CheckCircle size={14} />
          Past & Completed ({completedSessions.length})
        </button>
      </div>

      {/* Sessions Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : displayedSessions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <Calendar size={32} className="text-zinc-400 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-900 text-sm">
            No {activeTab} skill sessions
          </h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? 'Accept a skill request or send one to schedule a session.'
              : 'Completed sessions will appear here once peer lessons finish.'}
          </p>
          <Link
            to="/skills"
            className="btn-primary mt-4 inline-flex text-xs py-2 px-3.5"
          >
            Explore Skills
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedSessions.map((session) => {
            const isTeacher = String(session.teacher?._id) === String(currentUser?._id);
            const partner = isTeacher ? session.learner : session.teacher;

            return (
              <div
                key={session._id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:border-zinc-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-13 h-13 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] uppercase font-bold text-zinc-400">
                      {new Date(session.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-zinc-900 leading-none">
                      {new Date(session.date).getDate()}
                    </span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 text-sm">
                        {session.skill?.name || 'Skill Session'}
                      </h3>
                      <span className="badge-minimal text-[10px]">
                        {isTeacher ? 'You are Teaching' : 'You are Learning'}
                      </span>
                      <span className="badge-minimal text-[10px]">
                        {session.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-500">
                      <span className="flex items-center gap-1 font-medium text-zinc-800">
                        <Clock size={12} className="text-zinc-400" />
                        {session.startTime} - {session.endTime}
                      </span>
                      <span>•</span>
                      <span>Partner: <strong className="text-zinc-800">{partner?.name}</strong> ({partner?.college})</span>
                    </div>

                    {session.mode === 'online' && session.meetingLink && (
                      <div className="mt-2">
                        <a
                          href={session.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 hover:text-black bg-zinc-100 px-2.5 py-1 rounded-lg border border-zinc-200"
                        >
                          <Video size={12} />
                          Join Meeting <ExternalLink size={10} />
                        </a>
                      </div>
                    )}

                    {session.mode === 'in-person' && session.location && (
                      <p className="text-xs text-zinc-600 mt-2 flex items-center gap-1.5">
                        <MapPin size={12} className="text-zinc-400" />
                        Meeting Spot: <strong className="text-zinc-800">{session.location}</strong>
                      </p>
                    )}

                    {session.notes && (
                      <p className="text-xs text-zinc-500 mt-1.5 italic">
                        Agenda: "{session.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 w-full md:w-auto shrink-0">
                  {session.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(session._id, 'completed')}
                        className="btn-primary w-full text-xs py-1.5 px-3"
                      >
                        <CheckCircle size={13} /> Mark Completed
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(session._id, 'cancelled')}
                        className="btn-secondary w-full text-xs py-1.5 px-3 text-red-600 hover:bg-red-50"
                      >
                        Cancel Session
                      </button>
                    </>
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
    </div>
  );
}
