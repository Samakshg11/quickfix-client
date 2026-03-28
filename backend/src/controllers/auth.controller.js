// src/controllers/auth.controller.js
const AuthService = require('../services/auth.service');
const catchAsync = require('../utils/catchAsync');

exports.registerUser = catchAsync(async (req, res) => {
  const user = await AuthService.registerUser(req.body);
  AuthService.authResponse(user, 201, res);
});

exports.registerMechanic = catchAsync(async (req, res) => {
  const { user } = await AuthService.registerMechanic(req.body);
  res.status(201).json({
    success: true,
    message: 'Registration submitted. Awaiting admin approval.',
    user,
  });
});

exports.login = catchAsync(async (req, res) => {
  const user = await AuthService.loginUser(req.body);
  AuthService.authResponse(user, 200, res);
});

exports.getMe = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
