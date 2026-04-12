import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gauge,
  MapPin,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Wrench,
} from 'lucide-react';

import { Button } from '../components/common';

const stats = [
  { label: 'Verified specialists', value: '850+' },
  { label: 'Average dispatch', value: '12m' },
  { label: 'Service success', value: '99.2%' },
  { label: 'Live updates', value: '24/7' },
];

const featureCards = [
  {
    icon: ShieldCheck,
    title: 'Approval-first network',
    description: 'Mechanics join through a dedicated application flow and go live only after admin approval.',
  },
  {
    icon: MapPin,
    title: 'Real-time visibility',
    description: 'Users can follow status changes and active movement instead of waiting without context.',
  },
  {
    icon: PhoneCall,
    title: 'Emergency-ready dispatch',
    description: 'Urgent requests move quickly with location-aware matching to nearby available mechanics.',
  },
];

const workflow = [
  {
    step: '01',
    title: 'Sign up or log in',
    description: 'Users enter through authentication first. Mechanics use a separate registration flow.',
  },
  {
    step: '02',
    title: 'Request assistance',
    description: 'Book a mechanic or send an emergency request with location and issue details.',
  },
  {
    step: '03',
    title: 'Track the service live',
    description: 'Bookings, notifications, and location updates keep both sides aligned until completion.',
  },
];

const roleCards = [
  {
    title: 'Driver experience',
    body: 'Search nearby mechanics, place requests fast, and follow service progress from one clean flow.',
  },
  {
    title: 'Mechanic workspace',
    body: 'Manage appointments, update movement, and operate from a dashboard built for active jobs.',
  },
  {
    title: 'Admin control',
    body: 'Approve mechanics, review platform activity, and keep the network organized and trustworthy.',
  },
];

const testimonials = [
  {
    quote: 'It feels like a proper service platform now, not just a collection of pages stitched together.',
    name: 'Aarav Mehta',
    role: 'Fleet operations',
  },
  {
    quote: 'The strongest part is the visibility. Customers know what is happening instead of guessing.',
    name: 'Naina Kapoor',
    role: 'Mobility partnerships',
  },
];

