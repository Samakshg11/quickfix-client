import React from "react";
// src/pages/user/FindMechanicsPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Loader2, SlidersHorizontal } from 'lucide-react';
import { getNearbyMechanicsAPI } from '../../api/mechanic.api';
import { useGeolocation } from '../../hooks/useGeolocation';
import MechanicCard from '../../components/mechanic/MechanicCard';
import LiveMap from '../../components/map/LiveMap';
import { Spinner, EmptyState } from '../../components/common';
import toast from 'react-hot-toast';

const SKILL_FILTERS = ['All', 'Engine Repair', 'Tyre Change', 'Battery', 'AC Repair', 'Brake Service', 'Electrical'];

export default function FindMechanicsPage() {
  const { location: geoLoc, loading: geoLoading, error: geoError, retry: retryGeolocation } = useGeolocation();

  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' | 'map'
  const [skillFilter, setSkill] = useState('All');
  const [radiusKm, setRadius] = useState(50);
  const [searchQuery, setSearch] = useState('');

  const fetchMechanics = useCallback(async (loc) => {
    if (!loc) return;
    setLoading(true);
    try {
      const params = { lat: loc.lat, lng: loc.lng, radius: radiusKm };
      if (skillFilter !== 'All') params.skill = skillFilter;
      const res = await getNearbyMechanicsAPI(params);
      setMechanics(res.data.data);
    } catch {
      toast.error('Failed to fetch mechanics.');
    } finally {
      setLoading(false);
    }
  }, [radiusKm, skillFilter]);

  useEffect(() => {
    if (geoLoc) fetchMechanics(geoLoc);
  }, [geoLoc, fetchMechanics]);

  const filtered = mechanics.filter((m) =>
    !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">🔍 Find a Mechanic</h1>
        <p className="text-slate-400 text-sm">
          {geoLoading ? 'Detecting your location…' : geoLoc ? `Showing mechanics within ${radiusKm} km` : 'Enable location to find nearby mechanics'}
        </p>
        {!geoLoading && geoError && (
          <p className="mt-2 text-sm text-amber-400">{geoError}</p>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Search */}
        <div className="relative flex-1 min-w-52">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skill…"
            className="w-full bg-[#1e293b] text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
          />
        </div>

        {/* Radius */}
        <div className="flex items-center gap-2 bg-[#1e293b] border border-slate-700 rounded-xl px-3 py-2">
          <SlidersHorizontal size={14} className="text-slate-400" />
          <select
            value={radiusKm}
            onChange={(e) => setRadius(Number(e.target.value))}
            className="bg-transparent text-white text-sm focus:outline-none"
          >
            {[10, 25, 50, 100].map((r) => <option key={r} value={r}>{r} km</option>)}
          </select>
        </div>

        {/* View toggle */}
        <div className="flex bg-[#1e293b] border border-slate-700 rounded-xl overflow-hidden">
          {['grid', 'map'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 text-sm font-medium transition-colors capitalize
                ${view === v ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Skill filter pills */}
      <div className="flex gap-2 flex-wrap">
        {SKILL_FILTERS.map((skill) => (
          <button
            key={skill}
            onClick={() => setSkill(skill)}
            className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors
              ${skillFilter === skill
                ? 'bg-amber-500 text-white border-amber-500'
                : 'bg-[#1e293b] text-slate-400 border-slate-700 hover:border-slate-500'}`}
          >
            {skill}
          </button>
        ))}
      </div>

      {/* Content */}
      {geoLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 size={32} className="animate-spin text-amber-400" />
          <p className="text-slate-400 text-sm">Detecting your location…</p>
        </div>
      ) : !geoLoc && geoError ? (
        <EmptyState
          icon="📍"
          title="Location unavailable"
          description={geoError}
          action={
            <button
              onClick={retryGeolocation}
              className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-300 transition-colors hover:bg-amber-500/20"
            >
              Retry location
            </button>
          }
        />
      ) : loading ? (
        <Spinner size="lg" className="py-16" />
      ) : view === 'map' ? (
        <LiveMap
          userLocation={geoLoc}
          mechanics={mechanics}
          height="500px"
          className="shadow-2xl"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="🔧"
          title="No mechanics found"
          description={`No approved mechanics within ${radiusKm} km. Try increasing the radius.`}
        />
      ) : (
        <>
          <p className="text-slate-500 text-sm">{filtered.length} mechanic{filtered.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((m, i) => (
              <MechanicCard key={m._id} mechanic={m} index={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
