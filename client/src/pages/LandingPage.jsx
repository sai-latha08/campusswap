import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, ShoppingBag, ArrowRightLeft, ShieldCheck,
  Search, ArrowRight, CheckCircle2, Star, Sparkles,
  Command, Layers, RefreshCw, Calendar, Award,
  Lock, Check, ArrowUpRight, ChevronRight, Laptop, Camera, Cpu
} from 'lucide-react';
import api from '../services/api';

export default function LandingPage() {
  const navigate = useNavigate();
  const [activeSearchTab, setActiveSearchTab] = useState('skills'); // 'skills' | 'rentals' | 'barter'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('All');
  const [healthData, setHealthData] = useState(null);

  useEffect(() => {
    api.get('/health')
      .then((res) => {
        if (res.data?.success) setHealthData(res.data.data);
      })
      .catch(() => {});
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = encodeURIComponent(searchQuery.trim());
    if (activeSearchTab === 'skills') {
      navigate(`/skills?search=${q}&category=${categoryQuery}`);
    } else if (activeSearchTab === 'rentals') {
      navigate(`/rentals?search=${q}&category=${categoryQuery}`);
    } else {
      navigate(`/barter?search=${q}`);
    }
  };

  return (
    <div className="bg-[#fafafa] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      {/* ─── Minimalist Apple/Linear Hero Section ──────────────────────── */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 border-b border-zinc-200/70 subtle-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Minimalist Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-zinc-200 text-xs font-semibold text-zinc-700 shadow-xs mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Verified Campus Sharing Ecosystem</span>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-500 font-normal">.edu authentication</span>
            </motion.div>

            {/* Sharp Typography Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 font-display leading-[1.08]"
            >
              Learn skills. Rent gear. <br />
              <span className="text-zinc-500">Barter without cash.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-5 text-base sm:text-lg text-zinc-600 max-w-xl mx-auto font-normal leading-relaxed"
            >
              The unified resource-sharing platform for college campuses. Match with peer mentors, book lab gear with anti-overlap protection, or trade tutoring hours for physical equipment.
            </motion.p>

            {/* ─── Minimalist Linear Search Component ─────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-8 max-w-2xl mx-auto"
            >
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-2">
                {/* Segmented Switcher */}
                <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl mb-2 text-xs font-semibold">
                  {[
                    { id: 'skills', label: 'Skills Exchange' },
                    { id: 'rentals', label: 'Item Rentals' },
                    { id: 'barter', label: 'Skill-for-Item Barter' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveSearchTab(tab.id)}
                      className={`flex-1 py-1.5 px-3 rounded-lg transition-all duration-150 cursor-pointer ${
                        activeSearchTab === tab.id
                          ? 'bg-white text-zinc-950 font-bold shadow-xs'
                          : 'text-zinc-600 hover:text-zinc-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Search Input Bar */}
                <form onSubmit={handleHeroSearch} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={
                        activeSearchTab === 'skills'
                          ? 'Search skills (e.g. Python, Calculus, UI/UX, Data Structures)...'
                          : activeSearchTab === 'rentals'
                          ? 'Search items to rent (e.g. 3D Printer, DSLR Camera, TI-84)...'
                          : 'Search barter trades (e.g. Web Dev for Camera)...'
                      }
                      className="w-full pl-9 pr-3 py-2.5 bg-transparent rounded-lg text-xs font-medium text-zinc-900 placeholder:text-zinc-400 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary shrink-0 py-2.5 px-4 text-xs font-semibold"
                  >
                    <span>Search</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              </div>

              {/* Quick Suggestions */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-zinc-500">
                <span className="text-zinc-400 text-[11px]">Popular:</span>
                {['Python / ML', 'DSLR Camera', 'TI-84 Plus', 'Web Architecture', '3D Printer', 'Calculus'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => {
                      setSearchQuery(term);
                      navigate(`/skills?search=${encodeURIComponent(term)}`);
                    }}
                    className="px-2 py-0.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── Metric Strip (Linear Style) ────────────────────────────────── */}
      <section className="border-b border-zinc-200/80 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-zinc-100">
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-zinc-900">
                100%
              </div>
              <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                Verified .EDU Peers
              </div>
            </div>
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-zinc-900">
                40/20/15
              </div>
              <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                Weighted Match Formula
              </div>
            </div>
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-zinc-900">
                $0 Fees
              </div>
              <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                Skill ↔ Item Barter
              </div>
            </div>
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-zinc-900">
                0–100 PTS
              </div>
              <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mt-0.5">
                Transparent Trust Score
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bento Grid: The 3 Core Pillars ─────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
            Architecture & Features
          </span>
          <h2 className="text-3xl font-bold text-zinc-950 font-display mt-1 tracking-tight">
            One platform. Three campus sharing models.
          </h2>
          <p className="text-sm text-zinc-600 mt-2">
            No fragmented group chats or lost deposits. CampusSwap structures skill exchanges, item rentals, and barter trades with verified student reputation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Bento Box 1: Skill Exchange */}
          <div className="linear-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4 border border-zinc-200">
                <BookOpen size={18} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-zinc-950 font-display">Skill Exchange</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                  40/20 Match
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                Teach what you know, learn what you need. Intelligent matching factors topic relevance, proficiency tier, campus proximity, and schedule availability.
              </p>

              <div className="mt-6 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-1.5">
                <div className="flex justify-between text-zinc-600 text-[11px]">
                  <span>Topic Alignment (40%)</span>
                  <span className="font-bold text-zinc-900">Exact Match</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-[11px]">
                  <span>Proficiency Compatibility (20%)</span>
                  <span className="font-bold text-zinc-900">Advanced / Novice</span>
                </div>
                <div className="flex justify-between text-zinc-600 text-[11px]">
                  <span>Availability Overlap (15%)</span>
                  <span className="font-bold text-zinc-900">Anti-Overlap Checked</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <Link to="/skills" className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1">
                Browse 14+ Campus Skills <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Bento Box 2: Student Rentals */}
          <div className="linear-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4 border border-zinc-200">
                <ShoppingBag size={18} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-zinc-950 font-display">Gear Rentals</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                  Anti-Overlap
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                Rent scientific calculators, DSLRs, lab microscopes, and textbooks at student rates. Database calendar blackout queries prevent double bookings.
              </p>

              <div className="mt-6 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">Safe Security Deposits</span>
                  <span className="text-[11px] text-zinc-500">Refunded upon return</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-900">Calendar Blackouts</span>
                  <span className="text-[11px] text-zinc-500">Zero double-bookings</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <Link to="/rentals" className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1">
                Explore Rental Catalog <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Bento Box 3: Skill-for-Item Barter */}
          <div className="linear-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-900 mb-4 border border-zinc-200">
                <ArrowRightLeft size={18} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-zinc-950 font-display">Skill ↔ Item Barter</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-900 text-white">
                  Signature
                </span>
              </div>
              <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                Don't have rental cash? Offer to tutor your peers in exchange for borrowing items. A formal multi-step state machine verifies trade completion.
              </p>

              <div className="mt-6 p-3 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs">
                <div className="font-bold text-zinc-900 mb-1">Example Barter Agreement:</div>
                <div className="text-zinc-600 text-[11px] space-y-1">
                  <div>• <strong>Offer:</strong> 3 Hours Python Tutoring</div>
                  <div>• <strong>Receive:</strong> 5 Days 3D Printer Kit Access</div>
                  <div className="text-emerald-700 font-semibold pt-1">• +3 Trust Score Bonus on completion</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between">
              <Link to="/barter" className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 flex items-center gap-1">
                Propose Barter Trade <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Minimalist Reputation & Verified Reviews Section ────────────── */}
      <section className="py-20 border-t border-zinc-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Trust & Standing
            </span>
            <h2 className="text-3xl font-bold text-zinc-950 font-display mt-1 tracking-tight">
              Verified campus reputation you can trust.
            </h2>
            <p className="text-sm text-zinc-600 mt-2">
              Every review on CampusSwap is linked to a completed skill session, rental handoff, or barter contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Elena Rostova',
                role: 'Stanford University • Computer Science',
                score: 98,
                stars: 5,
                text: 'Taught 4 sessions of React web architecture in exchange for borrowing an oscilloscope for my robotics midterm. Transparent and smooth.',
                tag: 'Diamond Verified',
              },
              {
                name: 'Marcus Vance',
                role: 'Stanford University • Mechanical Eng',
                score: 91,
                stars: 5,
                text: 'Listed my 3D printer for student rentals. The anti-overlap calendar prevented any double-booking clashes and deposit handling was automatic.',
                tag: 'Platinum Renter',
              },
              {
                name: 'David Chen',
                role: 'Stanford University • Electrical Eng',
                score: 89,
                stars: 5,
                text: 'Rented a scientific calculator for finals week in under 2 minutes. The peer trust rating gave me total confidence in the transaction.',
                tag: 'Gold Member',
              },
            ].map((t, idx) => (
              <div key={idx} className="linear-card rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(t.stars)].map((_, i) => (
                        <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-800 border border-zinc-200">
                      ★ {t.score} PTS
                    </span>
                  </div>

                  <p className="text-xs text-zinc-700 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-zinc-950 block">{t.name}</strong>
                    <span className="text-[11px] text-zinc-400">{t.role}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Apple/Linear Style Clean CTA Banner ────────────────────────── */}
      <section className="py-20 border-t border-zinc-200 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-zinc-950 text-white rounded-3xl p-10 sm:p-14 text-center max-w-3xl mx-auto shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Start sharing on your campus.
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
              Join verified students learning skills, renting equipment, and building campus reputation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 bg-white text-zinc-950 hover:bg-zinc-100 font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Create Account (.edu)
              </Link>
              <Link
                to="/skills"
                className="w-full sm:w-auto px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl border border-zinc-700 transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
