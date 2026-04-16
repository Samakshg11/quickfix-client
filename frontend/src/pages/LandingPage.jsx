import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Cpu,
  Globe,
  MessageSquare,
  ChevronDown,
  Clock3,
  CheckCircle2,
  Wrench,
  Sparkles,
  Search,
} from 'lucide-react';

import { Button } from '../components/common';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } },
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const stats = [
    { label: 'Active Mechanics', value: '18k+', progress: 85, color: 'from-cyan-500 to-blue-500' },
    { label: 'Success Rate', value: '99.2%', progress: 99, color: 'from-purple-500 to-pink-500' },
    { label: 'Services Handled', value: '2.4m', progress: 70, color: 'from-emerald-500 to-cyan-500' },
  ];

  const features = [
    {
      title: 'Trained Mechanics',
      description: 'Search nearby specialists, place requests fast, and follow progress through our encrypted node network.',
      icon: Wrench,
      accent: 'cyan',
    },
    {
      title: 'Critical Assistance',
      description: 'Emergency protocols for roadside failures. Dispatch within minutes through geographic load balancing.',
      icon: Zap,
      accent: 'purple',
    },
    {
      title: 'Verifiable Masters',
      description: 'Only approved masters enter the grid. Verified tenure, skills, and background-vetted reliability.',
      icon: ShieldCheck,
      accent: 'emerald',
    },
  ];

  const platforms = [
    {
      title: 'User Interface',
      role: 'Master Command',
      text: 'Unified portal for requesting and tracking status updates in real-time.',
      icon: Cpu,
    },
    {
      title: 'Mechanic Node',
      role: 'Operational Hub',
      text: 'Dedicated workspace for active jobs, routes, and performance benchmarks.',
      icon: Wrench,
    },
    {
      title: 'Central Registry',
      role: 'Admin Core',
      text: 'High-level oversight, approval workflows, and infrastructure maintenance.',
      icon: Globe,
    },
  ];

  return (
    <div className="relative min-h-screen bg-[#030712] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      {/* ── Background Infrastructure ────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
        <div className="absolute inset-0 carbon-overlay opacity-[0.03]" />
        
        {/* Animated Orbs */}
        <motion.div
          animate={{ x: [-100, 100, -100], y: [-50, 50, -50] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="orb top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20"
        />
        <motion.div
          animate={{ x: [100, -100, 100], y: [50, -50, 50] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="orb bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-500/20"
        />
      </div>

      {/* ── Navigation ────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 transition-all group-hover:neon-glow-cyan group-hover:scale-110">
              <Zap size={22} className="text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">QuickFix Grid</span>
              <span className="text-xl font-display font-black tracking-tighter text-white">QUICKFIX.AI</span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {['Infrastructure', 'Nodes', 'Protocols', 'Support'].map((nav) => (
              <a key={nav} href={`#${nav.toLowerCase()}`} className="text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-cyan-400">
                {nav}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Log Input
            </Link>
            <Link to="/register">
              <Button size="sm" variant="cyber" className="rounded-xl px-6 font-black tracking-widest text-[10px] uppercase">
                Initialize
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 font-sans">
        {/* ── Hero Section ────────────────────────────── */}
        <section className="relative px-6 pt-20 pb-32 lg:pt-32 lg:pb-48">
          <div className="mx-auto max-w-7xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-3 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-5 py-2 mb-10"
            >
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-cyan-300">System Protocol Active</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl lg:text-[9rem] font-display font-black leading-[0.85] tracking-tighter italic"
            >
              Automation <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-indigo-600">Sovereignty</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-12 mx-auto max-w-2xl text-lg leading-8 text-slate-400 md:text-xl font-medium"
            >
              Premium roadside support, designed with cleaner operations and stronger trust through our decentralized mechanic network.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-14 flex flex-col justify-center gap-5 sm:flex-row"
            >
              <Link to="/register">
                <Button size="lg" variant="cyber" className="h-16 px-10 rounded-full font-black uppercase tracking-[0.2em] text-xs">
                  Initiate Connection
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ── Feature Cards ────────────────────────────── */}
        <section className="px-6 py-24 bg-white/[0.02] border-y border-white/5">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-cyan-500/30 transition-all active:scale-95"
                >
                  <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border bg-black/40 text-cyan-400 ${
                    feature.accent === 'cyan' ? 'border-cyan-500/20' : 
                    feature.accent === 'purple' ? 'border-purple-500/20 text-purple-400' : 
                    'border-emerald-500/20 text-emerald-400'
                  }`}>
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-display font-bold mb-4">{feature.title}</h3>
                  <p className="text-slate-400 leading-7 text-sm">{feature.description}</p>
                  
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    Access Node <ArrowRight size={14} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Environment Visual ────────────────────────────── */}
        <section className="px-6 py-24 lg:py-48 overflow-hidden">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-20 lg:grid-cols-2 lg:items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-2 mb-8">
                  <Sparkles size={14} className="text-purple-400" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-purple-300">Core Infrastructure</span>
                </div>
                <h2 className="text-5xl lg:text-7xl font-display font-black leading-[0.9] tracking-tighter italic">
                  Hyper-localized <br />
                  <span className="text-slate-600">Verification.</span>
                </h2>
                <p className="mt-8 text-lg text-slate-400 leading-8 max-w-md">
                  Our system maintains a real-time ledger of approved masters, active deployment zones, and system integrity benchmarks across the entire grid.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] border border-white/10 bg-black shadow-2xl">
                  <div className="absolute inset-0 cyber-grid opacity-20" />
                  {/* Decorative network graphic pseudo-code */}
                  <div className="absolute inset-0 flex items-center justify-center p-10">
                    <div className="relative w-full h-full border border-cyan-500/20 rounded-full animate-spin-slow flex items-center justify-center">
                       <div className="absolute top-0 h-4 w-4 bg-cyan-400 rounded-full neon-glow-cyan" />
                       <div className="absolute bottom-1/4 right-0 h-3 w-3 bg-purple-500 rounded-full neon-glow-purple" />
                       <div className="w-1/2 h-1/2 border border-purple-500/20 rounded-full animate-reverse-spin-slow" />
                       <Zap size={48} className="text-cyan-400 neon-glow-cyan" />
                    </div>
                  </div>
                  <div className="absolute bottom-8 left-8 right-8 p-6 glass rounded-3xl">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400 mb-2">Live Environment</p>
                    <p className="text-lg font-display font-bold">Node-0014: Active</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Stats ────────────────────────────── */}
        <section className="px-6 py-24 bg-black border-y border-white/5">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col"
                >
                  <span className="text-5xl font-display font-black mb-4">{stat.value}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-8">{stat.label}</span>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${stat.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className={`h-full bg-gradient-to-r ${stat.color}`}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Platforms / Nodes ────────────────────────────── */}
        <section className="px-6 py-24 lg:py-48">
          <div className="mx-auto max-w-3xl text-center mb-24">
             <h2 className="text-5xl font-display font-black tracking-tighter italic uppercase underline decoration-cyan-500 decoration-4 underline-offset-8">The Platform of <br /> <span className="text-cyan-500">Integration</span></h2>
             <p className="mt-8 text-slate-400 text-lg">One infrastructure, synchronized for three operational perspectives.</p>
          </div>
          
          <div className="mx-auto max-w-7xl">
            <div className="space-y-4">
              {platforms.map((node, i) => (
                <motion.div
                  key={node.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group flex flex-col md:flex-row md:items-center justify-between p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]">
                      <node.icon size={20} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold">{node.title}</h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mt-1">{node.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 md:mt-0 md:max-w-md text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                    {node.text}
                  </p>
                  <button className="hidden md:flex h-12 w-12 items-center justify-center rounded-full border border-white/10 group-hover:border-cyan-500 transition-colors">
                    <ArrowRight size={18} />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer Link Section ────────────────────────────── */}
        <section className="px-6 py-24 lg:py-48 text-center bg-gradient-to-b from-transparent to-cyan-500/5">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter italic mb-10">
              Ready to <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Override?</span>
            </h2>
            <p className="text-slate-400 text-lg mb-14">Get started as a user or initialize your mechanic node today.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" variant="cyber" className="h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="h-16 px-12 rounded-2xl border-white/20 bg-white/5 font-black uppercase tracking-[0.2em] w-full sm:w-auto">
                  Log Input
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-4 opacity-50">
              <Zap size={20} className="text-cyan-400" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Integrated Infrastructure © 2026</span>
           </div>
           <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
             {['Protocols', 'Term', 'Policy', 'Status'].map(link => (
               <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
             ))}
           </div>
        </div>
      </footer>

      {/* Tailwind and custom CSS classes like animate-spin-slow, animate-reverse-spin-slow are managed here or in style tag */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes reverse-spin-slow {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-reverse-spin-slow {
          animation: reverse-spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
