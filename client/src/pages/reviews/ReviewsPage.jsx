import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Star, ShieldCheck, Award, ThumbsUp, MessageSquare,
  Sparkles, CheckCircle2, User, Filter, AlertCircle, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { selectCurrentUser } from '../../store/authSlice';

export default function ReviewsPage() {
  const currentUser = useSelector(selectCurrentUser);
  const [activeTab, setActiveTab] = useState('received'); // 'received' | 'given'
  const [receivedReviews, setReceivedReviews] = useState([]);
  const [givenReviews, setGivenReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReceived, setTotalReceived] = useState(0);
  const [starFilter, setStarFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [recRes, givRes] = await Promise.all([
        api.get(`/reviews/user/${currentUser._id || currentUser.id}`),
        api.get('/reviews/my-reviews')
      ]);

      if (recRes.data.success) {
        setReceivedReviews(recRes.data.data.reviews || []);
        setAverageRating(recRes.data.data.averageRating || 0);
        setTotalReceived(recRes.data.data.total || 0);
      }

      if (givRes.data.success) {
        setGivenReviews(givRes.data.data.reviews || []);
      }
    } catch (err) {
      toast.error('Failed to load reviews data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentUser]);

  const trust = currentUser?.trustScore || 50;

  const filteredReceived = receivedReviews.filter((r) => {
    if (starFilter === 'all') return true;
    return r.rating === Number(starFilter);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="badge-minimal mb-2">
            <ShieldCheck size={13} className="text-zinc-900" /> Campus Reputation Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
            Reviews & Trust Reputation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Build your campus standing through successful skill exchanges, rental handoffs, and peer ratings.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="btn-secondary self-start md:self-auto text-xs py-2 px-3.5"
        >
          <RefreshCw size={13} /> Refresh Ratings
        </button>
      </div>

      {/* ─── Trust Reputation & Score Overview ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-10">
        {/* Trust Score Card */}
        <div className="bg-zinc-900 rounded-2xl p-6 text-white border border-zinc-800 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Verified Trust Score
              </span>
              <span className="badge-minimal bg-zinc-800 border-zinc-700 text-zinc-200 text-[10px]">
                {trust >= 75 ? 'Highly Trusted' : 'Good Standing'}
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-4xl font-bold font-display tracking-tight text-white">
                {trust}
              </span>
              <span className="text-zinc-400 text-xs font-normal">/ 100 PTS</span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden my-3.5 border border-zinc-700">
              <div
                className="h-full bg-white transition-all duration-1000 rounded-full"
                style={{ width: `${Math.min(trust, 100)}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Calculated transparently based on 5-star ratings, completed skill teachings, safe item returns, and peer verifications.
            </p>
          </div>
        </div>

        {/* Rating Metrics Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Community Rating
            </span>
            <div className="flex items-center gap-3 mt-1.5">
              <div className="text-3xl font-bold text-zinc-900 font-display">
                {averageRating > 0 ? averageRating : '5.0'}
              </div>
              <div>
                <div className="flex items-center gap-0.5 text-zinc-900">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={s <= Math.round(averageRating || 5) ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-200'}
                    />
                  ))}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Based on {totalReceived} peer review(s)
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-zinc-100">
            <div className="p-2 bg-zinc-50 rounded-xl text-center border border-zinc-100">
              <span className="text-[10px] text-zinc-400 block">Skills Taught</span>
              <span className="font-semibold text-zinc-900 text-sm">{currentUser?.stats?.completedSkillSessions || 0}</span>
            </div>
            <div className="p-2 bg-zinc-50 rounded-xl text-center border border-zinc-100">
              <span className="text-[10px] text-zinc-400 block">Rentals Fulfilled</span>
              <span className="font-semibold text-zinc-900 text-sm">{currentUser?.stats?.completedRentals || 0}</span>
            </div>
          </div>
        </div>

        {/* Trust Badges & Safety Card */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm space-y-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 block">
            Reputation Milestones
          </span>

          <div className="flex items-center gap-2.5 p-2 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white shrink-0">
              <CheckCircle2 size={13} />
            </div>
            <div>
              <div className="font-medium text-zinc-900 text-xs">Verified Student ID</div>
              <div className="text-[10px] text-zinc-500">Official .edu email authenticated</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white shrink-0">
              <Sparkles size={13} />
            </div>
            <div>
              <div className="font-medium text-zinc-900 text-xs">Zero Disputed Claims</div>
              <div className="text-[10px] text-zinc-500">100% dispute-free record</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 bg-zinc-50 rounded-xl border border-zinc-100">
            <div className="p-1.5 rounded-lg bg-zinc-900 text-white shrink-0">
              <Award size={13} />
            </div>
            <div>
              <div className="font-medium text-zinc-900 text-xs">Campus Contributor</div>
              <div className="text-[10px] text-zinc-500">Active resource sharing member</div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs & Star Filters ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('received')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'received'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Reviews Received ({receivedReviews.length})
          </button>
          <button
            onClick={() => setActiveTab('given')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'given'
                ? 'bg-zinc-900 text-white shadow-2xs'
                : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
            }`}
          >
            Reviews Given ({givenReviews.length})
          </button>
        </div>

        {activeTab === 'received' && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[11px] font-semibold text-zinc-400 mr-1 flex items-center gap-1">
              <Filter size={11} /> Filter:
            </span>
            {['all', '5', '4', '3', '2', '1'].map((val) => (
              <button
                key={val}
                onClick={() => setStarFilter(val)}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium transition-all ${
                  starFilter === val
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {val === 'all' ? 'All' : `${val} ★`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ─── Reviews List ──────────────────────────────────────────────── */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : activeTab === 'received' ? (
        filteredReceived.length > 0 ? (
          <div className="space-y-3">
            {filteredReceived.map((rev) => (
              <div
                key={rev._id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:border-zinc-300 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold flex items-center justify-center text-xs">
                      {rev.reviewer?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <Link
                        to={`/users/${rev.reviewer?._id}`}
                        className="font-semibold text-zinc-900 text-xs sm:text-sm hover:underline"
                      >
                        {rev.reviewer?.name || 'Verified Student'}
                      </Link>
                      <div className="text-[11px] text-zinc-400">
                        {rev.reviewer?.college || 'Campus Peer'} • Trust Score: {rev.reviewer?.trustScore || 50}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          className={s <= rev.rating ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-200'}
                        />
                      ))}
                    </div>
                    <span className="badge-minimal text-[10px]">
                      {rev.type}
                    </span>
                  </div>
                </div>

                {rev.comment && (
                  <p className="text-xs text-zinc-700 bg-zinc-50 rounded-xl p-3 border border-zinc-100 italic">
                    "{rev.comment}"
                  </p>
                )}

                <div className="text-[10px] text-zinc-400 mt-2.5 text-right">
                  {new Date(rev.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-lg mx-auto">
            <Star size={32} className="mx-auto text-zinc-300 mb-2" />
            <h3 className="font-semibold text-zinc-900 text-sm">No reviews yet</h3>
            <p className="text-xs text-zinc-500 mt-1">
              Complete skill sessions or item rentals with peers on campus to earn verified reviews and boost your trust standing.
            </p>
          </div>
        )
      ) : givenReviews.length > 0 ? (
        <div className="space-y-3">
          {givenReviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold flex items-center justify-center text-xs">
                    {rev.reviewedUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-400 block">Reviewed Peer:</span>
                    <Link
                      to={`/users/${rev.reviewedUser?._id}`}
                      className="font-semibold text-zinc-900 text-xs sm:text-sm hover:underline"
                    >
                      {rev.reviewedUser?.name || 'Student'}
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        className={s <= rev.rating ? 'fill-zinc-900 text-zinc-900' : 'text-zinc-200'}
                      />
                    ))}
                  </div>
                  <span className="badge-minimal text-[10px]">
                    {rev.type}
                  </span>
                </div>
              </div>

              {rev.comment && (
                <p className="text-xs text-zinc-700 bg-zinc-50 rounded-xl p-3 border border-zinc-100 italic">
                  "{rev.comment}"
                </p>
              )}

              <div className="text-[10px] text-zinc-400 mt-2.5 text-right">
                Submitted on {new Date(rev.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center max-w-lg mx-auto">
          <MessageSquare size={32} className="mx-auto text-zinc-300 mb-2" />
          <h3 className="font-semibold text-zinc-900 text-sm">No reviews given yet</h3>
          <p className="text-xs text-zinc-500 mt-1">
            After completing a skill exchange or returning a rental item, submit a review to recognize your peer's reliability.
          </p>
        </div>
      )}
    </div>
  );
}
