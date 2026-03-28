// src/controllers/notification.controller.js
const NotificationService = require('../services/notification.service');
const catchAsync = require('../utils/catchAsync');

exports.getMyNotifications = catchAsync(async (req, res) => {
  const result = await NotificationService.getUserNotifications(req.user._id, req.query);
  res.status(200).json({ success: true, ...result });
});

exports.markRead = catchAsync(async (req, res) => {
  const notification = await NotificationService.markRead(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: notification });
});

exports.markAllRead = catchAsync(async (req, res) => {
  await NotificationService.markAllRead(req.user._id);
  res.status(200).json({ success: true, message: 'All notifications marked as read.' });
});
