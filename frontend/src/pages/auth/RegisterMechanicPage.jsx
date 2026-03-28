// src/pages/auth/RegisterMechanicPage.jsx
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Loader2, Wrench, Search, Smartphone, User, Mail, Lock, Briefcase, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common';
import toast from 'react-hot-toast';
import _ from 'lodash';

const SKILL_OPTIONS = [
  'Engine Repair', 'Tyre Change', 'Battery Replacement', 'AC Repair',
  'Brake Service', 'Oil Change', 'Electrical', 'Transmission', 'Body Work', 'Towing',
];

export default function RegisterMechanicPage() {
  const { registerMechanic } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    skills: [], experience: '',
    location: null,
  });

  const [addressQuery, setAddressQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isManual, setIsManual] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const setVal = (key) => (e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); };

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));
  };

  /** ── Auto Detection ── */
  const detectLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocation not supported by this terminal.'); return; }
    setGeoLoading(true);
    setIsManual(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, { headers: { 'User-Agent': 'QuickFix/1.0' } });
          const data = await res.json();
          const label = data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
          setForm((prev) => ({ ...prev, location: { lat, lng, label } }));
          setAddressQuery(label);
        } catch {
          setForm((prev) => ({ ...prev, location: { lat, lng, label: `${lat.toFixed(4)}, ${lng.toFixed(4)}` } }));
        } finally { setGeoLoading(false); }
      },
      (err) => { toast.error('Signal Failure: ' + err.message); setGeoLoading(false); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /** ── Manual Search ── */
  const searchAddress = useCallback(_.debounce(async (query) => {
    if (query.length < 3) return;
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`, { headers: { 'User-Agent': 'QuickFix/1.0' } });
      const data = await res.json();
      setSearchResults(data);
    } catch (_) { }
  }, 500), []);

  const handleAddressInput = (e) => {
    setAddressQuery(e.target.value);
    setIsManual(true);
    searchAddress(e.target.value);
  };

  const selectAddress = (res) => {
    const lat = parseFloat(res.lat);
    const lng = parseFloat(res.lon);
    setForm((prev) => ({ ...prev, location: { lat, lng, label: res.display_name } }));
    setAddressQuery(res.display_name);
    setSearchResults([]);
    toast.success('Coordinates Locked.');
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Identity verified? Required.';
    if (!form.email) e.email = 'Comm channel required.';
    if (!form.phone) e.phone = 'Terminal ID required.';
    if (form.password.length < 6) e.password = 'Key strength low.';
    if (form.skills.length === 0) e.skills = 'Select tactical skills.';
    if (!form.experience) e.experience = 'Experience required.';
    if (!form.location) e.location = 'Grid coordinates required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await registerMechanic(form);
      toast.success('Node Registered. Awaiting Admin Vouching.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Link establishment failed.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-16 relative overflow-hidden font-sans selection:bg-primary/30">

      {/* ── Cinematic Background ────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-secondary/5 rounded-full blur-[180px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-2xl px-2">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-surface-low border border-white/5 mb-6 group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wrench size={24} className="text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tighter mb-4 italic leading-tight">
            Unit <span className="text-primary">Registry</span>.
          </h1>
          <p className="text-slate-500 text-lg font-medium">Initialize your presence on the synchronized grid.</p>
        </div>

        <div className="bg-surface-low/40 backdrop-blur-3xl rounded-[3.5rem] border border-white/5 p-8 md:p-14 shadow-2xl relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

          <form onSubmit={handleSubmit} className="space-y-8" noValidate>

            {/* Identity & Comms */}
            <div className="grid md:grid-cols-2 gap-8">
              <FormField label="Identity" error={errors.name}>
                <FieldInput icon={<User size={18} />} value={form.name} onChange={setVal('name')} placeholder="FULL NAME" hasError={!!errors.name} />
              </FormField>
              <FormField label="Terminal ID" error={errors.phone}>
                <FieldInput icon={<Smartphone size={18} />} value={form.phone} onChange={setVal('phone')} placeholder="+91 PORT" hasError={!!errors.phone} />
              </FormField>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <FormField label="Grid Channel" error={errors.email}>
                <FieldInput icon={<Mail size={18} />} type="email" value={form.email} onChange={setVal('email')} placeholder="EMAIL PROTOCOL" hasError={!!errors.email} />
              </FormField>
              <FormField label="Security Key" error={errors.password}>
                <FieldInput icon={<Lock size={18} />} type="password" value={form.password} onChange={setVal('password')} placeholder="••••••" hasError={!!errors.password} />
              </FormField>
            </div>

            <FormField label="Professional Tenure" error={errors.experience}>
              <FieldInput icon={<Briefcase size={18} />} value={form.experience} onChange={setVal('experience')} placeholder="E.G. 5 YEARS COMBAT/ENGINE" hasError={!!errors.experience} />
            </FormField>

            {/* Tactical Skills */}
            <FormField label="Tactical Skills" error={errors.skills}>
              <div className="flex flex-wrap gap-2.5 mt-2">
                {SKILL_OPTIONS.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`text-[10px] px-4 py-2.5 rounded-xl border transition-all duration-300 font-bold uppercase tracking-widest ${form.skills.includes(skill)
                        ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20'
                        : 'bg-white/5 text-slate-500 border-white/5 hover:border-white/10'
                      }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </FormField>

            {/* Specialized Hybrid Location Selector */}
            <FormField label="Deployment Coordinates" error={errors.location}>
              <div className="space-y-3 relative">
                <div className="flex gap-4">
                  <div className="relative group flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary transition-colors"><Search size={18} /></span>
                    <input
                      value={addressQuery}
                      onChange={handleAddressInput}
                      placeholder="SEARCH DEPLOYMENT ZONE..."
                      className={`w-full bg-surface-high/50 text-white pl-12 pr-4 py-4 rounded-2xl border border-white/5 focus:border-primary/50 focus:bg-surface-high transition-all font-bold text-xs uppercase tracking-widest ${errors.location ? 'border-red-500/50' : ''}`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={geoLoading}
                    className="aspect-square w-14 bg-white/5 hover:bg-primary/10 text-primary border border-white/5 hover:border-primary/30 rounded-2xl flex items-center justify-center transition-all group"
                  >
                    {geoLoading ? <Loader2 size={20} className="animate-spin" /> : <MapPin size={20} className="group-hover:scale-110 transition-transform" />}
                  </button>
                </div>

                {/* Suggestions Overlay */}
                <AnimatePresence>
                  {searchResults.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute z-50 left-0 right-0 mt-2 bg-surface-low border border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                      {searchResults.map((res, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => selectAddress(res)}
                          className="w-full text-left px-5 py-4 hover:bg-white/5 text-xs font-bold text-slate-400 hover:text-white border-b border-white/5 last:border-0 transition-colors flex items-center gap-3"
                        >
                          <MapPin size={14} className="text-secondary opacity-50" />
                          <span className="truncate">{res.display_name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {form.location && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-green-500/5 border border-green-500/20 rounded-[1.2rem]">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Signal Locked: {form.location.lat.toFixed(3)}, {form.location.lng.toFixed(3)}</span>
                  </div>
                )}
              </div>
            </FormField>

            <div className="pt-6">
              <Button type="submit" variant="primary" size="lg" className="w-full h-18 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.25em] shadow-2xl shadow-primary/20" loading={loading}>
                Establish Registry <CheckCircle className="ml-2" size={16} />
              </Button>
            </div>
          </form>

          <p className="mt-12 text-center text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            Sync status cached?{' '}
            <Link to="/login" className="text-primary hover:text-white transition-colors underline underline-offset-8">Decrypt Login</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function FormField({ label, error, children }) {
  return (
    <div className="space-y-3">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.25em] ml-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{error}</p>}
    </div>
  );
}

function FieldInput({ icon, hasError, className = '', ...props }) {
  return (
    <div className="relative group">
      <span className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300
        ${hasError ? 'text-red-500' : 'text-slate-600 group-focus-within:text-primary'}`}>{icon}</span>
      <input
        className={`w-full bg-surface-high/40 text-white pl-12 pr-4 py-4 rounded-2xl border transition-all duration-300 font-bold text-sm
          focus:outline-none focus:bg-surface-high placeholder-slate-600 uppercase tracking-wider
          ${hasError ? 'border-red-500/50 focus:border-red-500' : 'border-white/5 focus:border-primary/50'} ${className}`}
        {...props}
      />
    </div>
  );
}
