// src/routes/admin.routes.js
const express = require('express');
const AdminController = require('../controllers/admin.controller');
const { protect, restrictTo } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(protect, restrictTo('admin'));

router.get('/stats', AdminController.getStats);
router.get('/mechanics/pending', AdminController.getPendingMechanics);
router.patch('/mechanics/:id/approve', AdminController.approveMechanic);
router.delete('/mechanics/:id/reject', AdminController.rejectMechanic);

module.exports = router;
