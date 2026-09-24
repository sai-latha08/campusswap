import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, BookOpen, Users, Star, ShieldCheck,
  ArrowRight, Filter, Sparkles, Plus, Clock,
  Calendar, Building, GraduationCap, X, Send,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/authSlice';

const CATEGORIES = [
  'All',
  'Programming',
  'Design',
  'Data Science',
  'Video & Media',
  'Music',
  'Language',
  'Mathematics',
  'Other',
];

export default function ExploreSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Selected skill for viewing mentors
  const [activeSkill, setActiveSkill] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(false);

  // Request modal state
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [requestData, setRequestData] = useState({
    preferredMode: 'online',
    preferredTime: 'Evenings',
    description: '',
  });
  const [sendingRequest, setSendingRequest] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, [selectedCategory]);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const res = await api.get('/skills', {
        params: {
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchTerm || undefined,
        },
      });
      if (res.data.success) {
        setSkills(res.data.data.skills);
      }
    } catch (err) {
      toast.error('Failed to load skills catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchSkills();
  };

  const handleOpenSkill = async (skill) => {
    setActiveSkill(skill);
    setLoadingTeachers(true);
    try {
      const res = await api.get(`/skills/${skill._id}/teachers`);
      if (res.data.success) {
        setTeachers(res.data.data.teachers);
      }
    } catch (err) {
      toast.error('Failed to load mentors for this skill');
    } finally {
      setLoadingTeachers(false);
    }
  };

  const handleOpenRequestModal = (teacher) => {
    if (!isAuthenticated) {
      toast('Please sign in to request a skill exchange.', { icon: '🔒' });
      navigate('/login');
      return;
    }
    setSelectedTeacher(teacher);
    setRequestModalOpen(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!activeSkill || !selectedTeacher) return;

    setSendingRequest(true);
    try {
      const res = await api.post('/skill-requests', {
        teacherId: selectedTeacher._id,
        skillId: activeSkill._id,
        preferredMode: requestData.preferredMode,
        preferredTime: requestData.preferredTime,
        description: requestData.description,
      });

      if (res.data.success) {
        toast.success(`Skill exchange request sent to ${selectedTeacher.name}! 🎉`);
        setRequestModalOpen(false);
        setRequestData({ preferredMode: 'online', preferredTime: 'Evenings', description: '' });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send request.';
      toast.error(msg);
    } finally {
      setSendingRequest(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ─── Hero / Header ────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-700 text-xs font-semibold mb-2 border border-zinc-200">
              <Sparkles size={13} /> 40/20 Matchmaking Engine
            </div>
            <h1 className="text-3xl font-extrabold text-zinc-950 font-display tracking-tight">
              Campus Skills Exchange
            </h1>
            <p className="text-zinc-500 text-xs sm:text-sm mt-1">
              Find verified student mentors, view rule-based compatibility scores, and schedule 1-on-1 sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/skills/my-skills"
              className="btn-primary text-xs"
            >
              <Plus size={14} /> Teach a Skill
            </Link>
            <Link
              to="/skills/requests"
              className="btn-secondary text-xs"
            >
              My Requests
            </Link>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200/80 hover:text-zinc-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-4 flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Python, React, UI/UX, Calculus..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:border-zinc-400 outline-none"
            />
          </div>
          <button
            type="submit"
            className="btn-primary py-2 px-4 text-xs font-semibold"
          >
            Search
          </button>
        </form>
      </div>

      {/* ─── Skills Grid ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <BookOpen size={36} className="text-zinc-300 mx-auto mb-2" />
          <h3 className="font-bold text-zinc-900 text-sm">No skills found</h3>
          <p className="text-zinc-400 text-xs mt-1">Try another search keyword or select a different category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill) => (
            <div
              key={skill._id}
              className="linear-card rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700 uppercase tracking-wider">
                    {skill.category}
                  </span>
                  <span className="text-[11px] text-zinc-500 flex items-center gap-1 font-semibold">
                    <Users size={12} className="text-zinc-400" />
                    {skill.teacherCount} {skill.teacherCount === 1 ? 'Mentor' : 'Mentors'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-950 font-display mb-1">{skill.name}</h3>
                <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                  {skill.description || 'Learn and exchange knowledge with fellow university peers.'}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenSkill(skill)}
                  className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Users size={13} />
                  <span>View Mentors & Match Score</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Mentors / Teachers Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {activeSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{activeSkill.category}</span>
                  <h2 className="text-xl font-bold text-slate-900 font-display mt-0.5">
                    Students Teaching {activeSkill.name}
                  </h2>
                </div>
                <button
                  onClick={() => setActiveSkill(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mentors List */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1">
                {loadingTeachers ? (
                  <div className="py-12 text-center">
                    <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                    <p className="text-xs text-slate-500 font-medium">Calculating skill match scores...</p>
                  </div>
                ) : teachers.length === 0 ? (
                  <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Users size={32} className="text-slate-400 mx-auto mb-2" />
                    <h4 className="font-bold text-slate-800 text-sm">No students teaching this skill yet</h4>
                    <p className="text-xs text-slate-500 mt-1">Be the first on campus to offer this skill!</p>
                    {isAuthenticated && (
                      <Link
                        to="/skills/my-skills"
                        className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
                      >
                        + Teach {activeSkill.name}
                      </Link>
                    )}
                  </div>
                ) : (
                  teachers.map((teacher) => (
                    <div
                      key={teacher._id}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
                          {teacher.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 text-sm">{teacher.name}</h4>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                              {teacher.matchScore}% Skill Match
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-1.5">
                            <Building size={12} /> {teacher.college}
                            {teacher.branch && (
                              <>
                                <span>•</span>
                                <GraduationCap size={12} /> {teacher.branch} (Yr {teacher.year || 1})
                              </>
                            )}
                          </p>

                          <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-600 font-medium">
                            <span className="flex items-center gap-1 text-emerald-600 font-bold">
                              <ShieldCheck size={13} /> Trust: {teacher.trustScore}/100
                            </span>
                            <span>•</span>
                            <span>{teacher.experienceYears} yr(s) exp</span>
                          </div>

                          {teacher.skillDescription && (
                            <p className="text-xs text-slate-600 mt-1 italic">
                              "{teacher.skillDescription}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0">
                        <button
                          onClick={() => handleOpenRequestModal(teacher)}
                          className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Send size={13} /> Request Exchange
                        </button>
                        <Link
                          to={`/users/${teacher._id}`}
                          className="w-full sm:w-auto px-3 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl text-center border border-slate-200"
                        >
                          Profile
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Request Proposal Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {requestModalOpen && selectedTeacher && activeSkill && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  Request Skill Exchange
                </h3>
                <button
                  onClick={() => setRequestModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 mb-5 text-xs text-indigo-900">
                <span className="font-bold">Skill:</span> {activeSkill.name} <br />
                <span className="font-bold">Mentor:</span> {selectedTeacher.name} ({selectedTeacher.college})
              </div>

              <form onSubmit={handleSendRequest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Mode
                  </label>
                  <select
                    value={requestData.preferredMode}
                    onChange={(e) => setRequestData({ ...requestData, preferredMode: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  >
                    <option value="online">Online (Google Meet / Zoom)</option>
                    <option value="in-person">In-Person (Campus Library / Lab)</option>
                    <option value="both">Flexible (Either)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Preferred Time / Availability
                  </label>
                  <input
                    type="text"
                    value={requestData.preferredTime}
                    onChange={(e) => setRequestData({ ...requestData, preferredTime: e.target.value })}
                    placeholder="e.g. Weekday evenings after 5 PM"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Message to Mentor
                  </label>
                  <textarea
                    rows={3}
                    value={requestData.description}
                    onChange={(e) => setRequestData({ ...requestData, description: e.target.value })}
                    placeholder="Describe what specific topics you'd like guidance on..."
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRequestModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingRequest}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm disabled:opacity-60 cursor-pointer"
                  >
                    <Send size={13} />
                    {sendingRequest ? 'Sending...' : 'Send Request'}
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
