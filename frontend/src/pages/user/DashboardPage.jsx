import React from "react";
// src/pages/user/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Wrench, AlertTriangle, Star, TrendingUp, Clock, ChevronRight, Zap, Shield, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../hooks';
import { Spinner, EmptyState, StatusBadge, Button } from '../../components/common';
import { formatDate } from '../../utils/formatDate';

function StatCard({ icon: Icon, label, value, sub, color = 'primary', delay = 0 }) {
  const themes = {
    primary: 'from-primary/20   to-primary/5    border-primary/20    text-primary',
    secondary: 'from-secondary/20 to-secondary/5  border-secondary/20  text-secondary',
    tertiary: 'from-tertiary/20  to-tertiary/5   border-tertiary/20   text-tertiary',
    amber: 'from-brand-500/20 to-brand-500/5  border-brand-500/20  text-brand-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${themes[color]} border rounded-3xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full -translate-y-12 translate-x-12 blur-2xl" />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-current opacity-10 flex items-center justify-center`}>
          <Icon size={20} className="opacity-100" />
        </div>
        {sub && <span className="text-[10px] font-bold uppercase tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded-full text-slate-400">{sub}</span>}
      </div>
      <p className="text-4xl font-display font-bold text-white mb-1 leading-none">{value}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { bookings, loading, fetch } = useBookings('user');

  useEffect(() => { fetch(); }, [fetch]);

  const total = bookings.length;
  const active = bookings.filter((b) => ['pending', 'accepted', 'arrived', 'in_progress'].includes(b.status)).length;
  const completed = bookings.filter((b) => b.status === 'completed').length;
  const avgRating = bookings
    .filter((b) => b.rating)
    .reduce((sum, b, _, arr) => sum + b.rating / arr.length, 0);

  const recent = [...bookings].slice(0, 4);

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 font-sans selection:bg-primary/30">
      {/* ── Welcome Banner ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-transparent border border-white/5 rounded-[2.5rem]" />

        {/* Animated Background Pulse */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[80px] animate-pulse-slow" />

        <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 z-10">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3">
              👋 Hey, <span className="text-primary italic">{user?.name?.split(' ')[0]}</span>.
            </h1>
            <p className="text-slate-400 text-lg font-medium max-w-md">
              Welcome back to your synchronized automotive command center.
            </p>
          </div>
          <Link to="/mechanics">
            <Button variant="primary" size="lg" className="rounded-2xl px-10 h-16 shadow-2xl shadow-primary/20 group font-bold">
              Find a Technician <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* ── Dashboard Content Grid ───────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-12">

        {/* Left Col: Activity & Stats */}
        <div className="lg:col-span-2 space-y-12">

          {/* Stats section */}
          <div>
            <div className="flex items-center gap-2 mb-6 ml-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Operational Overview</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Zap} label="Operational" value={total} color="primary" delay={0.1} />
              <StatCard icon={Clock} label="Active" value={active} color="amber" delay={0.15} sub={active > 0 ? 'Live' : undefined} />
              <StatCard icon={Shield} label="Secured" value={completed} color="secondary" delay={0.2} />
              <StatCard icon={Star} label="Rating" value={avgRating ? avgRating.toFixed(1) : '—'} color="tertiary" delay={0.25} />
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="flex items-center gap-2 mb-6 ml-2">
              <div className="w-1 h-4 bg-secondary rounded-full" />
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Kinetic Links</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <QuickAction to="/mechanics" icon={<Wrench size={24} />} label="Rescue & Repair" description="Request on-demand aid" />
              <QuickAction to="/bookings" icon={<CalendarDays size={24} />} label="History" description="Audit your service logs" />
              <QuickAction to="/emergency" icon={<AlertTriangle size={24} />} label="Emergency" description="Immediate tactical support" danger />
            </div>
          </div>

        </div>

        {/* Right Col: Recent Activity List */}
        <div className="space-y-8">
          <div className="flex items-center justify-between gap-2 mb-6 px-1">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-primary" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recent Pulses</h2>
            </div>
            {bookings.length > 4 && (
              <Link to="/bookings" className="text-[10px] font-bold text-primary hover:text-white uppercase tracking-widest underline underline-offset-4 transition-colors">View All</Link>
            )}
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex justify-center"><Spinner size="lg" /></div>
            ) : recent.length === 0 ? (
              <div className="bg-surface-low rounded-[2rem] border border-white/5 p-12 text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench size={20} className="text-slate-600" />
                </div>
                <p className="text-sm font-bold text-slate-500 mb-6">No historical data available.</p>
                <Link to="/mechanics">
                  <Button variant="secondary" size="md" className="rounded-xl w-full">Initialize First Order</Button>
                </Link>
              </div>
            ) : (
              recent.map((b, i) => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-surface-low border border-white/5 hover:border-primary/20 rounded-[2rem] p-5 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-surface-high border border-white/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                      <Zap size={20} className="text-slate-500 group-hover:text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate uppercase tracking-tight">{b.serviceType}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{b.mechanic?.name || 'Assigned Tech'} · {formatDate(b.createdAt)}</p>
                    </div>
                  </div>
                  <StatusBadge status={b.status} />
                </motion.div>
              ))
            )}
          </div>

          {/* Promo / Tip Card */}
          <div className="bg-gradient-to-br from-secondary/20 to-primary/5 rounded-[2rem] border border-white/5 p-8 relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-lg font-display font-bold mb-2">Platinum Perks</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Platinum members enjoy prioritized terminal placement and zero-latency concierge responses.</p>
              <Link to="/emergency" className="text-xs font-bold text-white flex items-center gap-2 group-hover:text-primary transition-colors">
                Explore Membership <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Star size={80} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function QuickAction({ to, icon, label, description, danger = false }) {
  return (
    <Link
      to={to}
      className={`group flex items-start flex-col gap-4 p-6 rounded-[2rem] border transition-all duration-300
        ${danger
          ? 'bg-red-500/5 border-red-500/10 hover:border-red-500/40 hover:bg-red-500/10'
          : 'bg-surface-low border-white/5 hover:border-primary/30 hover:bg-surface-high'}`}
    >
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 
        ${danger ? 'bg-red-500/10 text-red-500' : 'bg-white/5 text-slate-400 group-hover:text-primary group-hover:bg-primary/10'}`}>
        {icon}
      </div>
      <div>
        <p className={`font-display font-bold text-base mb-1 ${danger ? 'text-red-500' : 'text-white'}`}>{label}</p>
        <p className="text-xs font-medium text-slate-500 group-hover:text-slate-400 transition-colors leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
