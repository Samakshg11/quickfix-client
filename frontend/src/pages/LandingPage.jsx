// src/pages/LandingPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, Shield, Zap, Clock, Star, MapPin, ChevronRight, Check } from 'lucide-react';
import { Button } from '../components/common';

export default function LandingPage() {
    const features = [
        { title: 'Hyper-Local Logistics', desc: 'Our proprietary routing algorithm ensures a technician arrives at your precise location within minutes, not hours.', icon: MapPin, color: 'text-primary' },
        { title: 'Advanced Diagnostics', desc: 'Real-time telemetry analysis before we even arrive. We know the issue before the hood opens.', icon: Zap, color: 'text-secondary' },
        { title: 'Roadside Assist', desc: '24/7 global support network. No matter where the road takes you, QuickFix is already there.', icon: Shield, color: 'text-tertiary' },
        { title: 'Concierge Grade', desc: 'A dedicated service manager for your entire fleet. Personalization at every touchpoint.', icon: Wrench, color: 'text-amber-400' },
    ];

    return (
        <div className="bg-background text-white min-h-screen selection:bg-primary/30 font-sans">
            {/* ── Navbar ────────────────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-2xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-all">
                            <Wrench size={22} className="text-primary" />
                        </div>
                        <span className="text-2xl font-display font-bold tracking-tight">Quick<span className="text-primary">Fix</span></span>
                    </Link>
                    <div className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-400 transition-colors">
                        <a href="#features" className="hover:text-white">Services</a>
                        <a href="#about" className="hover:text-white">Experience</a>
                        <a href="#membership" className="hover:text-white">Membership</a>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors pr-2">Sign In</Link>
                        <Link to="/register">
                            <Button variant="primary" size="md" className="rounded-full px-6">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ──────────────────────────────────────── */}
            <section className="relative pt-40 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[800px] bg-primary/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px]" />

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-8">
                            <Star size={14} /> Redefining the Standard
                        </span>
                        <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter mb-8 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
                            Automotive Care, <br />
                            <span className="text-white italic">Redefined.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed mb-12">
                            Every detail of our logistics and diagnostic engine is tuned for the ultra-premium driver. Precision engineering meets a human touch.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register">
                                <Button size="lg" className="rounded-full px-12 h-16 text-lg font-bold group">
                                    Synchronize Now <ChevronRight className="group-hover:translate-x-1 transition-transform ml-2" />
                                </Button>
                            </Link>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://i.pravatar.cc/100?u=user${i}`} className="w-12 h-12 rounded-full border-2 border-background ring-2 ring-primary/10" />
                                ))}
                                <div className="w-12 h-12 rounded-full bg-surface-high border-2 border-background flex items-center justify-center text-xs font-bold text-primary">
                                    12k+
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Joined by Platinum Members</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Feature Grid ──────────────────────────────────────── */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {features.map((f, idx) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group p-8 rounded-3xl bg-surface-low border border-white/5 hover:border-primary/20 hover:bg-surface-high transition-all"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-surface-high flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${f.color}`}>
                                    <f.icon size={28} />
                                </div>
                                <h3 className="text-xl font-display font-bold mb-4">{f.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Detailed Experience Section ────────────────────────── */}
            <section id="about" className="py-32 px-6">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-8">
                            Precision Engineering. <br />
                            <span className="text-secondary italic">Human Touch.</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                { label: 'Real-time Synchronized Diagnostics', text: 'Telemetry data pulses from your vehicle directly to our technicians before they arrive.' },
                                { label: 'Hyper-Local Arrival Architecture', text: 'Proprietary node-based logistics ensure average arrival times of under 18 minutes.' },
                                { label: 'Kinetic UI Experience', text: 'Track every move on a cinematic map interface optimized for zero-latency interactions.' }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center shrink-0 mt-1">
                                        <Check size={14} className="text-secondary" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">{item.label}</h4>
                                        <p className="text-slate-400 text-sm">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 group">
                            <img
                                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=2000"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                alt="Modern Garage"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
                        </div>
                        {/* Floating UI Element */}
                        <div className="absolute -bottom-10 -left-10 p-6 rounded-2xl bg-surface-high/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-float">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <Zap size={20} className="text-green-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Diagnosis Complete</p>
                                    <p className="text-sm font-bold">ECM Pulse detected</p>
                                </div>
                            </div>
                            <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div className="w-3/4 h-full bg-primary" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA Membership ────────────────────────────────────── */}
            <section id="membership" className="py-24 px-6">
                <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-br from-primary/20 via-secondary/10 to-tertiary/5 border border-white/10 p-16 text-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-8 italic">Ready to Synchronize?</h2>
                        <p className="text-slate-300 max-w-xl mx-auto mb-12 h-auto text-lg">
                            The future of automotive care is waiting in your pocket. Join the elite network of members today.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register">
                                <Button variant="primary" size="lg" className="rounded-2xl px-12 h-16 h-auto font-bold w-full sm:w-auto">Become a Member</Button>
                            </Link>
                            <Link to="/register/mechanic">
                                <Button variant="outline" size="lg" className="rounded-2xl px-12 h-16 h-auto font-bold w-full sm:w-auto text-white border-white/20 hover:bg-white/5">I am a Technician</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ────────────────────────────────────────────── */}
            <footer className="py-20 px-6 border-t border-white/5">
                <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                    <div className="col-span-2 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 mb-6">
                            <Wrench size={22} className="text-primary" />
                            <span className="text-2xl font-display font-bold tracking-tight">Quick<span className="text-primary">Fix</span></span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
                            Redefining the standard of luxury automotive maintenance for the digital age.
                        </p>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-slate-300">Solutions</h5>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Diagnostics</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Roadside</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Concierge</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-slate-300">Company</h5>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Partners</a></li>
                        </ul>
                    </div>
                    <div>
                        <h5 className="font-bold mb-6 text-slate-300">Legal</h5>
                        <ul className="space-y-4 text-sm text-slate-500">
                            <li><a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto text-center mt-20 pt-8 border-t border-white/5 text-slate-600 text-xs">
                    © {new Date().getFullYear()} QuickFix Hyperlocal Service. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
