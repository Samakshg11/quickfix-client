// src/components/booking/BookingCard.jsx
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Wrench, Calendar, MessageCircle, Star } from 'lucide-react';
import { StatusBadge, Button } from '../common';
import { formatDate } from '../../utils/formatDate';

const STATUS_ACTIONS = {
  // mechanic actions
  pending: [{ label: '✅ Accept', status: 'accepted', variant: 'success' }, { label: '❌ Reject', status: 'rejected', variant: 'danger' }],
  accepted: [{ label: '📍 Mark Arrived', status: 'arrived', variant: 'secondary' }],
  arrived: [{ label: '🔧 Start Repair', status: 'in_progress', variant: 'secondary' }],
  in_progress: [{ label: '✅ Complete', status: 'completed', variant: 'success' }],
  // user action
  completed: [], // rating handled separately
};

const BookingCard = forwardRef(({ booking, role = 'user', onStatusChange, onChat, onRate, index = 0 }, ref) => {
  const isMechanic = role === 'mechanic';
  const actions = isMechanic ? (STATUS_ACTIONS[booking.status] || []) : [];
  const canCancel = ['pending', 'accepted'].includes(booking.status) && !isMechanic;
  const canRate = booking.status === 'completed' && !isMechanic && !booking.rating;
  const counterpart = isMechanic ? booking.user : booking.mechanic;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      className="bg-[#1e293b] rounded-2xl border border-white/5 hover:border-white/10 transition-all duration-200 overflow-hidden group shadow-2xl"
    >
      {/* Status stripe */}
      <div className={`h-1 ${booking.status === 'completed' ? 'bg-emerald-500' :
          booking.status === 'in_progress' ? 'bg-amber-500' :
            booking.status === 'cancelled' || booking.status === 'rejected' ? 'bg-red-500' :
              'bg-blue-500'
        }`} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-widest">
              {isMechanic ? 'Customer Interface' : 'Mechanical Unit'}
            </p>
            <h3 className="font-display font-extrabold text-white text-lg">{counterpart?.name || 'In Transit'}</h3>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={booking.status} />
            {booking.isEmergency && (
              <span className="text-[10px] font-black px-2 py-0.5 bg-red-500/20 text-red-500 rounded-full border border-red-500/30 uppercase tracking-tighter animate-pulse">
                🚨 Critical Emergency
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-3 mb-6">
          <InfoRow icon={<Wrench size={14} />} text={booking.serviceType} />
          {booking.userLocation?.label && (
            <InfoRow icon={<MapPin size={14} />} text={booking.userLocation.label} />
          )}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest">
            <Calendar size={12} /> {formatDate(booking.createdAt)}
          </div>
          {booking.description && (
            <p className="text-sm text-slate-400 bg-white/5 rounded-xl px-4 py-3 italic border border-white/5 ring-1 ring-white/5 ring-inset">
              "{booking.description}"
            </p>
          )}
        </div>

        {/* Rating display */}
        {booking.rating && (
          <div className="flex items-center gap-1 mb-6 bg-amber-500/5 border border-amber-500/10 rounded-xl px-4 py-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className={i < booking.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-800'} />
            ))}
            {booking.review && <span className="text-xs font-bold text-slate-400 ml-2 uppercase tracking-tight">"{booking.review}"</span>}
          </div>
        )}

        {/* Tactical Actions */}
        <div className="flex flex-wrap gap-2 pt-2">
          {actions.map((action) => (
            <Button
              key={action.status}
              variant={action.variant}
              size="sm"
              className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]"
              onClick={() => onStatusChange?.(booking._id, action.status)}
            >
              {action.label}
            </Button>
          ))}

          {canCancel && (
            <Button variant="danger" size="sm" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]" onClick={() => onStatusChange?.(booking._id, 'cancelled')}>
              Terminate Request
            </Button>
          )}

          {canRate && (
            <Button variant="primary" size="sm" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px]" onClick={() => onRate?.(booking)}>
              <Star size={14} className="mr-2" /> Vouch Service
            </Button>
          )}

          {booking.chatRoom && !['completed', 'cancelled', 'rejected'].includes(booking.status) && (
            <Button variant="ghost" size="sm" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px] border border-white/5 bg-white/5 hover:bg-primary/10 hover:text-primary transition-all" onClick={() => onChat?.(booking)}>
              <MessageCircle size={14} className="mr-2" /> Open Comms
            </Button>
          )}

          {/* User: Track Live */}
          {role === 'user' && ['accepted', 'arrived', 'in_progress'].includes(booking.status) && (
            <Button variant="secondary" size="sm" className="rounded-xl h-10 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-secondary/10" onClick={() => window.dispatchEvent(new CustomEvent('open-tracking', { detail: booking }))}>
              <MapPin size={14} className="mr-2" /> Track Signal
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

function InfoRow({ icon, text }) {
  return (
    <div className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase tracking-[0.1em]">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-500">
        {icon}
      </div>
      {text}
    </div>
  );
}

export default BookingCard;
