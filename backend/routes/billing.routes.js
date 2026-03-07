/**
 * Billing Routes
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  getPlans
} = require('../controllers/billing.controller');

// Protected routes - require authentication
router.post('/create-checkout-session', authMiddleware, createCheckoutSession);
router.post('/create-portal-session', authMiddleware, createPortalSession);
router.get('/subscription', authMiddleware, getSubscriptionStatus);
router.get('/plans', getPlans);

module.exports = router;
