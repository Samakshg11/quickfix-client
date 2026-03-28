import React from "react";
// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center text-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <p className="text-8xl font-black text-amber-400 mb-4">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
        <Link to="/" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
