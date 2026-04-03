import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Clock3,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
  Wrench,
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common';

const ROLE_SETTINGS = {
  user: {
    title: 'Driver Login',
    eyebrow: 'Personal Assistance',
    subtitle: 'Book help fast, track your mechanic live, and manage every service request from one place.',
    icon: User,
    iconClass: 'text-primary',
    iconShellClass: 'bg-primary/12 border-primary/20',
    accentClass: 'from-primary/35 via-primary/10 to-transparent',
    ringClass: 'ring-primary/20',
    tabActiveClass: 'bg-primary text-background shadow-[0_18px_45px_-24px_rgba(143,245,255,0.9)]',
    panelClass: 'border-primary/14 bg-primary/6',
    buttonVariant: 'primary',
    emailPlaceholder: 'name@example.com',
    passwordPlaceholder: 'Enter your password',
    helperTitle: 'What you get',
    helperPoints: [
      'Request a mechanic in a few clicks',
      'Follow bookings, ETAs, and notifications',
      'Access your dashboard instantly after login',
    ],
    registerPath: '/register',
    registerLabel: 'Create a driver account',
    loginPath: '/user/login',
  },
  mechanic: {
    title: 'Mechanic Login',
    eyebrow: 'Field Operations',
    subtitle: 'Review appointments, update progress in real time, and keep your service profile ready for dispatch.',
    icon: Wrench,
    iconClass: 'text-secondary',
    iconShellClass: 'bg-secondary/12 border-secondary/20',
    accentClass: 'from-secondary/35 via-secondary/10 to-transparent',
    ringClass: 'ring-secondary/20',
    tabActiveClass: 'bg-secondary text-white shadow-[0_18px_45px_-24px_rgba(172,137,255,0.9)]',
    panelClass: 'border-secondary/14 bg-secondary/6',
    buttonVariant: 'secondary',
    emailPlaceholder: 'mechanic@example.com',
    passwordPlaceholder: 'Enter your password',
    helperTitle: 'Built for technicians',
    helperPoints: [
      'See incoming appointments at a glance',
      'Manage profile, availability, and updates',
      'Move from dispatch to completion without friction',
    ],
    registerPath: '/register/mechanic',
    registerLabel: 'Apply as a mechanic',
    loginPath: '/mechanic/login',
  },
  admin: {
    title: 'Admin Login',
    eyebrow: 'Control Room',
    subtitle: 'Monitor platform activity, review mechanic approvals, and keep the QuickFix network running smoothly.',
    icon: ShieldCheck,
    iconClass: 'text-red-400',
    iconShellClass: 'bg-red-500/12 border-red-500/20',
    accentClass: 'from-red-500/35 via-red-500/10 to-transparent',
    ringClass: 'ring-red-500/20',
    tabActiveClass: 'bg-red-500 text-white shadow-[0_18px_45px_-24px_rgba(239,68,68,0.95)]',
    panelClass: 'border-red-500/14 bg-red-500/6',
    buttonVariant: 'danger',
    emailPlaceholder: 'admin@example.com',
    passwordPlaceholder: 'Enter your password',
    helperTitle: 'Admin controls',
    helperPoints: [
      'Review mechanic applications and approvals',
      'Keep operations visible across the platform',
      'Jump directly into the admin workspace',
    ],
    registerPath: null,
    registerLabel: null,
    loginPath: '/admin/login',
  },
};

const LOGIN_REDIRECTS = {
  admin: '/admin',
  mechanic: '/mechanic/dashboard',
  user: '/dashboard',
};

