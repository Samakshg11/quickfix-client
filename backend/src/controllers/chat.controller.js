// src/controllers/chat.controller.js
const ChatService = require('../services/chat.service');
const catchAsync = require('../utils/catchAsync');

exports.getMessages = catchAsync(async (req, res) => {
  const messages = await ChatService.getMessages(req.params.roomId, req.user._id, req.query);
  res.status(200).json({ success: true, data: messages });
});

exports.sendMessage = catchAsync(async (req, res) => {
  const message = await ChatService.sendMessage({
    roomId: req.params.roomId,
    senderId: req.user._id,
    text: req.body.text,
    type: req.body.type,
  });
  res.status(201).json({ success: true, data: message });
});

exports.markRead = catchAsync(async (req, res) => {
  await ChatService.markMessagesRead(req.params.roomId, req.user._id);
  res.status(200).json({ success: true });
});
