/**
 * Review Routes
 * Handles review inbox operations
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  getReviews,
  getReview,
  approveReply,
  updateReply,
  sendReply,
  generateReply,
  rejectReply
} = require('../controllers/review.controller');

// All routes require authentication
router.get('/', authMiddleware, getReviews);
router.get('/:id', authMiddleware, getReview);

// Actions
router.post('/:id/generate', authMiddleware, generateReply);
router.post('/:id/approve', authMiddleware, approveReply);
router.put('/:id/edit', authMiddleware, updateReply);
router.post('/:id/send', authMiddleware, sendReply);
router.post('/:id/reject', authMiddleware, rejectReply);

module.exports = router;
