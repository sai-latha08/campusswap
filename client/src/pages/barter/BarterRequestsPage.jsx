import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightLeft, BookOpen, ShoppingBag, CheckCircle2,
  Calendar, ShieldCheck, Sparkles, Check
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function BarterRequestsPage() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'sent' ? 'sent' : 'received';
  const [activeTab, setActiveTab] = useState(initialTab); // 'received' | 'sent'
  const [receivedBarters, setReceivedBarters] = useState([]);
  const [sentBarters, setSentBarters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBarters();
  }, []);

  const fetchBarters = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes] = await Promise.all([
        api.get('/barter/received'),
        api.get('/barter/sent'),
      ]);
      if (recRes.data.success) setReceivedBarters(recRes.data.data.barters);
      if (sentRes.data.success) setSentBarters(sentRes.data.data.barters);
    } catch (err) {
      toast.error('Failed to load barter proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (barterId, status) => {
    try {
      const res = await api.patch(`/barter/${barterId}/status`, { status });
      if (res.data.success) {
        toast.success(`Barter status updated: ${status}!`);
        const updated = res.data.data.barter;
        setReceivedBarters(receivedBarters.map((b) => (b._id === barterId ? updated : b)));
        setSentBarters(sentBarters.map((b) => (b._id === barterId ? updated : b)));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update barter');
    }
  };

  const bartersToDisplay = activeTab === 'received' ? receivedBarters : sentBarters;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="badge-minimal mb-2">
            <Sparkles size={12} className="text-zinc-900" /> Zero-Cash Skill ↔ Item Exchange
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">Barter Exchange Proposals</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Manage incoming proposals from students offering to teach you skills in return for equipment, and track your outgoing trades.
          </p>
        </div>

        <Link
          to="/barter"
          className="btn-primary self-start sm:self-auto text-xs py-2 px-3.5"
        >
          <ArrowRightLeft size={13} /> Explore Barter Hub
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('received')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'received'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <ShoppingBag size={14} />
          Received on My Items ({receivedBarters.length})
        </button>

        <button
          onClick={() => setActiveTab('sent')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'sent'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <BookOpen size={14} />
          My Sent Barter Offers ({sentBarters.length})
        </button>
      </div>

      {/* Barter Proposals List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-40 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : bartersToDisplay.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <ArrowRightLeft size={32} className="text-zinc-400 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-900 text-sm">
            No {activeTab === 'received' ? 'received barter proposals' : 'sent barter proposals'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
            {activeTab === 'received'
              ? 'When peers offer to teach you a skill for your listed items, their proposals will appear here.'
              : 'Find an item in the marketplace and click "Offer Skill Instead" to propose a 0-cash barter!'}
          </p>
          <Link
            to="/rentals"
            className="btn-primary mt-4 inline-flex text-xs py-2 px-3.5"
          >
            Browse Marketplace Items
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bartersToDisplay.map((barter) => {
            const isReceiver = activeTab === 'received';
            const partner = isReceiver ? barter.proposer : barter.receiver;

            return (
              <div
                key={barter._id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 shadow-sm hover:border-zinc-300 transition-all flex flex-col justify-between"
              >
                {/* Header: Partner & Status */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-zinc-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-900 font-bold text-sm flex items-center justify-center">
                      {partner?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-zinc-900 text-sm">
                        {isReceiver ? `Offered by ${partner?.name}` : `Sent to ${partner?.name} (Owner)`}
                      </h4>
                      <p className="text-xs text-zinc-500">{partner?.college} {partner?.branch ? `• ${partner.branch}` : ''}</p>
                    </div>
                  </div>

                  <span className="badge-minimal text-[10px]">
                    {barter.status}
                  </span>
                </div>

                {/* Dual Barter Comparison Showcase */}
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center bg-zinc-50 p-4 rounded-xl border border-zinc-200/70">
                  {/* Skill Offered */}
                  <div className="md:col-span-3 bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      <BookOpen size={12} /> Skill Offered
                    </div>
                    <h4 className="font-semibold text-zinc-900 text-sm">{barter.offeredSkill?.name}</h4>
                    <span className="text-xs text-zinc-500 block mt-0.5">
                      {barter.numberOfSessions} Teaching Session(s)
                    </span>
                  </div>

                  {/* Icon Divider */}
                  <div className="md:col-span-1 flex justify-center py-1 md:py-0">
                    <div className="w-8 h-8 rounded-full bg-zinc-200 text-zinc-800 flex items-center justify-center">
                      <ArrowRightLeft size={14} />
                    </div>
                  </div>

                  {/* Item Requested */}
                  <div className="md:col-span-3 bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-1">
                      <ShoppingBag size={12} /> In Exchange For Item
                    </div>
                    <h4 className="font-semibold text-zinc-900 text-sm">{barter.requestedItem?.title}</h4>
                    <span className="text-xs text-zinc-500 block mt-0.5">
                      {barter.duration} Days Equipment Usage
                    </span>
                  </div>
                </div>

                {/* Message */}
                {barter.message && (
                  <p className="text-xs text-zinc-600 mt-3.5 bg-zinc-50 p-2.5 rounded-xl border border-zinc-100 italic">
                    "{barter.message}"
                  </p>
                )}

                {/* Actions Bar */}
                <div className="mt-5 pt-4 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-zinc-500 flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-zinc-700" />
                    <span>Completion awards <strong className="text-zinc-900">+3 Trust Score</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    {isReceiver && barter.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(barter._id, 'accepted')}
                          className="btn-primary text-xs py-1.5 px-3"
                        >
                          <CheckCircle2 size={13} /> Accept Barter
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(barter._id, 'rejected')}
                          className="btn-secondary text-xs py-1.5 px-3 text-red-600 hover:bg-red-50"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {barter.status === 'accepted' && (
                      <button
                        onClick={() => handleUpdateStatus(barter._id, 'active')}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        <Check size={13} /> Confirm Handover & Start Lessons
                      </button>
                    )}

                    {barter.status === 'active' && (
                      <button
                        onClick={() => handleUpdateStatus(barter._id, 'completed')}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        <CheckCircle2 size={13} /> Mark Completed
                      </button>
                    )}

                    <Link
                      to={`/rentals/${barter.requestedItem?._id}`}
                      className="btn-secondary text-xs py-1.5 px-3 text-center"
                    >
                      View Item
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
