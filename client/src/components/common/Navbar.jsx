import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Menu, X, ChevronDown,
  ShoppingBag, ArrowRightLeft, User, LayoutDashboard,
  LogOut, Settings, ShieldCheck, MessageSquare, Plus,
  Sparkles, Award, ArrowUpRight
} from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';

const navLinks = [
  { label: 'Skills', href: '/skills', icon: BookOpen },
  { label: 'Rentals', href: '/rentals', icon: ShoppingBag },
  { label: 'Barter', href: '/barter', icon: ArrowRightLeft },
];

export default function Navbar({ isAuthenticated, user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const dropdownRef = useRef(null);
  const quickCreateRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (quickCreateRef.current && !quickCreateRef.current.contains(event.target)) {
        setQuickCreateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserDropdownOpen(false);
    setQuickCreateOpen(false);
  }, [location.pathname]);

  const trust = user?.trustScore || 50;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]'
          : 'bg-white/90 backdrop-blur-sm border-b border-zinc-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Wordmark (Apple/Linear Style) */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 bg-zinc-900 text-white rounded-lg flex items-center justify-center font-black text-xs shadow-xs group-hover:bg-zinc-800 transition-colors">
                CS
              </div>
              <span className="font-extrabold text-base sm:text-lg text-zinc-900 tracking-tight font-display">
                CampusSwap
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const active = location.pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-2.5">
            {isAuthenticated && user ? (
              <>
                {/* Post New Listing / Skill Dropdown */}
                <div className="relative" ref={quickCreateRef}>
                  <button
                    onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Create</span>
                    <ChevronDown size={11} className="opacity-70" />
                  </button>

                  <AnimatePresence>
                    {quickCreateOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-1.5 w-52 bg-white rounded-xl border border-zinc-200 shadow-lg py-1.5 z-50"
                      >
                        <Link
                          to="/skills/my-skills"
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                        >
                          <BookOpen size={14} className="text-zinc-400" />
                          <span>Offer Skill to Teach</span>
                        </Link>
                        <Link
                          to="/rentals/create"
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                        >
                          <ShoppingBag size={14} className="text-zinc-400" />
                          <span>List Rental Item</span>
                        </Link>
                        <Link
                          to="/barter"
                          className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
                        >
                          <ArrowRightLeft size={14} className="text-zinc-400" />
                          <span>Propose Skill Barter</span>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Direct Messages Icon */}
                <Link
                  to="/messages"
                  className="p-2 rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                  title="Messages"
                >
                  <MessageSquare size={16} />
                </Link>

                {/* Notification Bell */}
                <NotificationBell />

                <div className="h-4 w-px bg-zinc-200 mx-1"></div>

                {/* User Dropdown Pill */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-lg hover:bg-zinc-100 transition-all cursor-pointer border border-transparent hover:border-zinc-200"
                  >
                    <div className="w-6 h-6 rounded-md bg-zinc-900 text-white font-bold flex items-center justify-center text-[10px]">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-md" />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="text-xs font-semibold text-zinc-800 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {trust}
                    </span>
                    <ChevronDown size={12} className="text-zinc-400" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-1.5 w-56 bg-white rounded-xl border border-zinc-200 shadow-xl py-1.5 z-50 text-xs"
                      >
                        <div className="px-3.5 py-2 border-b border-zinc-100">
                          <p className="font-bold text-zinc-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{user.email}</p>
                          <div className="mt-1 flex items-center justify-between text-[10px] text-zinc-500 font-medium">
                            <span>Trust Score:</span>
                            <span className="font-bold text-zinc-900">{trust} / 100</span>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors font-medium"
                          >
                            <LayoutDashboard size={14} className="text-zinc-400" /> Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors font-medium"
                          >
                            <User size={14} className="text-zinc-400" /> Public Profile
                          </Link>
                          <Link
                            to="/reviews"
                            className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors font-medium"
                          >
                            <ShieldCheck size={14} className="text-zinc-400" /> Reputation & Reviews
                          </Link>
                          <Link
                            to="/skills/sessions"
                            className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors font-medium"
                          >
                            <BookOpen size={14} className="text-zinc-400" /> Skill Sessions
                          </Link>
                          <Link
                            to="/rentals/bookings"
                            className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors font-medium"
                          >
                            <ShoppingBag size={14} className="text-zinc-400" /> Rental Bookings
                          </Link>
                          <Link
                            to="/profile/edit"
                            className="flex items-center gap-2 px-3.5 py-1.5 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors font-medium"
                          >
                            <Settings size={14} className="text-zinc-400" /> Profile Settings
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-3.5 py-1.5 text-rose-700 bg-rose-50/50 hover:bg-rose-50 transition-colors font-semibold"
                            >
                              <Award size={14} /> Admin Moderation
                            </Link>
                          )}
                        </div>

                        <div className="pt-1 border-t border-zinc-100">
                          <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-2 px-3.5 py-1.5 text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer font-medium"
                          >
                            <LogOut size={14} /> Log out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg text-zinc-700 hover:bg-zinc-100"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-zinc-200 px-4 py-3 space-y-2 text-xs"
          >
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-zinc-700 hover:bg-zinc-100 font-semibold"
              >
                <Icon size={16} className="text-zinc-500" />
                {label}
              </Link>
            ))}

            {isAuthenticated && user ? (
              <div className="pt-2 border-t border-zinc-100 space-y-1">
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-1.5 text-zinc-700 font-medium">
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link to="/messages" className="flex items-center gap-2 px-3 py-1.5 text-zinc-700 font-medium">
                  <MessageSquare size={14} /> Messages
                </Link>
                <Link to="/reviews" className="flex items-center gap-2 px-3 py-1.5 text-zinc-700 font-medium">
                  <ShieldCheck size={14} /> Trust Score ({trust})
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-red-600 font-medium"
                >
                  <LogOut size={14} /> Log out
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-zinc-100 flex gap-2">
                <Link to="/login" className="flex-1 py-2 text-center font-semibold bg-zinc-100 rounded-lg text-zinc-800">
                  Sign in
                </Link>
                <Link to="/register" className="flex-1 py-2 text-center font-semibold bg-zinc-900 text-white rounded-lg">
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
