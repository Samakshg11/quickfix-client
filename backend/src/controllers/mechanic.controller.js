// src/controllers/mechanic.controller.js
const MechanicService = require('../services/mechanic.service');
const CacheService = require('../services/cache.service');
const catchAsync = require('../utils/catchAsync');
const { AppError } = require('../middleware/error.middleware');

exports.getNearby = catchAsync(async (req, res) => {
  const { lat, lng, radius, skill } = req.query;
  if (!lat || !lng) throw new AppError('lat and lng are required.', 400);

  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const radiusKm = radius ? parseFloat(radius) : 50;
  const cacheKey = `mechanics:nearby:${parsedLat.toFixed(3)}:${parsedLng.toFixed(3)}:${radiusKm}:${skill || 'all'}`;

  let mechanics = await CacheService.get(cacheKey);

  if (!mechanics) {
    mechanics = await MechanicService.getNearbyMechanics({
      lat: parsedLat,
      lng: parsedLng,
      radiusKm,
      skill,
    });

    await CacheService.set(cacheKey, mechanics, 120);
  }

  res.status(200).json({ success: true, count: mechanics.length, data: mechanics });
});

exports.getMe = catchAsync(async (req, res) => {
  const mechanic = await MechanicService.getMechanicProfileByUserId(req.user._id);
  if (!mechanic) throw new AppError('Mechanic profile not found for this node.', 404);
  res.status(200).json({ success: true, data: mechanic });
});

exports.getProfile = catchAsync(async (req, res) => {
  const mechanic = await MechanicService.getMechanicProfile(req.params.id);
  res.status(200).json({ success: true, data: mechanic });
});

exports.updateMyProfile = catchAsync(async (req, res) => {
  const mechanic = await MechanicService.updateProfile(req.user._id, req.body);
  res.status(200).json({ success: true, data: mechanic });
});

exports.updateLocation = catchAsync(async (req, res) => {
  const mechanic = await MechanicService.updateLocation(req.user._id, req.body);
  res.status(200).json({ success: true, data: mechanic });
});
