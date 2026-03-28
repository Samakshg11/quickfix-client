// src/pages/user/BookMechanicPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Wrench, MapPin, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { getMechanicProfileAPI } from '../../api/mechanic.api';
import { createBookingAPI } from '../../api/booking.api';
import { useGeolocation } from '../../hooks/useGeolocation';
import { Button, Spinner } from '../../components/common';
import toast from 'react-hot-toast';

const SERVICE_TYPES = [
  'Tyre Change', 'Battery Jump', 'Engine Repair', 'AC Repair',
  'Brake Service', 'Oil Change', 'Electrical Issue', 'Towing', 'Other',
];

export default function BookMechanicPage() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { location: geoLoc, loading: geoLoading } = useGeolocation();

  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    serviceType: '',
    description: '',
    isEmergency: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getMechanicProfileAPI(id)
      .then((r) => { setMechanic(r.data.data); setLoading(false); })
      .catch(() => { toast.error('Mechanic not found.'); navigate('/mechanics'); });
  }, [id, navigate]);

  const validate = () => {
    const e = {};
    if (!form.serviceType) e.serviceType = 'Please select a service type.';
    if (!geoLoc) e.location = 'We need your location to dispatch the mechanic.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await createBookingAPI({
        mechanicId: id,
        serviceType: form.serviceType,
        description: form.description,
        isEmergency: form.isEmergency,
        userLocation: { lat: geoLoc.lat, lng: geoLoc.lng, label: 'Current Location' },
      });
      toast.success('Booking created! The mechanic will respond shortly.');
      navigate('/bookings');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spinner size="lg" className="py-24" />;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Mechanic profile summary */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-amber-400">{mechanic?.name?.[0]}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-white">{mechanic?.name}</h2>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-amber-400 text-sm font-medium">{mechanic?.rating?.toFixed(1) || 'New'}</span>
              <span className="text-slate-500 text-xs">({mechanic?.totalRatings || 0} reviews)</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {mechanic?.skills?.map((s) => (
                <span key={s} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">{s}</span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-slate-400"><Clock size={12} /> {mechanic?.experience}</span>
              <span className="flex items-center gap-1 text-xs text-slate-400"><Wrench size={12} /> {mechanic?.totalJobs} jobs</span>
            </div>
          </div>
        </div>
        {mechanic?.bio && (
          <p className="mt-4 text-sm text-slate-400 border-t border-slate-700 pt-4">"{mechanic.bio}"</p>
        )}
      </motion.div>

      {/* Booking Form */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1e293b] rounded-2xl border border-slate-700 p-6"
      >
        <h3 className="font-semibold text-white mb-5">Book This Mechanic</h3>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Service type */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-2 block">Service Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SERVICE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => { setForm({ ...form, serviceType: type }); setErrors({ ...errors, serviceType: '' }); }}
                  className={`py-2 px-3 rounded-xl text-xs font-medium border transition-colors
                    ${form.serviceType === type
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.serviceType && <p className="text-red-400 text-xs mt-1">{errors.serviceType}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-1.5 block">Describe the Issue (optional)</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Tyre burst on NH8, need urgent help…"
              className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-slate-500"
            />
          </div>

          {/* Emergency toggle */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                className="sr-only"
                checked={form.isEmergency}
                onChange={(e) => setForm({ ...form, isEmergency: e.target.checked })}
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${form.isEmergency ? 'bg-red-500' : 'bg-slate-700'}`} />
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.isEmergency ? 'translate-x-5' : ''}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-white">🚨 Emergency</p>
              <p className="text-xs text-slate-400">Mark if you need urgent assistance</p>
            </div>
          </label>

          {/* Location status */}
          <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm border
            ${geoLoc ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
            {geoLoading ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />}
            {geoLoading ? 'Detecting your location…' : geoLoc ? `📍 Location detected (${geoLoc.lat.toFixed(4)}, ${geoLoc.lng.toFixed(4)})` : 'Location not available'}
          </div>
          {errors.location && <p className="text-red-400 text-xs -mt-3">{errors.location}</p>}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={submitting}
            disabled={geoLoading}
          >
            Confirm Booking
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
