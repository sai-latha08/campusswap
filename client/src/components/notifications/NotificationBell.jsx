import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, CheckCircle2, BookOpen, Package, ArrowLeftRight,
  Star, ShieldAlert, Sparkles, Trash2, ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const bellRef = useRef(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      if (res.data.success) {
        setUnreadCount(res.data.data.unreadCount || 0);
      }
    } catch (err) {
      // Silently fail if not logged in
    }
  };

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications?limit=6');
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
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      const res = await api.patch(`/notifications/${id}/read`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount(res.data.data.unreadCount);
      }
    } catch (err) {
      // silently ignore
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await api.patch('/notifications/read-all');
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success('All marked as read');
      }
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const getIcon = (type) => {
    if (type?.includes('skill')) return <BookOpen size={14} className="text-indigo-600" />;
    if (type?.includes('rental')) return <Package size={14} className="text-emerald-600" />;
    if (type?.includes('barter')) return <ArrowLeftRight size={14} className="text-purple-600" />;
    if (type?.includes('review')) return <Star size={14} className="text-amber-500 fill-amber-500" />;
    return <Sparkles size={14} className="text-slate-600" />;
  };

  const getTargetUrl = (notif) => {
    if (notif.type?.includes('skill_request')) return '/skills/requests';
    if (notif.type?.includes('skill_session')) return '/skills/sessions';
    if (notif.type?.includes('rental')) return '/rentals/bookings';
    if (notif.type?.includes('barter')) return '/barter/requests';
    if (notif.type?.includes('review')) return '/reviews';
    return '/notifications';
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) {
      handleMarkAsRead(notif._id);
    }
    setIsOpen(false);
    navigate(getTargetUrl(notif));
  };

  return (
    <div className="relative" ref={bellRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
        aria-label="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 text-center text-xs text-slate-400">Loading alerts...</div>
              ) : notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div
                    key={notif._id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex items-start gap-3 relative ${
                      !notif.isRead ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-100 shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className={`text-xs ${!notif.isRead ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'} truncate`}>
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">
                        {notif.message}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="w-2 h-2 rounded-full bg-indigo-600 shrink-0 self-center"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 px-4 text-center">
                  <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-2" />
                  <p className="text-xs font-bold text-slate-700">All caught up!</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">No new campus notifications.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center justify-center gap-1"
              >
                View Full Notification Center <ExternalLink size={12} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
