import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  User, Building, GraduationCap, MapPin, Phone,
  FileText, Plus, Trash2, Save, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import { setUser, selectCurrentUser } from '../../store/authSlice';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function EditProfilePage() {
  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    college: '',
    branch: '',
    year: '1',
    bio: '',
    location: '',
    phone: '',
  });

  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        college: currentUser.college || '',
        branch: currentUser.branch || '',
        year: currentUser.year ? String(currentUser.year) : '1',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        phone: currentUser.phone || '',
      });
      if (currentUser.availability && Array.isArray(currentUser.availability)) {
        setAvailability(currentUser.availability);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSlot = () => {
    setAvailability([
      ...availability,
      { day: 'Monday', startTime: '16:00', endTime: '18:00' },
    ]);
  };

  const handleRemoveSlot = (index) => {
    setAvailability(availability.filter((_, idx) => idx !== index));
  };

  const handleSlotChange = (index, field, value) => {
    const updated = [...availability];
    updated[index][field] = value;
    setAvailability(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.put('/auth/profile', {
        ...formData,
        year: parseInt(formData.year, 10),
        availability,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.data.user));
        toast.success('Profile updated successfully!');
        navigate('/profile');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-6 transition-colors"
      >
        <ArrowLeft size={13} /> Back
      </button>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 font-display mb-1">Edit Student Profile</h1>
        <p className="text-xs sm:text-sm text-zinc-500 mb-8">Update your campus information, bio, and weekly availability.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Full Name
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                College / University
              </label>
              <div className="relative">
                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Branch / Major
              </label>
              <div className="relative">
                <GraduationCap size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Academic Year
              </label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
                <option value="5">5th Year / Masters</option>
                <option value="6">PhD</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Campus Location
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. North Hostel, Block 4"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Phone Number (Private)
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
              Bio / Introduction
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell other students about yourself, your interests, and what you enjoy teaching or learning..."
              className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs sm:text-sm text-zinc-900 outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          {/* Availability Schedule */}
          <div className="pt-4 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider">Weekly Availability Schedule</h3>
                <p className="text-xs text-zinc-500">Add time slots when you are available for skill sessions or item handovers.</p>
              </div>
              <button
                type="button"
                onClick={handleAddSlot}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                <Plus size={13} /> Add Slot
              </button>
            </div>

            <div className="space-y-2.5">
              {availability.map((slot, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 p-2.5 bg-zinc-50 rounded-xl border border-zinc-200">
                  <select
                    value={slot.day}
                    onChange={(e) => handleSlotChange(idx, 'day', e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs font-medium text-zinc-900 outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>

                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <span>From</span>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleSlotChange(idx, 'startTime', e.target.value)}
                      className="px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 outline-none"
                    />
                    <span>To</span>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleSlotChange(idx, 'endTime', e.target.value)}
                      className="px-2 py-1 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    className="ml-auto p-1.5 text-zinc-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {availability.length === 0 && (
                <p className="text-xs text-zinc-400 italic">No availability slots added yet.</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="btn-secondary text-xs py-2 px-4"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary text-xs py-2 px-4"
            >
              <Save size={14} />
              {loading ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
