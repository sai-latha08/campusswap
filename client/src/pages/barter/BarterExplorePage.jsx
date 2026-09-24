import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft, Sparkles, BookOpen, ShoppingBag,
  ShieldCheck, ArrowRight, Zap, Users
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ─── Barter Spotlight Hero ────────────────────────────────────── */}
      <div className="bg-zinc-900 text-white rounded-2xl p-8 sm:p-12 border border-zinc-800 shadow-sm mb-12 relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold mb-4 border border-zinc-700">
            <Sparkles size={13} className="text-white" /> Zero-Cash Skill ↔ Equipment Trade
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight leading-tight text-white">
            Skill ↔ Item Barter
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base mt-3 leading-relaxed">
            Zero cash required. Offer to teach your peers a skill (like Python, React, UI/UX, or Calculus)
            in exchange for temporary access to physical equipment like calculators, Arduino kits, cameras, or bikes.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/barter/requests"
              className="btn-secondary text-xs py-2.5 px-4 font-semibold text-zinc-950"
            >
              <ArrowRightLeft size={14} /> View My Barter Proposals
            </Link>
            <Link
              to="/rentals"
              className="btn-primary text-xs py-2.5 px-4 bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
            >
              <ShoppingBag size={14} /> Browse Items to Barter For
            </Link>
          </div>
        </div>

        {/* Real Example Visual Banner */}
        <div className="mt-10 pt-8 border-t border-zinc-800 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/60">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold mb-1">
              <BookOpen size={14} /> You Offer
            </div>
            <p className="text-white font-semibold">3 React.js 1-on-1 Sessions</p>
            <span className="text-[11px] text-zinc-400">Teach hooks & state management</span>
          </div>

          <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/40 flex flex-col justify-center items-center text-center">
            <ArrowRightLeft size={20} className="text-zinc-300 mb-1" />
            <span className="text-zinc-400 font-semibold uppercase tracking-wider text-[10px]">Zero Cash Traded</span>
          </div>

          <div className="p-4 bg-zinc-800/60 rounded-xl border border-zinc-700/60">
            <div className="flex items-center gap-2 text-zinc-300 font-semibold mb-1">
              <ShoppingBag size={14} /> You Receive
            </div>
            <p className="text-white font-semibold">Arduino Starter Kit</p>
            <span className="text-[11px] text-zinc-400">For 7 days semester project use</span>
          </div>
        </div>
      </div>

      {/* ─── How Barter Works ─────────────────────────────────────────── */}
      <div className="mb-14">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
            How Skill Barter Works in 3 Steps
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Fair peer-to-peer exchange with automatic trust verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold text-xs mb-4 border border-zinc-200">
              1
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm mb-1">Find Any Rental Item</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Click on any item in the marketplace and select <strong>"Offer Skill Instead"</strong>.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold text-xs mb-4 border border-zinc-200">
              2
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm mb-1">Propose Your Skill & Duration</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Choose a skill from your profile (e.g. Python, Design), set teaching sessions, and requested days.
            </p>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center font-bold text-xs mb-4 border border-zinc-200">
              3
            </div>
            <h3 className="font-semibold text-zinc-900 text-sm mb-1">Owner Accepts & Trade Starts</h3>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Exchange equipment and teach your peer. When finished, both students earn +3 Trust Score points!
            </p>
          </div>
        </div>
      </div>

      {/* ─── Featured Rental Items Ready for Barter ───────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-zinc-900 font-display">
              Campus Items Eligible for Skill Barter
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              Click any item to rent with cash OR propose a skill barter exchange.
            </p>
          </div>

          <Link to="/rentals" className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1">
            View All Marketplace <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-zinc-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => {
              const primaryImage = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-40 w-full bg-zinc-100 overflow-hidden">
                      <img src={primaryImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200" />
                      <span className="absolute top-3 left-3 badge-minimal text-[10px] shadow-sm">
                        {item.category}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1">{item.title}</h3>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-zinc-500">Rent: <strong className="text-zinc-800">₹{item.pricePerDay}/day</strong></span>
                        <span className="badge-minimal text-[10px]">Barter Ready</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <Link
                      to={`/rentals/${item._id}`}
                      className="btn-secondary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                    >
                      <ArrowRightLeft size={12} />
                      Offer Skill Instead
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
