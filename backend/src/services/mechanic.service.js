// src/services/mechanic.service.js
const Mechanic = require('../models/Mechanic.model');
const CacheService = require('./cache.service');
const { AppError } = require('../middleware/error.middleware');

const getNearbyMechanics = async ({ lat, lng, radiusKm = 50, skill }) => {
  const radiusMeters = radiusKm * 1000;

  const filter = {
    isApproved: true,
    location: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: radiusMeters,
      },
    },
  };

  if (skill) filter.skills = { $in: [new RegExp(skill, 'i')] };

  const mechanics = await Mechanic.find(filter)
    .populate('user', 'name email avatar isActive')
    .select('-__v')
    .lean();

  // Attach computed distance in km
  return mechanics.map((m) => {
    const [mLng, mLat] = m.location.coordinates;
    const d = getDistanceKm(lat, lng, mLat, mLng);
    return { ...m, distanceKm: parseFloat(d.toFixed(2)) };
  });
};

const getMechanicProfile = async (mechanicId) => {
  const mechanic = await Mechanic.findById(mechanicId)
    .populate('user', 'name email phone avatar createdAt')
    .lean();
  if (!mechanic) throw new AppError('Mechanic not found.', 404);
  return mechanic;
};

const getMechanicProfileByUserId = async (userId) => {
  const mechanic = await Mechanic.findOne({ user: userId })
    .populate('user', 'name email phone avatar createdAt')
    .lean();
  return mechanic;
};

const updateLocation = async (userId, { lat, lng }) => {
  const mechanic = await Mechanic.findOneAndUpdate(
    { user: userId },
    { location: { type: 'Point', coordinates: [lng, lat] } },
    { new: true }
  );
  if (!mechanic) throw new AppError('Mechanic profile not found.', 404);
  await CacheService.delByPattern('mechanics:nearby:*');
  return mechanic;
};

const setOnlineStatus = async (userId, isOnline) => {
  const mechanic = await Mechanic.findOneAndUpdate({ user: userId }, { isOnline }, { new: true });
  await CacheService.delByPattern('mechanics:nearby:*');
  return mechanic;
};

const updateProfile = async (userId, updates) => {
  const allowed = ['bio', 'skills', 'experience', 'phone', 'profilePhoto'];
  const filtered = {};
  allowed.forEach((key) => { if (updates[key] !== undefined) filtered[key] = updates[key]; });

  const mechanic = await Mechanic.findOneAndUpdate({ user: userId }, filtered, { new: true, runValidators: true });
  if (!mechanic) throw new AppError('Mechanic profile not found.', 404);
  await CacheService.delByPattern('mechanics:nearby:*');
  return mechanic;
};

// Haversine formula
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = {
  getNearbyMechanics,
  getMechanicProfile,
  getMechanicProfileByUserId,
  updateLocation,
  setOnlineStatus,
  updateProfile
};
