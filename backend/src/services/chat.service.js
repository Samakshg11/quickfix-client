// src/services/chat.service.js
const ChatRoom = require('../models/ChatRoom.model');
const Message = require('../models/Message.model');
const NotificationService = require('./notification.service');
const { AppError } = require('../middleware/error.middleware');
const getIO = () => require('../socket').getIO();

const getRoomById = async (roomId, userId) => {
  const room = await ChatRoom.findById(roomId).populate('booking');
  if (!room) throw new AppError('Chat room not found.', 404);

  const isParticipant = room.participants.some((p) => p.toString() === userId.toString());
  if (!isParticipant) throw new AppError('Not authorised to access this chat.', 403);

  return room;
};

const getMessages = async (roomId, userId, { page = 1, limit = 40 } = {}) => {
  await getRoomById(roomId, userId);
  const skip = (page - 1) * limit;

  const messages = await Message.find({ chatRoom: roomId })
    .populate('sender', 'name avatar role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return messages.reverse();
};

const sendMessage = async ({ roomId, senderId, text, type = 'text' }) => {
  const room = await getRoomById(roomId, senderId);

  const message = await Message.create({
    chatRoom: roomId,
    sender: senderId,
    text,
    type,
    readBy: [senderId],
  });

  // Update room's last message
  room.lastMessage = message._id;
  room.lastMessageAt = new Date();
  await room.save();

  const populated = await message.populate('sender', 'name avatar role');

  // Emit to all participants
  try {
    const io = getIO();
    io.to(`chat:${roomId}`).emit('chat:message', populated);
  } catch (_) {}

  // Notify other participants
  const others = room.participants.filter((p) => p.toString() !== senderId.toString());
  for (const recipientId of others) {
    await NotificationService.create({
      recipientId,
      type: 'NEW_MESSAGE',
      title: '💬 New Message',
      body: text?.slice(0, 80) || 'You have a new message.',
      data: { roomId },
    });
  }

  return populated;
};

const markMessagesRead = async (roomId, userId) => {
  await Message.updateMany(
    { chatRoom: roomId, readBy: { $ne: userId } },
    { $push: { readBy: userId } }
  );
  try {
    const io = getIO();
    io.to(`chat:${roomId}`).emit('chat:read', { roomId, userId });
  } catch (_) {}
};

module.exports = { getRoomById, getMessages, sendMessage, markMessagesRead };
