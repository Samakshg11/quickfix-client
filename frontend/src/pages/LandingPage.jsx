import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  ChevronDown,
  Wrench,
  Search,
  Car,
  Headphones,
  MapPinned,
  Activity,
  Cpu,
  Layers,
  Sparkles,
} from 'lucide-react';

import { Button } from '../components/common';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  {
    title: 'Precision Verified',
    description: 'Every mechanic undergoes a rigorous 5-step verification process including identity, skills, and past performance audits.',
    icon: ShieldCheck,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
  },
  {
    title: 'Instant Dispatch',
    description: 'Our proprietary matching algorithm identifies the nearest specialist within 45 seconds of your request.',
    icon: Zap,
    color: '#06b6d4',
    bg: 'rgba(6, 182, 212, 0.1)',
  },
  {
    title: 'Live Telemetry',
    description: 'Track your service progress with real-time updates, live location mapping, and direct encrypted chat.',
    icon: Activity,
    color: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.1)',
  },
];

const stats = [
  { label: 'Network Uptime', value: '99.98%', icon: Globe },
  { label: 'Active Mechanics', value: '4.2k+', icon: Wrench },
  { label: 'Avg. Response', value: '12m', icon: Zap },
  { label: 'Satisfied Drivers', value: '50k+', icon: Headphones },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020617] text-slate-100 selection:bg-cyan-500/30 font-outfit">
      {/* Background Elements */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
        <div className="absolute inset-0 cyber-grid opacity-[0.07]" />
        
        <motion.div 
          style={{ y: y1 }}
          className="absolute -top-24 -left-24 h-[600px] w-[600px] rounded-full bg-cyan-600/10 blur-[120px]" 
        />
        <motion.div 
          style={{ y: useTransform(scrollY, [0, 1000], [0, -300]) }}
          className="absolute top-1/2 -right-24 h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[100px]" 
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="group flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 p-[1px] transition-transform group-hover:scale-110">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#020617]">
                <Zap size={18} className="text-cyan-400" />
              </div>
              <div className="absolute inset-0 -z-10 rounded-xl bg-cyan-400/20 blur-md group-hover:blur-lg" />
            </div>
            <span className="text-xl font-black tracking-tighter text-white">QUICKFIX</span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {['Network', 'Platform', 'Security', 'Support'].map((nav) => (
              <a
                key={nav}
                href={`#${nav.toLowerCase()}`}
                className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-cyan-400"
              >
                {nav}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-white sm:block">
              Log In
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-xl bg-cyan-500 px-6 py-2 text-[10px] font-black uppercase tracking-widest text-black hover:bg-cyan-400">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative flex min-h-[90vh] items-center px-6 pt-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-16 lg:grid-cols-2">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  <Sparkles size={12} />
                  <span>The Future of Roadside Assistance</span>
                </div>
                <h1 className="text-6xl font-black leading-[1.1] tracking-tight text-white md:text-7xl lg:text-8xl">
                  MECHANIC <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">ON DEMAND</span>
                </h1>
                <p className="mt-8 max-w-lg text-lg leading-relaxed text-slate-400">
                  Connect with verified professionals in seconds. Whether it's a breakdown or a scheduled check-up, QuickFix brings the garage to your doorstep.
                </p>
                <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                  <Link to="/register">
                    <Button size="lg" className="group h-14 rounded-2xl bg-white px-8 text-xs font-black uppercase tracking-widest text-black transition-all hover:scale-105 active:scale-95">
                      Request Support <ArrowRight className="ml-2 transition-transform group-hover:translate-x-1" size={16} />
                    </Button>
                  </Link>
                  <button onClick={() => scrollToSection('network')} className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10">
                    Explore Network
                  </button>
                </div>
                
                <div className="mt-12 flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 w-10 rounded-full border-2 border-[#020617] bg-slate-800" />
                    ))}
                  </div>
                  <div className="text-xs font-medium text-slate-500">
                    <span className="block font-bold text-white">4.2k+ Active Pro's</span>
                    Joined the network this month
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="relative perspective-1000"
              >
                <div className="group relative aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
                  <img 
                    src="/hero-main.png" 
                    alt="Futuristic Mechanic" 
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-60" />
                  
                  {/* Floating Labels */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-10 left-10 right-10 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                          <Cpu size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">System Ready</div>
                          <div className="text-sm font-bold text-white">Advanced Diagnostics Active</div>
                        </div>
                      </div>
                      <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                    </div>
                  </motion.div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -bottom-6 -right-6 -z-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute -top-6 -left-6 -z-10 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Ticker */}
        <section className="border-y border-white/5 bg-white/[0.02] py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center md:text-left">
                  <div className="flex items-center justify-center gap-3 md:justify-start">
                    <stat.icon size={16} className="text-cyan-400" />
                    <span className="text-2xl font-black text-white">{stat.value}</span>
                  </div>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="network" className="px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 max-w-2xl">
              <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl lg:text-6xl">
                ENGINEERED FOR <br />
                <span className="text-slate-500">ABSOLUTE RELIABILITY.</span>
              </h2>
              <p className="mt-6 text-lg leading-relaxed text-slate-400">
                We've combined hyper-local logistics with rigorous quality controls to create the world's most dependable mechanic network.
              </p>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="grid gap-8 lg:grid-cols-3"
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-8 transition-all hover:border-cyan-500/30"
                >
                  <div 
                    className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.25rem] transition-transform group-hover:scale-110"
                    style={{ backgroundColor: feature.bg, color: feature.color }}
                  >
                    <feature.icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="mt-4 text-base leading-relaxed text-slate-400">{feature.description}</p>
                  
                  <div className="mt-8 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                    System Architecture <ArrowRight size={14} />
                  </div>
                  
                  {/* Hover Background Accent */}
                  <div 
                    className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full blur-[60px] transition-opacity opacity-0 group-hover:opacity-40"
                    style={{ backgroundColor: feature.color }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Workflow Section */}
        <section id="platform" className="relative border-y border-white/5 bg-black/40 px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 text-center">
              <h2 className="text-4xl font-black tracking-tight text-white md:text-5xl">ONE NETWORK. THREE MODALITIES.</h2>
              <p className="mx-auto mt-6 max-w-xl text-slate-400">A unified core powering custom experiences for drivers, mechanics, and administrators.</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {[
                { title: 'Driver App', desc: 'Focus on speed and transparency.', icon: Car, tag: 'End User' },
                { title: 'Mechanic Pro', desc: 'Job management and live routes.', icon: Wrench, tag: 'Professional' },
                { title: 'Admin HQ', desc: 'Global oversight and approvals.', icon: Globe, tag: 'Infrastructure' },
              ].map((item, i) => (
                <div key={item.title} className="group relative flex flex-col items-center rounded-3xl border border-white/5 bg-white/[0.02] p-10 text-center transition-all hover:bg-white/[0.04]">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-900 shadow-2xl group-hover:neon-glow-cyan">
                    <item.icon size={32} className="text-cyan-400" />
                  </div>
                  <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">{item.tag}</div>
                  <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  <p className="mt-3 text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="support" className="px-6 py-24 lg:py-40">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[3rem] border border-cyan-500/20 bg-gradient-to-br from-cyan-950/40 to-indigo-950/40 p-12 text-center md:p-24">
            <div className="relative z-10">
              <h2 className="text-5xl font-black tracking-tight text-white md:text-7xl">READY FOR <br /> TAKEOFF?</h2>
              <p className="mx-auto mt-8 max-w-xl text-xl text-slate-300">
                Join thousands of drivers and professionals using the most advanced mechanic dispatch network in the country.
              </p>
              
              <div className="mt-12 flex flex-col justify-center gap-6 sm:flex-row">
                <Link to="/register">
                  <Button size="lg" className="h-16 rounded-2xl bg-cyan-500 px-12 text-[11px] font-black uppercase tracking-widest text-black transition-transform hover:scale-105 active:scale-95">
                    Get Started Now
                  </Button>
                </Link>
                <Link to="/login">
                  <button className="h-16 rounded-2xl border border-white/10 bg-white/5 px-12 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur-md transition-all hover:bg-white/10">
                    Partner Portal
                  </button>
                </Link>
              </div>
            </div>

            {/* Background Effects for CTA */}
            <div className="absolute inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
            <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-cyan-500/20 blur-[100px]" />
            <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-purple-500/20 blur-[100px]" />
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Zap size={14} className="text-cyan-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-slate-500">© 2026 QUICKFIX NETWORK</span>
          </div>
          
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            {['Architecture', 'Compliance', 'Uptime', 'Terms'].map(link => (
              <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
        .cyber-grid {
          background-size: 60px 60px;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
