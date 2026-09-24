import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Users, Package, BookOpen, ArrowRightLeft,
  CheckCircle2, ShieldCheck, RefreshCw, ArrowRight, Activity
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to load admin analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-zinc-200 rounded-lg w-1/4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-zinc-200 rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const overview = stats?.overview || {};

  const kpis = [
    {
      title: 'Total Students',
      value: overview.totalUsers || 0,
      icon: Users,
      link: '/admin/users',
      linkText: 'Manage Students',
    },
    {
      title: 'Rental Listings',
      value: overview.totalItems || 0,
      icon: Package,
      link: '/admin/items',
      linkText: 'Moderate Items',
    },
    {
      title: 'Skill Catalog',
      value: overview.totalSkills || 0,
      icon: BookOpen,
      link: '/skills',
      linkText: 'Explore Skills',
    },
    {
      title: 'Pending Reports',
      value: overview.pendingReports || 0,
      icon: ShieldAlert,
      link: '/admin/reports',
      linkText: 'Review Claims',
      alert: overview.pendingReports > 0,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="badge-minimal mb-2">
            <ShieldCheck size={12} className="text-zinc-900" /> Executive Console
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">
            Admin Moderation & Governance
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Real-time platform metrics, user verification standing, listing moderation, and dispute resolution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/reports"
            className="btn-primary text-xs py-2 px-3.5"
          >
            <ShieldAlert size={13} /> Safety Reports ({overview.pendingReports || 0})
          </Link>
          <button
            onClick={fetchStats}
            className="p-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Refresh metrics"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* ─── KPI Metric Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-2xs flex flex-col justify-between hover:border-zinc-300 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className="p-2 rounded-xl bg-zinc-100 text-zinc-800 border border-zinc-200">
                    <Icon size={14} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-zinc-900 font-display">
                  {kpi.value}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <Link
                  to={kpi.link}
                  className="text-xs font-semibold text-zinc-900 hover:underline flex items-center gap-1"
                >
                  {kpi.linkText} <ArrowRight size={11} />
                </Link>
                {kpi.alert && (
                  <span className="badge-minimal text-[9px] bg-zinc-900 text-white">
                    Action Needed
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Platform Activity Counters ─────────────────────────────────── */}
      <div className="bg-zinc-900 rounded-2xl p-6 sm:p-7 text-white mb-8 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-sm font-bold font-display mb-4 flex items-center gap-2 text-zinc-200">
            <Activity size={16} className="text-white" /> Platform Transaction Health
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-3.5">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Completed Rentals</span>
              <div className="text-xl font-bold mt-0.5 text-white">{overview.completedRentals || 0}</div>
              <span className="text-[10px] text-zinc-500">of {overview.totalRentals || 0} total</span>
            </div>

            <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-3.5">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Completed Skills</span>
              <div className="text-xl font-bold mt-0.5 text-white">{overview.completedSkillSessions || 0}</div>
              <span className="text-[10px] text-zinc-500">of {overview.totalSkillSessions || 0} scheduled</span>
            </div>

            <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-3.5">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Completed Barters</span>
              <div className="text-xl font-bold mt-0.5 text-white">{overview.completedBarters || 0}</div>
              <span className="text-[10px] text-zinc-500">of {overview.totalBarters || 0} proposals</span>
            </div>

            <div className="bg-zinc-800/60 border border-zinc-700/60 rounded-xl p-3.5">
              <span className="text-[10px] text-zinc-400 uppercase font-semibold">Disputes Resolved</span>
              <div className="text-xl font-bold mt-0.5 text-white">
                {(overview.totalReports || 0) - (overview.pendingReports || 0)}
              </div>
              <span className="text-[10px] text-zinc-400">Moderation Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Recent Registrations & Open Incident Reports ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Students */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
            <h3 className="font-semibold text-zinc-900 text-sm flex items-center gap-2">
              <Users size={16} /> Recent Students
            </h3>
            <Link to="/admin/users" className="text-xs font-semibold text-zinc-900 hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {stats?.recentUsers?.length > 0 ? (
              stats.recentUsers.map((u) => (
                <div key={u._id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-zinc-900 truncate">{u.name}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{u.email} • {u.college}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="badge-minimal text-[10px]">
                      {u.trustScore || 50} pts
                    </span>
                    {u.isSuspended ? (
                      <span className="badge-minimal text-[10px] text-red-600">
                        Suspended
                      </span>
                    ) : (
                      <span className="badge-minimal text-[10px]">
                        Active
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-zinc-400 py-4 text-center">No students registered yet.</p>
            )}
          </div>
        </div>

        {/* Open Reports */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100">
            <h3 className="font-semibold text-zinc-900 text-sm flex items-center gap-2">
              <ShieldAlert size={16} /> Open Safety Reports
            </h3>
            <Link to="/admin/reports" className="text-xs font-semibold text-zinc-900 hover:underline">
              Resolution Center
            </Link>
          </div>

          <div className="divide-y divide-zinc-100">
            {stats?.recentReports?.length > 0 ? (
              stats.recentReports.map((r) => (
                <div key={r._id} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="badge-minimal text-[9px]">
                        {r.reason}
                      </span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1 truncate">
                      Reported by: <strong className="text-zinc-800">{r.reporter?.name}</strong>
                    </p>
                  </div>
                  <Link
                    to="/admin/reports"
                    className="btn-secondary text-[11px] py-1 px-2.5 shrink-0"
                  >
                    Investigate
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-8 text-center">
                <CheckCircle2 size={28} className="mx-auto text-zinc-400 mb-2" />
                <p className="text-xs font-semibold text-zinc-900">No open incident reports</p>
                <p className="text-[11px] text-zinc-400">All student reports are resolved.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