const faqs = [
  {
    q: 'Can users open the dashboard directly from the landing page?',
    a: 'No. The intended flow starts with login or signup. Users reach their dashboard only after authenticating.',
  },
  {
    q: 'How do mechanics join?',
    a: 'Mechanics apply through the mechanic registration path and become active only after admin approval.',
  },
  {
    q: 'Is live tracking part of the product?',
    a: 'Yes. The platform supports booking updates, notifications, and live movement visibility during active requests.',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

function SectionIntro({ tag, title, description, centered = false }) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-2xl'}>
      <div className={`inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300 ${centered ? 'justify-center' : ''}`}>
        <Sparkles size={14} className="text-primary" />
        {tag}
      </div>
      <h2 className="mt-5 text-4xl font-display font-bold leading-tight text-white md:text-5xl">{title}</h2>
      <p className="mt-5 text-base leading-7 text-slate-400 md:text-lg">{description}</p>
    </div>
  );
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);

  const liveSteps = useMemo(
    () => [
      { label: 'Customer request created', tone: 'primary' },
      { label: 'Mechanic assigned nearby', tone: 'secondary' },
      { label: 'ETA and tracking enabled', tone: 'tertiary' },
    ],
    []
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-white">
      <div className="pointer-events-none absolute inset-0 carbon-overlay opacity-[0.025]" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 80, 0], y: [0, -40, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-[-10rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-primary/10 blur-[110px]"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-[-10rem] top-[8rem] h-[28rem] w-[28rem] rounded-full bg-secondary/10 blur-[110px]"
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/8 bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
              <Wrench size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-slate-500">QuickFix Network</p>
              <p className="text-xl font-display font-bold tracking-tight text-white">QuickFix</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-semibold text-slate-400 transition-colors hover:text-white">Features</a>
            <a href="#workflow" className="text-sm font-semibold text-slate-400 transition-colors hover:text-white">Workflow</a>
            <a href="#roles" className="text-sm font-semibold text-slate-400 transition-colors hover:text-white">Roles</a>
            <a href="#faq" className="text-sm font-semibold text-slate-400 transition-colors hover:text-white">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-semibold text-slate-300 transition-colors hover:text-white md:block">
              Log in
            </Link>
            <Link to="/register">
              <Button size="sm" className="rounded-xl px-5">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative px-5 pb-20 pt-14 md:px-8 md:pb-28 md:pt-20">
          <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
            <motion.div initial="hidden" animate="show" variants={container} className="max-w-3xl">
              <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-300">
                <Sparkles size={14} className="text-primary" />
                Modern roadside assistance platform
              </motion.div>

              <motion.h1 variants={item} className="mt-7 text-5xl font-display font-bold leading-[0.94] tracking-tight text-white sm:text-6xl lg:text-[5.2rem]">
                Premium roadside support, designed with cleaner operations and stronger trust.
              </motion.h1>

              <motion.p variants={item} className="mt-7 max-w-2xl text-lg leading-8 text-slate-400 md:text-xl">
                QuickFix connects customers, mechanics, and admins through a polished workflow for booking, emergency dispatch, approvals, notifications, and live tracking.
              </motion.p>

              <motion.div variants={item} className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <Link to="/register">
                  <Button size="lg" className="h-14 rounded-2xl px-8 shadow-[0_18px_50px_-24px_rgba(143,245,255,0.65)]">
                    Sign up as user
                    <ArrowRight size={18} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-14 rounded-2xl border-white/15 bg-white/5 px-8">
                    Log in
                  </Button>
                </Link>
                <Link to="/register/mechanic">
                  <Button variant="outline" size="lg" className="h-14 rounded-2xl border-white/15 bg-transparent px-8">
                    Apply as mechanic
                  </Button>
                </Link>
              </motion.div>

              <motion.p variants={item} className="mt-5 text-sm text-slate-500">
                Authentication comes first. Dashboards open only after the correct user or mechanic flow is completed.
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.15, ease: 'easeOut' }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/15 via-transparent to-secondary/15 blur-3xl" />

              <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-5 shadow-[0_35px_120px_rgba(0,0,0,0.38)] backdrop-blur-2xl">
                <div className="rounded-[2rem] border border-white/10 bg-background/70 p-5">
                  <div className="flex items-center justify-between border-b border-white/8 pb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-slate-500">Service layer</p>
                      <p className="mt-2 text-lg font-display font-bold text-white">Live Dispatch Surface</p>
                    </div>
                    <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-300">
                      Active
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4">
                    <div className="grid gap-4 sm:grid-cols-[1.05fr_0.95fr]">
                      <div className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Request status</p>
                            <p className="mt-3 text-xl font-display font-bold text-white">Mechanic confirmed</p>
                            <p className="mt-2 text-sm leading-6 text-slate-400">Battery support dispatched with booking, ETA, and status updates active.</p>
                          </div>
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                            <Gauge size={20} />
                          </div>
                        </div>

                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/6">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '91%' }}
                            transition={{ duration: 1.15, delay: 0.25 }}
                            className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-secondary"
                          />
                        </div>
                      </div>

                      <div className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Network signal</p>
                        <p className="mt-3 text-3xl font-display font-bold text-white">31</p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">Approved mechanics available in nearby range for active matching.</p>
                      </div>
                    </div>

                    <div className="rounded-[1.6rem] border border-white/8 bg-white/4 p-5">
                      <div className="flex items-center gap-3">
                        <CalendarDays size={18} className="text-primary" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">Booking progression</p>
                      </div>
                      <div className="mt-5 grid gap-3">
                        {liveSteps.map((step, index) => (
                          <div key={step.label} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-background/50 px-4 py-3">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${
                                step.tone === 'secondary'
                                  ? 'bg-secondary'
                                  : step.tone === 'tertiary'
                                    ? 'bg-tertiary'
                                    : 'bg-primary'
                              }`}
                            />
                            <span className="text-sm font-medium text-slate-200">{step.label}</span>
                            <span className="ml-auto text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                              0{index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[1.6rem] border border-primary/15 bg-primary/8 p-5">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 size={18} className="mt-0.5 text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-white">Correct access flow</p>
                          <p className="mt-2 text-sm leading-6 text-slate-300">
                            The landing page leads users to login, signup, or mechanic application first. Dashboard access comes after authentication.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto mt-12 grid max-w-7xl gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={item}
                className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 text-left backdrop-blur-xl"
              >
                <p className="text-3xl font-display font-bold text-white">{stat.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="features" className="border-t border-white/8 px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              tag="Core advantages"
              title="A stronger visual system, without losing the original energy."
              description="This version keeps the cinematic direction of the earlier design but tightens the spacing, card language, and section structure so it feels more product-ready."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {featureCards.map(({ icon: Icon, title, description }) => (
                <motion.div
                  key={title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={item}
                  className="rounded-[2.1rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-7 backdrop-blur-xl"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-6 text-2xl font-display font-bold text-white">{title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">{description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="workflow" className="border-y border-white/8 bg-white/[0.03] px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              tag="Workflow"
              title="The entry logic is now explicit and visually clear."
              description="This part fixes the confusion directly: authentication first, then booking and role-specific dashboard access afterwards."
            />

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {workflow.map((step) => (
                <motion.div
                  key={step.step}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={item}
                  className="rounded-[2rem] border border-white/10 bg-background/70 p-7"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-primary">{step.step}</p>
                  <h3 className="mt-5 text-2xl font-display font-bold text-white">{step.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="roles" className="px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              tag="Role surfaces"
              title="One product, three clear operating perspectives."
              description="Users, mechanics, and admins each have a specific role in the system, so the landing page now explains those surfaces without flattening them together."
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-3">
              {roleCards.map((card) => (
                <motion.div
                  key={card.title}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={item}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
                >
                  <h3 className="text-2xl font-display font-bold text-white">{card.title}</h3>
                  <p className="mt-4 text-base leading-7 text-slate-400">{card.body}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <SectionIntro
              tag="Proof"
              title="Sharper testimonial layout, calmer tone."
              description="The proof section is still high-end visually, but the copy is restrained enough to feel believable."
              centered
            />

            <div className="mt-12 grid gap-5 lg:grid-cols-2">
              {testimonials.map((testimonial) => (
                <motion.blockquote
                  key={testimonial.name}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={item}
                  className="rounded-[2.2rem] border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <MessageSquare size={20} />
                  </div>
                  <p className="mt-6 text-xl leading-8 text-white">“{testimonial.quote}”</p>
                  <div className="mt-8">
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-slate-500">{testimonial.role}</p>
                  </div>
                </motion.blockquote>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="border-t border-white/8 px-5 py-20 md:px-8">
          <div className="mx-auto max-w-4xl">
            <SectionIntro
              tag="FAQ"
              title="The UI is cinematic again, but the product logic stays strict."
              description="These answers reinforce the intended flow so the page looks premium without drifting away from how the app should actually work."
              centered
            />

            <div className="mt-12 space-y-4">
              {faqs.map((faq, index) => (
                <div key={faq.q} className="overflow-hidden rounded-[1.9rem] border border-white/10 bg-white/5">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-lg font-semibold text-white">{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-base leading-7 text-slate-400">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-20 pt-8 md:px-8 md:pb-24">
          <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(143,245,255,0.2),rgba(255,255,255,0.05),rgba(172,137,255,0.16))] p-8 shadow-[0_35px_120px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-slate-100/80">Start with the right entry</p>
                <h2 className="mt-4 text-4xl font-display font-bold leading-tight text-white md:text-5xl">
                  Sign up or log in first. Mechanic access still begins with application and approval.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-200/80 md:text-lg">
                  The flow stays correct while the UI feels sharper: users authenticate first, mechanics apply separately, and dashboard access comes only after that.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link to="/register">
                  <Button size="lg" className="h-14 min-w-[220px] rounded-2xl bg-white text-background hover:bg-slate-100">
                    Create user account
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-14 min-w-[220px] rounded-2xl border-white/20 bg-background/20">
                    Log in
                  </Button>
                </Link>
                <Link to="/register/mechanic">
                  <Button variant="outline" size="lg" className="h-14 min-w-[220px] rounded-2xl border-white/20 bg-transparent">
                    Mechanic application
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/8 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-display font-bold text-white">QuickFix</p>
            <p className="mt-2 text-sm text-slate-500">Roadside assistance with cleaner structure, stronger trust signals, and a tighter first impression.</p>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-slate-400">
            <a href="#features" className="transition-colors hover:text-white">Features</a>
            <a href="#workflow" className="transition-colors hover:text-white">Workflow</a>
            <a href="#roles" className="transition-colors hover:text-white">Roles</a>
            <a href="#faq" className="transition-colors hover:text-white">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
