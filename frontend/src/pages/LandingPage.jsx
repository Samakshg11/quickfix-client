import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import {
    Wrench, ShieldCheck, Zap, ArrowRight,
    MapPin, Star, Users, Navigation,
    Activity, Globe, MessageSquare, ChevronRight,
    Cpu, Layers, Smartphone, Sparkles,
    BarChart3, CheckCircle2, ChevronDown, Mail,
    Terminal, Radar, Server
} from "lucide-react";
import { Button } from "../components/common";
import { useAuth } from "../context/AuthContext";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.12, delayChildren: 0.2 }
    }
};

const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } }
};

const FEATURE_CARDS = [
    { icon: Cpu, title: "Precision Diagnostics", desc: "Digital-first interfaces providing absolute clarity on your vehicle's health.", color: "primary" },
    { icon: ShieldCheck, title: "Elite Specialists", desc: "A curated roster of certified technicians vetted for master-level skill.", color: "secondary" },
    { icon: Smartphone, title: "Seamless Link", desc: "A streamlined, real-time connection between you and your personal mechanic.", color: "primary" }
];

const PROTOCOLS = [
    { step: "01", title: "Initialize Request", desc: "Define your diagnostic requirements through our high-performance portal." },
    { step: "02", title: "Specialist Sync", desc: "Our network locks onto the nearest master technician with the required skill set." },
    { step: "03", title: "Precision Overhaul", desc: "Direct on-site repair with real-time telemetry and digital service logging." }
];

const TESTIMONIALS = [
    { name: "Vikram R.", role: "Fleet Director", quote: "The QuickFix infrastructure has reduced our downtime by 40%. The efficiency is unmatched." },
    { name: "Sunita M.", role: "Tech Specialist", quote: "Joining the network changed how I reach clients. The diagnostic link is pure precision." }
];

const FAQ = [
    { q: "How are specialists vetted?", a: "Every technician undergoes a rigorous 4-step biometric and technical validation protocol." },
    { q: "Is live tracking available?", a: "Yes, our telemetry link provides real-time GPS and status updates for every service event." },
    { q: "What sectors do you cover?", a: "We provide master-level support for Engine, Electrical, and Kinetic safety systems." }
];

const STATS = [
    { label: "Vetted Specialists", value: "850+" },
    { label: "Successful Repairs", value: "12,400" },
    { label: "Platform Uptime", value: "99.9%" },
    { label: "Delivery Time", value: "12m" }
];

const SPECIALISTS = [
    { name: "Arjun S.", rating: 4.9, skill: "Engine Systems", status: "Online" },
    { name: "Priyanka K.", rating: 5.0, skill: "Diagnostic Hubs", status: "Active" },
    { name: "Rohan M.", rating: 4.8, skill: "Precision Safety", status: "Available" }
];

