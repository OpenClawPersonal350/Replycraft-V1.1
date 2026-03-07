const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const analyticsController = require('../controllers/analytics.controller');

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/analytics/overview - Get analytics overview
router.get('/overview', analyticsController.getOverview);

// GET /api/analytics/reviews - Get reviews with filters
router.get('/reviews', analyticsController.getReviews);

// GET /api/analytics/sentiment - Get sentiment analysis
router.get('/sentiment', analyticsController.getSentiment);

// GET /api/analytics/performance - Get reply performance metrics
router.get('/performance', analyticsController.getReplyPerformance);

module.exports = router;
