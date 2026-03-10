/**
 * Unified Authentication Middleware
 * Supports both Firebase ID tokens and JWT tokens
 * Extracts user from database and attaches to request
 */

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const logger = require('../utils/logger');
const { initializeFirebase } = require('./firebaseAuth');

let firebaseAdmin = null;
let firebaseInitialized = false;

// Try to get Firebase Admin instance
try {
  const firebaseAuth = require('./firebaseAuth');
  firebaseInitialized = firebaseAuth.initializeFirebase();
  // We need to require firebase-admin directly to get the admin instance
  try {
    firebaseAdmin = require('firebase-admin');
    if (!firebaseAdmin.apps.length) {
      firebaseAdmin = null;
    }
  } catch (e) {
    firebaseAdmin = null;
  }
} catch (e) {
  console.log('Firebase not available, using JWT only');
}

/**
 * Main authentication middleware
 * Accepts either Firebase ID token or JWT token
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. No token provided.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token is required.'
      });
    }

    let user = null;
    let authMethod = null;

    // Try Firebase first (preferred)
    if (firebaseAdmin && firebaseAdmin.apps.length > 0) {
      try {
        const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
        
        // Find or create user by Firebase UID
        user = await User.findOne({ firebaseUid: decodedToken.uid });
        
        if (!user) {
          // Check if user exists by email (for migration)
          if (decodedToken.email) {
            user = await User.findOne({ email: decodedToken.email.toLowerCase() });
            if (user) {
              // Link Firebase UID to existing user
              user.firebaseUid = decodedToken.uid;
              await user.save();
            }
          }
          
          // If still no user, create a new one
          if (!user) {
            user = new User({
              name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
              email: decodedToken.email?.toLowerCase() || 'unknown@example.com',
              firebaseUid: decodedToken.uid,
              password: Math.random().toString(36).slice(-8), // Random password (not used)
              plan: config.defaultPlan || 'free'
            });
            await user.save();
          }
        }
        
        authMethod = 'firebase';
        req.firebaseUser = decodedToken;
        req.uid = decodedToken.uid;
        
      } catch (firebaseError) {
        // Firebase token invalid, try JWT
        console.log('Firebase token invalid, trying JWT:', firebaseError.message);
      }
    }

    // Fall back to JWT if Firebase failed or is not available
    if (!user) {
      try {
        const decoded = jwt.verify(token, config.jwt.secret);
        
        user = await User.findById(decoded.userId);
        
        if (!user) {
          return res.status(401).json({
            success: false,
            error: 'Invalid token. User not found.'
          });
        }
        
        authMethod = 'jwt';
        
      } catch (jwtError) {
        return res.status(401).json({
          success: false,
          error: 'Invalid or expired token. Please login again.'
        });
      }
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated. Please contact support.'
      });
    }

    // Check and sync subscription status
    await user.syncSubscriptionStatus();
    
    // Reload user after potential plan change
    if (user.isModified && user.isModified('plan')) {
      await user.reload();
    }

    // Check and update daily usage
    user.checkDailyLimit();

    // Attach user to request
    req.user = user;
    req.userId = user._id;
    req.authMethod = authMethod;

    next();
    
  } catch (error) {
    logger.error('Authentication Middleware Error', { 
      error: error.message, 
      stack: error.stack 
    });
    
    return res.status(500).json({
      success: false,
      error: 'Authentication error. Please try again.'
    });
  }
};

/**
 * Require premium subscription
 * Use after authenticate middleware
 */
const requirePremium = (req, res, next) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  const premiumPlans = ['pro', 'ultra', 'enterprise'];
  
  if (!premiumPlans.includes(user.plan)) {
    return res.status(403).json({
      success: false,
      error: 'Premium subscription required.',
      code: 'PREMIUM_REQUIRED',
      currentPlan: user.plan
    });
  }

  next();
};

/**
 * Check daily usage limit
 * Use after authenticate middleware
 */
const checkUsageLimit = async (req, res, next) => {
  const user = req.user;
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required.'
    });
  }

  const usage = user.checkDailyLimit();
  
  if (usage.exceeded) {
    return res.status(429).json({
      success: false,
      error: 'Daily usage limit exceeded.',
      code: 'DAILY_LIMIT_EXCEEDED',
      used: usage.used,
      limit: usage.limit,
      remaining: usage.remaining
    });
  }

  // Attach usage info to request
  req.usage = usage;
  
  next();
};

module.exports = {
  authenticate,
  requirePremium,
  checkUsageLimit
};
