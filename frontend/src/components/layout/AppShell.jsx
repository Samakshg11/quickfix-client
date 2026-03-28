// src/components/layout/AppShell.jsx
import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, CalendarDays, Wrench, Bell, User,
  LogOut, ChevronLeft, ChevronRight, AlertTriangle, Settings, Users, Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../hooks';

const USER_NAV = [
  { label: 'Tactical Grid', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Service Logs', icon: CalendarDays, path: '/bookings' },
  { label: 'Personnel', icon: Users, path: '/mechanics' },
  { label: 'Emergency', icon: AlertTriangle, path: '/emergency', danger: true },
];

const MECHANIC_NAV = [
  { label: 'Command Hub', icon: LayoutDashboard, path: '/mechanic/dashboard' },
  { label: 'Assigned Events', icon: CalendarDays, path: '/mechanic/appointments' },
  { label: 'Profile Matrix', icon: User, path: '/mechanic/profile' },
];

const ADMIN_NAV = [
  { label: 'System Analytics', icon: LayoutDashboard, path: '/admin' },
  { label: 'Node Registry', icon: Users, path: '/admin/mechanics' },
];

export default function AppShell({ children }) {
  const { user, logout, isMechanic, isAdmin } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Admins see both their specific tools AND the user-level functions
  const navItems = isAdmin ? [...ADMIN_NAV, ...USER_NAV] : isMechanic ? MECHANIC_NAV : USER_NAV;

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="flex min-h-screen bg-background text-white selection:bg-primary/20 font-sans">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <motion.aside
        animate={{ width: collapsed ? 100 : 280 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="relative flex flex-col flex-shrink-0 bg-surface-low/30 backdrop-blur-3xl border-r border-white/5 z-40 overflow-hidden"
      >
        {/* Luminous accent */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />

        {/* Brand */}
        <div className="flex items-center justify-between px-6 h-24 mb-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(143,245,255,0.1)]">
              <Wrench size={20} className="text-primary" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.h1
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-display font-extrabold text-white tracking-tighter"
                >
                  Quick<span className="text-primary italic">Fix</span>
                </motion.h1>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* User Card (Small) */}
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mx-6 p-4 rounded-2xl bg-white/5 border border-white/5 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center border border-white/10 shrink-0 capitalize text-sm font-bold">
                {user?.name?.[0] || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{user?.role} node</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-2">
          <div className={`text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-4 px-3 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'Hub' : 'Tactical Controls'}
          </div>
          {navItems.map(({ label, icon: Icon, path, danger }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group relative flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300
                ${isActive
                  ? 'bg-primary/10 text-primary shadow-[inset_0_0_20px_rgba(143,245,255,0.05)]'
                  : danger
                    ? 'text-red-500 hover:bg-red-500/10'
                    : 'text-slate-500 hover:text-white hover:bg-white/5 hover:translate-x-1'}`
              }
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 w-1.5 h-6 bg-primary rounded-full -translate-x-1/2"
                    />
                  )}
                  <Icon size={20} className={`flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-primary' : ''}`} />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -5 }}>
                        {label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer Navigation */}
        <div className="px-4 py-8 space-y-2">
          <div className={`text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em] mb-4 px-3 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? 'Sys' : 'System Operations'}
          </div>

          <NavLink
            to="/notifications"
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300
              ${isActive ? 'bg-secondary/10 text-secondary' : 'text-slate-500 hover:text-white hover:bg-white/5 hover:translate-x-1'}`
            }
          >
            <div className="relative flex-shrink-0">
              <Bell size={20} className="group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-background text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-black shadow-[0_0_10px_rgba(143,245,255,0.5)]">
                  {unreadCount > 9 ? '!' : unreadCount}
                </span>
              )}
            </div>
            {!collapsed && <span>Intelligence</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-500/10 hover:translate-x-1 transition-all w-full group"
          >
            <LogOut size={20} className="flex-shrink-0 group-hover:rotate-12 transition-transform" />
            {!collapsed && <span>Terminal End</span>}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mt-6 flex items-center justify-center w-full py-4 text-slate-600 hover:text-primary transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <div className="flex items-center gap-2"><ChevronLeft size={20} /> <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Minimize</span></div>}
          </button>
        </div>
      </motion.aside>

      {/* ── Main Content Area ───────────────────────────────── */}
      <main className="flex-1 overflow-auto relative">
        {/* Global background decoration */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
