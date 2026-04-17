import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  ChevronDown,
  CheckCircle2,
  Wrench,
  Sparkles,
  Search,
  BadgeCheck,
  Car,
  Headphones,
  MapPinned,
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
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
};

const features = [
  {
    title: 'Verified Mechanics',
    description: 'Every mechanic is identity-checked, skill-verified, and continuously rated by completed jobs.',
    icon: ShieldCheck,
    accent: 'emerald',
  },
  {
    title: 'Fast Emergency Dispatch',
    description: 'Roadside assistance requests are matched to available professionals in your active service zone.',
    icon: Zap,
    accent: 'cyan',
  },
  {
    title: 'Transparent Job Tracking',
    description: 'Track acceptance, ETA, live progress, and completion updates from one clean timeline.',
    icon: Search,
    accent: 'purple',
  },
];

const stats = [
  { label: 'Cities Covered', value: '120+', progress: 78, color: 'from-cyan-500 to-blue-500' },
  { label: 'Average Dispatch Time', value: '11 min', progress: 88, color: 'from-indigo-500 to-purple-500' },
  { label: 'Monthly Service Requests', value: '48k+', progress: 84, color: 'from-emerald-500 to-cyan-500' },
];

const serviceSteps = [
  {
    title: 'Share Your Issue',
    detail: 'Tell us your problem, location, and vehicle details in less than a minute.',
    icon: Car,
  },
  {
    title: 'Matched in Real Time',
    detail: 'The nearest eligible mechanic receives your request and confirms availability.',
    icon: MapPinned,
  },
  {
    title: 'On-Site Support',
    detail: 'Get updates until the mechanic arrives, resolves the issue, and closes the job.',
    icon: Headphones,
  },
];

const platforms = [
  {
    title: 'Driver Console',
    role: 'Request and track assistance',
    text: 'Built for speed, clarity, and emergency-first actions with location-aware dispatch.',
    icon: Car,
  },
  {
    title: 'Mechanic Workspace',
    role: 'Jobs, ETAs, and performance',
    text: 'A focused dashboard for incoming bookings, route updates, and completion quality.',
    icon: Wrench,
  },
  {
    title: 'Admin Control Center',
    role: 'Approvals, oversight, analytics',
    text: 'Maintain network quality through onboarding checks, fraud controls, and SLA reporting.',
    icon: Globe,
  },
];

const faqs = [
  {
    q: 'How fast can QuickFix respond?',
    a: 'Response time depends on location and traffic, but most urban bookings are accepted within minutes with live ETA updates.',
  },
  {
    q: 'Are mechanics background verified?',
    a: 'Yes. Mechanics go through profile checks, experience screening, and ongoing quality review based on completed jobs.',
  },
  {
    q: 'Can I book non-emergency services?',
    a: 'Yes. You can request both urgent roadside help and planned vehicle service appointments from the same platform.',
  },
];

const trustPoints = [
  'Live status updates from request to completion',
  'Verified mechanics and service quality checks',
  'Coverage across expanding city clusters',
  'Support for emergency and scheduled bookings',
];

const serviceCategories = ['Flat Tyre', 'Battery Jumpstart', 'Engine Overheat', 'Brake Failure', 'Fuel Delivery', 'On-site Inspection'];

