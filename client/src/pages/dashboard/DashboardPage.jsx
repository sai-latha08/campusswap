import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BookOpen, ShoppingBag, ArrowRightLeft, ShieldCheck,
  Star, PlusCircle, Search, Calendar,
  ArrowRight, Users, Bell, Clock, ChevronRight,
  Sparkles, Award, User, Settings
} from 'lucide-react';
import { selectCurrentUser } from '../../store/authSlice';
import api from '../../services/api';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const trust = user?.trustScore || 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* ─── Top Banner: Welcome + Trust Score ─────────────────────────── */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-9 border border-indigo-900/50 shadow-md mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-3 border border-white/15 backdrop-blur-xs">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span>Verified Student Identity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Welcome back, {user?.name || 'Student'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-xl">
              {user?.college ? `${user.college}` : 'CampusSwap Student Portal'} • {user?.branch || 'Campus Peer'} {user?.year ? `(Year ${user.year})` : ''}
            </p>
          </div>

          {/* Trust Score Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-center shrink-0 w-full md:w-auto min-w-[170px] shadow-lg">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Campus Trust Score
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
              {trust}<span className="text-sm font-normal text-slate-300">/100</span>
            </div>
            <div className="text-[11px] text-emerald-300 font-semibold mt-1 flex items-center justify-center gap-1 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
              <Star size={12} className="fill-emerald-400 text-emerald-400" />
              {trust >= 75 ? 'Highly Trusted Peer' : 'Good Standing'}
            </div>
          </div>
        </div>

        {/* Quick Badges Row */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium">
            ✓ College Verified
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium">
            ✓ 0-Cash Barter Eligible
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-medium">
            ✓ Anti-Overlap Protected
          </span>
        </div>
      </div>

      {/* ─── Quick Actions Row ─────────────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            to="/skills"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-indigo-100">
              <BookOpen size={18} />
            </div>
            <span className="font-bold text-slate-900 text-xs">Find a Skill</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Explore mentors</span>
          </Link>

          <Link
            to="/skills/my-skills"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-indigo-100">
              <PlusCircle size={18} />
            </div>
            <span className="font-bold text-slate-900 text-xs">Teach a Skill</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Add to profile</span>
          </Link>

          <Link
            to="/rentals"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-emerald-100">
              <ShoppingBag size={18} />
            </div>
            <span className="font-bold text-slate-900 text-xs">Rent an Item</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Gear & tools</span>
          </Link>

          <Link
            to="/rentals/create"
            className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-emerald-100">
              <PlusCircle size={18} />
            </div>
            <span className="font-bold text-slate-900 text-xs">List an Item</span>
            <span className="text-[10px] text-slate-400 mt-0.5">Rent or barter</span>
          </Link>

          <Link
            to="/barter"
            className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-amber-100">
              <ArrowRightLeft size={18} />
            </div>
            <span className="font-bold text-slate-900 text-xs">Skill Barter</span>
            <span className="text-[10px] text-slate-400 mt-0.5">0-Cash exchange</span>
          </Link>
        </div>
      </div>

      {/* ─── Main Overview Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity & Highlights (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Exchange Card */}
          <div className="cs-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen size={17} className="text-indigo-600" />
                <h3 className="font-bold text-slate-900 text-sm">Skill Exchange Hub</h3>
              </div>
              <Link to="/skills/requests" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                View Requests <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <span className="text-xs text-slate-500 font-medium">Skills You Teach</span>
                <div className="text-2xl font-black text-indigo-950 mt-0.5">
                  {user?.skillsToTeach?.length || 0}
                </div>
                <Link to="/skills/my-skills" className="text-xs text-indigo-600 font-semibold hover:underline mt-2 inline-block">
                  + Add more skills
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs text-slate-500 font-medium">Skills You Want to Learn</span>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {user?.skillsToLearn?.length || 0}
                </div>
                <Link to="/skills" className="text-xs text-slate-700 font-semibold hover:underline mt-2 inline-block">
                  Browse mentors
                </Link>
              </div>
            </div>
          </div>

          {/* Student Rentals & Barter Card */}
          <div className="cs-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={17} className="text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Rentals & Barter Overview</h3>
              </div>
              <Link to="/rentals/my-items" className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1">
                My Listed Items <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <span className="text-xs text-slate-500 font-medium">Completed Rentals</span>
                <div className="text-2xl font-black text-emerald-950 mt-0.5">
                  {user?.stats?.completedRentals || 0}
                </div>
                <Link to="/rentals" className="text-xs text-emerald-700 font-semibold hover:underline mt-2 inline-block">
                  Explore campus gear
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                <span className="text-xs text-slate-500 font-medium">Barter Trades</span>
                <div className="text-2xl font-black text-amber-950 mt-0.5">
                  {user?.stats?.completedBarters || 0}
                </div>
                <Link to="/barter" className="text-xs text-amber-700 font-semibold hover:underline mt-2 inline-block">
                  Propose 0-cash barter
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Profile Snapshot */}
        <div className="space-y-6">
          <div className="cs-card p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Student Profile</h3>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-950 text-white font-bold text-base flex items-center justify-center shadow-xs">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{user?.name}</h4>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 py-3.5 border-y border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">College:</span>
                <span className="font-semibold text-slate-800">{user?.college || 'Stanford University'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Branch:</span>
                <span className="font-semibold text-slate-800">{user?.branch || 'General Engineering'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Academic Year:</span>
                <span className="font-semibold text-slate-800">Year {user?.year || 1}</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-2.5">
              <Link
                to="/profile"
                className="btn-secondary text-xs py-2.5 w-full text-center"
              >
                View Public Profile
              </Link>
              <Link
                to="/profile/edit"
                className="btn-primary text-xs py-2.5 w-full text-center"
              >
                Edit Profile & Skills
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
