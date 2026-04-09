import React from "react";
// src/pages/user/EmergencyPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, MapPin, Loader2 } from 'lucide-react';
import { getNearbyMechanicsAPI } from '../../api/mechanic.api';
import { createBookingAPI } from '../../api/booking.api';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Button } from '../../components/common';
import toast from 'react-hot-toast';

export default function EmergencyPage() {
  const navigate = useNavigate();
  const { location: geoLoc, loading: geoLoading, error: geoError, retry: retryGeolocation } = useGeolocation();

  const [issue, setIssue]         = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleEmergency = async (e) => {
    e.preventDefault();
    if (!geoLoc) { toast.error('Location required for emergency dispatch.'); return; }
    if (!issue.trim()) { toast.error('Please describe your issue.'); return; }

    setSubmitting(true);
    try {
      // Find the nearest available mechanic
      const res = await getNearbyMechanicsAPI({ lat: geoLoc.lat, lng: geoLoc.lng, radius: 30 });
      const mechanics = res.data.data.filter((m) => m.isOnline);

      if (!mechanics.length) {
        toast.error('No mechanics available nearby. Try increasing your search radius.');
        setSubmitting(false);
        return;
      }

      const nearest = mechanics[0];
      await createBookingAPI({
        mechanicId: nearest._id,
        serviceType: 'Emergency',
        description: issue,
        isEmergency: true,
        userLocation: { lat: geoLoc.lat, lng: geoLoc.lng, label: 'Emergency Location' },
      });

      toast.success(`🚨 Emergency request sent to ${nearest.name}!`);
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Emergency request failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-xl mx-auto">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500/40 mb-4 animate-pulse">
            <AlertTriangle size={36} className="text-red-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Emergency Assistance</h1>
          <p className="text-slate-400 text-sm">
            We'll dispatch the nearest available mechanic to you immediately.
          </p>
        </div>

        {/* Location status */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl border mb-6
          ${geoLoc ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-slate-800 border-slate-700'}`}>
          {geoLoading
            ? <Loader2 size={20} className="animate-spin text-amber-400 flex-shrink-0" />
            : <MapPin size={20} className={`flex-shrink-0 ${geoLoc ? 'text-emerald-400' : 'text-slate-400'}`} />}
          <div>
            <p className={`text-sm font-medium ${geoLoc ? 'text-emerald-400' : 'text-slate-400'}`}>
              {geoLoading ? 'Detecting your location…' : geoLoc ? 'Location detected ✓' : 'Location unavailable'}
            </p>
            {geoLoc && (
              <p className="text-xs text-slate-500">{geoLoc.lat.toFixed(5)}, {geoLoc.lng.toFixed(5)}</p>
            )}
            {!geoLoc && geoError && (
              <p className="text-xs text-amber-400">{geoError}</p>
            )}
          </div>
          {!geoLoading && !geoLoc && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="ml-auto rounded-xl"
              onClick={retryGeolocation}
            >
              Retry
            </Button>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleEmergency} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">
              Describe your emergency *
            </label>
            <textarea
              rows={4}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. Car won't start on NH8 near Gurgaon toll, engine making loud noise…"
              required
              className="w-full bg-[#1e293b] text-white px-4 py-3 rounded-xl border border-slate-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-500 placeholder-slate-500"
            />
          </div>

          <Button
            type="submit"
            variant="danger"
            size="lg"
            className="w-full text-base"
            loading={submitting}
            disabled={geoLoading || !geoLoc}
          >
            <AlertTriangle size={18} />
            {submitting ? 'Dispatching…' : '🚨 Send Emergency Request'}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-4">
          Your GPS location will be shared with the mechanic in real-time.
        </p>
      </motion.div>
    </div>
  );
}
