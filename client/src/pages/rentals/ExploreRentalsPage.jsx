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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ─── Hero / Header ────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 mb-2">
              <Sparkles size={13} /> Verified Campus Sharing Marketplace
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
              Student Item Rentals
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Rent verified lab equipment, cameras, graphing calculators, and textbooks with anti-overlap booking protection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/rentals/create"
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all hover:scale-102 cursor-pointer"
            >
              <Plus size={16} /> List Item for Rent
            </Link>
            <Link
              to="/rentals/bookings"
              className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              My Bookings
            </Link>
          </div>
        </div>

        {/* Category Pill Slider */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(({ name, icon: Icon }) => {
            const active = selectedCategory === name;
            return (
              <button
                key={name}
                onClick={() => setSelectedCategory(name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 hover:text-slate-900'
                }`}
              >
                <Icon size={14} className={active ? 'text-emerald-400' : 'text-slate-400'} />
                <span>{name}</span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Filter Bar */}
        <div className="mt-4 bg-white rounded-3xl border border-slate-200 p-3 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-96">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keyword, brand, or model..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 focus:bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-xs font-medium outline-none transition-all"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
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
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white outline-none cursor-pointer"
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
            <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Floating Badges */}
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                  {/* Price Tag */}
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-black bg-slate-900/85 text-white backdrop-blur-md shadow-md">
                    ${item.pricePerDay}<span className="text-[10px] font-normal text-slate-300">/day</span>
                  </div>

                  {/* Condition Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/90 text-slate-800 backdrop-blur-md shadow-sm">
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
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 mb-1 uppercase tracking-wider">
                    <Tag size={11} /> {item.category}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-emerald-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Owner Chip */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                        {item.owner?.name?.charAt(0) || 'S'}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 truncate">
                        {item.owner?.name || 'Student'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-black text-amber-500 shrink-0">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      <span>{item.owner?.trustScore || 50} pts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <Link
                  to={`/rentals/${item._id}`}
                  className="flex-1 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold text-center transition-colors shadow-sm"
                >
                  Rent Item
                </Link>
                <Link
                  to={`/barter?targetItem=${item._id}`}
                  className="px-2.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Propose Skill Barter Trade"
                >
                  <ArrowRightLeft size={14} />
                  <span>Barter</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-16 text-center max-w-md mx-auto">
          <ShoppingBag size={40} className="mx-auto text-slate-300 mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No items available</h3>
          <p className="text-xs text-slate-400 mt-1">Be the first on campus to list an item for rent!</p>
          <Link
            to="/rentals/create"
            className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-100"
          >
            + Create First Listing
          </Link>
        </div>
      )}
    </div>
  );
}
