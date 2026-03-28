import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
    Wrench, ShieldCheck, Zap, ArrowRight,
    MapPin, Star, Users, Phone, Navigation,
    Activity, Globe, Shield, MessageSquare, ChevronRight
} from "lucide-react";
import { Button } from "../components/common";
import { useAuth } from "../context/AuthContext";

const FEATURE_CARDS = [
    { icon: Navigation, title: "Precision Tracking", desc: "Real-time satellite telemetry for every strategic unit.", color: "primary" },
    { icon: Shield, title: "Grid Security", desc: "Every technician is a vetted node on our secure network.", color: "secondary" },
    { icon: Zap, title: "Instant Link", desc: "Establish a direct line to elite specialists in seconds.", color: "red-500" }
];

const STATS = [
    { label: "Active Nodes", value: "2.4K+" },
    { label: "Tactical Units", value: "850+" },
    { label: "Sync Successful", value: "99.9%" },
    { label: "Avg Response", value: "14m" }
];

const TECH_NODES = [
    { name: "Unit-042 (Sarah)", rating: 4.9, skill: "Engine Matrix", status: "Online" },
    { name: "Unit-115 (Marc)", rating: 5.0, skill: "Electrical Hub", status: "In_Transit" },
    { name: "Unit-098 (Alex)", rating: 4.8, skill: "Armor/Brakes", status: "Searching" }
];

