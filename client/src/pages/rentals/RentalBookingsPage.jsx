import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Calendar, CheckCircle2,
  Clock, Tag, Phone, Check, AlertCircle, Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

export default function RentalBookingsPage() {
  const [activeTab, setActiveTab] = useState('my-bookings'); // 'my-bookings' | 'owner-bookings'
  const [myBookings, setMyBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [myRes, ownerRes] = await Promise.all([
        api.get('/rentals/my-bookings'),
        api.get('/rentals/owner-bookings'),
      ]);
      if (myRes.data.success) setMyBookings(myRes.data.data.bookings);
      if (ownerRes.data.success) setOwnerBookings(ownerRes.data.data.bookings);
    } catch (err) {
      toast.error('Failed to load rental bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId, status) => {
    try {
      const res = await api.patch(`/rentals/${bookingId}/status`, { status });
      if (res.data.success) {
        toast.success(`Rental updated: ${status}!`);
        const updated = res.data.data.booking;
        setMyBookings(myBookings.map((b) => (b._id === bookingId ? updated : b)));
        setOwnerBookings(ownerBookings.map((b) => (b._id === bookingId ? updated : b)));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update booking status';
      toast.error(msg);
    }
  };

  const bookingsToDisplay = activeTab === 'my-bookings' ? myBookings : ownerBookings;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 font-display">Campus Rental Bookings</h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Track your rental reservations, borrower requests, handovers, and return completion.
          </p>
        </div>

        <Link
          to="/rentals"
          className="btn-primary self-start sm:self-auto text-xs py-2 px-3.5"
        >
          <ShoppingBag size={14} /> Browse Marketplace
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('my-bookings')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'my-bookings'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <ShoppingBag size={14} />
          Rentals I've Booked ({myBookings.length})
        </button>

        <button
          onClick={() => setActiveTab('owner-bookings')}
          className={`pb-3 font-semibold text-xs tracking-tight transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeTab === 'owner-bookings'
              ? 'border-zinc-900 text-zinc-900'
              : 'border-transparent text-zinc-400 hover:text-zinc-700'
          }`}
        >
          <Tag size={14} />
          Requests on My Items ({ownerBookings.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-zinc-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : bookingsToDisplay.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-zinc-200">
          <ShoppingBag size={32} className="text-zinc-400 mx-auto mb-3" />
          <h3 className="font-semibold text-zinc-900 text-sm">
            No {activeTab === 'my-bookings' ? 'rentals booked yet' : 'borrower requests on your items'}
          </h3>
          <p className="text-zinc-500 text-xs mt-1 max-w-sm mx-auto">
            {activeTab === 'my-bookings'
              ? 'Browse campus calculators, electronics, or lab equipment to place a rental request.'
              : 'List more items for rent to start receiving requests from peers.'}
          </p>
          <Link
            to={activeTab === 'my-bookings' ? '/rentals' : '/rentals/create'}
            className="btn-primary mt-4 inline-flex text-xs py-2 px-3.5"
          >
            {activeTab === 'my-bookings' ? 'Explore Rentals' : 'List an Item'}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookingsToDisplay.map((booking) => {
            const isOwner = activeTab === 'owner-bookings';
            const partner = isOwner ? booking.renter : booking.owner;
            const primaryImage = booking.item?.images?.[0]?.url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm hover:border-zinc-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-zinc-100 overflow-hidden shrink-0 border border-zinc-200">
                    <img src={primaryImage} alt={booking.item?.title} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-zinc-900 text-sm">
                        {booking.item?.title || 'Rental Item'}
                      </h3>
                      <span className="badge-minimal text-[10px]">
                        {booking.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-zinc-500">
                      <span className="flex items-center gap-1 font-medium text-zinc-800">
                        <Calendar size={12} className="text-zinc-400" />
                        {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                      </span>
                      <span>({booking.totalDays} day(s))</span>
                      <span>•</span>
                      <span className="font-semibold text-zinc-900">Total: ₹{booking.totalAmount}</span>
                      <span>(Deposit: ₹{booking.securityDeposit || 0})</span>
                    </div>

                    <div className="mt-1.5 text-xs text-zinc-500 flex flex-wrap items-center gap-2">
                      <span>{isOwner ? 'Borrower:' : 'Owner:'} <strong className="text-zinc-800">{partner?.name}</strong> ({partner?.college})</span>
                      {partner?.phone && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-zinc-700 font-medium">
                            <Phone size={11} /> {partner.phone}
                          </span>
                        </>
                      )}
                    </div>

                    {booking.renterNote && (
                      <p className="text-xs text-zinc-600 mt-2 bg-zinc-50 p-2 rounded-lg border border-zinc-100 italic">
                        "{booking.renterNote}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 w-full md:w-auto shrink-0">
                  {isOwner && booking.status === 'requested' && (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'approved')}
                        className="btn-primary flex-1 text-xs py-1.5 px-3"
                      >
                        <CheckCircle2 size={13} /> Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(booking._id, 'rejected')}
                        className="btn-secondary flex-1 text-xs py-1.5 px-3 text-red-600 hover:bg-red-50"
                      >
                        Decline
                      </button>
                    </div>
                  )}

                  {booking.status === 'approved' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'active')}
                      className="btn-primary w-full text-xs py-1.5 px-3"
                    >
                      <Check size={13} /> Confirm Handover
                    </button>
                  )}

                  {booking.status === 'active' && (
                    <button
                      onClick={() => handleUpdateStatus(booking._id, 'completed')}
                      className="btn-primary w-full text-xs py-1.5 px-3"
                    >
                      <CheckCircle2 size={13} /> Mark Returned
                    </button>
                  )}

                  <Link
                    to={`/rentals/${booking.item?._id}`}
                    className="btn-secondary w-full text-xs py-1.5 px-3 text-center"
                  >
                    View Item
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
