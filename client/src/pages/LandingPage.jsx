import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, ShoppingBag, ArrowRightLeft, ShieldCheck,
  Search, ArrowRight, CheckCircle2, Star, Sparkles,
  Command, Layers, RefreshCw, Calendar, Award,
  Lock, Check, ArrowUpRight, ChevronRight, Users, Clock
} from 'lucide-react';
import api from '../services/api';
import CampusInteractiveHero from '../components/common/CampusInteractiveHero';

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
    <div className="bg-[#faf6f0] text-stone-900 selection:bg-[#881337] selection:text-white">
      {/* ─── Hero Section with Signature 3D Campus Experience ─────────── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#e7ded3] campus-mesh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Heading, Supporting Text, Search & CTAs */}
            <div className="lg:col-span-7 text-left">
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#e7ded3] text-xs font-semibold text-stone-700 shadow-xs mb-6"
              >
                <span className="w-2 h-2 rounded-full bg-[#166534] animate-pulse" />
                <span>Verified Campus Sharing Platform</span>
                <span className="text-stone-300">•</span>
                <span className="text-[#881337] font-bold">.edu verified</span>
              </motion.div>

              {/* Exact Requested Hero Copy */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-4xl sm:text-6xl font-black tracking-tight text-stone-950 font-display leading-[1.08]"
              >
                Everything students can share,{' '}
                <span className="text-[#881337]">in one place.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="mt-5 text-base sm:text-lg text-stone-600 max-w-xl font-normal leading-relaxed"
              >
                Exchange skills, rent useful resources, and connect with students around you.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mt-6 flex flex-wrap items-center gap-3"
              >
                <Link
                  to="/skills"
                  className="btn-primary py-3 px-6 text-sm font-bold shadow-md"
                >
                  Explore CampusSwap <ArrowRight size={16} />
                </Link>
                <Link
                  to="/register"
                  className="btn-secondary py-3 px-6 text-sm font-bold"
                >
                  Start Sharing
                </Link>
              </motion.div>

              {/* ─── Integrated Unified Search Switcher ────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="mt-8 max-w-xl"
              >
                <div className="bg-white rounded-2xl border border-[#e7ded3] shadow-sm p-2">
                  {/* Segmented Switcher */}
                  <div className="flex items-center gap-1 p-1 bg-[#f4eee5] rounded-xl mb-2 text-xs font-semibold">
                    {[
                      { id: 'skills', label: 'Skills' },
                      { id: 'rentals', label: 'Rentals' },
                      { id: 'barter', label: 'Skill ↔ Item Barter' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveSearchTab(tab.id)}
                        className={`flex-1 py-1.5 px-3 rounded-lg transition-all duration-150 cursor-pointer ${
                          activeSearchTab === tab.id
                            ? 'bg-white text-stone-900 font-bold shadow-xs'
                            : 'text-stone-600 hover:text-stone-900'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Input Bar */}
                  <form onSubmit={handleHeroSearch} className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={
                          activeSearchTab === 'skills'
                            ? 'Search skills (Python, Calculus, UI/UX, Data Structures)...'
                            : activeSearchTab === 'rentals'
                            ? 'Search items to rent (3D Printer, DSLR Camera, TI-84)...'
                            : 'Search barter trades (e.g. Web Dev for Camera)...'
                        }
                        className="w-full pl-9 pr-3 py-2 bg-transparent rounded-lg text-xs font-medium text-stone-900 placeholder:text-stone-400 outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-primary shrink-0 py-2 px-4 text-xs font-semibold"
                    >
                      <span>Search</span>
                    </button>
                  </form>
                </div>

                {/* Popular Pills */}
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                  <span className="text-stone-400 text-[11px] font-medium">Popular:</span>
                  {['Python / ML', 'DSLR Camera', 'TI-84 Plus', 'Calculus III', '3D Printer'].map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        navigate(`/skills?search=${encodeURIComponent(term)}`);
                      }}
                      className="px-2.5 py-0.5 rounded-md bg-white border border-[#e7ded3] hover:bg-[#fbf8f3] text-stone-700 text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Signature 3D Interactive Campus Experience */}
            <div className="lg:col-span-5 flex justify-center">
              <CampusInteractiveHero />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Metric Strip ──────────────────────────────────────────────── */}
      <section className="border-b border-[#e7ded3] bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-stone-100">
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#581c2e]">
                100%
              </div>
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Verified .EDU Peers
              </div>
            </div>
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#881337]">
                40/20/15
              </div>
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Weighted Skill Match
              </div>
            </div>
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#166534]">
                $0 Cash
              </div>
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Skill ↔ Item Barter
              </div>
            </div>
            <div className="px-4">
              <div className="text-2xl sm:text-3xl font-bold font-display text-[#b45309]">
                0–100 PTS
              </div>
              <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider mt-0.5">
                Transparent Trust Score
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── The 3 Core Pillars ────────────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
            Campus Sharing Models
          </span>
          <h2 className="text-3xl font-bold text-stone-950 font-display mt-1 tracking-tight">
            One platform. Three ways to collaborate.
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            CampusSwap connects students through verified academic identity, transparent trust scores, and anti-overlap scheduling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: Skill Exchange */}
          <div className="cs-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fff1f2] flex items-center justify-center text-[#881337] mb-4 border border-[#fecdd3]">
                <BookOpen size={20} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-stone-950 font-display">Skill Exchange</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fff1f2] text-[#881337] border border-[#fecdd3]">
                  40/20 Formula
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mt-2">
                Teach what you know, learn what you need. Intelligent matching factors topic relevance, proficiency tier, campus proximity, and schedule availability.
              </p>

              <div className="mt-6 p-3.5 rounded-xl bg-[#faf6f0] border border-[#e7ded3] text-xs space-y-2">
                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>Topic Alignment (40%)</span>
                  <span className="font-bold text-stone-900">Exact Match</span>
                </div>
                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>Proficiency Compatibility (20%)</span>
                  <span className="font-bold text-stone-900">Advanced / Beginner</span>
                </div>
                <div className="flex justify-between text-stone-600 text-[11px]">
                  <span>Availability Overlap (15%)</span>
                  <span className="font-bold text-[#166534]">Conflict-Free</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <Link to="/skills" className="text-xs font-semibold text-[#881337] hover:text-[#581c2e] flex items-center gap-1">
                Explore Skills <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Student Rentals */}
          <div className="cs-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] flex items-center justify-center text-[#166534] mb-4 border border-[#a7f3d0]">
                <ShoppingBag size={20} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-stone-950 font-display">Item Rentals</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ecfdf5] text-[#166534] border border-[#a7f3d0]">
                  Anti-Overlap
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mt-2">
                Rent scientific calculators, DSLRs, lab microscopes, and textbooks at student rates. Database calendar blackout queries prevent double bookings.
              </p>

              <div className="mt-6 p-3.5 rounded-xl bg-[#faf6f0] border border-[#e7ded3] text-xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-stone-800">Security Deposit Protection</span>
                  <span className="text-stone-500">Refunded upon return</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-stone-800">Calendar Blackouts</span>
                  <span className="text-[#166534] font-bold">Zero clashes</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <Link to="/rentals" className="text-xs font-semibold text-[#166534] hover:text-[#14532d] flex items-center gap-1">
                Browse Rental Items <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Pillar 3: Skill-for-Item Barter */}
          <div className="cs-card p-6 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fef3c7] flex items-center justify-center text-[#92400e] mb-4 border border-[#fde68a]">
                <ArrowRightLeft size={20} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-stone-950 font-display">Skill ↔ Item Barter</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                  Signature 0-Cash
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed mt-2">
                Don't have rental cash? Offer to tutor your peers in exchange for borrowing physical items. A formal multi-step state machine verifies trade completion.
              </p>

              <div className="mt-6 p-3.5 rounded-xl bg-[#faf6f0] border border-[#e7ded3] text-xs">
                <div className="font-bold text-stone-900 mb-1">Example Barter Agreement:</div>
                <div className="text-stone-600 text-[11px] space-y-1">
                  <div>• <strong>Offer:</strong> 3 Hours Python Tutoring</div>
                  <div>• <strong>Receive:</strong> 5 Days 3D Printer Access</div>
                  <div className="text-[#166534] font-semibold pt-1">• +3 Trust Score Bonus on completion</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <Link to="/barter" className="text-xs font-semibold text-[#92400e] hover:text-[#78350f] flex items-center gap-1">
                Propose Barter <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Verified Student Reviews & Standing ───────────────────────── */}
      <section className="py-20 border-t border-[#e7ded3] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <span className="text-xs font-bold text-[#881337] uppercase tracking-wider">
              Student Trust & Reputation
            </span>
            <h2 className="text-3xl font-bold text-stone-950 font-display mt-1 tracking-tight">
              Verified campus reputation you can rely on.
            </h2>
            <p className="text-sm text-stone-600 mt-2">
              Every review on CampusSwap is linked to a completed skill session, rental handoff, or verified barter contract.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Elena Rostova',
                role: 'Stanford University • Computer Science',
                score: 98,
                stars: 5,
                text: 'Taught 4 sessions of React web architecture in exchange for borrowing an oscilloscope for my robotics project. Transparent, fast, and smooth.',
                tag: 'Diamond Mentor',
              },
              {
                name: 'Marcus Vance',
                role: 'Stanford University • Mechanical Eng',
                score: 91,
                stars: 5,
                text: 'Listed my 3D printer for student rentals. The anti-overlap calendar prevented double bookings and deposit handling was automatic.',
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
              <div key={idx} className="cs-card p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(t.stars)].map((_, i) => (
                        <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ecfdf5] text-[#166534] border border-[#a7f3d0]">
                      ★ {t.score} PTS
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-stone-900 block">{t.name}</strong>
                    <span className="text-[11px] text-stone-500">{t.role}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-stone-600 bg-[#faf6f0] px-2 py-0.5 rounded border border-[#e7ded3]">
                    {t.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Clean Bottom CTA Banner ──────────────────────────────────── */}
      <section className="py-20 border-t border-[#e7ded3] bg-[#faf6f0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#581c2e] via-[#3b111e] to-[#581c2e] text-white rounded-3xl p-10 sm:p-14 text-center max-w-3xl mx-auto shadow-xl border border-[#70243b]">
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white">
              Start sharing on your campus.
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-3 max-w-md mx-auto leading-relaxed">
              Join verified students learning skills, renting equipment, and building campus reputation.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/register"
                className="w-full sm:w-auto px-6 py-3 bg-white text-stone-950 hover:bg-[#faf6f0] font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Create Free Account (.edu)
              </Link>
              <Link
                to="/skills"
                className="w-full sm:w-auto px-6 py-3 bg-[#3b111e] hover:bg-[#4a1523] text-white font-bold text-xs rounded-xl border border-[#70243b] transition-colors"
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