export default function LandingPage() {
    const { isAuthenticated, user } = useAuth();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.92]);
    const heroY = useTransform(scrollYProgress, [0, 0.8], [0, 100]);
    const smoothY = useSpring(heroY, { stiffness: 100, damping: 30 });

    const [activeTicker, setActiveTicker] = useState(0);
    const TICKER_MESSAGES = [
        "🛰️ System Sync: Specialist Arjun S. en route to Sector 4",
        "🛡️ Trust Protocol: All 850 specialists have been verified",
        "⚡ Priority Dispatch: Mobile unit active in your area",
        "🌐 Network Update: 15 new professionals registered today"
    ];

    const [openFaq, setOpenFaq] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setActiveTicker(p => (p + 1) % TICKER_MESSAGES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/20 relative">
            <div className="absolute inset-0 carbon-overlay opacity-[0.02] pointer-events-none" />

            {/* ── Background Orbs ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <motion.div animate={{ x: [0, 120, 0], y: [0, -80, 0] }} transition={{ duration: 25, repeat: Infinity }} className="orb w-[700px] h-[700px] bg-primary/5 top-[-100px] left-[-200px]" />
                <motion.div animate={{ x: [0, -100, 0], y: [0, 80, 0] }} transition={{ duration: 30, repeat: Infinity }} className="orb w-[600px] h-[600px] bg-secondary/5 bottom-[-100px] right-[-300px]" />
            </div>

            {/* ── Navigation ── */}
            <nav className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-3xl border-b border-white/5 px-10 h-20 flex items-center justify-between">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center group-hover:border-primary/40 transition-all">
                        <Wrench size={22} className="text-primary/80" />
                    </div>
                    <h1 className="text-2xl font-display font-bold text-white tracking-tight uppercase">Quick<span className="text-primary">Fix</span></h1>
                </motion.div>
                <div className="hidden md:flex items-center gap-10">
                    {["Specialists", "Protocol", "Technology", "FAQ"].map((link, idx) => (
                        <a key={idx} href={`#${link.toLowerCase()}`} className="text-xs font-semibold text-slate-500 hover:text-white transition-all relative group overflow-hidden">
                            {link}<span className="absolute bottom-0 left-0 w-full h-px bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </a>
                    ))}
                    {isAuthenticated ? (
                        <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'mechanic' ? '/mechanic/dashboard' : '/dashboard'}>
                            <Button size="sm" className="rounded-xl h-10 px-8 font-bold text-xs bg-primary/90 text-background hover:bg-primary transition-all shadow-lg shadow-primary/20">Command Center</Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-10">
                            <Link to="/login" className="text-xs font-semibold text-white/70 hover:text-primary transition-all">Login</Link>
                            <Link to="/register"><Button size="sm" className="rounded-xl h-10 px-8 font-bold text-xs bg-white text-background hover:bg-slate-200 transition-all">Join Network</Button></Link>
                        </div>
                    )}
                </div>
            </nav>

            <div className="fixed top-20 w-full z-40 bg-background/20 backdrop-blur-md border-b border-white/5 overflow-hidden h-10 flex items-center">
                <AnimatePresence mode="wait"><motion.p key={activeTicker} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="w-full text-center text-[10px] font-bold text-primary/70 uppercase tracking-[0.5em]">{TICKER_MESSAGES[activeTicker]}</motion.p></AnimatePresence>
            </div>

            {/* ── HERO ── */}
            <section ref={heroRef} className="relative pt-64 pb-32 px-10 flex flex-col items-center overflow-hidden">
                <motion.div style={{ opacity: heroOpacity, scale: heroScale, y: smoothY }} className="text-center max-w-6xl mb-24 relative z-10">
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }} className="inline-flex items-center gap-3 px-6 py-2.5 bg-primary/5 border border-primary/10 rounded-full mb-12 backdrop-blur-xl">
                        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.6em] flex items-center gap-2">Active Service Infrastructure Active</span>
                    </motion.div>
                    <h1 className="text-7xl md:text-[6.5rem] font-display font-bold text-white leading-[1.05] tracking-tight mb-10">Revolutionizing the <br /><span className="text-primary text-gradient italic">Service Network.</span></h1>
                    <p className="text-2xl md:text-3xl text-slate-400 max-w-4xl mx-auto font-medium leading-relaxed mb-16 opacity-80">Establishing a sophisticated interface between motorists and elite specialists. Professional repair, refined for the modern age.</p>
                    <div className="flex flex-col sm:flex-row gap-8 justify-center">
                        <Link to="/login"><Button size="xl" className="rounded-2xl h-16 px-14 font-bold text-sm bg-primary text-background shadow-2xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all">Enter Portal <ArrowRight className="ml-3" /></Button></Link>
                        <Link to="/register/mechanic"><Button size="xl" variant="outline" className="rounded-2xl h-16 px-14 font-bold text-sm border-white/10 text-white hover:bg-white/5 transition-all">Become Specialist</Button></Link>
                    </div>
                </motion.div>
                <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }} className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                    {STATS.map((stat, i) => (
                        <motion.div key={i} variants={item} className="bg-surface-low/30 backdrop-blur-2xl border border-white/5 p-12 rounded-[3.5rem] text-center hover:bg-surface-high/40 transition-all overflow-hidden relative shadow-sm">
                            <h4 className="text-5xl font-display font-bold text-white tracking-tight mb-2">{stat.value}</h4>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── THE PROTOCOL ── */}
            <section id="protocol" className="py-44 px-10 relative bg-surface-low/10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <p className="text-primary text-[11px] font-bold uppercase tracking-[0.7em] mb-6 italic">How it Works</p>
                        <h2 className="text-6xl font-display font-bold text-white tracking-tight leading-tight">The Diagnostic<br /><span className="text-primary italic">Protocol.</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {PROTOCOLS.map((p, i) => (
                            <motion.div key={i} whileHover={{ y: -10 }} className="p-12 bg-surface-high/20 rounded-[4.56rem] border border-white/5 relative overflow-hidden group glass">
                                <span className="text-8xl font-display font-black text-white/5 absolute -top-4 -left-4 group-hover:text-primary/10 transition-colors">{p.step}</span>
                                <div className="mb-10 w-16 h-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary shadow-xl"><CheckCircle2 size={32} /></div>
                                <h4 className="text-3xl font-bold text-white mb-6 italic">{p.title}</h4>
                                <p className="text-slate-400 leading-relaxed font-medium text-lg">{p.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TECHNOLOGY DASHBOARD ── */}
            <section id="technology" className="py-44 px-10 bg-background relative overflow-hidden">
                <div className="absolute inset-0 carbon-overlay opacity-[0.03] pointer-events-none" />
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
                    <div>
                        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}>
                            <p className="text-primary text-[11px] font-bold uppercase tracking-[0.8em] mb-8 italic">Telemetry Hub</p>
                            <h2 className="text-7xl font-display font-bold text-white tracking-tighter leading-[0.9] mb-12 italic uppercase">Industrial<br /><span className="text-primary">Intelligence.</span></h2>
                            <p className="text-2xl text-slate-400 leading-relaxed mb-20 max-w-xl opacity-80">Our proprietary diagnostic bridge establishes a high-frequency telemetry link between master technicians and the core network.</p>
                        </motion.div>
                        <div className="space-y-6 relative">
                            {FEATURE_CARDS.map((card, i) => (
                                <motion.div key={i} whileHover={{ x: 10, backgroundColor: 'rgba(143,245,255,0.02)' }} className="p-10 bg-surface-high/10 rounded-[4rem] border border-white/5 flex items-center gap-10 group transition-all glass">
                                    <div className="w-18 h-18 rounded-[2rem] bg-background border border-white/5 flex items-center justify-center text-primary/60 shrink-0 group-hover:text-primary group-hover:scale-110 transition-all"><card.icon size={32} /></div>
                                    <div>
                                        <h4 className="text-2xl font-bold text-white tracking-tight">{card.title}</h4>
                                        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 italic group-hover:text-slate-400 transition-colors">{card.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                    <div className="relative group">
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 60, repeat: Infinity, ease: 'linear' }} className="absolute inset-[-100px] border border-primary/5 rounded-full border-dashed p-20 pointer-events-none" />
                        <div className="relative aspect-square rounded-[10rem] bg-surface-low/40 border border-white/5 p-1 flex items-center justify-center shadow-3xl glass group-hover:border-primary/20 transition-all overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

                            {/* ── Holographic Intelligence Dashboard ── */}
                            <div className="absolute inset-12 bg-black/60 rounded-[8rem] border border-white/10 backdrop-blur-3xl p-16 flex flex-col justify-between overflow-hidden shadow-2xl">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-4">
                                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1, repeat: Infinity }} className="w-3 h-3 bg-primary rounded-full neon-glow-primary" />
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Node_Sync: Active</span>
                                    </div>
                                    <Terminal size={20} className="text-primary/40" />
                                </div>

                                <div className="flex-1 flex flex-col justify-center gap-12">
                                    {/* Pulse Graph */}
                                    <div className="relative h-44 w-full flex items-end gap-2 px-4">
                                        {[40, 65, 30, 85, 45, 95, 60, 40, 75, 55, 35, 80].map((h, i) => (
                                            <motion.div key={i} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} transition={{ duration: 1.5, delay: i * 0.05 + 0.5 }} className="flex-1 bg-primary/20 rounded-t-lg border-x border-primary/5 relative group">
                                                <motion.div animate={{ height: ['0%', '100%', '0%'] }} transition={{ duration: 3, repeat: Infinity, delay: i * 0.1 }} className="absolute bottom-0 w-full bg-primary/40 blur-sm rounded-t-lg" />
                                            </motion.div>
                                        ))}
                                        <div className="absolute inset-x-0 h-px bg-primary/20 bottom-0 shadow-[0_0_20px_rgba(143,245,255,0.4)]" />
                                        <div className="absolute top-0 right-4 text-[9px] font-bold text-primary/40 uppercase tracking-[0.3em]">Telemetry_Feed</div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Network_Stability</div>
                                            <div className="text-2xl font-display font-bold text-white">99.98%</div>
                                        </div>
                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div initial={{ x: '-100%' }} whileInView={{ x: '0%' }} transition={{ duration: 2, ease: 'circOut' }} className="h-full w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20 shadow-[0_0_30px_rgba(143,245,255,0.5)]" />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-center">
                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Latency</span>
                                        <span className="text-lg font-bold text-primary">05ms</span>
                                    </div>
                                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 flex flex-col justify-center">
                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Nodes</span>
                                        <span className="text-lg font-bold text-primary">1.2K</span>
                                    </div>
                                </div>

                                {/* Tactical Overlay */}
                                <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                                    <Radar size={120} className="text-primary animate-pulse" />
                                </div>
                            </div>

                            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(143,245,255,0.1),transparent_70%)]" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="py-44 px-10 relative bg-background">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 lg:items-center">
                    <div className="lg:w-1/3"><h2 className="text-6xl font-display font-bold text-white tracking-tighter italic leading-tight">Industry<br /><span className="text-primary">Trusted.</span></h2><p className="text-xl text-slate-500 mt-10 font-medium leading-relaxed">Leading automotive fleet managers and independent master technicians rely on our synchronized service infrastructure.</p></div>
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10">
                        {TESTIMONIALS.map((t, i) => (
                            <motion.div key={i} whileHover={{ y: -10 }} className="p-14 bg-white/5 rounded-[5rem] border border-white/5 relative glass flex flex-col justify-between group overflow-hidden">
                                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity"><MessageSquare size={40} className="text-primary" /></div>
                                <p className="text-2xl text-white font-medium italic mb-16 leading-relaxed">"{t.quote}"</p>
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-xl"><Users size={24} /></div>
                                    <div className="text-[11px] font-black uppercase tracking-[0.3em]"><div>{t.name}</div><div className="text-primary/60 mt-1.5">{t.role}</div></div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section id="faq" className="py-44 px-10 relative bg-surface-low/20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-32">
                        <p className="text-primary text-[10px] font-bold uppercase tracking-[0.8em] mb-6 italic">Support Hub</p>
                        <h2 className="text-6xl font-display font-bold text-white tracking-tighter italic uppercase">Synchronized<br />Knowledge.</h2>
                    </div>
                    <div className="space-y-6">
                        {FAQ.map((f, i) => (
                            <div key={i} className="bg-surface-high/20 rounded-[3.5rem] border border-white/5 overflow-hidden transition-all hover:border-white/10 glass">
                                <button onClick={() => setOpenFaq(i)} className="w-full p-12 flex justify-between items-center text-left group">
                                    <span className="text-xl font-bold text-white italic transition-colors group-hover:text-primary leading-tight">{f.q}</span>
                                    <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 transition-all ${openFaq === i ? 'bg-primary/10 text-primary rotate-180' : ''}`}><ChevronDown size={20} /></div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-12 pb-12 overflow-hidden"><p className="text-lg text-slate-400 font-medium leading-relaxed max-w-2xl">{f.a}</p></motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── ENGAGEMENT ── */}
            <section className="py-44 px-10 relative overflow-hidden">
                <div className="max-w-7xl mx-auto p-32 bg-primary rounded-[6rem] relative overflow-hidden flex flex-col items-center text-center shadow-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/40 blur-2xl" />
                    <div className="absolute inset-0 carbon-overlay opacity-[0.05]" />
                    <Server className="text-background/40 mb-12 relative z-10" size={100} />
                    <h2 className="text-7xl md:text-8xl font-display font-black text-background mb-10 tracking-tighter uppercase italic leading-none relative z-10">Access the<br />Network.</h2>
                    <p className="text-background/90 text-2xl md:text-3xl font-medium max-w-3xl mb-20 relative z-10">Join 12,000+ elite professionals and clients in the next generation of industrial service infrastructure.</p>
                    <div className="flex w-full max-w-2xl gap-6 bg-white/30 p-3 rounded-[3rem] backdrop-blur-3xl border border-white/30 relative z-10 shadow-2xl">
                        <input type="text" placeholder="Enter Registration Email..." className="flex-1 bg-transparent border-none px-10 outline-none text-background font-bold text-lg placeholder:text-background/40" />
                        <Button className="rounded-[2rem] h-20 px-16 bg-background text-white font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">Submit_Link</Button>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="py-32 px-10 border-t border-white/5 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-24">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                            <Wrench size={32} className="text-primary/80" />
                            <h4 className="text-3xl font-display font-bold text-white tracking-tight italic uppercase">Quick<span className="text-primary">Fix</span>_Hub</h4>
                        </div>
                        <p className="text-slate-600 text-xs font-bold uppercase tracking-[0.5em] italic mb-4">© 2026 Professional Service Hub • Enterprise_Architecture_v3.0</p>
                        <p className="text-slate-800 text-[11px] font-bold uppercase tracking-[0.3em] font-medium tracking-widest">Authorized Portal End — Satellite_Sync_Stable</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-16 text-[11px] font-bold uppercase tracking-[0.5em] text-slate-500">
                        {["System_Protocol", "Technical_Docs", "Network_Policy", "Security_API"].map((l, i) => <a key={i} href="#" className="hover:text-primary transition-all relative group">{l}</a>)}
                    </div>
                </div>
            </footer>
        </div>
    );
}
