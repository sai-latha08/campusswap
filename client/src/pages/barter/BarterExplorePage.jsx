import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft, Sparkles, BookOpen, ShoppingBag,
  ShieldCheck, ArrowRight, Zap, Users, Star, Award
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/authSlice';

export default function BarterExplorePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items', { params: { limit: 8 } });
      if (res.data.success) {
        setItems(res.data.data.items);
      }
    } catch (err) {
      toast.error('Failed to load barter items');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* ─── Barter Spotlight Hero ────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 border border-indigo-900/50 shadow-md mb-12 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-4 border border-amber-400/30">
            <Sparkles size={13} className="text-amber-300" /> Zero-Cash Skill ↔ Equipment Trade
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight leading-tight text-white">
            Skill ↔ Item Barter
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-3 leading-relaxed">
            Zero cash required. Offer to teach your peers a skill (like Python, React, UI/UX, or Calculus)
            in exchange for temporary access to physical equipment like calculators, Arduino kits, cameras, or lab tools.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/barter/requests"
              className="btn-primary text-xs py-2.5 px-4 font-bold bg-white text-slate-950 hover:bg-slate-100"
            >
              <ArrowRightLeft size={14} /> View My Barter Proposals
            </Link>
            <Link
              to="/rentals"
              className="btn-secondary text-xs py-2.5 px-4 bg-indigo-900/60 border-indigo-700 text-white hover:bg-indigo-800"
            >
              <ShoppingBag size={14} /> Browse Items to Barter For
            </Link>
          </div>
        </div>

        {/* ─── Signature Visual Representation of Barter Trade ─────────── */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
            <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1.5">
              <BookOpen size={16} /> I Teach
            </div>
            <p className="text-white font-black text-sm">React.js Web Dev</p>
            <span className="text-[11px] text-slate-300 font-medium">3 1-on-1 Mentorship Sessions</span>
          </div>

          <div className="p-4 bg-white/5 backdrop-blur-xs rounded-2xl border border-white/10 flex flex-col justify-center items-center text-center">
            <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold mb-1 shadow-sm">
              <ArrowRightLeft size={16} />
            </div>
            <span className="text-amber-300 font-black uppercase tracking-wider text-[10px]">
              0-Cash Fair Trade
            </span>
          </div>

          <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/15">
            <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1.5">
              <ShoppingBag size={16} /> I Receive
            </div>
            <p className="text-white font-black text-sm">Arduino Starter Kit</p>
            <span className="text-[11px] text-slate-300 font-medium">7 Days Project Lab Use</span>
          </div>
        </div>
      </div>

      {/* ─── How Barter Works ─────────────────────────────────────────── */}
      <div className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
            Safe Student Protocol
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-display mt-1">
            How Skill Barter Works in 3 Steps
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Fair peer-to-peer exchange with automatic +3 trust score bonus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="cs-card p-6">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs mb-4 border border-indigo-100">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Find Any Rental Item</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click on any item in the campus marketplace and select <strong>"Offer Skill Instead"</strong>.
            </p>
          </div>

          <div className="cs-card p-6">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs mb-4 border border-amber-200">
              2
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Propose Skill & Duration</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Choose a skill from your profile (e.g. Python, Design), set teaching hours, and requested equipment access days.
            </p>
          </div>

          <div className="cs-card p-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs mb-4 border border-emerald-100">
              3
            </div>
            <h3 className="font-bold text-slate-900 text-sm mb-1.5">Acceptance & +3 Trust Bonus</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upon successful completion of the sessions and gear return, both student trust scores receive a +3 PTS boost!
            </p>
          </div>
        </div>
      </div>

      {/* ─── Featured Rental Items Ready for Barter ───────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 font-display">
              Campus Items Eligible for Skill Barter
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Click any item to rent with cash OR propose a skill barter exchange.
            </p>
          </div>

          <Link to="/rentals" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            View All Marketplace <ArrowRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => {
              const primaryImage = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={item._id}
                  className="cs-card overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                      <img src={primaryImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-200" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-800 backdrop-blur-xs shadow-xs">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{item.title}</h3>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Rent: <strong className="text-slate-800">${item.pricePerDay}/day</strong></span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Barter Ready
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      to={`/rentals/${item._id}`}
                      className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                    >
                      <ArrowRightLeft size={13} className="text-amber-600" />
                      <span>Offer Skill Instead</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
