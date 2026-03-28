// src/services/booking.service.js
const Booking = require('../models/Booking.model');
const Mechanic = require('../models/Mechanic.model');
const ChatRoom = require('../models/ChatRoom.model');
const NotificationService = require('./notification.service');
const { AppError } = require('../middleware/error.middleware');
// getIO is lazy-required inside functions to avoid circular-dependency
// warnings during module load (socket/index.js → services → socket/index.js).
const getIO = () => require('../socket').getIO();

const VALID_TRANSITIONS = {
  pending:     ['accepted', 'rejected', 'cancelled'],
  accepted:    ['arrived',  'cancelled'],
  arrived:     ['in_progress'],
  in_progress: ['completed'],
  completed:   [],
  rejected:    [],
  cancelled:   [],
};

const createBooking = async ({ userId, mechanicId, serviceType, description, isEmergency, userLocation }) => {
  const mechanic = await Mechanic.findById(mechanicId);
  if (!mechanic) throw new AppError('Mechanic not found.', 404);
  if (!mechanic.isApproved) throw new AppError('Mechanic is not approved.', 400);

  const booking = await Booking.create({
    user: userId,
    mechanic: mechanicId,
    serviceType,
    description,
    isEmergency: isEmergency || false,
    userLocation: userLocation
      ? { type: 'Point', coordinates: [userLocation.lng, userLocation.lat], label: userLocation.label }
      : undefined,
    statusHistory: [{ status: 'pending', changedBy: userId }],
  });

  // Create a ChatRoom for this booking
  const chatRoom = await ChatRoom.create({
    booking: booking._id,
    participants: [userId, mechanic.user],
  });
  booking.chatRoom = chatRoom._id;
  await booking.save();

  // Notify mechanic
  await NotificationService.create({
    recipientId: mechanic.user,
    type: 'BOOKING_CREATED',
    title: '🔔 New Booking Request',
    body: `You have a new ${serviceType} request.`,
    data: { bookingId: booking._id },
  });

  // Real-time emit to mechanic's socket room
  try {
    const io = getIO();
    io.to(`mechanic:${mechanic.user}`).emit('booking:new', { booking });
  } catch (_) {}

  const populated = await booking.populate([
    { path: 'user', select: 'name email phone avatar' },
    { path: 'mechanic', select: 'name phone skills rating location' },
  ]);

  return populated;
};

const updateBookingStatus = async ({ bookingId, newStatus, actorId, actorRole }) => {
  const booking = await Booking.findById(bookingId)
    .populate('mechanic', 'user name')
    .populate('user', '_id name email');

  if (!booking) throw new AppError('Booking not found.', 404);

  const currentStatus = booking.status;
  if (!VALID_TRANSITIONS[currentStatus]?.includes(newStatus)) {
    throw new AppError(`Cannot transition from "${currentStatus}" to "${newStatus}".`, 400);
  }

  // Authorisation: only mechanic can accept/arrive/in_progress; user can cancel
  if (['accepted', 'rejected', 'arrived', 'in_progress', 'completed'].includes(newStatus)) {
    if (actorRole !== 'mechanic' || booking.mechanic.user.toString() !== actorId.toString()) {
      throw new AppError('Only the assigned mechanic can perform this action.', 403);
    }
  }
  if (newStatus === 'cancelled') {
    const isOwner = booking.user._id.toString() === actorId.toString();
    const isMechanic = booking.mechanic.user.toString() === actorId.toString();
    if (!isOwner && !isMechanic) throw new AppError('Not authorised to cancel.', 403);
  }

  booking.status = newStatus;
  booking.statusHistory.push({ status: newStatus, changedBy: actorId });

  if (newStatus === 'accepted') booking.acceptedAt = new Date();
  if (newStatus === 'completed') {
    booking.completedAt = new Date();
    await Mechanic.findByIdAndUpdate(booking.mechanic._id, { $inc: { totalJobs: 1 } });
  }

  await booking.save();

  // Notification map
  const notifMap = {
    accepted:    { type: 'BOOKING_ACCEPTED',    title: '✅ Booking Accepted', body: 'Your mechanic is on the way!' },
    rejected:    { type: 'BOOKING_REJECTED',    title: '❌ Booking Rejected', body: 'Your booking was rejected.' },
    arrived:     { type: 'BOOKING_ARRIVED',     title: '📍 Mechanic Arrived', body: 'Your mechanic has arrived.' },
    in_progress: { type: 'BOOKING_IN_PROGRESS', title: '🔧 Repair Started',  body: 'Repair is in progress.' },
    completed:   { type: 'BOOKING_COMPLETED',   title: '🎉 Booking Completed', body: 'Service completed!' },
    cancelled:   { type: 'BOOKING_CANCELLED',   title: 'ℹ️ Booking Cancelled', body: 'Booking was cancelled.' },
  };

  const notif = notifMap[newStatus];
  if (notif) {
    const recipientId = ['rejected', 'accepted', 'arrived', 'in_progress', 'completed'].includes(newStatus)
      ? booking.user._id
      : booking.mechanic.user;

    await NotificationService.create({ recipientId, ...notif, data: { bookingId } });

    try {
      const io = getIO();
      io.to(`user:${recipientId}`).emit('booking:statusUpdated', { bookingId, newStatus });
      io.to(`user:${booking.user._id}`).emit('booking:statusUpdated', { bookingId, newStatus });
      io.to(`mechanic:${booking.mechanic.user}`).emit('booking:statusUpdated', { bookingId, newStatus });
    } catch (_) {}
  }

  return booking;
};

const getUserBookings = async (userId, query = {}) => {
  const filter = { user: userId };
  if (query.status) filter.status = query.status;

  return Booking.find(filter)
    .populate('mechanic', 'name phone skills rating profilePhoto')
    .sort({ createdAt: -1 })
    .lean();
};

const getMechanicBookings = async (mechanicId, query = {}) => {
  const filter = { mechanic: mechanicId };
  if (query.status) filter.status = { $in: query.status.split(',') };

  return Booking.find(filter)
    .populate('user', 'name email phone avatar location')
    .sort({ createdAt: -1 })
    .lean();
};

const rateBooking = async ({ bookingId, userId, rating, review }) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, status: 'completed' });
  if (!booking) throw new AppError('Booking not found or not yet completed.', 404);
  if (booking.rating) throw new AppError('You have already rated this booking.', 400);

  booking.rating = rating;
  booking.review = review;
  await booking.save();

  // Recalculate mechanic rating
  const mechanic = await Mechanic.findById(booking.mechanic);
  const newTotal = mechanic.totalRatings + 1;
  const newRating = ((mechanic.rating * mechanic.totalRatings) + rating) / newTotal;
  mechanic.rating = parseFloat(newRating.toFixed(2));
  mechanic.totalRatings = newTotal;
  await mechanic.save();

  return booking;
};

module.exports = { createBooking, updateBookingStatus, getUserBookings, getMechanicBookings, rateBooking };
