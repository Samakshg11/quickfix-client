// src/routes/auth.routes.js
const express = require('express');
const { body } = require('express-validator');
const AuthController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required.'),
    body('email').trim().toLowerCase().isEmail().withMessage('Valid email required.'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  ],
  validate,
  AuthController.registerUser
);

router.post(
  '/register/mechanic',
  [
    body('name').trim().notEmpty(),
    body('email').trim().toLowerCase().isEmail(),
    body('password').isLength({ min: 6 }),
    body('phone').notEmpty().withMessage('Phone is required.'),
    body('skills').notEmpty().withMessage('Skills are required.'),
    body('location.lat').isNumeric().withMessage('Valid latitude required.'),
    body('location.lng').isNumeric().withMessage('Valid longitude required.'),
  ],
  validate,
  AuthController.registerMechanic
);

router.post(
  '/login',
  [
    body('email').trim().toLowerCase().isEmail().withMessage('Email protocol missing or invalid.'),
    body('password').notEmpty().withMessage('Security key required.'),
  ],
  validate,
  AuthController.login
);

router.get('/me', protect, AuthController.getMe);

module.exports = router;
