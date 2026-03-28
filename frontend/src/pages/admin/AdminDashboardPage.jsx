import React from "react";
// src/pages/admin/AdminDashboardPage.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Wrench, CalendarDays, Clock, Shield, ChevronRight, TrendingUp, Cpu } from 'lucide-react';
import client from '../../api/client';
import { Spinner, Button } from '../../components/common';

function AdminStatCard({ icon: Icon, label, value, color = 'primary', delay = 0 }) {
  const themes = {
    primary: 'from-primary/20   to-primary/5    border-primary/20    text-primary',
    secondary: 'from-secondary/20 to-secondary/5  border-secondary/20  text-secondary',
    tertiary: 'from-tertiary/20  to-tertiary/5   border-tertiary/20   text-tertiary',
    red: 'from-red-500/20   to-red-500/5    border-red-500/20    text-red-500',
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`bg-gradient-to-br ${themes[color]} border rounded-3xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-default`}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-current opacity-[0.03] rounded-full -translate-y-12 translate-x-12 blur-2xl font-sans" />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-current opacity-10 flex items-center justify-center`}>
          <Icon size={20} className="opacity-100" />
        </div>
      </div>
      <p className="text-4xl font-display font-bold text-white mb-1 leading-none">{value ?? '—'}</p>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</p>
    </motion.div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/admin/stats').then((r) => { setStats(r.data.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><Spinner size="lg" /></div>;

  const cards = [
    { icon: Users, label: 'Core Nodes (Users)', value: stats?.totalUsers, color: 'primary' },
    { icon: Wrench, label: 'Tactical Units (Pros)', value: stats?.totalMechanics, color: 'secondary' },
    { icon: CalendarDays, label: 'Operational Logs', value: stats?.totalBookings, color: 'tertiary' },
    { icon: Clock, label: 'Quarantined Approvals', value: stats?.pendingApprovals, color: 'red' },
  ];

  return (
    <div className="p-6 md:p-12 max-w-7xl mx-auto space-y-12 font-sans selection:bg-primary/30">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3">
            System <span className="text-primary italic">Analytics</span>.
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md">
            Global operational overview of the QuickFix synchronized network.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-low rounded-2xl border border-white/5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network Online</span>
          </div>
        </div>
      </div>

      {/* ── Primary Stats Cluster ───────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <AdminStatCard key={c.label} {...c} delay={i * 0.1} />
        ))}
      </div>

      {/* ── Operational Visualizer ──────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-12">

        {/* Analytics Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-low border border-white/5 hover:border-primary/10 rounded-[2.5rem] p-8 md:p-12 transition-all">
            <div className="flex items-center gap-3 mb-8">
              <Shield size={18} className="text-primary" />
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Operational Status Distribution</h2>
            </div>

            {stats?.bookingsByStatus?.length > 0 ? (
              <div className="grid gap-6">
                {stats.bookingsByStatus.map(({ _id, count }, i) => (
                  <div key={_id} className="group flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest px-1">
                      <span className="text-slate-500 transition-colors group-hover:text-white">
                        {_id?.replace('_', ' ') || 'Process'}
                      </span>
                      <span className="text-white bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        {count}
                      </span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((count / (stats.totalBookings || 1)) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-slate-600 font-bold uppercase tracking-widest text-xs">
                No operational data detected on current pulse.
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Quick Actions / System Health */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-secondary/15 to-transparent border border-white/5 rounded-[2rem] p-8">
            <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6">
              <Cpu size={24} className="text-secondary" />
            </div>
            <h3 className="text-xl font-display font-bold text-white mb-2">Master Override</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">System-wide parameters can be modulated from the Advanced registry.</p>
            <div className="space-y-4">
              <Button variant="outline" size="sm" className="w-full justify-between group">
                User Audit <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-between group">
                Node Management <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Performance Card */}
          <div className="p-8 border border-white/5 rounded-[2rem] bg-surface-low flex items-center gap-6">
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Network Latency</p>
              <p className="text-2xl font-display font-bold text-white">42ms</p>
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Sys Load</p>
              <p className="text-2xl font-display font-bold text-secondary">1.2%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
