// src/models/Notification.model.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'BOOKING_CREATED', 'BOOKING_ACCEPTED', 'BOOKING_REJECTED',
        'BOOKING_ARRIVED', 'BOOKING_IN_PROGRESS', 'BOOKING_COMPLETED',
        'BOOKING_CANCELLED', 'NEW_MESSAGE', 'MECHANIC_APPROVED', 'GENERAL',
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
