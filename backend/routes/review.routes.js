const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { customRateLimiter } = require('../middleware/rateLimit.middleware');

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/reviews/process - Process review and generate reply
router.post('/process', customRateLimiter, reviewController.processReview);

// GET /api/reviews/pending - Get reviews awaiting approval
router.get('/pending', reviewController.getPendingReviews);

// POST /api/reviews/:id/approve - Approve and post reply
router.post('/:id/approve', reviewController.approveReview);

// POST /api/reviews/:id/reject - Reject review (no reply)
router.post('/:id/reject', reviewController.rejectReview);

module.exports = router;
