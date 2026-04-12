// src/models/Mechanic.model.js
const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    skills: [{ type: String, trim: true }],
    experience: { type: String },
    bio: { type: String, default: '' },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    totalJobs: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      label: { type: String, default: '' },
    },
    profilePhoto: { type: String, default: '' },
    idProof: { type: String, default: '' },
  },
  { timestamps: true }
);

mechanicSchema.index({ location: '2dsphere' });
mechanicSchema.index({ isApproved: 1, isOnline: 1 });

module.exports = mongoose.model('Mechanic', mechanicSchema);
