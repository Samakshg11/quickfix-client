// src/routes/mechanic.routes.js
const express = require('express');
const MechanicController = require('../controllers/mechanic.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/nearby', protect, MechanicController.getNearby);
router.get('/me/profile', protect, restrictTo('mechanic'), MechanicController.getMe);
router.get('/:id', protect, MechanicController.getProfile);
router.patch('/me/profile', protect, restrictTo('mechanic'), MechanicController.updateMyProfile);
router.patch('/me/location', protect, restrictTo('mechanic'), MechanicController.updateLocation);

module.exports = router;
