// src/pages/admin/PendingMechanicsPage.jsx
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, User, Wrench, Phone, MapPin, Clock, ShieldCheck, Mail, Briefcase, Calendar } from 'lucide-react';
import client from '../../api/client';
import { Spinner, EmptyState, Button } from '../../components/common';
import toast from 'react-hot-toast';
import { formatDate } from '../../utils/formatDate';

export default function PendingMechanicsPage() {
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState({});

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await client.get('/admin/mechanics/pending');
      setMechanics(res.data.data);
    } catch { toast.error('Failed to load pending mechanics.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const approve = async (id) => {
    setActing((a) => ({ ...a, [id]: 'approving' }));
    try {
      await client.patch(`/admin/mechanics/${id}/approve`);
      setMechanics((prev) => prev.filter((m) => m._id !== id));
      toast.success('Technician protocols verified and approved!');
    } catch { toast.error('Approval failed.'); }
    finally { setActing((a) => ({ ...a, [id]: null })); }
  };

  const reject = async (id) => {
    if (!window.confirm('Terminate registry for this technician candidates?')) return;
    setActing((a) => ({ ...a, [id]: 'rejecting' }));
    try {
      await client.delete(`/admin/mechanics/${id}/reject`);
      setMechanics((prev) => prev.filter((m) => m._id !== id));
      toast.success('Technician unit purged from registry.');
    } catch { toast.error('Rejection failed.'); }
    finally { setActing((a) => ({ ...a, [id]: null })); }
  };

  return (
    <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-12 font-sans selection:bg-primary/30">

      {/* ── Header ────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-3">
            Node <span className="text-tertiary italic">Registry</span>.
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-md">
            Verify and synchronize tactical units into the global QuickFix grid.
          </p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-surface-low rounded-[1.5rem] border border-white/5">
          <Clock size={16} className="text-tertiary" />
          <span className="text-xs font-bold text-white uppercase tracking-widest">{mechanics.length} Pending Units</span>
        </div>
      </div>

      {/* ── Content Area ───────────────────────────────────────── */}
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
        ) : mechanics.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <EmptyState
              icon={<ShieldCheck size={60} className="text-slate-800" />}
              title="Registry Synchronized"
              description="Incoming signals verified. No tactical units are currently in quarantine queue."
            />
          </motion.div>
        ) : (
          <div className="grid gap-8">
            <AnimatePresence mode="popLayout">
              {mechanics.map((m, i) => (
                <motion.div
                  key={m._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-surface-low border border-white/5 hover:border-white/10 rounded-[2.5rem] p-8 group transition-all"
                >
                  <div className="flex items-start gap-8 flex-wrap lg:flex-nowrap">
                    {/* Unit Identity */}
                    <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-tertiary/20 to-primary/10 border border-white/10 flex items-center justify-center flex-shrink-0 shadow-2xl">
                      <span className="text-3xl font-display font-black text-white">{m.name?.[0]?.toUpperCase()}</span>
                    </div>

                    {/* Detailed Telemetry */}
                    <div className="flex-1 min-w-0 space-y-6">
                      <div>
                        <h3 className="text-2xl font-display font-extrabold text-white mb-2">{m.name}</h3>
                        <div className="flex flex-wrap gap-4">
                          <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full"><Mail size={12} className="text-primary" />{m.user?.email}</span>
                          <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full"><Phone size={12} className="text-secondary" />{m.phone}</span>
                          <span className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full"><Briefcase size={12} className="text-tertiary" />{m.experience} experience</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-3 bg-primary rounded-full" />
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tactical Skills</h4>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.skills?.map((s) => (
                            <span key={s} className="flex items-center gap-1.5 text-[10px] font-bold px-4 py-2 bg-white/5 text-white rounded-xl border border-white/5 group-hover:border-primary/20 transition-colors uppercase tracking-widest">
                              <Wrench size={12} className="text-primary opacity-50" />{s}
                            </span>
                          ))}
                        </div>
                      </div>

                      {m.location?.label && (
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-400">
                          <div className="p-2 bg-white/5 rounded-xl"><MapPin size={14} className="text-red-500" /></div>
                          <span>Deployment Node: <span className="text-white">{m.location.label}</span></span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        <Calendar size={10} /> Transmission Established: {formatDate(m.user?.createdAt)}
                      </div>
                    </div>

                    {/* Verification Actions */}
                    <div className="flex flex-col gap-3 w-full lg:w-48 lg:pt-1">
                      <Button
                        variant="primary"
                        size="md"
                        className="w-full rounded-2xl h-14 shadow-lg shadow-primary/10 font-black"
                        loading={acting[m._id] === 'approving'}
                        onClick={() => approve(m._id)}
                      >
                        <CheckCircle size={18} /> Vouch Node
                      </Button>
                      <Button
                        variant="danger"
                        size="md"
                        className="w-full rounded-2xl h-14 font-black"
                        loading={acting[m._id] === 'rejecting'}
                        onClick={() => reject(m._id)}
                      >
                        <XCircle size={18} /> Purge Unit
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
