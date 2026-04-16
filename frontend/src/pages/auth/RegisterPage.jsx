import React from "react";
// src/pages/auth/RegisterPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Phone, Wrench, ChevronRight, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setAddress = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    setErrors({ ...errors, [key]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Identification required.';
    if (!form.email) e.email = 'Communication channel missing.';
    if (!form.phone) e.phone = 'Terminal ID (phone) required.';
    if (form.password.length < 6) e.password = 'Security key too weak.';
    if (form.password !== form.confirm) e.confirm = 'Key synchronization failed.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      navigate('/dashboard');
    } catch (err) {
      // The toast.error is handled globally in client.js, but if we wanted specific handling:
      // toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden font-sans selection:bg-primary/30">

      {/* ── Cinematic Background ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        className="relative w-full max-w-xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-surface-low border border-white/5 mb-6 group"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench size={24} className="text-primary" />
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tighter mb-4 italic">
            Initialize <span className="text-primary">Node</span>.
          </h1>
          <p className="text-slate-500 text-lg font-medium">Synchronize with the global QuickFix grid.</p>
        </div>

        <div className="bg-surface-low/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Luminous accent */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <Field label="Identification" error={errors.name}>
                <FieldInput icon={<User size={18} />} type="text" value={form.name} onChange={setAddress('name')} placeholder="Full Name" hasError={!!errors.name} />
              </Field>

              {/* Email */}
              <Field label="Grid Protocol" error={errors.email}>
                <FieldInput icon={<Mail size={18} />} type="email" value={form.email} onChange={setAddress('email')} placeholder="Email Address" hasError={!!errors.email} />
              </Field>
            </div>

            {/* Phone */}
            <Field label="Terminal ID" error={errors.phone}>
              <FieldInput icon={<Phone size={18} />} type="tel" value={form.phone} onChange={setAddress('phone')} placeholder="+91 Phone Number" hasError={!!errors.phone} />
            </Field>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Password */}
              <Field label="Security Key" error={errors.password}>
                <div className="relative">
                  <FieldInput icon={<Lock size={18} />} type={showPass ? 'text' : 'password'} value={form.password} onChange={setAddress('password')} placeholder="••••••" hasError={!!errors.password} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-primary transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </Field>

              {/* Confirm */}
              <Field label="Synchronization" error={errors.confirm}>
                <FieldInput icon={<Check size={18} />} type="password" value={form.confirm} onChange={setAddress('confirm')} placeholder="••••••" hasError={!!errors.confirm} />
              </Field>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" size="lg" className="w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-[1.02]" loading={loading}>
                Connect Node <ChevronRight className="ml-2" size={16} />
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">
            Synchronized before?{' '}
            <Link to="/login" className="text-primary hover:text-white transition-colors underline underline-offset-4">Decrypt Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">{label}</label>
      {children}
      {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] font-bold uppercase tracking-wider ml-1">{error}</motion.p>}
    </div>
  );
}

function FieldInput({ icon, hasError, className = '', ...props }) {
  return (
    <div className="relative group">
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300
        ${hasError ? 'text-red-500' : 'text-slate-600 group-focus-within:text-primary'}`}>{icon}</span>
      <input
        className={`w-full bg-surface-high/50 text-white pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm
          focus:outline-none focus:bg-surface-high placeholder-slate-600 tracking-wider
          ${hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-primary/50'} ${className}`}
        {...props}
      />
    </div>
  );
}
