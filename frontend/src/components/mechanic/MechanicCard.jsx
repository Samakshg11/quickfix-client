// src/components/mechanic/MechanicCard.jsx
import { motion } from 'framer-motion';
import { Star, MapPin, Wrench, Clock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common';

export default function MechanicCard({ mechanic, index = 0 }) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="bg-[#1e293b] rounded-2xl border border-slate-700 hover:border-amber-500/50 transition-all duration-200 hover:shadow-xl hover:shadow-amber-500/5 overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-500" />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-bold text-amber-400">
              {mechanic.name?.[0]?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{mechanic.name}</h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm text-amber-400 font-medium">{mechanic.rating?.toFixed(1) || 'New'}</span>
              {mechanic.totalRatings > 0 && (
                <span className="text-xs text-slate-500">({mechanic.totalRatings})</span>
              )}
            </div>
          </div>
          {mechanic.isOnline && (
            <div className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex-shrink-0">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Online
            </div>
          )}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {mechanic.skills?.slice(0, 3).map((skill) => (
            <span key={skill} className="flex items-center gap-1 text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700">
              <Wrench size={10} /> {skill}
            </span>
          ))}
          {mechanic.skills?.length > 3 && (
            <span className="text-xs px-2 py-1 bg-slate-800 text-slate-400 rounded-lg border border-slate-700">
              +{mechanic.skills.length - 3} more
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="space-y-1 mb-4">
          {mechanic.distanceKm !== undefined && (
            <p className="flex items-center gap-2 text-xs text-slate-400">
              <MapPin size={13} className="text-slate-500" />
              {mechanic.distanceKm} km away
            </p>
          )}
          {mechanic.experience && (
            <p className="flex items-center gap-2 text-xs text-slate-400">
              <Clock size={13} className="text-slate-500" />
              {mechanic.experience} experience
            </p>
          )}
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <Zap size={13} className="text-slate-500" />
            {mechanic.totalJobs || 0} jobs completed
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          className="w-full"
          onClick={() => navigate(`/mechanics/${mechanic._id}`)}
        >
          View & Book
        </Button>
      </div>
    </motion.div>
  );
}
