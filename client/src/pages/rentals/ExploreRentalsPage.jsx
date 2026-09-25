import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingBag, Plus, Filter,
  ShieldCheck, MapPin, Tag, Star, ArrowRight,
  Sparkles, ArrowRightLeft, Check, RefreshCw,
  Camera, Laptop, BookOpen, Cpu, Wrench, Package,
  DollarSign, Clock, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../../store/authSlice';

const CATEGORIES = [
  { name: 'All', icon: Package },
  { name: 'Electronics', icon: Laptop },
  { name: 'Lab Equipment', icon: Cpu },
  { name: 'Camera', icon: Camera },
  { name: 'Books', icon: BookOpen },
  { name: 'Project Equipment', icon: Wrench },
  { name: 'Calculator', icon: DollarSign },
  { name: 'Other', icon: Tag },
];

export default function ExploreRentalsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [conditionFilter, setConditionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('latest');

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, [selectedCategory, conditionFilter, sortBy]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items', {
        params: {
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          condition: conditionFilter === 'All' ? undefined : conditionFilter,
          search: searchTerm || undefined,
          sort: sortBy === 'price_asc' ? 'price_asc' : sortBy === 'price_desc' ? 'price_desc' : undefined,
        },
      });
      if (res.data.success) {
        setItems(res.data.data.items || []);
      }
    } catch (err) {
      toast.error('Failed to load rental items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchItems();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* ─── Header ──────────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecfdf5] text-[#166534] text-xs font-semibold border border-[#a7f3d0] mb-2">
              <Sparkles size={13} /> Anti-Overlap Booking Protection
            </div>
            <h1 className="text-3xl font-black text-stone-950 font-display tracking-tight">
              Student Item Rentals
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              Rent verified lab equipment, cameras, graphing calculators, and textbooks with calendar conflict prevention.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/rentals/create"
              className="btn-forest text-xs"
            >
              <Plus size={15} /> List Item for Rent
            </Link>
            <Link
              to="/rentals/bookings"
              className="btn-secondary text-xs"
            >
              My Bookings
            </Link>
          </div>
        </div>

        {/* Category Slider */}
        <div className="mt-6 flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const active = selectedCategory === name;
            return (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer ${
                  active
                    ? 'bg-[#581c2e] text-white shadow-xs'
                    : 'bg-white text-stone-600 hover:bg-[#faf6f0] border border-[#e7ded3] hover:text-stone-900'
                }`}
              >
                <Icon size={14} className={active ? 'text-amber-300' : 'text-stone-400'} />
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Filters */}
        <div className="mt-4 bg-white rounded-2xl border border-[#e7ded3] p-3 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search items, models, gear..."
              className="w-full pl-9 pr-3 py-2 bg-[#faf6f0] focus:bg-white rounded-xl border border-[#e7ded3] focus:border-[#881337] text-xs font-medium outline-none transition-all"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#e7ded3] text-xs font-semibold text-stone-700 bg-white outline-none cursor-pointer"
            >
              <option value="All">All Conditions</option>
              <option value="Brand New">Brand New</option>
              <option value="Like New">Like New</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#e7ded3] text-xs font-semibold text-stone-700 bg-white outline-none cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* ─── Inventory Grid ────────────────────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-80 bg-stone-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="cs-card overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Floating Badges */}
                <div className="relative h-48 bg-stone-100 overflow-hidden">
                  <img
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent" />

                  {/* Price Tag */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-[#581c2e]/90 text-white backdrop-blur-xs shadow-xs border border-[#70243b]">
                    ${item.pricePerDay}<span className="text-[10px] font-normal text-rose-200">/day</span>
                  </div>

                  {/* Condition Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 backdrop-blur-xs shadow-xs">
                    {item.condition}
                  </div>

                  {/* Deposit Tag at Bottom */}
                  {item.securityDeposit > 0 && (
                    <div className="absolute bottom-2.5 left-3 text-[11px] font-bold text-emerald-300">
                      Deposit: ${item.securityDeposit}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#881337] mb-1 uppercase tracking-wider">
                    <Tag size={11} /> {item.category}
                  </div>

                  <h3 className="font-bold text-stone-900 text-sm line-clamp-1 group-hover:text-[#881337] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Owner Chip */}
                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-[#581c2e] text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        {item.owner?.name?.charAt(0) || 'S'}
                      </div>
                      <span className="text-xs font-semibold text-stone-700 truncate">
                        {item.owner?.name || 'Student'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-amber-600 shrink-0">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{item.owner?.trustScore || 50} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-[#faf6f0] border-t border-[#e7ded3] flex items-center gap-2">
                <Link
                  to={`/rentals/${item._id}`}
                  className="btn-primary flex-1 text-xs py-2"
                >
                  Rent Item
                </Link>
                <Link
                  to={`/barter?targetItem=${item._id}`}
                  className="px-2.5 py-2 rounded-xl bg-[#fef3c7] hover:bg-[#fde68a] text-[#92400e] text-xs font-bold flex items-center gap-1 transition-colors border border-[#fde68a]"
                  title="Propose Skill Barter Trade"
                >
                  <ArrowRightLeft size={14} />
                  <span>Barter</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-[#e7ded3] p-16 text-center max-w-md mx-auto">
          <ShoppingBag size={40} className="mx-auto text-stone-300 mb-3" />
          <h3 className="font-bold text-stone-800 text-base">No items available</h3>
          <p className="text-xs text-stone-400 mt-1">Be the first on campus to list an item for rent!</p>
          <Link
            to="/rentals/create"
            className="btn-forest mt-4 text-xs"
          >
            + Create First Listing
          </Link>
        </div>
      )}
    </div>
  );
}
