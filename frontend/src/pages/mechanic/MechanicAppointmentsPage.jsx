import React from "react";
// src/pages/mechanic/MechanicAppointmentsPage.jsx
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CalendarDays, Star } from 'lucide-react';
import { useBookings } from '../../hooks';
import { StatusBadge, Spinner, EmptyState } from '../../components/common';
import { formatDateTime } from '../../utils/formatDate';

export default function MechanicAppointmentsPage() {
  const { bookings, loading, fetch } = useBookings('mechanic');

  useEffect(() => { fetch({ status: 'completed,cancelled,rejected' }); }, [fetch]);

  const completed = bookings.filter((b) => b.status === 'completed');
  const totalEarnings = completed.length * 200; // placeholder until pricing is set
  const avgRating = completed.filter((b) => b.rating).reduce((sum, b, _, arr) => sum + b.rating / arr.length, 0);

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
          <CalendarDays size={22} className="text-amber-400" /> Appointment History
        </h1>
        <p className="text-slate-400 text-sm">All your past service appointments.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-white">{completed.length}</p>
          <p className="text-xs text-slate-400 mt-1">Jobs Completed</p>
        </div>
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-amber-400">
            {avgRating ? avgRating.toFixed(1) : '—'}
          </p>
          <p className="text-xs text-slate-400 mt-1">Avg Rating</p>
        </div>
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold text-emerald-400">{bookings.filter((b) => b.status === 'cancelled').length}</p>
          <p className="text-xs text-slate-400 mt-1">Cancelled</p>
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Spinner size="lg" className="py-16" />
      ) : bookings.length === 0 ? (
        <EmptyState icon="📋" title="No history yet" description="Your completed jobs will appear here." />
      ) : (
        <div className="space-y-3">
          {bookings.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-[#1e293b] rounded-xl border border-slate-700 p-4"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0">
                  <p className="font-medium text-white">{b.serviceType}</p>
                  <p className="text-sm text-slate-400 mt-0.5">Customer: {b.user?.name}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDateTime(b.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={b.status} />
                  {b.rating && (
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={12} className={idx < b.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {b.review && (
                <p className="mt-2 text-xs text-slate-400 bg-slate-800/50 rounded-lg px-3 py-2 italic">
                  "{b.review}"
                </p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