const serviceStandards = [
  { title: 'Verified Profiles', detail: 'Identity and skill checks before activation.', icon: ShieldCheck },
  { title: 'Live ETA Tracking', detail: 'Continuous updates from acceptance to arrival.', icon: MapPinned },
  { title: 'Priority Support', detail: 'Escalation support for active emergency requests.', icon: Headphones },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#030712] text-white selection:bg-cyan-500/30">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 cyber-grid opacity-[0.05]" />
        <div className="absolute inset-0 carbon-overlay opacity-[0.03]" />

        <motion.div
          animate={{ x: [-90, 110, -90], y: [-40, 55, -40] }}
          transition={{ duration: 21, repeat: Infinity, ease: 'easeInOut' }}
          className="orb left-[-10%] top-[-10%] h-[480px] w-[480px] bg-cyan-500/20"
        />
        <motion.div
          animate={{ x: [90, -90, 90], y: [40, -40, 40] }}
          transition={{ duration: 27, repeat: Infinity, ease: 'easeInOut' }}
          className="orb bottom-[-10%] right-[-10%] h-[560px] w-[560px] bg-indigo-500/20"
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030712]/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="group flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-500/30 bg-cyan-500/10 transition-all group-hover:scale-110 group-hover:neon-glow-cyan">
              <Zap size={22} className="text-cyan-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">QuickFix Network</span>
              <span className="text-xl font-display font-black tracking-tight text-white">QUICKFIX</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {['Infrastructure', 'Nodes', 'Protocols', 'Support'].map((nav) => (
              <a
                key={nav}
                href={`#${nav.toLowerCase()}`}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-cyan-400"
              >
                {nav}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="hidden text-xs font-bold uppercase tracking-widest text-slate-400 transition-colors hover:text-white sm:block"
            >
              Sign In
            </Link>
            <Link to="/register">
              <Button size="sm" variant="cyber" className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10 font-sans">
        <section className="px-6 pb-24 pt-16 lg:pb-36 lg:pt-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 inline-flex items-center gap-3 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-5 py-2"
              >
                <BadgeCheck size={16} className="text-cyan-300" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">Roadside Network, Reinvented</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
                className="text-5xl font-display font-black leading-[0.95] tracking-tight md:text-7xl lg:text-[5.2rem]"
              >
                Roadside Help
                <br />
                <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  you can trust
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.2 }}
                className="mt-8 max-w-2xl text-lg leading-8 text-slate-300"
              >
                QuickFix connects you with verified mechanics in minutes, with real-time status updates from request to resolution.
              </motion.p>

              <div className="mt-6 flex flex-wrap gap-2">
                {serviceCategories.map((category) => (
                  <span
                    key={category}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-semibold tracking-wide text-slate-300"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="mt-10 flex flex-col gap-4 sm:flex-row"
              >
                <Link to="/register">
                  <Button size="lg" variant="cyber" className="h-14 rounded-2xl px-10 text-xs font-black uppercase tracking-[0.2em]">
                    Request Help
                    <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-14 rounded-2xl border-white/20 bg-white/5 px-9 text-xs font-black uppercase tracking-[0.2em]"
                  >
                    Mechanic Sign In
                  </Button>
                </Link>
              </motion.div>

              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div key={point} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300">
                    <CheckCircle2 size={16} className="shrink-0 text-cyan-400" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="relative"
            >
              <div className="glass relative overflow-hidden rounded-[2.6rem] border border-white/15 p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-indigo-500/10" />
                <div className="relative">
                  <div className="mb-7 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300">Service Performance</p>
                      <p className="mt-2 text-2xl font-display font-bold">Live Network Snapshot</p>
                    </div>
                    <Sparkles size={20} className="text-cyan-400" />
                  </div>

                  <div className="space-y-4">
                    {stats.map((stat, index) => (
                      <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/35 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs uppercase tracking-[0.17em] text-slate-400">{stat.label}</span>
                          <span className="text-xl font-display font-bold text-white">{stat.value}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.progress}%` }}
                            transition={{ duration: 1.1, delay: index * 0.15 + 0.2 }}
                            className={`h-full bg-gradient-to-r ${stat.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 rounded-2xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-100">
                    <p className="font-semibold">Premium response protocol enabled</p>
                    <p className="mt-1 text-cyan-100/80">Your request gets routed using proximity, skill, and availability confidence.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="protocols" className="border-y border-white/5 bg-white/[0.02] px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-300">Why QuickFix</p>
              <h2 className="mt-5 text-4xl font-display font-black tracking-tight md:text-5xl">
                Built for trust, speed, and better roadside outcomes.
              </h2>
            </div>

            <motion.div
              className="grid gap-6 lg:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  className="group rounded-[2rem] border border-white/10 bg-white/[0.03] p-7 transition-all hover:border-cyan-500/35"
                >
                  <div
                    className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border bg-black/40 ${
                      feature.accent === 'cyan'
                        ? 'border-cyan-500/25 text-cyan-400'
                        : feature.accent === 'purple'
                        ? 'border-purple-500/25 text-purple-400'
                        : 'border-emerald-500/25 text-emerald-400'
                    }`}
                  >
                    <feature.icon size={24} />
                  </div>
                  <h3 className="text-2xl font-display font-bold">{feature.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-300">{feature.description}</p>
                  <div className="mt-7 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Learn More <ArrowRight size={14} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="infrastructure" className="px-6 py-24 lg:py-36">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 max-w-3xl">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-purple-300">How It Works</p>
              <h2 className="mt-5 text-4xl font-display font-black tracking-tight md:text-5xl">A cleaner experience from request to resolution.</h2>
            </div>

            <motion.div
              className="grid gap-5 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {serviceSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  variants={fadeUp}
                  className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/40 p-6"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                      <step.icon size={20} />
                    </div>
                    <span className="text-3xl font-display font-black text-white/20">0{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-display font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{step.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section id="nodes" className="border-y border-white/5 bg-black/50 px-6 py-24 lg:py-32">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="text-4xl font-display font-black tracking-tight md:text-5xl">One Platform. Three Role-Specific Workflows.</h2>
            <p className="mt-5 text-lg text-slate-300">Every stakeholder gets the right interface without losing shared visibility.</p>
          </div>

          <motion.div
            className="mx-auto max-w-7xl space-y-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
          >
            {platforms.map((node) => (
              <motion.div
                key={node.title}
                variants={fadeUp}
                className="group flex flex-col justify-between rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-7 transition-all hover:border-cyan-500/30 md:flex-row md:items-center"
              >
                <div className="flex items-center gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.12)]">
                    <node.icon size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold">{node.title}</h3>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{node.role}</p>
                  </div>
                </div>
                <p className="mt-4 max-w-md text-sm text-slate-300 md:mt-0">{node.text}</p>
                <button className="mt-4 hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-cyan-400 md:flex md:mt-0">
                  <ArrowRight size={17} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section className="px-6 py-20">
          <div className="mx-auto max-w-7xl rounded-[2rem] border border-white/10 bg-gradient-to-r from-white/[0.03] via-cyan-500/[0.08] to-white/[0.03] p-8 md:p-10">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-cyan-300">Service Standards</p>
                <h2 className="mt-4 text-3xl font-display font-black tracking-tight md:text-4xl">Designed for consistent, premium support quality.</h2>
              </div>
              <p className="max-w-md text-sm leading-7 text-slate-300">
                QuickFix enforces baseline standards for every booking so drivers get dependable help, not guesswork.
              </p>
            </div>

            <motion.div
              className="grid gap-4 md:grid-cols-3"
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {serviceStandards.map((standard) => (
                <motion.div key={standard.title} variants={fadeUp} className="rounded-2xl border border-white/10 bg-black/35 p-5">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/25 bg-cyan-500/10 text-cyan-300">
                    <standard.icon size={18} />
                  </div>
                  <h3 className="font-display text-xl font-bold">{standard.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-300">{standard.detail}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="text-4xl font-display font-black tracking-tight md:text-5xl">Frequently Asked Questions</h2>
              <p className="mt-4 text-slate-300">Quick answers before you book your first service.</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                    <button
                      onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left"
                    >
                      <span className="text-base font-semibold text-white">{faq.q}</span>
                      <ChevronDown
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-300' : 'text-slate-400'}`}
                        size={20}
                      />
                    </button>
                    <motion.div
                      initial={false}
                      animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-6 text-sm leading-7 text-slate-300">{faq.a}</p>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="support" className="bg-gradient-to-b from-transparent to-cyan-500/10 px-6 py-24 text-center lg:py-36">
          <div className="mx-auto max-w-3xl rounded-[2.3rem] border border-white/10 bg-black/45 p-10 md:p-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">Get Started Today</p>
            <h2 className="mt-5 text-5xl font-display font-black tracking-tight md:text-6xl">Need help now? We are ready.</h2>
            <p className="mx-auto mt-6 max-w-xl text-lg text-slate-300">
              Book roadside support in minutes or sign in as a mechanic and start accepting nearby requests.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" variant="cyber" className="h-14 w-full rounded-2xl px-11 text-xs font-black uppercase tracking-[0.2em] sm:w-auto">
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-14 w-full rounded-2xl border-white/20 bg-white/5 px-11 text-xs font-black uppercase tracking-[0.2em] sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 bg-black py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 px-6 md:flex-row">
          <div className="flex items-center gap-3 opacity-70">
            <Zap size={18} className="text-cyan-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em]">QuickFix Infrastructure © 2026</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <a href="#protocols" className="transition-colors hover:text-white">
              Protocols
            </a>
            <a href="#support" className="transition-colors hover:text-white">
              Support
            </a>
            <a href="#" className="transition-colors hover:text-white">
              Policy
            </a>
          </div>
        </div>
      </footer>

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
