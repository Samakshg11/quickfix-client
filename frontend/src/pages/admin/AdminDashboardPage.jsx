import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Wrench, CalendarDays, TrendingUp,
  ShieldCheck, AlertCircle, Activity, Zap,
  ArrowRight, CheckCircle2, XCircle, Clock
} from 'lucide-react';
import { Button } from '../../components/common';
import { Link } from 'react-router-dom';
import client from '../../api/client';

const StatCard = ({ label, value, icon: Icon, trend, color }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    className="bg-surface-low border border-white/5 p-6 rounded-[2.5rem] relative overflow-hidden group transition-all"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-${color}/10 transition-colors`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`w-12 h-12 bg-${color}/10 rounded-2xl flex items-center justify-center text-${color}`}>
        <Icon size={24} />
      </div>
      {trend && (
        <span className="flex items-center gap-1 text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
          <TrendingUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-3xl font-display font-black text-white tracking-tighter mb-1">{value}</h3>
      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</p>
    </div>
  </motion.div>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalMechanics: 0,
    totalBookings: 0,
    revenue: 0,
    pendingMechanics: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [statsRes, pendingRes] = await Promise.all([
          client.get('/admin/stats'),
          client.get('/admin/mechanics/pending'),
        ]);

        const analytics = statsRes.data.data;

        setStats({
          totalUsers: analytics.totalUsers || 0,
          totalMechanics: analytics.totalMechanics || 0,
          totalBookings: analytics.totalBookings || 0,
          revenue: 0,
          pendingMechanics: pendingRes.data.count || analytics.pendingApprovals || 0,
        });
      } catch (err) {
        console.error('Analytics fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">

      {/* ── Header ────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <ShieldCheck size={12} /> Command Center Active
            </div>
            <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
              <Zap size={12} /> Real-time Nodes: 100%
            </div>
          </div>
          <h1 className="text-6xl font-display font-black text-white tracking-tighter italic">
            GRID_ANALYTICS.
          </h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.2em] mt-2">Global System Monitoring & Control Hub</p>
        </div>

        <Link to="/admin/mechanics">
          <Button variant="danger" size="lg" className="rounded-2xl h-16 font-black text-[11px] uppercase tracking-[0.2em] px-8 bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
            Review Registry ({stats.pendingMechanics}) <ArrowRight className="ml-2" size={16} />
          </Button>
        </Link>
      </div>

      {/* ── Stats Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Hub Nodes" value={stats.totalUsers} icon={Users} color="primary" trend="+12%" />
        <StatCard label="Active Technicians" value={stats.totalMechanics} icon={Wrench} color="secondary" trend="+5%" />
        <StatCard label="Service Events" value={stats.totalBookings} icon={CalendarDays} color="red-500" trend="+24%" />
        <StatCard label="Total Flux (Revenue)" value={`$${stats.revenue}`} icon={Activity} color="white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Registry Alert ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-low/30 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="flex items-center justify-between mb-10 relative z-10">
              <div>
                <h2 className="text-3xl font-display font-black text-white tracking-tighter mb-1 uppercase">Pending Approval Registry</h2>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">High-Priority Vetting Queue</p>
              </div>
              <Link to="/admin/mechanics" className="text-[10px] font-black text-red-500 hover:text-white transition-colors uppercase tracking-[0.3em] flex items-center gap-2">
                Enter Registry <ArrowRight size={14} />
              </Link>
            </div>

            {stats.pendingMechanics > 0 ? (
              <div className="space-y-4 relative z-10">
                {[1, 2, 3].map((i) => i <= stats.pendingMechanics && (
                  <div key={i} className="flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-colors group/item">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 font-black italic">
                        {i}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white uppercase tracking-tight">Technical Unit 00{i}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Awaiting Clearance</p>
                      </div>
                    </div>
                    <Link to="/admin/mechanics">
                      <Button size="sm" variant="outline" className="rounded-xl font-black text-[9px] uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white">
                        Analyze <Zap size={10} className="ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                ))}
                {stats.pendingMechanics > 3 && (
                  <p className="text-center text-[10px] font-bold text-slate-700 uppercase tracking-[0.3em] pt-4">Plus {stats.pendingMechanics - 3} additional units in vault</p>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 bg-white/2 border border-dashed border-white/5 rounded-3xl">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Registry Synchronized • All Nodes Cleared</p>
              </div>
            )}
          </div>
        </div>

        {/* ── System Status ─────────────────────────────── */}
        <div className="space-y-6">
          <div className="bg-surface-low/30 backdrop-blur-3xl border border-white/5 rounded-[3.5rem] p-10 relative overflow-hidden h-full">
            <h2 className="text-3xl font-display font-black text-white tracking-tighter mb-8 uppercase italic">System_State</h2>

            <div className="space-y-8">
              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Zap size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">API_GATEWAY</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Stable Node</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1 rounded-lg uppercase tracking-widest">Active</span>
              </div>

              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <Activity size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">SOCKET_FEED</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">Low Latency</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-secondary bg-secondary/10 px-3 py-1 rounded-lg uppercase tracking-widest">Linked</span>
              </div>

              <div className="flex items-center justify-between group cursor-default">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <AlertCircle size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white tracking-tight uppercase">AUTH_VAULT</p>
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest italic">High Security</p>
                  </div>
                </div>
                <span className="text-[10px] font-black text-red-500 bg-red-500/10 px-3 py-1 rounded-lg uppercase tracking-widest">Locked</span>
              </div>

              <div className="pt-10">
                <div className="h-px bg-white/5 mb-8" />
                <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 uppercase tracking-[0.2em]">
                  <Clock size={12} /> Last Grid Pulse: {new Date().toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
