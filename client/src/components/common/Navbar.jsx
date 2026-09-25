import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen, Menu, X, ChevronDown,
  ShoppingBag, ArrowRightLeft, User, LayoutDashboard,
  LogOut, Settings, ShieldCheck, MessageSquare, Plus,
  Award, ArrowUpRight
} from 'lucide-react';
import Logo from './Logo';
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
          ? 'bg-[#fdfbf7]/95 backdrop-blur-md border-b border-[#e7ded3] shadow-xs'
          : 'bg-[#faf6f0]/90 backdrop-blur-sm border-b border-[#ede5d8]'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="group inline-flex items-center">
              <Logo />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1.5">
              {navLinks.map(({ label, href, icon: Icon }) => {
                const active = location.pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    to={href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                      active
                        ? 'bg-[#fff1f2] text-[#881337] font-bold border border-[#fecdd3]'
                        : 'text-stone-600 hover:text-stone-900 hover:bg-[#f4eee5]'
                    }`}
                  >
                    <Icon size={14} className={active ? 'text-[#881337]' : 'text-stone-400'} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Create Quick Action Dropdown */}
                <div className="relative" ref={quickCreateRef}>
                  <button
                    onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#581c2e] hover:bg-[#70243b] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer border border-[#451523]"
                  >
                    <Plus size={14} />
                    <span>Share</span>
                    <ChevronDown size={12} className="opacity-70" />
                  </button>

                  <AnimatePresence>
                    {quickCreateOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-[#e7ded3] shadow-xl py-1.5 z-50"
                      >
                        <Link
                          to="/skills/my-skills"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-[#fff1f2] hover:text-[#881337] transition-colors"
                        >
                          <BookOpen size={15} className="text-[#881337]" />
                          <div>
                            <div className="font-semibold text-stone-900">Offer a Skill</div>
                            <div className="text-[11px] text-stone-400">Teach peers on campus</div>
                          </div>
                        </Link>
                        <Link
                          to="/rentals/create"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-[#ecfdf5] hover:text-[#166534] transition-colors"
                        >
                          <ShoppingBag size={15} className="text-[#166534]" />
                          <div>
                            <div className="font-semibold text-stone-900">List Rental Item</div>
                            <div className="text-[11px] text-stone-400">Calculators, cameras, gear</div>
                          </div>
                        </Link>
                        <Link
                          to="/barter"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-stone-700 hover:bg-[#fef3c7] hover:text-[#92400e] transition-colors border-t border-stone-100"
                        >
                          <ArrowRightLeft size={15} className="text-[#b45309]" />
                          <div>
                            <div className="font-semibold text-stone-900">Propose Barter</div>
                            <div className="text-[11px] text-stone-400">Skill ↔ Item 0-cash trade</div>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Direct Messages */}
                <Link
                  to="/messages"
                  className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-[#f4eee5] transition-colors relative"
                  title="Messages"
                >
                  <MessageSquare size={17} />
                </Link>

                {/* Notification Bell */}
                <NotificationBell />

                <div className="h-4 w-px bg-[#e7ded3] mx-0.5" />

                {/* User Dropdown Pill */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-2.5 rounded-xl bg-white hover:bg-[#fbf8f3] border border-[#e7ded3] transition-all cursor-pointer shadow-2xs"
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#581c2e] text-white font-bold flex items-center justify-center text-[10px]">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <span className="text-xs font-semibold text-stone-800 max-w-[100px] truncate">
                      {user.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#ecfdf5] text-[#166534] border border-[#a7f3d0]">
                      ★ {trust}
                    </span>
                    <ChevronDown size={12} className="text-stone-400" />
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.98, y: 4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 4 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-[#e7ded3] shadow-xl py-2 z-50 text-xs"
                      >
                        <div className="px-4 py-2.5 border-b border-stone-100">
                          <p className="font-bold text-stone-900 truncate">{user.name}</p>
                          <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                          <div className="mt-2 flex items-center justify-between text-[11px] bg-[#faf6f0] p-2 rounded-xl border border-[#e7ded3]">
                            <span className="text-stone-500 font-medium">Campus Trust:</span>
                            <span className="font-bold text-[#166534]">{trust} / 100 PTS</span>
                          </div>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-[#fff1f2] hover:text-[#881337] transition-colors font-medium"
                          >
                            <LayoutDashboard size={14} className="text-stone-400" /> Dashboard
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-[#fff1f2] hover:text-[#881337] transition-colors font-medium"
                          >
                            <User size={14} className="text-stone-400" /> Public Student Profile
                          </Link>
                          <Link
                            to="/reviews"
                            className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-[#fff1f2] hover:text-[#881337] transition-colors font-medium"
                          >
                            <ShieldCheck size={14} className="text-stone-400" /> Reputation & Reviews
                          </Link>
                          <Link
                            to="/skills/sessions"
                            className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-[#fff1f2] hover:text-[#881337] transition-colors font-medium"
                          >
                            <BookOpen size={14} className="text-stone-400" /> Skill Sessions
                          </Link>
                          <Link
                            to="/rentals/bookings"
                            className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-[#fff1f2] hover:text-[#881337] transition-colors font-medium"
                          >
                            <ShoppingBag size={14} className="text-stone-400" /> Rental Bookings
                          </Link>
                          <Link
                            to="/profile/edit"
                            className="flex items-center gap-2.5 px-4 py-2 text-stone-700 hover:bg-[#fff1f2] hover:text-[#881337] transition-colors font-medium"
                          >
                            <Settings size={14} className="text-stone-400" /> Settings
                          </Link>
                          {user.role === 'admin' && (
                            <Link
                              to="/admin"
                              className="flex items-center gap-2.5 px-4 py-2 text-rose-800 bg-rose-50/60 hover:bg-rose-50 transition-colors font-semibold border-t border-rose-100"
                            >
                              <Award size={14} /> Admin Moderation
                            </Link>
                          )}
                        </div>

                        <div className="pt-1 border-t border-stone-100">
                          <button
                            onClick={onLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-700 hover:bg-rose-50 transition-colors text-left cursor-pointer font-medium"
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
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-xs py-2 px-4 shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile header controls */}
          <div className="flex items-center gap-2 md:hidden">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-xl text-stone-700 hover:bg-[#f4eee5]"
              aria-label="Toggle Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#fdfbf7] border-b border-[#e7ded3] px-4 py-4 space-y-2 text-xs shadow-lg"
          >
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                to={href}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-stone-700 hover:bg-[#f4eee5] font-semibold"
              >
                <Icon size={16} className="text-[#881337]" />
                <span>{label}</span>
              </Link>
            ))}

            {isAuthenticated && user ? (
              <div className="pt-3 border-t border-stone-200 space-y-1">
                <Link to="/dashboard" className="flex items-center gap-2.5 px-3.5 py-2 text-stone-700 font-medium">
                  <LayoutDashboard size={15} /> Dashboard
                </Link>
                <Link to="/skills/my-skills" className="flex items-center gap-2.5 px-3.5 py-2 text-stone-700 font-medium">
                  <BookOpen size={15} /> Teach a Skill
                </Link>
                <Link to="/rentals/create" className="flex items-center gap-2.5 px-3.5 py-2 text-stone-700 font-medium">
                  <ShoppingBag size={15} /> List an Item
                </Link>
                <Link to="/reviews" className="flex items-center gap-2.5 px-3.5 py-2 text-stone-700 font-medium">
                  <ShieldCheck size={15} /> Trust Score ({trust} PTS)
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-700 font-medium cursor-pointer"
                >
                  <LogOut size={15} /> Log out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-stone-200 flex gap-2">
                <Link to="/login" className="flex-1 py-2.5 text-center font-semibold bg-white border border-[#e7ded3] rounded-xl text-stone-800">
                  Sign in
                </Link>
                <Link to="/register" className="flex-1 py-2.5 text-center font-semibold bg-[#581c2e] text-white rounded-xl">
                  Register Free
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
