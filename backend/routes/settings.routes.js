/**
 * Settings Routes
 * User and business settings management
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  getSettings,
  updateSettings,
  getNotifications,
  updateNotifications,
  changePassword
} = require('../controllers/settings.controller');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Settings routes
router.get('/', getSettings);
router.put('/', updateSettings);

// Notification routes
router.get('/notifications', getNotifications);
router.put('/notifications', updateNotifications);

// Password routes
router.put('/password', changePassword);

module.exports = router;
