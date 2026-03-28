// src/controllers/booking.controller.js
const BookingService = require('../services/booking.service');
const catchAsync = require('../utils/catchAsync');
const Mechanic = require('../models/Mechanic.model');

exports.createBooking = catchAsync(async (req, res) => {
  const booking = await BookingService.createBooking({
    userId: req.user._id,
    ...req.body,
  });
  res.status(201).json({ success: true, data: booking });
});

exports.updateStatus = catchAsync(async (req, res) => {
  const booking = await BookingService.updateBookingStatus({
    bookingId: req.params.id,
    newStatus: req.body.status,
    actorId: req.user._id,
    actorRole: req.user.role,
  });
  res.status(200).json({ success: true, data: booking });
});

exports.getMyBookings = catchAsync(async (req, res) => {
  const bookings = await BookingService.getUserBookings(req.user._id, req.query);
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

exports.getMechanicBookings = catchAsync(async (req, res) => {
  const mechanic = await Mechanic.findOne({ user: req.user._id });
  if (!mechanic) return res.status(404).json({ success: false, message: 'Mechanic profile not found.' });
  const bookings = await BookingService.getMechanicBookings(mechanic._id, req.query);
  res.status(200).json({ success: true, count: bookings.length, data: bookings });
});

exports.rateBooking = catchAsync(async (req, res) => {
  const booking = await BookingService.rateBooking({
    bookingId: req.params.id,
    userId: req.user._id,
    rating: req.body.rating,
    review: req.body.review,
  });
  res.status(200).json({ success: true, data: booking });
});
