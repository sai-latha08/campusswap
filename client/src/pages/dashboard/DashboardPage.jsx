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
      <div className="bg-gradient-to-r from-[#581c2e] via-[#3b111e] to-[#581c2e] text-white rounded-3xl p-6 sm:p-9 border border-[#70243b] shadow-md mb-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-200 text-xs font-semibold mb-3 border border-white/15 backdrop-blur-xs">
              <ShieldCheck size={14} className="text-[#4ade80]" />
              <span>Verified Student Identity</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Welcome back, {user?.name || 'Student'}
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-xl">
              {user?.college ? `${user.college}` : 'CampusSwap Student Portal'} • {user?.branch || 'Campus Peer'} {user?.year ? `(Year ${user.year})` : ''}
            </p>
          </div>

          {/* Trust Score Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 text-center shrink-0 w-full md:w-auto min-w-[170px] shadow-lg">
            <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider block">
              Campus Trust Score
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-0.5">
              {trust}<span className="text-sm font-normal text-stone-300">/100</span>
            </div>
            <div className="text-[11px] text-[#86efac] font-semibold mt-1 flex items-center justify-center gap-1 bg-[#1a402d]/70 px-2.5 py-0.5 rounded-full border border-[#22c55e]/30">
              <Star size={12} className="fill-[#4ade80] text-[#4ade80]" />
              {trust >= 75 ? 'Highly Trusted Peer' : 'Good Standing'}
            </div>
          </div>
        </div>

        {/* Quick Badges Row */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px] font-medium">
            ✓ College Verified
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px] font-medium">
            ✓ 0-Cash Barter Eligible
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-stone-300 text-[11px] font-medium">
            ✓ Anti-Overlap Protected
          </span>
        </div>
      </div>

      {/* ─── Quick Actions Row ─────────────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            to="/skills"
            className="p-4 rounded-2xl bg-white border border-[#e7ded3] hover:border-[#881337] hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fff1f2] text-[#881337] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-[#fecdd3]">
              <BookOpen size={18} />
            </div>
            <span className="font-bold text-stone-900 text-xs">Find a Skill</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Explore mentors</span>
          </Link>

          <Link
            to="/skills/my-skills"
            className="p-4 rounded-2xl bg-white border border-[#e7ded3] hover:border-[#881337] hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fff1f2] text-[#881337] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-[#fecdd3]">
              <PlusCircle size={18} />
            </div>
            <span className="font-bold text-stone-900 text-xs">Teach a Skill</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Add to profile</span>
          </Link>

          <Link
            to="/rentals"
            className="p-4 rounded-2xl bg-white border border-[#e7ded3] hover:border-[#166534] hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#166534] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-[#a7f3d0]">
              <ShoppingBag size={18} />
            </div>
            <span className="font-bold text-stone-900 text-xs">Rent an Item</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Gear & tools</span>
          </Link>

          <Link
            to="/rentals/create"
            className="p-4 rounded-2xl bg-white border border-[#e7ded3] hover:border-[#166534] hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-[#ecfdf5] text-[#166534] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-[#a7f3d0]">
              <PlusCircle size={18} />
            </div>
            <span className="font-bold text-stone-900 text-xs">List an Item</span>
            <span className="text-[10px] text-stone-400 mt-0.5">Rent or barter</span>
          </Link>

          <Link
            to="/barter"
            className="col-span-2 sm:col-span-1 p-4 rounded-2xl bg-white border border-[#e7ded3] hover:border-[#b45309] hover:shadow-md transition-all group flex flex-col items-center text-center"
          >
            <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#92400e] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-[#fde68a]">
              <ArrowRightLeft size={18} />
            </div>
            <span className="font-bold text-stone-900 text-xs">Skill Barter</span>
            <span className="text-[10px] text-stone-400 mt-0.5">0-Cash exchange</span>
          </Link>
        </div>
      </div>

      {/* ─── Main Overview Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity & Highlights (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Exchange Card */}
          <div className="cs-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <BookOpen size={17} className="text-[#881337]" />
                <h3 className="font-bold text-stone-900 text-sm">Skill Exchange Hub</h3>
              </div>
              <Link to="/skills/requests" className="text-xs font-semibold text-[#881337] hover:underline flex items-center gap-1">
                View Requests <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[#fff1f2] border border-[#fecdd3]">
                <span className="text-xs text-stone-500 font-medium">Skills You Teach</span>
                <div className="text-2xl font-black text-[#581c2e] mt-0.5">
                  {user?.skillsToTeach?.length || 0}
                </div>
                <Link to="/skills/my-skills" className="text-xs text-[#881337] font-semibold hover:underline mt-2 inline-block">
                  + Add more skills
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-[#faf6f0] border border-[#e7ded3]">
                <span className="text-xs text-stone-500 font-medium">Skills You Want to Learn</span>
                <div className="text-2xl font-black text-stone-900 mt-0.5">
                  {user?.skillsToLearn?.length || 0}
                </div>
                <Link to="/skills" className="text-xs text-stone-700 font-semibold hover:underline mt-2 inline-block">
                  Browse mentors
                </Link>
              </div>
            </div>
          </div>

          {/* Student Rentals & Barter Card */}
          <div className="cs-card p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={17} className="text-[#166534]" />
                <h3 className="font-bold text-stone-900 text-sm">Rentals & Barter Overview</h3>
              </div>
              <Link to="/rentals/my-items" className="text-xs font-semibold text-[#166534] hover:underline flex items-center gap-1">
                My Listed Items <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-4 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0]">
                <span className="text-xs text-stone-500 font-medium">Completed Rentals</span>
                <div className="text-2xl font-black text-[#166534] mt-0.5">
                  {user?.stats?.completedRentals || 0}
                </div>
                <Link to="/rentals" className="text-xs text-[#166534] font-semibold hover:underline mt-2 inline-block">
                  Explore campus gear
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-[#fef3c7] border border-[#fde68a]">
                <span className="text-xs text-stone-500 font-medium">Barter Trades</span>
                <div className="text-2xl font-black text-[#92400e] mt-0.5">
                  {user?.stats?.completedBarters || 0}
                </div>
                <Link to="/barter" className="text-xs text-[#92400e] font-semibold hover:underline mt-2 inline-block">
                  Propose 0-cash barter
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Profile Snapshot */}
        <div className="space-y-6">
          <div className="cs-card p-6">
            <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Student Profile</h3>
            <div className="flex items-center gap-3.5 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#581c2e] text-white font-bold text-base flex items-center justify-center shadow-xs">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">{user?.name}</h4>
                <p className="text-xs text-stone-500">{user?.email}</p>
              </div>
            </div>

            <div className="text-xs text-stone-600 space-y-2.5 py-3.5 border-y border-stone-100">
              <div className="flex justify-between">
                <span className="text-stone-400">College:</span>
                <span className="font-semibold text-stone-800">{user?.college || 'Stanford University'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Branch:</span>
                <span className="font-semibold text-stone-800">{user?.branch || 'General Engineering'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Academic Year:</span>
                <span className="font-semibold text-stone-800">Year {user?.year || 1}</span>
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
