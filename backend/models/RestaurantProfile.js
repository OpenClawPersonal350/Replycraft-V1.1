const mongoose = require('mongoose');

const restaurantProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  brandTone: {
    type: String,
    enum: ['casual', 'professional', 'friendly'],
    default: 'professional'
  },
  emojiAllowed: {
    type: Boolean,
    default: false
  },
  cuisineType: {
    type: String,
    trim: true,
    default: ''
  },
  replyMode: {
    type: String,
    enum: ['auto', 'manual'],
    default: 'auto'
  },
  replyDelayMinutes: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// One profile per user
restaurantProfileSchema.index({ userId: 1 }, { unique: true });

module.exports = mongoose.model('RestaurantProfile', restaurantProfileSchema);
