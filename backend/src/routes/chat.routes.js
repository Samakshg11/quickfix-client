// src/routes/chat.routes.js
const express = require('express');
const ChatController = require('../controllers/chat.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect);

router.get('/:roomId/messages', ChatController.getMessages);
router.post('/:roomId/messages', ChatController.sendMessage);
router.patch('/:roomId/read', ChatController.markRead);

module.exports = router;
