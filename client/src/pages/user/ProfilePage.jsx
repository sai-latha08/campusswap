import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User as UserIcon, Mail, Building, GraduationCap, MapPin,
  Calendar, ShieldCheck, Award, Star, CheckCircle, Edit3,
  BookOpen, Clock, MessageSquare, Phone
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { selectCurrentUser } from '../../store/authSlice';

export default function ProfilePage() {
  const { id } = useParams();
  const currentUser = useSelector(selectCurrentUser);
  const isOwnProfile = !id || id === currentUser?._id;

  const [profileUser, setProfileUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndReviews = async () => {
      setLoading(true);
      try {
        let targetId = id;
        if (isOwnProfile) {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setProfileUser(res.data.data.user);
            targetId = res.data.data.user._id;
          }
        } else {
          const res = await api.get(`/users/${id}`);
          if (res.data.success) {
            setProfileUser(res.data.data.user);
          }
        }

        if (targetId) {
          const revRes = await api.get(`/reviews/user/${targetId}`);
          if (revRes.data.success) {
            setReviews(revRes.data.data.reviews || []);
          }
        }
      } catch (err) {
        toast.error('Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndReviews();
  }, [id, isOwnProfile]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-44 bg-zinc-200 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-64 bg-zinc-200 rounded-2xl"></div>
            <div className="md:col-span-2 h-64 bg-zinc-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <h2 className="text-xl font-bold text-zinc-900 font-display">Student Not Found</h2>
        <p className="text-zinc-500 text-xs mt-1.5">The profile you are looking for does not exist.</p>
        <Link to="/dashboard" className="btn-primary mt-4 inline-flex text-xs">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const trust = profileUser.trustScore || 50;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ─── Profile Header Card ────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-2xl bg-zinc-100 border border-zinc-200 text-zinc-900 text-2xl font-bold flex items-center justify-center shadow-2xs shrink-0">
              {profileUser.profileImage ? (
                <img src={profileUser.profileImage} alt={profileUser.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                profileUser.name?.charAt(0)?.toUpperCase()
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
                  {profileUser.name}
                </h1>
                {profileUser.role === 'admin' && (
                  <span className="badge-minimal text-[10px]">
                    Admin
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm font-medium text-zinc-600 mt-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="flex items-center gap-1">
                  <Building size={13} className="text-zinc-400" /> {profileUser.college}
                </span>
                {profileUser.branch && (
                  <>
                    <span className="text-zinc-300">•</span>
                    <span className="flex items-center gap-1">
                      <GraduationCap size={13} className="text-zinc-400" /> {profileUser.branch}
                    </span>
                  </>
                )}
                {profileUser.year && (
                  <>
                    <span className="text-zinc-300">•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-zinc-400" /> Year {profileUser.year}
                    </span>
                  </>
                )}
              </p>

              {profileUser.location && (
                <p className="text-xs text-zinc-500 mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin size={12} className="text-zinc-400" /> {profileUser.location}
                </p>
              )}
            </div>
          </div>

          {/* Trust Score Display & Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center w-full sm:w-32">
              <div className="text-2xl font-bold text-zinc-900">{trust}</div>
              <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
                Trust Score
              </div>
            </div>

            {isOwnProfile ? (
              <Link
                to="/profile/edit"
                className="btn-primary w-full sm:w-auto text-xs py-2.5 px-4"
              >
                <Edit3 size={13} />
                Edit Profile
              </Link>
            ) : (
              <Link
                to={`/messages?user=${profileUser._id}`}
                className="btn-primary w-full sm:w-auto text-xs py-2.5 px-4"
              >
                <MessageSquare size={13} /> Message
              </Link>
            )}
          </div>
        </div>

        {/* Badges Bar */}
        <div className="mt-5 pt-5 border-t border-zinc-100 flex flex-wrap gap-1.5">
          <span className="badge-minimal text-[10px]">
            <CheckCircle size={11} /> College Verified
          </span>
          <span className="badge-minimal text-[10px]">
            <ShieldCheck size={11} /> Email Verified
          </span>
          {(profileUser.stats?.completedSkillSessions || 0) >= 3 && (
            <span className="badge-minimal text-[10px]">
              <Award size={11} /> Skilled Mentor
            </span>
          )}
          {(profileUser.stats?.completedRentals || 0) >= 3 && (
            <span className="badge-minimal text-[10px]">
              <Award size={11} /> Reliable Renter
            </span>
          )}
        </div>
      </div>

      {/* ─── Profile Content Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Bio & Stats */}
        <div className="space-y-6">
          {/* Bio Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2.5">About</h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              {profileUser.bio || 'No bio written yet. Click Edit Profile to introduce yourself to your campus peers!'}
            </p>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-3">Platform Stats</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Skill Sessions Taught</span>
                <span className="font-semibold text-zinc-900">{profileUser.stats?.completedSkillSessions || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Rentals Completed</span>
                <span className="font-semibold text-zinc-900">{profileUser.stats?.completedRentals || 0}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Barter Exchanges</span>
                <span className="font-semibold text-zinc-900">{profileUser.stats?.completedBarters || 0}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-500">Average Rating</span>
                <span className="font-semibold text-zinc-900 flex items-center gap-1">
                  <Star size={12} className="fill-zinc-900 text-zinc-900" />
                  {profileUser.averageRating || 'New'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills & Availability */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skills Can Teach */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <BookOpen size={16} />
                Skills I Can Teach
              </h3>
              {isOwnProfile && (
                <Link to="/skills/my-skills" className="text-xs font-semibold text-zinc-900 hover:underline">
                  Manage Skills
                </Link>
              )}
            </div>

            {profileUser.skillsToTeach && profileUser.skillsToTeach.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {profileUser.skillsToTeach.map((item, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <div className="font-semibold text-zinc-900 text-xs">
                      {item.skill?.name || 'Skill'}
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {item.experienceYears ? `${item.experienceYears} yr(s) experience` : 'Beginner/Intermediate'}
                    </div>
                    {item.description && (
                      <p className="text-xs text-zinc-600 mt-1 italic">"{item.description}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <p className="text-xs text-zinc-400">No skills listed to teach yet.</p>
                {isOwnProfile && (
                  <Link to="/skills" className="mt-1.5 inline-block text-xs font-semibold text-zinc-900 underline">
                    + Add Skills to Teach
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Skills Want to Learn */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <GraduationCap size={16} />
              Skills I Want to Learn
            </h3>

            {profileUser.skillsToLearn && profileUser.skillsToLearn.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {profileUser.skillsToLearn.map((skill, idx) => (
                  <span
                    key={idx}
                    className="badge-minimal text-xs font-medium"
                  >
                    {skill.name || skill}
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <p className="text-xs text-zinc-400">No skills listed to learn yet.</p>
              </div>
            )}
          </div>

          {/* Weekly Availability */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-zinc-900 mb-3 flex items-center gap-2">
              <Clock size={16} />
              Weekly Availability Schedule
            </h3>

            {profileUser.availability && profileUser.availability.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {profileUser.availability.map((slot, idx) => (
                  <div key={idx} className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-200 text-xs">
                    <span className="font-semibold text-zinc-900 block">{slot.day}</span>
                    <span className="text-zinc-500">{slot.startTime} - {slot.endTime}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-zinc-400 italic">Availability schedule not yet set.</p>
            )}
          </div>

          {/* Peer Reviews Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Star size={14} className="text-zinc-900 fill-zinc-900" />
                Peer Reviews & Ratings ({reviews.length})
              </h3>
              {isOwnProfile && (
                <Link to="/reviews" className="text-xs font-semibold text-zinc-900 hover:underline">
                  View All Details
                </Link>
              )}
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-2.5">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white font-bold flex items-center justify-center text-[10px]">
                          {rev.reviewer?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <span className="text-xs font-semibold text-zinc-900 block">{rev.reviewer?.name}</span>
                          <span className="text-[10px] text-zinc-400">{rev.reviewer?.college}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={11}
                            className={s <= rev.rating ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-200'}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.comment && (
                      <p className="text-xs text-zinc-600 italic">"{rev.comment}"</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
                <p className="text-xs text-zinc-400">No reviews received yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
