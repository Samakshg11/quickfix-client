// src/pages/mechanic/MechanicDashboardPage.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Hourglass, Wrench, MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useBookings } from '../../hooks';
import { useMechanicTracking } from '../../hooks/useMechanicTracking';
import BookingCard from '../../components/booking/BookingCard';
import LiveMap from '../../components/map/LiveMap';
import ChatWindow from '../../components/chat/ChatWindow';
import { Modal, Spinner, EmptyState } from '../../components/common';

function StatPill({ label, count, color }) {
  const colors = {
    yellow:  'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    green:   'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    blue:    'bg-blue-500/15   text-blue-400   border-blue-500/30',
  };
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${colors[color]}`}>
      <span className="text-2xl font-bold">{count}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

export default function MechanicDashboardPage() {
  const { user }                             = useAuth();
  const { socket }                           = useSocket();
  const { bookings, loading, fetch, updateStatus } = useBookings('mechanic');

  const activeBooking = bookings.find((b) => ['accepted','arrived','in_progress'].includes(b.status));
  const { location: mechanicLoc }            = useMechanicTracking(activeBooking?._id);

  const [userLoc,      setUserLoc]      = useState(null);
  const [distanceKm,   setDistanceKm]  = useState(null);
  const [chatBooking,  setChatBooking]  = useState(null);

  useEffect(() => { fetch({ status: 'pending,accepted,arrived,in_progress' }); }, [fetch]);

  // Listen for incoming new booking requests
  useEffect(() => {
    if (!socket) return;
    const onNew = () => fetch({ status: 'pending,accepted,arrived,in_progress' });
    const onUpd = () => fetch({ status: 'pending,accepted,arrived,in_progress' });
    socket.on('booking:new', onNew);
    socket.on('booking:statusUpdated', onUpd);
    return () => { socket.off('booking:new', onNew); socket.off('booking:statusUpdated', onUpd); };
  }, [socket, fetch]);

  // Track user location from socket (sent by the user's client)
  useEffect(() => {
    if (!socket) return;
    const handler = ({ lat, lng }) => setUserLoc({ lat, lng });
    socket.on('location:userMoved', handler);
    return () => socket.off('location:userMoved', handler);
  }, [socket]);

  // Join active booking's socket room for bi-directional location
  useEffect(() => {
    if (!socket || !activeBooking) return;
    socket.emit('booking:join', { bookingId: activeBooking._id });
    return () => socket.emit('booking:leave', { bookingId: activeBooking._id });
  }, [socket, activeBooking]);

  // Derive user coords from active booking data
  useEffect(() => {
    if (activeBooking?.userLocation?.coordinates) {
      const [lng, lat] = activeBooking.userLocation.coordinates;
      setUserLoc({ lat, lng });
    }
  }, [activeBooking]);

  const pending     = bookings.filter((b) => b.status === 'pending').length;
  const accepted    = bookings.filter((b) => b.status === 'accepted').length;
  const inProgress  = bookings.filter((b) => b.status === 'in_progress').length;

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-white mb-1">🔧 Mechanic Dashboard</h1>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <p className="text-slate-400 text-sm">Live tracking active · {user?.name}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <StatPill label="Pending"     count={pending}    color="yellow" />
        <StatPill label="Accepted"    count={accepted}   color="blue" />
        <StatPill label="In Progress" count={inProgress} color="green" />
      </div>

      {/* Live Map */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3 flex items-center gap-2">
          <MapPin size={14} /> Live Map
        </h2>
        <LiveMap
          mechanicLocation={mechanicLoc}
          userLocation={userLoc}
          setDistanceKm={setDistanceKm}
          height="380px"
        />
        {distanceKm && (
          <p className="mt-2 text-sm text-emerald-400 flex items-center gap-1">
            🚗 Distance to customer: <strong>{distanceKm} km</strong>
          </p>
        )}
        {!mechanicLoc && (
          <p className="mt-2 text-xs text-slate-500">Waiting for GPS signal…</p>
        )}
      </div>

      {/* Active Requests */}
      <div>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4 flex items-center gap-2">
          <Wrench size={14} /> Active Requests
        </h2>

        {loading ? (
          <Spinner size="lg" className="py-12" />
        ) : bookings.length === 0 ? (
          <EmptyState icon="📭" title="No active requests" description="New requests will appear here in real-time." />
        ) : (
          <div className="space-y-4">
            {bookings.map((b, i) => (
              <BookingCard
                key={b._id}
                booking={b}
                role="mechanic"
                index={i}
                onStatusChange={updateStatus}
                onChat={(booking) => setChatBooking(booking)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      <Modal isOpen={!!chatBooking} onClose={() => setChatBooking(null)} title="Job Chat">
        {chatBooking && (
          <div className="h-96 -mx-6 -mb-6">
            <ChatWindow roomId={chatBooking.chatRoom} bookingId={chatBooking._id} />
          </div>
        )}
      </Modal>
    </div>
  );
}
