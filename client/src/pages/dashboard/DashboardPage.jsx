import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  BookOpen, ShoppingBag, ArrowRightLeft, ShieldCheck,
  Star, PlusCircle, Search, Calendar,
  ArrowRight, Users, Bell, Clock, ChevronRight
} from 'lucide-react';
import { selectCurrentUser } from '../../store/authSlice';
import api from '../../services/api';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const [stats, setStats] = useState({
    skillsTaught: user?.skillsToTeach?.length || 0,
    skillsLearned: user?.skillsToLearn?.length || 0,
    activeRentals: 0,
    upcomingSessions: 0,
    pendingRequests: 0,
  });

  const trust = user?.trustScore || 50;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* ─── Top Banner: Welcome + Trust Score ─────────────────────────── */}
      <div className="bg-zinc-900 text-white rounded-2xl p-6 sm:p-9 border border-zinc-800 shadow-sm mb-10 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 text-xs font-semibold mb-3 border border-zinc-700">
              <ShieldCheck size={13} className="text-white" /> Verified Student Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
              Welcome back, {user?.name || 'Student'}
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 max-w-xl">
              {user?.college ? `${user.college}` : 'CampusSwap Portal'} • {user?.branch || 'Resource Sharing Member'}
            </p>
          </div>

          {/* Trust Score Pill */}
          <div className="bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 text-center shrink-0 w-full md:w-auto min-w-[150px]">
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider block">
              Campus Trust Score
            </span>
            <div className="text-3xl font-bold text-white mt-0.5">
              {trust}<span className="text-sm font-normal text-zinc-400">/100</span>
            </div>
            <div className="text-[11px] text-zinc-300 font-medium mt-1 flex items-center justify-center gap-1">
              <Star size={11} className="fill-zinc-300 text-zinc-300" />
              {trust >= 75 ? 'Highly Trusted' : 'Good Standing'}
            </div>
          </div>
        </div>

        {/* Quick Badges Row */}
        <div className="mt-6 pt-5 border-t border-zinc-800 flex flex-wrap gap-2 text-xs">
          <span className="badge-minimal bg-zinc-800 border-zinc-700 text-zinc-300">
            ✓ College Verified
          </span>
          <span className="badge-minimal bg-zinc-800 border-zinc-700 text-zinc-300">
            ✓ Email Verified
          </span>
          <span className="badge-minimal bg-zinc-800 border-zinc-700 text-zinc-300">
            ✓ Active Campus Peer
          </span>
        </div>
      </div>

      {/* ─── Quick Actions Row ─────────────────────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/skills"
            className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-zinc-200">
              <BookOpen size={16} />
            </div>
            <span className="font-semibold text-zinc-900 text-xs">Find a Skill</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Explore mentors</span>
          </Link>

          <Link
            to="/skills/my-skills"
            className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-zinc-200">
              <PlusCircle size={16} />
            </div>
            <span className="font-semibold text-zinc-900 text-xs">Teach a Skill</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Add to profile</span>
          </Link>

          <Link
            to="/rentals"
            className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-zinc-200">
              <ShoppingBag size={16} />
            </div>
            <span className="font-semibold text-zinc-900 text-xs">Rent an Item</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Gear & tools</span>
          </Link>

          <Link
            to="/rentals/create"
            className="p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-zinc-200">
              <PlusCircle size={16} />
            </div>
            <span className="font-semibold text-zinc-900 text-xs">List an Item</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Earn or barter</span>
          </Link>

          <Link
            to="/barter"
            className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-white border border-zinc-200 hover:border-zinc-400 transition-all group flex flex-col items-center text-center shadow-2xs"
          >
            <div className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform border border-zinc-200">
              <ArrowRightLeft size={16} />
            </div>
            <span className="font-semibold text-zinc-900 text-xs">Skill Barter</span>
            <span className="text-[10px] text-zinc-400 mt-0.5">Trade 0-cash</span>
          </Link>
        </div>
      </div>

      {/* ─── Main Overview Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity & Highlights (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Skill Exchange Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-zinc-900" />
                <h3 className="font-semibold text-zinc-900 text-sm">Skill Exchange Hub</h3>
              </div>
              <Link to="/skills/requests" className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1">
                View Requests <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Skills You Teach</span>
                <div className="text-2xl font-bold text-zinc-900 mt-0.5">
                  {user?.skillsToTeach?.length || 0}
                </div>
                <Link to="/skills/my-skills" className="text-xs text-zinc-900 underline underline-offset-2 font-medium mt-1.5 inline-block">
                  + Add more skills
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Skills You Want</span>
                <div className="text-2xl font-bold text-zinc-900 mt-0.5">
                  {user?.skillsToLearn?.length || 0}
                </div>
                <Link to="/skills" className="text-xs text-zinc-900 underline underline-offset-2 font-medium mt-1.5 inline-block">
                  Browse mentors
                </Link>
              </div>
            </div>
          </div>

          {/* Student Rentals & Barter Card */}
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-zinc-900" />
                <h3 className="font-semibold text-zinc-900 text-sm">Rentals & Barter</h3>
              </div>
              <Link to="/rentals/my-items" className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1">
                My Listed Items <ChevronRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Completed Rentals</span>
                <div className="text-2xl font-bold text-zinc-900 mt-0.5">
                  {user?.stats?.completedRentals || 0}
                </div>
                <Link to="/rentals" className="text-xs text-zinc-900 underline underline-offset-2 font-medium mt-1.5 inline-block">
                  Browse campus items
                </Link>
              </div>

              <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200">
                <span className="text-xs text-zinc-500">Barter Transactions</span>
                <div className="text-2xl font-bold text-zinc-900 mt-0.5">
                  {user?.stats?.completedBarters || 0}
                </div>
                <Link to="/barter" className="text-xs text-zinc-900 underline underline-offset-2 font-medium mt-1.5 inline-block">
                  Skill-for-item exchange
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Profile Snapshot */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
            <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-4">Profile Summary</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-sm flex items-center justify-center">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-zinc-900 text-sm">{user?.name}</h4>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
            </div>

            <div className="text-xs text-zinc-600 space-y-2 py-3 border-y border-zinc-100">
              <div className="flex justify-between">
                <span className="text-zinc-400">College:</span>
                <span className="font-medium text-zinc-800">{user?.college || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Branch:</span>
                <span className="font-medium text-zinc-800">{user?.branch || 'Not set'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Academic Year:</span>
                <span className="font-medium text-zinc-800">Year {user?.year || 1}</span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Link
                to="/profile"
                className="btn-secondary text-xs py-2 w-full text-center"
              >
                View Full Profile
              </Link>
              <Link
                to="/profile/edit"
                className="btn-primary text-xs py-2 w-full text-center"
              >
                Edit Profile & Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
