// src/routes/booking.routes.js
const express = require('express');
const { body } = require('express-validator');
const BookingController = require('../controllers/booking.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');

const router = express.Router();

router.use(protect);

// User: create booking
router.post(
  '/',
  restrictTo('user'),
  [
    body('mechanicId').notEmpty().withMessage('Mechanic ID required.'),
    body('serviceType').notEmpty().withMessage('Service type required.'),
    body('userLocation.lat').isNumeric().withMessage('Valid user latitude required.'),
    body('userLocation.lng').isNumeric().withMessage('Valid user longitude required.'),
  ],
  validate,
  BookingController.createBooking
);

// User: my bookings
router.get('/my', restrictTo('user'), BookingController.getMyBookings);

// Mechanic: their bookings
router.get('/mechanic', restrictTo('mechanic'), BookingController.getMechanicBookings);

// Update booking status
router.patch(
  '/:id/status',
  [body('status').notEmpty().withMessage('Status required.')],
  validate,
  BookingController.updateStatus
);

// User: rate booking
router.patch(
  '/:id/rate',
  restrictTo('user'),
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5.'),
  ],
  validate,
  BookingController.rateBooking
);

module.exports = router;
