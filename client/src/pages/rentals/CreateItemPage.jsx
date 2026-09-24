import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Tag, DollarSign, MapPin,
  Image, Plus, ArrowLeft, Check, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const CATEGORIES = [
  'Calculator',
  'Project Equipment',
  'Lab Equipment',
  'Electronics',
  'Bicycle',
  'Camera',
  'Headphones',
  'Books',
  'Sports',
  'Furniture',
  'Other',
];

const PRESET_IMAGES = [
  { label: 'Calculator', url: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=800&q=80' },
  { label: 'Arduino / IoT', url: 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80' },
  { label: 'Lab Equipment', url: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80' },
  { label: 'Bicycle', url: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Headphones', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80' },
  { label: 'Camera', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80' },
  { label: 'Book / Notes', url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80' },
];

export default function CreateItemPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Calculator',
    pricePerDay: '',
    pricePerWeek: '',
    securityDeposit: '',
    condition: 'Like New',
    location: '',
    imageUrl: '',
    tags: '',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectPreset = (url) => {
    setFormData({ ...formData, imageUrl: url });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.pricePerDay || !formData.location) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/items', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        pricePerDay: parseFloat(formData.pricePerDay),
        pricePerWeek: formData.pricePerWeek ? parseFloat(formData.pricePerWeek) : undefined,
        securityDeposit: formData.securityDeposit ? parseFloat(formData.securityDeposit) : 0,
        condition: formData.condition,
        location: formData.location,
        images: formData.imageUrl ? [formData.imageUrl] : undefined,
        tags: formData.tags,
      });

      if (res.data.success) {
        toast.success('Item listed successfully!');
        navigate('/rentals/my-items');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to list item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link to="/rentals" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-6 transition-colors">
        <ArrowLeft size={13} /> Back to Marketplace
      </Link>

      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 shadow-sm">
        <div className="mb-6 pb-6 border-b border-zinc-100">
          <span className="badge-minimal mb-3">
            List Equipment
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-display mt-1">
            List an Item for Campus Rental
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Help other students access study tools, electronics, or lab gear while earning extra campus cash or skill exchanges.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Item Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. TI-84 Plus Graphing Calculator, Arduino Uno Kit..."
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Pricing: Daily, Weekly, Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Price Per Day (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="pricePerDay"
                required
                min="0"
                value={formData.pricePerDay}
                onChange={handleChange}
                placeholder="e.g. 50"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Price Per Week (₹)
              </label>
              <input
                type="number"
                name="pricePerWeek"
                min="0"
                value={formData.pricePerWeek}
                onChange={handleChange}
                placeholder="e.g. 200"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Security Deposit (₹)
              </label>
              <input
                type="number"
                name="securityDeposit"
                min="0"
                value={formData.securityDeposit}
                onChange={handleChange}
                placeholder="e.g. 300 (refundable)"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Condition & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Item Condition
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              >
                <option value="New">New (Unused)</option>
                <option value="Like New">Like New (Perfect condition)</option>
                <option value="Good">Good (Minor cosmetic wear)</option>
                <option value="Fair">Fair (Fully functional)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Campus Pickup Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Central Library, Hostel 4, ECE Dept"
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
              Item Description & Usage Guidelines <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detail what is included (cables, manuals, accessories), recommended courses, and return expectations..."
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
            />
          </div>

          {/* Image Presets / Custom URL */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
              Item Image URL (or select sample photo)
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 mb-2.5"
            />

            <span className="text-xs text-zinc-400 block mb-2 font-medium">Quick presets:</span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_IMAGES.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleSelectPreset(preset.url)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    formData.imageUrl === preset.url
                      ? 'bg-zinc-900 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
              Search Tags (Comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g. calculator, exam, engineering, physics"
              className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-2 px-4"
            >
              <Plus size={14} />
              {loading ? 'Listing Item...' : 'Publish Rental Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
