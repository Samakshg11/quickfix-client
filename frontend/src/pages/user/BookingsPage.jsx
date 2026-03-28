// src/pages/user/BookingsPage.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../../context/SocketContext';
import { useBookings } from '../../hooks';
import BookingCard from '../../components/booking/BookingCard';
import RatingModal from '../../components/booking/RatingModal';
import ChatWindow from '../../components/chat/ChatWindow';
import { Modal, Spinner, EmptyState, Button } from '../../components/common';
import LiveMap from '../../components/map/LiveMap';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, ListFilter, MessageSquare, Star, ChevronRight } from 'lucide-react';

const STATUS_TABS = [
  { label: 'All Operations', value: '', icon: ListFilter },
  { label: 'Live Pulses', value: 'active', icon: Clock },
  { label: 'Secured', value: 'completed', icon: CheckCircle },
  { label: 'Voided', value: 'cancelled', icon: XCircle },
];

export default function BookingsPage() {
  const { bookings, loading, fetch, updateStatus, rate } = useBookings('user');
  const { socket } = useSocket();

  const [activeTab, setActiveTab] = useState('');
  const [ratingTarget, setRatingTarget] = useState(null);
  const [chatBooking, setChatBooking] = useState(null);
  const [trackingBooking, setTrackingBooking] = useState(null);
  const [liveMechanicLoc, setLiveMechanicLoc] = useState(null);
  const [currentDistance, setCurrentDistance] = useState(null);

  useEffect(() => { fetch(); }, [fetch]);

  // Live status updates via socket
  useEffect(() => {
    if (!socket) return;
    const handler = ({ bookingId, newStatus }) => {
      fetch(); // Re-fetch to get the updated booking
    };
    socket.on('booking:statusUpdated', handler);

    // Listen for live location updates while tracking is active
    const locHandler = ({ bookingId, lat, lng }) => {
      if (trackingBooking?._id === bookingId) {
        setLiveMechanicLoc({ lat, lng });
      }
    };
    socket.on('location:mechanicMoved', locHandler);

    return () => {
      socket.off('booking:statusUpdated', handler);
      socket.off('location:mechanicMoved', locHandler);
    };
  }, [socket, fetch, trackingBooking?._id]);

  useEffect(() => {
    const handleOpenTracking = (e) => {
      const booking = e.detail;
      setTrackingBooking(booking);
      if (socket) socket.emit('booking:join', { bookingId: booking._id });
      // Pre-set location from current state if available
      if (booking.mechanic?.location?.coordinates) {
        setLiveMechanicLoc({
          lat: booking.mechanic.location.coordinates[1],
          lng: booking.mechanic.location.coordinates[0]
        });
      }
    };
    window.addEventListener('open-tracking', handleOpenTracking);
    return () => window.removeEventListener('open-tracking', handleOpenTracking);
  }, [socket]);

  const closeTracking = () => {
    if (socket && trackingBooking) {
      socket.emit('booking:leave', { bookingId: trackingBooking._id });
    }
    setTrackingBooking(null);
    setLiveMechanicLoc(null);
    setCurrentDistance(null);
  };

  const filtered = bookings.filter((b) => {
    if (!activeTab) return true;
    if (activeTab === 'active') return ['pending', 'accepted', 'arrived', 'in_progress'].includes(b.status);
    return b.status === activeTab;
  });

  const activeCount = bookings.filter((b) => ['pending', 'accepted', 'arrived', 'in_progress'].includes(b.status)).length;

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 font-sans selection:bg-primary/30">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3">
            My <span className="text-secondary italic">Service Logs</span>.
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md">
            Audit and synchronize with your past and present service events.
          </p>
        </div>
        <Link to="/mechanics">
          <Button variant="outline" size="md" className="rounded-2xl px-6 h-12 text-xs font-bold uppercase tracking-widest border-white/5 bg-white/5 hover:bg-white/10 group">
            Find Technician <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* ── Filter Tabs ───────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 bg-surface-low border border-white/5 rounded-[2rem] p-2 w-fit shadow-xl">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl transition-all duration-300
              ${activeTab === tab.value
                ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105'
                : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.value === 'active' && activeCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-md bg-secondary text-white text-[9px] font-black border border-white/20 animate-pulse">
                {activeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Content Area ──────────────────────────────────────── */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <EmptyState
              icon={<Clock size={60} className="text-slate-700" />}
              title="No Historical Data Found"
              description="Your service logs are currently void. Initialize a new synchronized request to populate the feed."
              action={
                <Link to="/mechanics">
                  <Button variant="primary" size="md" className="rounded-xl w-full">Search for Pros</Button>
                </Link>
              }
            />
          </motion.div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((b, i) => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  role="user"
                  index={i}
                  onStatusChange={updateStatus}
                  onRate={(booking) => setRatingTarget(booking)}
                  onChat={(booking) => setChatBooking(booking)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Modal Integration ─────────────────────────────────── */}
      <RatingModal
        isOpen={!!ratingTarget}
        booking={ratingTarget}
        onClose={() => setRatingTarget(null)}
        onSubmit={rate}
      />

      <Modal
        isOpen={!!chatBooking}
        onClose={() => setChatBooking(null)}
        title="Tactical Comm Hub"
      >
        {chatBooking && (
          <div className="h-96 -mx-8 -mb-8 mt-2">
            <ChatWindow roomId={chatBooking.chatRoom} bookingId={chatBooking._id} />
          </div>
        )}
      </Modal>

      <Modal
        isOpen={!!trackingBooking}
        onClose={() => { setTrackingBooking(null); setLiveMechanicLoc(null); }}
        title="Tactical Tracking Feed"
        fullWidth
      >
        {trackingBooking && (
          <div className="space-y-4">
            <div className="bg-surface-high border border-white/5 rounded-2xl p-4 flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technician Target</p>
                <p className="text-sm font-bold text-white">{trackingBooking.mechanic?.name || 'In Transit'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Proximity</p>
                <p className="text-xs font-bold text-primary font-display">{currentDistance ? `${currentDistance} KM` : 'CALCULATING...'}</p>
              </div>
            </div>

            <div className="h-[450px] -mx-4 overflow-hidden rounded-3xl border border-white/5 shadow-2xl">
              <LiveMap
                mechanicLocation={liveMechanicLoc}
                setDistanceKm={setCurrentDistance}
                userLocation={trackingBooking.userLocation ? {
                  lat: trackingBooking.userLocation.coordinates[1],
                  lng: trackingBooking.userLocation.coordinates[0]
                } : null}
                height="100%"
              />
            </div>

            <div className="flex gap-4">
              <Button variant="ghost" size="sm" className="w-full h-12 rounded-xl" onClick={() => setChatBooking(trackingBooking)}>
                <MessageSquare size={14} className="mr-2" /> Open Comms
              </Button>
              <Button variant="outline" size="sm" className="w-full h-12 rounded-xl" onClick={() => { setTrackingBooking(null); setLiveMechanicLoc(null); }}>
                Terminate Feed
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
