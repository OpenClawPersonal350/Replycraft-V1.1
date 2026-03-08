/**
 * Billing Routes
 * Razorpay payment and subscription management
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  getPlans,
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  cancelSubscription,
  handleWebhook
} = require('../controllers/billing.controller');

// Webhook - no auth required
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes - require authentication
router.get('/plans', getPlans);
router.post('/create-order', authMiddleware, createOrder);
router.post('/verify-payment', authMiddleware, verifyPayment);
router.get('/subscription', authMiddleware, getSubscriptionStatus);
router.post('/cancel', authMiddleware, cancelSubscription);

module.exports = router;
