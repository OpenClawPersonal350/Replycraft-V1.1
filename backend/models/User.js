const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/config');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatarUrl: {
    type: String,
    default: null
  },
  plan: {
    type: String,
    enum: config.validPlans,
    default: config.defaultPlan
  },
  dailyUsage: {
    count: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Check and reset daily usage
userSchema.methods.checkDailyLimit = function() {
  const now = new Date();
  const lastReset = new Date(this.dailyUsage.lastReset);
  
  // Check if it's a new day (midnight)
  if (now.toDateString() !== lastReset.toDateString()) {
    this.dailyUsage.count = 0;
    this.dailyUsage.lastReset = now;
  }
  
  const planLimits = config.plans[this.plan] || config.plans.free;
  const remaining = planLimits.dailyLimit - this.dailyUsage.count;
  
  return {
    used: this.dailyUsage.count,
    limit: planLimits.dailyLimit,
    remaining: Math.max(0, remaining),
    exceeded: this.dailyUsage.count >= planLimits.dailyLimit
  };
};

// Increment usage
userSchema.methods.incrementUsage = async function() {
  await this.checkDailyLimit();
  this.dailyUsage.count += 1;
  await this.save();
};

// Reset daily usage
userSchema.methods.resetDailyUsage = function() {
  this.dailyUsage.count = 0;
  this.dailyUsage.lastReset = new Date();
};

module.exports = mongoose.model('User', userSchema);
