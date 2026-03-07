const mongoose = require('mongoose');

const businessConnectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  platform: {
    type: String,
    enum: ['google'],
    default: 'google'
  },
  accountId: {
    type: String,
    required: true
  },
  locationId: {
    type: String,
    required: true
  },
  locationName: {
    type: String
  },
  accessToken: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String,
    required: true
  },
  tokenExpiry: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
businessConnectionSchema.index({ userId: 1, platform: 1 });
businessConnectionSchema.index({ locationId: 1 });

module.exports = mongoose.model('BusinessConnection', businessConnectionSchema);
