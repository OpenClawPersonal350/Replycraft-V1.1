const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const logger = require('../utils/logger');
const { queueWelcomeEmail } = require('../queues/email.queue');
const { initializeFirebase } = require('../middleware/firebaseAuth');
const admin = require('firebase-admin');

/**
 * Firebase Login - Exchange Firebase token for JWT
 * This handles both new and existing Firebase users
 */
const firebaseLogin = async (req, res) => {
  try {
    const { idToken, email, name } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        error: 'Firebase ID token is required'
      });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (firebaseError) {
      logger.logSecurity('Firebase token verification failed', { 
        error: firebaseError.message,
        code: firebaseError.code 
      });
      return res.status(401).json({
        success: false,
        error: 'Invalid Firebase token'
      });
    }

    const firebaseUid = decodedToken.uid;
    const firebaseEmail = decodedToken.email || email;
    const firebaseName = decodedToken.name || name || (email ? email.split('@')[0] : 'User');

    // Check if user exists by firebaseUid or email
    let user = await User.findOne({ 
      $or: [
        { firebaseUid: firebaseUid },
        { email: firebaseEmail?.toLowerCase() }
      ]
    });

    if (!user) {
      // New user - create account
      logger.logAuth('New Firebase user signup', { firebaseUid, email: firebaseEmail });

      user = new User({
        name: firebaseName,
        email: firebaseEmail?.toLowerCase(),
        firebaseUid: firebaseUid,
        password: Math.random().toString(36).slice(-8), // Random password (not used for Firebase login)
        plan: config.defaultPlan
      });

      await user.save();

      // Queue welcome email
      queueWelcomeEmail({
        name: user.name,
        email: user.email,
        plan: user.plan,
        dailyUsage: user.dailyUsage
      }).catch(err => {
        logger.error('Failed to queue welcome email', { error: err.message });
      });
    } else {
      // Existing user - update firebaseUid if not set
      if (!user.firebaseUid) {
        user.firebaseUid = firebaseUid;
        await user.save();
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          error: 'Account is deactivated'
        });
      }

      // Update name if provided and different
      if (name && name !== user.name) {
        user.name = name;
        await user.save();
      }

      logger.logAuth('Firebase user logged in', { userId: user._id, firebaseUid });
    }

    // Generate JWT token for backend
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Return user data and token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        dailyUsage: user.dailyUsage,
        avatarUrl: user.avatarUrl
      },
      token
    });

  } catch (error) {
    logger.error('Firebase Login Error', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      error: 'Failed to login with Firebase'
    });
  }
};

/**
 * Register a new user (legacy - email/password)
 */
const register = async (req, res) => {
  try {
    const { name, email, password, plan } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email and password are required'
      });
    }

    // Validate name
    if (name.trim().length < 1) {
      return res.status(400).json({
        success: false,
        error: 'Name is required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Validate plan if provided
    const userPlan = plan && config.validPlans.includes(plan.toLowerCase()) 
      ? plan.toLowerCase() 
      : config.defaultPlan;

    // Create new user with name
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase(),
      password,
      plan: userPlan
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    logger.logAuth('User registered', { userId: user._id, email: user.email });

    // Queue welcome email (async, doesn't block API)
    queueWelcomeEmail({
      name: user.name,
      email: user.email,
      plan: user.plan,
      dailyUsage: user.dailyUsage
    }).catch(err => {
      logger.error('Failed to queue welcome email', { error: err.message, userId: user._id });
    });

    // Return success response (without password)
    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          dailyUsage: user.dailyUsage,
          avatarUrl: user.avatarUrl
        },
        token
      }
    });

  } catch (error) {
    logger.error('Register Error', { error: error.message, stack: error.stack });
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        error: messages.join(', ')
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Failed to register user'
    });
  }
};

/**
 * Login user (legacy - email/password)
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Find user by email (include password for comparison)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      logger.logAuth('Login failed - user not found', { email: email.toLowerCase() });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      logger.logAuth('Login failed - account deactivated', { userId: user._id });
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated'
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      logger.logAuth('Login failed - invalid password', { userId: user._id });
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check and reset daily usage if needed
    user.checkDailyLimit();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    logger.logAuth('User logged in', { userId: user._id, email: user.email });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          plan: user.plan,
          dailyUsage: user.dailyUsage,
          avatarUrl: user.avatarUrl
        },
        token
      }
    });

  } catch (error) {
    logger.error('Login Error', { error: error.message, stack: error.stack });
    return res.status(500).json({
      success: false,
      error: 'Failed to login'
    });
  }
};

module.exports = {
  firebaseLogin,
  register,
  login
};
