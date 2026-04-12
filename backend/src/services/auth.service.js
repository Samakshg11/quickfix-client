// src/services/auth.service.js
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');
const Mechanic = require('../models/Mechanic.model');
const { AppError } = require('../middleware/error.middleware');

const normalizeEmail = (email = '') => email.trim().toLowerCase();

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const authResponse = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

const registerUser = async ({ name, email, password, phone }) => {
  const normalizedEmail = normalizeEmail(email);
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) throw new AppError('Email already registered.', 409);

  const user = await User.create({ name, email: normalizedEmail, password, phone, role: 'user' });
  return user;
};

const registerMechanic = async ({ name, email, password, phone, skills, experience, location }) => {
  const normalizedEmail = normalizeEmail(email);
  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) throw new AppError('Email already registered.', 409);

  const user = await User.create({ name, email: normalizedEmail, password, phone, role: 'mechanic' });

  const mechanic = await Mechanic.create({
    user: user._id,
    name,
    email: normalizedEmail,
    phone,
    skills: Array.isArray(skills) ? skills : skills.split(',').map((s) => s.trim()),
    experience,
    location: {
      type: 'Point',
      coordinates: [location.lng, location.lat],
      label: location.label || '',
    },
    isApproved: false,
  });

  return { user, mechanic };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }
  if (!user.isActive) throw new AppError('Account deactivated. Contact support.', 403);

  // If mechanic, verify approval
  if (user.role === 'mechanic') {
    const mechanic = await Mechanic.findOne({ user: user._id });
    if (!mechanic) throw new AppError('Mechanic profile not found.', 404);
    if (!mechanic.isApproved) throw new AppError('Your account is pending admin approval.', 403);
  }

  const safeUser = user.toJSON();
  return safeUser;
};

module.exports = { signToken, authResponse, registerUser, registerMechanic, loginUser };
