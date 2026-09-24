import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Bell, CheckCircle2, BookOpen, Package, ArrowLeftRight,
  Star, Sparkles, Trash2, CheckCheck, Filter,
  ArrowRight, RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let url = '/notifications?limit=50';
      if (unreadOnly) url += '&isRead=false';

      const res = await api.get(url);
      if (res.data.success) {
        setNotifications(res.data.data.notifications || []);
        setUnreadCount(res.data.data.unreadCount || 0);
      }
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [unreadOnly]);

  const handleMarkAsRead = async (id) => {
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (err) {
      toast.error('Error updating notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.patch('/notifications/read-all');
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      }
    } catch (err) {
      toast.error('Error marking all as read');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`/notifications/${id}`);
      if (res.data.success) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
        setUnreadCount(res.data.data.unreadCount || 0);
        toast.success('Notification removed');
      }
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    if (type?.includes('skill')) return <BookOpen size={16} className="text-zinc-900" />;
    if (type?.includes('rental')) return <Package size={16} className="text-zinc-900" />;
    if (type?.includes('barter')) return <ArrowLeftRight size={16} className="text-zinc-900" />;
    if (type?.includes('review')) return <Star size={16} className="text-zinc-900 fill-zinc-900" />;
    return <Sparkles size={16} className="text-zinc-700" />;
  };

  const getTargetUrl = (notif) => {
    if (notif.type?.includes('skill_request')) return '/skills/requests';
    if (notif.type?.includes('skill_session')) return '/skills/sessions';
    if (notif.type?.includes('rental')) return '/rentals/bookings';
    if (notif.type?.includes('barter')) return '/barter/requests';
    if (notif.type?.includes('review')) return '/reviews';
    return '/dashboard';
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'skill') return notif.type?.includes('skill');
    if (activeFilter === 'rental') return notif.type?.includes('rental');
    if (activeFilter === 'barter') return notif.type?.includes('barter');
    if (activeFilter === 'review') return notif.type?.includes('review');
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="badge-minimal mb-2">
            <Bell size={12} className="text-zinc-900" /> Campus Activity Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
            Notifications
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Stay updated with booking requests, schedule confirmations, peer messages, and reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn-secondary text-xs py-2 px-3"
            >
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
          <button
            onClick={fetchNotifications}
            className="p-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl transition-all cursor-pointer"
            title="Refresh notifications"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-zinc-200">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'skill', label: 'Skills' },
            { id: 'rental', label: 'Rentals' },
            { id: 'barter', label: 'Barters' },
            { id: 'review', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeFilter === tab.id
                  ? 'bg-zinc-900 text-white shadow-2xs'
                  : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-medium text-zinc-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-zinc-900 accent-zinc-900 border-zinc-300"
          />
          Unread only ({unreadCount})
        </label>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredNotifications.length > 0 ? (
        <div className="space-y-2.5">
          {filteredNotifications.map((notif) => (
            <div
              key={notif._id}
              onClick={() => {
                if (!notif.isRead) handleMarkAsRead(notif._id);
                navigate(getTargetUrl(notif));
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 group ${
                !notif.isRead
                  ? 'bg-white border-zinc-300 shadow-2xs'
                  : 'bg-zinc-50/50 border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-zinc-100 border border-zinc-200 shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className={`text-xs sm:text-sm ${!notif.isRead ? 'font-bold text-zinc-900' : 'font-semibold text-zinc-700'}`}>
                      {notif.title}
                    </h4>
                    {!notif.isRead && (
                      <span className="badge-minimal text-[9px] bg-zinc-900 text-white">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-zinc-400 mt-1.5 block">
                    {new Date(notif.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 self-center">
                <button
                  onClick={(e) => handleDelete(notif._id, e)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete notification"
                >
                  <Trash2 size={13} />
                </button>
                <div className="p-1.5 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                  <ArrowRight size={13} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-12 text-center">
          <CheckCircle2 size={32} className="mx-auto text-zinc-400 mb-2" />
          <h3 className="font-semibold text-zinc-900 text-sm">No notifications</h3>
          <p className="text-xs text-zinc-500 mt-1">
            You are fully caught up! New requests and activity updates will show up here.
          </p>
        </div>
      )}
    </div>
  );
}
