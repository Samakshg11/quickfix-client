// src/socket/index.js
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Mechanic = require('../models/Mechanic.model');
const ChatService = require('../services/chat.service');
const MechanicService = require('../services/mechanic.service');
const logger = require('../config/logger');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    },
    pingTimeout: 30000,
    pingInterval: 10000,
  });

  // ── Auth Middleware ──────────────────────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) return next(new Error('Authentication token missing.'));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) return next(new Error('Invalid user.'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication failed.'));
    }
  });

  // ── Connection ───────────────────────────────────────────────────────────────
  io.on('connection', async (socket) => {
    const user = socket.user;
    logger.info(`🔌 Socket connected: ${user.name} [${user.role}] (${socket.id})`);

    // Every user joins their personal room for targeted events
    socket.join(`user:${user._id}`);

    // Mechanics also join their mechanic room
    if (user.role === 'mechanic') {
      socket.join(`mechanic:${user._id}`);
      await MechanicService.setOnlineStatus(user._id, true);
      socket.broadcast.emit('mechanic:online', { mechanicUserId: user._id });
    }

    // ── Chat Events ────────────────────────────────────────────────────────────
    socket.on('chat:join', ({ roomId }) => {
      socket.join(`chat:${roomId}`);
      logger.debug(`${user.name} joined chat room ${roomId}`);
    });

    socket.on('chat:leave', ({ roomId }) => {
      socket.leave(`chat:${roomId}`);
    });

    socket.on('chat:send', async ({ roomId, text, type = 'text' }) => {
      try {
        if (!roomId || !text?.trim()) return;
        await ChatService.sendMessage({ roomId, senderId: user._id, text: text.trim(), type });
      } catch (err) {
        socket.emit('error', { message: err.message });
      }
    });

    socket.on('chat:typing', ({ roomId }) => {
      socket.to(`chat:${roomId}`).emit('chat:typing', { userId: user._id, name: user.name });
    });

    socket.on('chat:stopTyping', ({ roomId }) => {
      socket.to(`chat:${roomId}`).emit('chat:stopTyping', { userId: user._id });
    });

    socket.on('chat:read', async ({ roomId }) => {
      try {
        await ChatService.markMessagesRead(roomId, user._id);
      } catch (err) {
        logger.warn(`chat:read error: ${err.message}`);
      }
    });

    // ── Location Events ────────────────────────────────────────────────────────
    // Throttle: we only update DB if more than 5 seconds have passed since last write
    let lastLocationWrite = 0;
    const LOCATION_WRITE_INTERVAL_MS = 5000;

    socket.on('location:update', async ({ lat, lng, bookingId }) => {
      if (user.role !== 'mechanic') return;

      const now = Date.now();
      const shouldWrite = now - lastLocationWrite > LOCATION_WRITE_INTERVAL_MS;

      // Always broadcast to active booking room for smooth UI
      if (bookingId) {
        io.to(`booking:${bookingId}`).emit('location:mechanicMoved', {
          mechanicUserId: user._id,
          lat,
          lng,
          timestamp: now,
        });
      }

      // Throttled DB write
      if (shouldWrite) {
        lastLocationWrite = now;
        try {
          await MechanicService.updateLocation(user._id, { lat, lng });
        } catch (err) {
          logger.warn(`location:update DB write error: ${err.message}`);
        }
      }
    });

    // User shares their live location during an active booking
    socket.on('location:userUpdate', ({ lat, lng, bookingId }) => {
      if (!bookingId) return;
      io.to(`booking:${bookingId}`).emit('location:userMoved', {
        userId: user._id,
        lat,
        lng,
        timestamp: Date.now(),
      });
    });

    // ── Booking Room Events ────────────────────────────────────────────────────
    // Both user and mechanic join this room to get live booking updates
    socket.on('booking:join', ({ bookingId }) => {
      socket.join(`booking:${bookingId}`);
    });

    socket.on('booking:leave', ({ bookingId }) => {
      socket.leave(`booking:${bookingId}`);
    });

    // ── Disconnect ─────────────────────────────────────────────────────────────
    socket.on('disconnect', async (reason) => {
      logger.info(`🔌 Socket disconnected: ${user.name} — reason: ${reason}`);
      if (user.role === 'mechanic') {
        await MechanicService.setOnlineStatus(user._id, false);
        socket.broadcast.emit('mechanic:offline', { mechanicUserId: user._id });
      }
    });

    socket.on('error', (err) => {
      logger.error(`Socket error for ${user.name}: ${err.message}`);
    });
  });

  logger.info('✅ Socket.io initialised');
  return io;
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialised. Call initSocket(server) first.');
  return io;
};

module.exports = { initSocket, getIO };
