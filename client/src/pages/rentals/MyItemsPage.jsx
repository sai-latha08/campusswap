import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Plus, Trash2,
  MapPin, Tag, ArrowLeft, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function MyItemsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyItems();
  }, []);

  const fetchMyItems = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items/my-items');
      if (res.data.success) {
        setItems(res.data.data.items);
      }
    } catch (err) {
      toast.error('Failed to load your listed items');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this rental listing?')) return;
    try {
      const res = await api.delete(`/items/${itemId}`);
      if (res.data.success) {
        toast.success('Item removed successfully');
        setItems(items.filter((item) => item._id !== itemId));
      }
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link to="/rentals" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-2 transition-colors">
            <ArrowLeft size={13} /> Back to Marketplace
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">My Listed Items</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage your rental equipment, pricing, availability, and active borrower requests.
          </p>
        </div>

        <Link
          to="/rentals/create"
          className="btn-primary self-start sm:self-auto text-xs py-2 px-3.5"
        >
          <Plus size={14} /> List New Item
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <ShoppingBag size={32} className="text-zinc-400 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-900 text-sm">You haven't listed any items yet</h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
            List calculators, lab coats, tools, or bikes to share with peers.
          </p>
          <Link
            to="/rentals/create"
            className="btn-primary mt-4 inline-flex text-xs py-2 px-3.5"
          >
            List Your First Item
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const primaryImage = item.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';
            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-zinc-100">
                    <img src={primaryImage} alt={item.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 badge-minimal shadow-sm text-[10px]">
                      {item.category}
                    </span>
                    <span className="absolute top-3 right-3 badge-minimal text-[10px]">
                      {item.availabilityStatus}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-zinc-900 text-sm line-clamp-1">{item.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{item.description}</p>
                    <div className="mt-3 text-xs text-zinc-600 flex items-center justify-between">
                      <span className="font-semibold text-zinc-900">₹{item.pricePerDay}/day</span>
                      <span className="text-zinc-500">Deposit: ₹{item.securityDeposit}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-zinc-100 flex items-center justify-between mt-2">
                  <Link
                    to={`/rentals/${item._id}`}
                    className="text-xs text-zinc-900 font-semibold hover:underline flex items-center gap-1"
                  >
                    View Listing <ExternalLink size={12} />
                  </Link>

                  <button
                    onClick={() => handleDeleteItem(item._id)}
                    className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
