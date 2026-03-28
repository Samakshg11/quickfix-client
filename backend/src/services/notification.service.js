// src/services/notification.service.js
const Notification = require('../models/Notification.model');
const getIO = () => require('../socket').getIO();

const create = async ({ recipientId, type, title, body, data = {} }) => {
  const notification = await Notification.create({ recipient: recipientId, type, title, body, data });

  // Push real-time notification
  try {
    const io = getIO();
    io.to(`user:${recipientId}`).emit('notification:new', notification);
  } catch (_) {
    // socket not yet initialised (e.g. tests)
  }

  return notification;
};

const getUserNotifications = async (userId, { page = 1, limit = 20 } = {}) => {
  const skip = (page - 1) * limit;
  const [notifications, unreadCount] = await Promise.all([
    Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments({ recipient: userId, isRead: false }),
  ]);
  return { notifications, unreadCount };
};

const markRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { isRead: true },
    { new: true }
  );
};

const markAllRead = async (userId) => {
  return Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};

module.exports = { create, getUserNotifications, markRead, markAllRead };