export default function LoginPage({ defaultRole = 'user' }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const safeDefaultRole = ROLE_SETTINGS[defaultRole] ? defaultRole : 'user';

  const [activeRole, setActiveRole] = useState(safeDefaultRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActiveRole(safeDefaultRole);
    setEmail('');
    setPassword('');
  }, [safeDefaultRole]);

  const currentRole = useMemo(() => ROLE_SETTINGS[activeRole], [activeRole]);
  const CurrentIcon = currentRole.icon;

  const handleRoleChange = (role) => {
    setActiveRole(role);
    setEmail('');
    setPassword('');
    navigate(ROLE_SETTINGS[role].loginPath);
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login({ email, password });
      const resolvedRole = loggedInUser?.role || activeRole;

      toast.success(`Welcome back, ${resolvedRole}.`);
      navigate(LOGIN_REDIRECTS[resolvedRole] || LOGIN_REDIRECTS.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to sign in right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-8 selection:bg-primary/20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute inset-x-0 top-0 h-[32rem] bg-gradient-to-b ${currentRole.accentClass}`} />
        <div className="absolute left-[-8rem] top-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-3rem] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute inset-0 carbon-overlay opacity-[0.03]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex flex-col justify-between rounded-[2.5rem] border border-white/8 bg-white/[0.03] p-6 shadow-[0_30px_120px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8 lg:p-10"
          >
            <div>
              <Link to="/" className="inline-flex items-center gap-3 text-white/85 transition-colors hover:text-white">
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${currentRole.iconShellClass}`}>
                  <CurrentIcon size={22} className={currentRole.iconClass} />
                </span>
                <span>
                  <span className="block text-[0.65rem] font-bold uppercase tracking-[0.35em] text-slate-400">QuickFix Access</span>
                  <span className="block font-display text-2xl font-bold tracking-tight">Sign in</span>
                </span>
              </Link>

              <div className="mt-10 max-w-xl">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.45em] text-slate-400">
                  {currentRole.eyebrow}
                </p>
                <h1 className="mt-4 text-4xl font-display font-bold leading-tight text-white sm:text-5xl">
                  {currentRole.title}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                  {currentRole.subtitle}
                </p>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {Object.entries(ROLE_SETTINGS).map(([role, config]) => {
                  const RoleIcon = config.icon;

                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className={`rounded-[1.6rem] border px-4 py-4 text-left transition-all duration-300 ${
                        activeRole === role
                          ? `${config.tabActiveClass} border-transparent`
                          : 'border-white/8 bg-white/[0.03] text-slate-300 hover:border-white/16 hover:bg-white/[0.05] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl border ${
                          activeRole === role ? 'border-black/10 bg-black/10 text-current' : config.iconShellClass
                        }`}>
                          <RoleIcon size={18} className={activeRole === role ? '' : config.iconClass} />
                        </span>
                        <span>
                          <span className="block text-sm font-semibold capitalize">{role}</span>
                          <span className={`block text-[0.68rem] uppercase tracking-[0.28em] ${
                            activeRole === role ? 'text-current/70' : 'text-slate-500'
                          }`}>
                            {config.eyebrow}
                          </span>
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={`mt-8 rounded-[2rem] border p-5 ${currentRole.panelClass}`}>
                <div className="flex items-start gap-3">
                  <Sparkles className={`mt-0.5 ${currentRole.iconClass}`} size={18} />
                  <div>
                    <p className="text-sm font-semibold text-white">{currentRole.helperTitle}</p>
                    <div className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
                      {currentRole.helperPoints.map((point) => (
                        <p key={point}>{point}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2">
                <Clock3 size={14} />
                Live dispatch tracking
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/8 px-4 py-2">
                <ShieldCheck size={14} />
                Secure role-based access
              </span>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className={`relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-surface-low/80 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-3xl sm:p-8 lg:p-10 ${currentRole.ringClass} ring-1`}
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${currentRole.accentClass}`} />

            <div className="mb-8">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.35em] text-slate-500">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-display font-bold text-white">Access your workspace</h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
                Use the account approved for this role. After login, we&apos;ll take you to the correct dashboard automatically.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Email</span>
                <div className="relative">
                  <Mail size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={currentRole.emailPlaceholder}
                    autoComplete="email"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-white/20 focus:bg-white/[0.05]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Password</span>
                <div className="relative">
                  <Lock size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder={currentRole.passwordPlaceholder}
                    autoComplete="current-password"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-4 pl-12 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-white/20 focus:bg-white/[0.05]"
                  />
                </div>
              </label>

              <div className={`rounded-[1.75rem] border border-dashed p-4 text-sm text-slate-300 ${currentRole.panelClass}`}>
                <p className="font-semibold text-white">Role selected: <span className="capitalize">{activeRole}</span></p>
                <p className="mt-1 text-slate-400">The tab shapes the experience, but your actual account role decides the final redirect after authentication.</p>
              </div>

              <Button
                type="submit"
                variant={currentRole.buttonVariant}
                size="lg"
                loading={loading}
                className="h-14 w-full rounded-[1.4rem] text-sm font-bold uppercase tracking-[0.3em]"
              >
                Sign In
                <ArrowRight size={16} />
              </Button>
            </form>

            <div className="mt-8 flex flex-col gap-3 text-sm text-slate-400">
              {currentRole.registerPath ? (
                <p>
                  Need access?{' '}
                  <Link to={currentRole.registerPath} className="font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-primary">
                    {currentRole.registerLabel}
                  </Link>
                </p>
              ) : (
                <p className="text-red-300/80">Admin access is provisioned internally by the QuickFix team.</p>
              )}
              <p>
                Want a different portal?{' '}
                <Link to="/login" className="font-semibold text-white underline decoration-white/25 underline-offset-4 transition-colors hover:text-primary">
                  Open the shared chooser
                </Link>
              </p>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}
