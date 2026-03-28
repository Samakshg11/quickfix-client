// src/controllers/admin.controller.js
const Mechanic = require('../models/Mechanic.model');
const User = require('../models/User.model');
const Booking = require('../models/Booking.model');
const NotificationService = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../middleware/error.middleware');

exports.getPendingMechanics = catchAsync(async (req, res) => {
  const mechanics = await Mechanic.find({ isApproved: false })
    .populate('user', 'name email createdAt')
    .sort({ createdAt: -1 })
    .lean();
  res.status(200).json({ success: true, count: mechanics.length, data: mechanics });
});

exports.approveMechanic = catchAsync(async (req, res) => {
  const mechanic = await Mechanic.findByIdAndUpdate(
    req.params.id,
    { isApproved: true },
    { new: true }
  ).populate('user', 'name email');

  if (!mechanic) throw new AppError('Mechanic not found.', 404);

  await NotificationService.create({
    recipientId: mechanic.user._id,
    type: 'MECHANIC_APPROVED',
    title: '🎉 Account Approved',
    body: 'Your mechanic account has been approved. You can now accept bookings!',
    data: {},
  });

  res.status(200).json({ success: true, message: 'Mechanic approved.', data: mechanic });
});

exports.rejectMechanic = catchAsync(async (req, res) => {
  const mechanic = await Mechanic.findById(req.params.id).populate('user');
  if (!mechanic) throw new AppError('Mechanic not found.', 404);

  await User.findByIdAndDelete(mechanic.user._id);
  await mechanic.deleteOne();

  res.status(200).json({ success: true, message: 'Mechanic rejected and removed.' });
});

exports.getStats = catchAsync(async (req, res) => {
  const [totalUsers, totalMechanics, totalBookings, pendingApprovals] = await Promise.all([
    User.countDocuments({ role: 'user' }),
    Mechanic.countDocuments({ isApproved: true }),
    Booking.countDocuments(),
    Mechanic.countDocuments({ isApproved: false }),
  ]);

  const bookingsByStatus = await Booking.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    success: true,
    data: { totalUsers, totalMechanics, totalBookings, pendingApprovals, bookingsByStatus },
  });
});