export default function LandingPage() {
    const { isAuthenticated, user } = useAuth();
    const { scrollYProgress } = useScroll();
    const mapOpacity = useTransform(scrollYProgress, [0, 0.4], [0.1, 1]);
    const mapScale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1]);

    const [activeTicker, setActiveTicker] = useState(0);
    const TICKER_MESSAGES = [
        "🛰️ SATELLITE LINK ESTABLISHED: 4 NODES NEAR YOU",
        "🛡️ SECURITY UPDATE: ALL 850+ UNITS VETTED",
        "⚡ EMERGENCY PROTOCOL: ALPHA UNIT ATTACHED TO BOOKING #0934",
        "🌐 GLOBAL GRID: 15 NEW SPECIALISTS SYNCED IN 1HR"
    ];

    useEffect(() => {
        const timer = setInterval(() => setActiveTicker(p => (p + 1) % TICKER_MESSAGES.length), 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30">

            {/* ── High-Security Header ── */}
            <nav className="fixed top-0 w-full z-50 bg-background/50 backdrop-blur-3xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-[0_0_20px_rgba(143,245,255,0.1)]">
                        <Wrench size={22} className="text-primary group-hover:rotate-12 transition-transform" />
                    </div>
                    <h1 className="text-2xl font-display font-black text-white tracking-tighter italic">
                        QUICK<span className="text-primary">FIX</span>.
                    </h1>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">Tactical_Features</a>
                    <a href="#hub" className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-white transition-colors">Global_Hub</a>
                    {isAuthenticated ? (
                        <Link to={user?.role === 'admin' ? '/admin' : user?.role === 'mechanic' ? '/mechanic/dashboard' : '/dashboard'}>
                            <Button size="sm" className="rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest bg-primary text-background">Command_Center</Button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <Button size="sm" variant="outline" className="rounded-xl h-10 px-6 font-black text-[10px] uppercase tracking-widest border-white/10 text-white hover:bg-white/5">Access_Link</Button>
                        </Link>
                    )}
                </div>
            </nav>

            {/* ── Cinematic Ticker ── */}
            <div className="fixed top-20 w-full z-40 bg-primary/5 border-b border-primary/10 overflow-hidden h-10 flex items-center">
                <AnimatePresence mode="wait">
                    <motion.p
                        key={activeTicker}
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                        className="w-full text-center text-[9px] font-black text-primary/80 uppercase tracking-[0.5em]"
                    >
                        {TICKER_MESSAGES[activeTicker]}
                    </motion.p>
                </AnimatePresence>
            </div>

            {/* ── HERO HUB ── */}
            <section className="relative pt-44 pb-32 px-8 flex flex-col items-center">
                {/* Animated Glow Background */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] -z-10 animate-pulse" />

                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-5xl mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full mb-8">
                        <span className="w-2 h-2 bg-primary rounded-full animate-ping" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Grid Online • 854 Nodes Active</span>
                    </div>
                    <h1 className="text-7xl md:text-9xl font-display font-black text-white tracking-tighter mb-8 italic">
                        THE_MECHANIC_GRID.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed mb-10">
                        Elite automotive specialists on-demand. establish a secure link to certified technicians in minutes.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link to="/login">
                            <Button size="xl" className="rounded-3xl h-20 px-12 font-black text-[14px] uppercase tracking-[0.3em] bg-primary text-background shadow-2xl shadow-primary/20 group">
                                Initialize First Link <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/register/mechanic">
                            <Button size="xl" variant="outline" className="rounded-3xl h-20 px-12 font-black text-[14px] uppercase tracking-[0.3em] border-white/10 text-white hover:bg-white/5">
                                Register Tactical Unit
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Interactive Hub Visual */}
                <motion.div
                    style={{ opacity: mapOpacity, scale: mapScale }}
                    className="w-full max-w-6xl aspect-[21/9] bg-surface-low border border-white/5 rounded-[4rem] p-12 relative overflow-hidden group shadow-2xl"
                >
                    <div className="absolute inset-0 bg-grid-white/[0.02]" />
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -mr-1/2" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-1 italic">Real-time Visualization</p>
                                <h2 className="text-4xl font-display font-black text-white tracking-tighter">GLOBAL_NODE_REGISTRY</h2>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-background border border-white/5 p-4 rounded-3xl flex items-center gap-4">
                                    <Activity className="text-primary animate-pulse" size={20} />
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Signal</p>
                                        <p className="text-xs font-black text-white uppercase italic">Ultra_Low_Latency</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                            {TECH_NODES.map((node, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] hover:bg-white/10 transition-colors group/item">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-background border border-white/5 flex items-center justify-center">
                                            <Wrench size={18} className="text-primary" />
                                        </div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${node.status === 'Online' ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-500'}`}>
                                            {node.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-black text-white tracking-tight uppercase italic">{node.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 italic">{node.skill}</p>
                                    <div className="flex items-center gap-2 text-primary">
                                        <Star size={12} fill="currentColor" />
                                        <span className="text-xs font-black italic">{node.rating} Clearance</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── COLLABORATIVE HUB ── */}
            <section id="hub" className="py-32 px-8 bg-surface-low/30 relative">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4">The Collaboration Net</p>
                        <h2 className="text-6xl font-display font-black text-white tracking-tighter mb-8 italic italic">SYNC WITH THE_GRID.</h2>
                        <p className="text-slate-400 text-lg leading-relaxed mb-12">
                            QuickFix is more than a service, it's a global network of specialized tactical units. from roadside emergencies to high-tech diagnostics, you are connected.
                        </p>

                        <div className="grid grid-cols-2 gap-8 mb-12">
                            {STATS.map((stat, i) => (
                                <div key={i}>
                                    <h4 className="text-4xl font-display font-black text-white tracking-tighter mb-1 italic uppercase">{stat.value}</h4>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[.3em] italic">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <Link to="/register">
                            <Button className="h-16 px-8 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] bg-white text-background flex items-center gap-3">
                                Join the Node Network <ChevronRight size={16} />
                            </Button>
                        </Link>
                    </div>

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-[80px] group-hover:bg-primary/30 transition-all" />
                        <div className="relative bg-surface-high border border-white/5 p-8 rounded-[3.5rem] overflow-hidden">
                            <div className="flex flex-col gap-4">
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex gap-6 items-center translate-x-12 hover:translate-x-0 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Users size={24} /></div>
                                    <div>
                                        <p className="text-sm font-black text-white italic">PEER_TO_PEER_LINKS</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">Instant Technical Handshake</p>
                                    </div>
                                </div>
                                <div className="bg-white/10 p-6 rounded-3xl border border-white/10 flex gap-6 items-center shadow-2xl relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary"><MessageSquare size={24} /></div>
                                    <div>
                                        <p className="text-sm font-black text-white italic">TACTICAL_CHAT_FEED</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">Real-time collaboration node</p>
                                    </div>
                                </div>
                                <div className="bg-white/5 p-6 rounded-3xl border border-white/5 flex gap-6 items-center -translate-x-12 hover:translate-x-0 transition-transform">
                                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500"><Globe size={24} /></div>
                                    <div>
                                        <p className="text-sm font-black text-white italic">NEURAL_MAP_SEARCH</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic leading-none">Multi-node discovery system</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TACTICAL FEATURES ── */}
            <section id="features" className="py-32 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mb-4 italic">The Technical Arsenal</p>
                        <h2 className="text-6xl font-display font-black text-white tracking-tighter italic">DESIGNED FOR SPEED.</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {FEATURE_CARDS.map((card, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -15 }}
                                className="bg-surface-low border border-white/5 p-10 rounded-[3.5rem] transition-all group hover:bg-white/5"
                            >
                                <div className={`w-16 h-16 bg-${card.color}/10 rounded-2xl flex items-center justify-center text-${card.color} mb-8 shadow-2xl`}>
                                    <card.icon size={30} />
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tighter mb-4 italic uppercase">{card.title}</h3>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed uppercase tracking-widest">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER GRID ── */}
            <footer className="py-20 px-8 border-t border-white/5 bg-surface-low/10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div>
                        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] italic">© 2026 QUICKFIX_GRID_SYSTEMS</p>
                        <p className="text-slate-700 text-[9px] font-black uppercase tracking-[0.3em] mt-2 italic italic italic italic">Authorized Terminal End — [v2.4.0_KINETIC_ETHER]</p>
                    </div>
                    <div className="flex gap-12 font-black text-[10px] uppercase tracking-[0.3em]">
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Tactical_Terms</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Privacy_Protocol</a>
                        <a href="#" className="text-slate-500 hover:text-white transition-colors">Registry_Docs</a>
                    </div>
                </div>
            </footer>

        </div>
    );
}
