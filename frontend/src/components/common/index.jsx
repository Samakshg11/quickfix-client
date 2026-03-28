import React from "react";
// src/components/common/index.jsx
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/** ── Spinner Component ────────────────────────────────── */
export function Spinner({ size = 'md', className = '' }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`${sizes[size]} border-[3px] border-primary/20 border-t-primary rounded-full animate-spin`} />
    </div>
  );
}

/** ── StatusBadge Component ────────────────────────────── */
const STATUS_CONFIG = {
  pending: { label: 'Pending Pulse', color: 'bg-brand-500/10   text-brand-500   border-brand-500/20' },
  accepted: { label: 'Synchronized', color: 'bg-primary/10     text-primary     border-primary/20' },
  arrived: { label: 'Proximal', color: 'bg-secondary/10   text-secondary   border-secondary/20' },
  in_progress: { label: 'Executing', color: 'bg-tertiary/10     text-tertiary    border-tertiary/20' },
  completed: { label: 'Secured', color: 'bg-green-500/10    text-green-500   border-green-500/20' },
  rejected: { label: 'Terminated', color: 'bg-red-500/10      text-red-500     border-red-500/20' },
  cancelled: { label: 'Voided', color: 'bg-white/5         text-slate-500   border-white/10' },
};

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

/** ── Button Component ─────────────────────────────────── */
export function Button({ children, variant = 'primary', size = 'md', loading = false, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-2xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95 transition-all';

  const variants = {
    primary: 'bg-primary text-background hover:bg-white hover:shadow-[0_0_30px_-5px_rgba(143,245,255,0.4)]',
    secondary: 'bg-secondary text-white hover:bg-[#874cff] hover:shadow-[0_0_30px_-5px_rgba(172,137,255,0.4)]',
    tertiary: 'bg-tertiary text-background hover:bg-[#afee00]',
    outline: 'bg-transparent border border-white/10 hover:border-white/20 text-white hover:bg-white/5',
    danger: 'bg-red-600/10 text-red-500 border border-red-500/20 hover:bg-red-600/20',
  };

  const sizes = {
    sm: 'px-4 py-2 text-[10px] uppercase tracking-widest',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base'
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
      {children}
    </button>
  );
}

/** ── EmptyState Component ─────────────────────────────── */
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center font-sans">
      {icon && <div className="text-6xl mb-6 opacity-20 grayscale brightness-200">{icon}</div>}
      <h3 className="text-xl font-display font-bold text-white mb-2">{title}</h3>
      {description && <p className="text-slate-500 text-sm font-medium mb-8 max-w-xs">{description}</p>}
      <div className="w-full max-w-[200px]">{action}</div>
    </div>
  );
}

/** ── Modal Component ──────────────────────────────────── */
export function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface-low border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative overflow-hidden"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-tertiary" />

            <div className="flex items-center justify-between px-8 pt-8 pb-4">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">{title}</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-8 pb-8 pt-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
