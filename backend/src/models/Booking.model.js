// src/models/Booking.model.js
const mongoose = require('mongoose');

const STATUS_FLOW = ['pending', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled', 'rejected'];

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mechanic: { type: mongoose.Schema.Types.ObjectId, ref: 'Mechanic', required: true },
    serviceType: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    isEmergency: { type: Boolean, default: false },

    status: {
      type: String,
      enum: STATUS_FLOW,
      default: 'pending',
    },
    statusHistory: [
      {
        status: { type: String, enum: STATUS_FLOW },
        changedAt: { type: Date, default: Date.now },
        changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      },
    ],

    userLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] }, // [lng, lat]
      label: { type: String },
    },
    mechanicLocation: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number] },
    },

    scheduledAt: { type: Date },
    acceptedAt: { type: Date },
    completedAt: { type: Date },

    price: { type: Number, default: 0 },
    rating: { type: Number, min: 1, max: 5 },
    review: { type: String },

    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' },
  },
  { timestamps: true }
);

bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ mechanic: 1, status: 1 });
bookingSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Booking', bookingSchema);
