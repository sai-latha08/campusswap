import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Plus, Trash2, GraduationCap,
  Sparkles, X, Check, AlertCircle, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MySkillsPage() {
  const [userProfile, setUserProfile] = useState(null);
  const [allSkills, setAllSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Teach modal
  const [teachModalOpen, setTeachModalOpen] = useState(false);
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [experienceYears, setExperienceYears] = useState(1);
  const [teachDescription, setTeachDescription] = useState('');
  const [submittingTeach, setSubmittingTeach] = useState(false);

  // Learn modal
  const [learnModalOpen, setLearnModalOpen] = useState(false);
  const [learnSkillId, setLearnSkillId] = useState('');
  const [submittingLearn, setSubmittingLearn] = useState(false);

  // Create new skill modal
  const [customSkillModalOpen, setCustomSkillModalOpen] = useState(false);
  const [customSkillData, setCustomSkillData] = useState({
    name: '',
    category: 'Programming',
    description: '',
  });
  const [creatingCustomSkill, setCreatingCustomSkill] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [meRes, skillsRes] = await Promise.all([
        api.get('/auth/me'),
        api.get('/skills'),
      ]);
      if (meRes.data.success) {
        setUserProfile(meRes.data.data.user);
      }
      if (skillsRes.data.success) {
        setAllSkills(skillsRes.data.data.skills);
      }
    } catch (err) {
      toast.error('Failed to load your skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTeach = async (e) => {
    e.preventDefault();
    if (!selectedSkillId) {
      toast.error('Please select a skill');
      return;
    }
    setSubmittingTeach(true);
    try {
      const res = await api.post('/skills/my-skills/teach', {
        skillId: selectedSkillId,
        experienceYears,
        description: teachDescription,
      });
      if (res.data.success) {
        toast.success('Skill added to your teaching list!');
        setUserProfile(res.data.data.user);
        setTeachModalOpen(false);
        setSelectedSkillId('');
        setTeachDescription('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setSubmittingTeach(false);
    }
  };

  const handleRemoveTeach = async (skillId) => {
    try {
      const res = await api.delete(`/skills/my-skills/teach/${skillId}`);
      if (res.data.success) {
        toast.success('Skill removed');
        setUserProfile(res.data.data.user);
      }
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };

  const handleAddLearn = async (e) => {
    e.preventDefault();
    if (!learnSkillId) {
      toast.error('Please select a skill');
      return;
    }
    setSubmittingLearn(true);
    try {
      const res = await api.post('/skills/my-skills/learn', {
        skillId: learnSkillId,
      });
      if (res.data.success) {
        toast.success('Skill added to learning list!');
        setUserProfile(res.data.data.user);
        setLearnModalOpen(false);
        setLearnSkillId('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    } finally {
      setSubmittingLearn(false);
    }
  };

  const handleRemoveLearn = async (skillId) => {
    try {
      const res = await api.delete(`/skills/my-skills/learn/${skillId}`);
      if (res.data.success) {
        toast.success('Skill removed');
        setUserProfile(res.data.data.user);
      }
    } catch (err) {
      toast.error('Failed to remove skill');
    }
  };

  const handleCreateCustomSkill = async (e) => {
    e.preventDefault();
    if (!customSkillData.name) return;
    setCreatingCustomSkill(true);
    try {
      const res = await api.post('/skills', customSkillData);
      if (res.data.success) {
        toast.success(`Skill "${res.data.data.skill.name}" added to catalog!`);
        setAllSkills([...allSkills, res.data.data.skill]);
        setCustomSkillModalOpen(false);
        setCustomSkillData({ name: '', category: 'Programming', description: '' });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create skill');
    } finally {
      setCreatingCustomSkill(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-zinc-200 rounded-2xl"></div>
            <div className="h-64 bg-zinc-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const skillsToTeach = userProfile?.skillsToTeach || [];
  const skillsToLearn = userProfile?.skillsToLearn || [];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/skills" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-2 transition-colors">
            <ArrowLeft size={13} /> Back to Skills Catalog
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">Manage My Skills</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Configure skills you want to teach or learn to optimize mentor match scores.
          </p>
        </div>

        <button
          onClick={() => setCustomSkillModalOpen(true)}
          className="btn-secondary self-start sm:self-auto text-xs py-2 px-3.5"
        >
          <Plus size={13} /> Propose New Skill
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ─── Column 1: Skills I Teach ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 font-display">Skills I Can Teach</h2>
                  <p className="text-xs text-zinc-500">{skillsToTeach.length} skill(s) listed</p>
                </div>
              </div>

              <button
                onClick={() => setTeachModalOpen(true)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <Plus size={13} /> Add Skill
              </button>
            </div>

            <div className="space-y-2.5">
              {skillsToTeach.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                  <BookOpen size={24} className="text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs text-zinc-600 font-medium">You haven't listed any skills to teach yet.</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Teach peers on campus to earn trust score badges.</p>
                </div>
              ) : (
                skillsToTeach.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-zinc-900 text-xs sm:text-sm">{item.skill?.name || 'Skill'}</span>
                        <span className="badge-minimal text-[10px]">
                          {item.experienceYears} yr(s) exp
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-zinc-500 mt-1 italic">"{item.description}"</p>
                      )}
                    </div>

                    <button
                      onClick={() => handleRemoveTeach(item.skill?._id || item.skill)}
                      className="p-1 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ─── Column 2: Skills I Want to Learn ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-7 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center border border-zinc-200">
                  <GraduationCap size={16} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-zinc-900 font-display">Skills I Want to Learn</h2>
                  <p className="text-xs text-zinc-500">{skillsToLearn.length} skill(s) listed</p>
                </div>
              </div>

              <button
                onClick={() => setLearnModalOpen(true)}
                className="btn-primary text-xs py-1.5 px-3"
              >
                <Plus size={13} /> Add Skill
              </button>
            </div>

            <div className="space-y-2.5">
              {skillsToLearn.length === 0 ? (
                <div className="text-center py-12 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                  <GraduationCap size={24} className="text-zinc-400 mx-auto mb-2" />
                  <p className="text-xs text-zinc-600 font-medium">No learning goals added yet.</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Add skills to get matched with compatible student mentors.</p>
                </div>
              ) : (
                skillsToLearn.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-zinc-900 text-xs sm:text-sm">{skill.name || skill}</span>
                      <span className="text-[11px] text-zinc-400">• {skill.category || 'General'}</span>
                    </div>

                    <button
                      onClick={() => handleRemoveLearn(skill._id || skill)}
                      className="p-1 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Add Skill to Teach Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {teachModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900 font-display">Add Teachable Skill</h3>
                <button onClick={() => setTeachModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddTeach} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Select Skill
                  </label>
                  <select
                    value={selectedSkillId}
                    onChange={(e) => setSelectedSkillId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  >
                    <option value="">-- Choose a skill --</option>
                    {allSkills.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Years of Experience: {experienceYears} yr(s)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(parseInt(e.target.value, 10))}
                    className="w-full accent-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Description / What you can cover
                  </label>
                  <textarea
                    rows={3}
                    value={teachDescription}
                    onChange={(e) => setTeachDescription(e.target.value)}
                    placeholder="e.g. Can teach React hooks, state management, and project building..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTeachModalOpen(false)}
                    className="btn-secondary text-xs px-3.5 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingTeach}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    {submittingTeach ? 'Saving...' : 'Add to Teach List'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Add Skill to Learn Modal ─────────────────────────────────── */}
      <AnimatePresence>
        {learnModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900 font-display">Add Skill to Learn</h3>
                <button onClick={() => setLearnModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddLearn} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Select Skill
                  </label>
                  <select
                    value={learnSkillId}
                    onChange={(e) => setLearnSkillId(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  >
                    <option value="">-- Choose a skill --</option>
                    {allSkills.map((s) => (
                      <option key={s._id} value={s._id}>{s.name} ({s.category})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setLearnModalOpen(false)}
                    className="btn-secondary text-xs px-3.5 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingLearn}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    {submittingLearn ? 'Saving...' : 'Add to Learning List'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Propose Custom Skill Modal ──────────────────────────────── */}
      <AnimatePresence>
        {customSkillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-xl border border-zinc-200"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
                <h3 className="text-base font-bold text-zinc-900 font-display">Propose New Campus Skill</h3>
                <button onClick={() => setCustomSkillModalOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-700">
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateCustomSkill} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Skill Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customSkillData.name}
                    onChange={(e) => setCustomSkillData({ ...customSkillData, name: e.target.value })}
                    placeholder="e.g. Flutter, Blender 3D, Rust, Guitar"
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Category
                  </label>
                  <select
                    value={customSkillData.category}
                    onChange={(e) => setCustomSkillData({ ...customSkillData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Video & Media">Video & Media</option>
                    <option value="Music">Music</option>
                    <option value="Language">Language</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Business">Business</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={customSkillData.description}
                    onChange={(e) => setCustomSkillData({ ...customSkillData, description: e.target.value })}
                    placeholder="Short summary of topics or tools covered..."
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomSkillModalOpen(false)}
                    className="btn-secondary text-xs px-3.5 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingCustomSkill}
                    className="btn-primary text-xs px-4 py-2"
                  >
                    {creatingCustomSkill ? 'Creating...' : 'Create Skill'}
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
