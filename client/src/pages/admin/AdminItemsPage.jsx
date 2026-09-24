import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package, Search, Eye, EyeOff, Filter, ArrowLeft,
  RefreshCw, DollarSign, MapPin, Tag
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminItemsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let url = `/admin/items?page=${page}&limit=12`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter !== 'All') url += `&category=${categoryFilter}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setItems(res.data.data.items || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load item inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [page, categoryFilter, statusFilter]);

  const handleToggleActive = async (itemId) => {
    try {
      const res = await api.patch(`/admin/items/${itemId}/toggle`);
      if (res.data.success) {
        toast.success(res.data.message);
        setItems((prev) =>
          prev.map((it) => (it._id === itemId ? res.data.data.item : it))
        );
      }
    } catch (err) {
      toast.error('Failed to update listing visibility');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/admin"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Admin Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2.5">
            <Package size={24} className="text-zinc-900" /> Item Inventory & Listing Moderation
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Total Listings Indexed: <strong className="text-zinc-800">{total}</strong>
          </p>
        </div>

        <button
          onClick={fetchItems}
          className="p-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchItems()}
            placeholder="Search items by title or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 bg-white outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Calculator">Calculator</option>
            <option value="Electronics">Electronics</option>
            <option value="Books">Books</option>
            <option value="Lab Equipment">Lab Equipment</option>
            <option value="Sports">Sports</option>
            <option value="Other">Other</option>
          </select>

          <div className="flex items-center gap-1">
            {['all', 'active', 'inactive'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-zinc-900 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <div
              key={item._id}
              className={`bg-white rounded-2xl border p-4 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between ${
                item.isActive ? 'border-zinc-200' : 'border-red-200 bg-red-50/20'
              }`}
            >
              <div>
                <div className="relative h-40 rounded-xl overflow-hidden bg-zinc-100 mb-3">
                  <img
                    src={item.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 badge-minimal text-[10px] shadow-sm">
                    ₹{item.pricePerDay}/day
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    {item.isActive ? (
                      <span className="badge-minimal text-[10px]">
                        Active
                      </span>
                    ) : (
                      <span className="badge-minimal text-[10px] text-red-600">
                        Hidden
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium mb-1">
                  <Tag size={11} /> {item.category} • Condition: {item.condition}
                </div>

                <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-2.5 pt-2.5 border-t border-zinc-100 text-xs text-zinc-500 flex items-center justify-between">
                  <span>Owner: <strong className="text-zinc-800">{item.owner?.name || 'Student'}</strong></span>
                  <span className="flex items-center gap-1"><MapPin size={11} /> {item.location}</span>
                </div>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-2">
                <Link
                  to={`/rentals/${item._id}`}
                  className="btn-secondary text-xs py-1 px-2.5"
                >
                  View Listing
                </Link>

                <button
                  onClick={() => handleToggleActive(item._id)}
                  className={`btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 ${
                    item.isActive
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`}
                >
                  {item.isActive ? (
                    <>
                      <EyeOff size={13} /> Hide
                    </>
                  ) : (
                    <>
                      <Eye size={13} /> Make Active
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <Package size={32} className="mx-auto text-zinc-300 mb-2" />
          <h3 className="font-semibold text-zinc-900 text-sm">No items found</h3>
          <p className="text-xs text-zinc-400 mt-1">Try changing category or search filters.</p>
        </div>
      )}
    </div>
  );
}
