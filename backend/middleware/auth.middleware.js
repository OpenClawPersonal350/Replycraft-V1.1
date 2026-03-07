const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Verify JWT token and attach user to request
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);
    
    // Get user from database
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token. User not found.'
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated.'
      });
    }
    
    // Check and sync subscription status (downgrade if expired)
    await user.syncSubscriptionStatus();
    
    // Reload user after potential plan change
    if (user.isModified('plan')) {
      await user.reload();
    }
    
    // Check and update daily usage (reset if new day)
    user.checkDailyLimit();
    
    // Attach user to request
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logger.logSecurity('Invalid JWT token', { error: error.message });
      return res.status(401).json({
        success: false,
        error: 'Invalid token.',
        code: 'INVALID_TOKEN'
      });
    }
    if (error.name === 'TokenExpiredError') {
      logger.logSecurity('JWT token expired', { error: error.message });
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.',
        code: 'SESSION_EXPIRED'
      });
    }
    
    logger.error('Auth Middleware Error', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      error: 'Authentication error.'
    });
  }
};

module.exports = authMiddleware;
