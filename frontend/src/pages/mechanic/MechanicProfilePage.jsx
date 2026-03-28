import React from "react";
// src/pages/mechanic/MechanicProfilePage.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Wrench, Phone, Clock, Save } from 'lucide-react';
import { updateMechanicProfileAPI } from '../../api/mechanic.api';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { Button, Spinner } from '../../components/common';
import toast from 'react-hot-toast';

const SKILL_OPTIONS = [
  'Engine Repair', 'Tyre Change', 'Battery Replacement', 'AC Repair',
  'Brake Service', 'Oil Change', 'Electrical', 'Transmission', 'Body Work', 'Towing',
];

export default function MechanicProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [form, setForm]         = useState({ bio: '', experience: '', phone: '', skills: [] });

  useEffect(() => {
    client.get('/mechanics/me/profile').then((r) => {
      const p = r.data.data;
      setProfile(p);
      setForm({ bio: p.bio || '', experience: p.experience || '', phone: p.phone || '', skills: p.skills || [] });
    }).catch(() => toast.error('Failed to load profile.')).finally(() => setLoading(false));
  }, []);

  const toggleSkill = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill) ? prev.skills.filter((s) => s !== skill) : [...prev.skills, skill],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await updateMechanicProfileAPI(form);
      setProfile(res.data.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update profile.'); }
    finally { setSaving(false); }
  };

  if (loading) return <Spinner size="lg" className="py-24" />;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">⚙️ My Profile</h1>

      {/* Stats banner */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Rating', value: profile?.rating?.toFixed(1) || '—', icon: <Star size={16} className="text-amber-400" /> },
          { label: 'Jobs Done', value: profile?.totalJobs || 0, icon: <Wrench size={16} className="text-blue-400" /> },
          { label: 'Reviews', value: profile?.totalRatings || 0, icon: <Star size={16} className="text-purple-400" /> },
        ].map((s) => (
          <div key={s.label} className="bg-[#1e293b] border border-slate-700 rounded-2xl p-4 text-center">
            <div className="flex justify-center mb-1">{s.icon}</div>
            <p className="text-2xl font-bold text-white">{s.value}</p>
            <p className="text-xs text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Edit form */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6 space-y-5">
        <h2 className="font-semibold text-white">Edit Information</h2>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">Phone</label>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">Experience</label>
          <div className="relative">
            <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              placeholder="e.g. 5 years"
              className="w-full bg-slate-800 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-1.5 block">Bio</label>
          <textarea
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Tell customers about yourself…"
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-300 mb-2 block">Skills</label>
          <div className="flex flex-wrap gap-2">
            {SKILL_OPTIONS.map((skill) => (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  form.skills.includes(skill)
                    ? 'bg-amber-500 text-white border-amber-500'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <Button variant="primary" size="md" onClick={handleSave} loading={saving} className="w-full">
          <Save size={15} /> Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
