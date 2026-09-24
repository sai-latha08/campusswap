import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, ShieldCheck, ShieldAlert, CheckCircle2,
  XCircle, Filter, ArrowLeft, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  // Suspension modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let url = `/admin/users?page=${page}&limit=15`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (statusFilter !== 'all') url += `&status=${statusFilter}`;

      const res = await api.get(url);
      if (res.data.success) {
        setUsers(res.data.data.users || []);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      toast.error('Failed to load students directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleToggleStatus = async (user, isSuspending) => {
    setActionLoading(true);
    try {
      const res = await api.patch(`/admin/users/${user._id}/status`, {
        isSuspended: isSuspending,
        suspensionReason: isSuspending ? suspensionReason : '',
      });

      if (res.data.success) {
        toast.success(`Student ${isSuspending ? 'suspended' : 'reinstated'}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === user._id ? res.data.data.user : u))
        );
        setSelectedUser(null);
        setSuspensionReason('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Link
            to="/admin"
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft size={13} /> Back to Admin Console
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display flex items-center gap-2.5">
            <Users size={24} className="text-zinc-900" /> Student Directory & Verification
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Total Students Registered: <strong className="text-zinc-800">{total}</strong>
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-600 rounded-xl transition-all shadow-2xs self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw size={14} />
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-4 mb-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or campus..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 focus:bg-white focus:border-zinc-900 outline-none"
          />
        </form>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-medium text-zinc-400 mr-1 flex items-center gap-1">
            <Filter size={11} /> Status:
          </span>
          {['all', 'active', 'suspended'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-600">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold uppercase text-zinc-500 tracking-wider">
              <tr>
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-5">College / Branch</th>
                <th className="py-3 px-5">Trust Score</th>
                <th className="py-3 px-5">Account Status</th>
                <th className="py-3 px-5">Joined Date</th>
                <th className="py-3 px-5 text-right">Moderator Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-zinc-400">Loading student directory...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold flex items-center justify-center text-xs shrink-0">
                          {u.profileImage ? (
                            <img src={u.profileImage} alt={u.name} className="w-full h-full object-cover rounded-xl" />
                          ) : (
                            u.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 text-xs sm:text-sm flex items-center gap-1.5">
                            {u.name}
                            {u.role === 'admin' && (
                              <span className="badge-minimal text-[9px]">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="font-medium text-zinc-800">{u.college}</div>
                      <div className="text-[10px] text-zinc-400">{u.branch || 'Undergraduate'} • Year {u.year || 1}</div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="badge-minimal text-[10px]">
                        <ShieldCheck size={11} /> {u.trustScore || 50} pts
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      {u.isSuspended ? (
                        <span className="badge-minimal text-[10px] text-red-600">
                          <XCircle size={11} /> Suspended
                        </span>
                      ) : (
                        <span className="badge-minimal text-[10px]">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-zinc-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {u.role !== 'admin' && (
                        u.isSuspended ? (
                          <button
                            onClick={() => handleToggleStatus(u, false)}
                            className="btn-secondary text-[11px] py-1 px-2.5"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="btn-secondary text-[11px] py-1 px-2.5 text-red-600 hover:bg-red-50"
                          >
                            Suspend
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-zinc-400">No students match the criteria.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Suspension Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center gap-2.5 text-zinc-900">
              <AlertTriangle size={20} className="text-red-600" />
              <h3 className="text-base font-bold text-zinc-900 font-display">
                Suspend {selectedUser.name}
              </h3>
            </div>

            <p className="text-xs text-zinc-500 leading-relaxed">
              Suspending this student will immediately revoke active login tokens and apply a 20-point Trust Score penalty.
            </p>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 tracking-tight mb-1">
                Reason for Suspension
              </label>
              <textarea
                value={suspensionReason}
                onChange={(e) => setSuspensionReason(e.target.value)}
                placeholder="Specify community guidelines violation..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-900 outline-none focus:bg-white focus:border-zinc-900"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleStatus(selectedUser, true)}
                disabled={actionLoading}
                className="btn-primary text-xs py-1.5 px-3 bg-red-600 border-red-600 hover:bg-red-700"
              >
                {actionLoading ? 'Suspending...' : 'Confirm Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
