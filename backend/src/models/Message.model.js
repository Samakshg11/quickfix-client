// src/models/Message.model.js
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatRoom: { type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, trim: true },
    type: { type: String, enum: ['text', 'image', 'location', 'system'], default: 'text' },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

messageSchema.index({ chatRoom: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
