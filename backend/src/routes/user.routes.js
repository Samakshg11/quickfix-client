// src/routes/user.routes.js
const express = require('express');
const User = require('../models/User.model');
const catchAsync = require('../utils/catchAsync');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const { AppError } = require('../middleware/error.middleware');

const router = express.Router();
router.use(protect);

// Get own profile
router.get('/me', (req, res) => res.status(200).json({ success: true, data: req.user }));

// Update own profile
router.patch(
  '/me',
  catchAsync(async (req, res) => {
    const allowed = ['name', 'phone', 'avatar'];
    const updates = {};
    allowed.forEach((key) => { if (req.body[key] !== undefined) updates[key] = req.body[key]; });

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: user });
  })
);

// Update user location (shared when booking is active)
router.patch(
  '/me/location',
  catchAsync(async (req, res) => {
    const { lat, lng } = req.body;
    if (!lat || !lng) throw new AppError('lat and lng required.', 400);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { location: { type: 'Point', coordinates: [lng, lat] } },
      { new: true }
    );
    res.status(200).json({ success: true, data: user });
  })
);

module.exports = router;
