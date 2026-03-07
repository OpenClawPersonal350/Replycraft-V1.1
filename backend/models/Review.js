const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  connectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessConnection'
  },
  platform: {
    type: String,
    enum: ['google', 'yelp', 'tripadvisor', 'appstore', 'playstore'],
    default: 'google'
  },
  entityType: {
    type: String,
    enum: ['location', 'business', 'app'],
    default: 'location'
  },
  reviewText: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  author: {
    type: String
  },
  authorPhotoUrl: {
    type: String
  },
  replyText: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'pending_approval', 'processed', 'ignored', 'rejected', 'failed'],
    default: 'pending'
  },
  replyPostedAt: {
    type: Date
  },
  fetchedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
reviewSchema.index({ userId: 1, status: 1 });
reviewSchema.index({ connectionId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ reviewId: 1, platform: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
