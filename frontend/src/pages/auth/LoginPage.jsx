// src/pages/auth/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, ShieldCheck, User, Wrench, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common';
import toast from 'react-hot-toast';

const ROLE_SETTINGS = {
  user: {
    title: 'User Portal',
    placeholder: 'user@quickfix.grid',
    color: 'primary',
    icon: User,
    label: 'Standard Grid Node'
  },
  mechanic: {
    title: 'Technician Hub',
    placeholder: 'mechanic_unit@quickfix.grid',
    color: 'secondary',
    icon: Wrench,
    label: 'Authorized Tactical Unit'
  },
  admin: {
    title: 'Command Center',
    placeholder: 'samakshgarg2005@gmail.com', // Exclusive placeholder
    color: 'red-500',
    icon: ShieldCheck,
    label: 'High-Level Administrative Authority'
  }
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeRole, setActiveRole] = useState('user'); // Default
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Security keys required.');

    setLoading(true);
    try {
      await login({ email, password });
      toast.success(`Access Granted: ${activeRole.toUpperCase()}_TOKEN_VALID`);

      // Intelligent Redirect
      if (activeRole === 'admin') navigate('/admin');
      else if (activeRole === 'mechanic') navigate('/mechanic');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authorization failed.');
    } finally {
      setLoading(false);
    }
  };

  const currentRole = ROLE_SETTINGS[activeRole];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-primary/30">

      {/* ── Cinematic Background ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-0 left-0 w-[600px] h-[600px] bg-${currentRole.color}/5 rounded-full blur-[150px] transition-colors duration-1000`} />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-secondary/5 rounded-full blur-[180px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">

        {/* ── Role Switcher ── */}
        <div className="flex bg-surface-low border border-white/5 p-1.5 rounded-[2rem] gap-2 mb-10 shadow-2xl">
          {Object.keys(ROLE_SETTINGS).map((role) => (
            <button
              key={role}
              onClick={() => {
                setActiveRole(role);
                if (role === 'admin') setEmail('samakshgarg2005@gmail.com');
                else setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all duration-500
                    ${activeRole === role
                  ? (role === 'admin' ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' : `bg-${ROLE_SETTINGS[role].color} text-background shadow-xl`)
                  : 'text-slate-500 hover:text-white'}`}
            >
              {role}
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-[2.5rem] bg-surface-low border border-white/5 mb-6 group transition-colors duration-500`}>
            <div className={`w-12 h-12 bg-${activeRole === 'admin' ? 'red' : activeRole === 'user' ? 'primary' : 'secondary'}/10 rounded-2xl flex items-center justify-center`}>
              <currentRole.icon size={26} className={activeRole === 'admin' ? 'text-red-500' : activeRole === 'user' ? 'text-primary' : 'text-secondary'} />
            </div>
          </div>
          <h1 className="text-5xl font-display font-black text-white tracking-tighter mb-2 italic">
            {currentRole.title}.
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">{currentRole.label}</p>
        </div>

        <div className="bg-surface-low/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-8 md:p-12 shadow-[0_0_100px_rgba(0,0,0,0.4)] relative border-t-white/10 overflow-hidden">
          {/* Role Color Stripe */}
          <div className={`absolute top-0 left-0 w-full h-1 bg-${activeRole === 'admin' ? 'red-500' : currentRole.color} transition-colors duration-500`} />

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors"><Mail size={18} /></span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={currentRole.placeholder}
                  className="w-full bg-surface-high/30 border border-white/5 focus:border-white/10 rounded-2xl pl-14 pr-5 py-4.5 text-white font-bold text-xs uppercase tracking-widest focus:outline-none focus:bg-surface-high transition-all placeholder:text-slate-700"
                />
              </div>
              <div className="relative group">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-white transition-colors"><Lock size={18} /></span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="SECURITY KEY"
                  className="w-full bg-surface-high/30 border border-white/5 focus:border-white/10 rounded-2xl pl-14 pr-5 py-4.5 text-white font-bold text-xs uppercase tracking-widest focus:outline-none focus:bg-surface-high transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                variant={activeRole === 'admin' ? 'danger' : 'primary'}
                size="lg"
                className={`w-full h-18 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl transition-all duration-500 ${activeRole === 'admin' ? 'bg-red-500 border-red-500 text-white' : ''}`}
                loading={loading}
              >
                Initialize Link <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          </form>

          <div className="mt-10 flex flex-col gap-4 text-center">
            {activeRole !== 'admin' && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                New to the grid?{' '}
                <Link to={activeRole === 'user' ? '/register' : '/register-mechanic'} className="text-white hover:text-primary transition-colors underline underline-offset-8">Establish Registry</Link>
              </p>
            )}
            {activeRole === 'admin' && (
              <p className="text-[10px] font-bold text-red-500/50 uppercase tracking-[0.2em]">
                Secure Environment: Authorized Entities Only
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
