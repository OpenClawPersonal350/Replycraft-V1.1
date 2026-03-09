const admin = require('firebase-admin');
const config = require('../config/config');
const logger = require('../utils/logger');

// Initialize Firebase Admin (do this once at app startup)
let firebaseInitialized = false;

function initializeFirebase() {
  if (firebaseInitialized) return;
  
  if (!process.env.FIREBASE_PROJECT_ID || 
      !process.env.FIREBASE_CLIENT_EMAIL || 
      !process.env.FIREBASE_PRIVATE_KEY) {
    console.log('⚠️  Firebase credentials not configured. Firebase auth will be disabled.');
    return;
  }

  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin initialized');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin:', error);
  }
}

// Initialize on module load
initializeFirebase();

/**
 * Firebase Authentication Middleware
 * Verifies Firebase ID token and attaches user info to request
 */
const firebaseAuth = async (req, res, next) => {
  try {
    // Skip if Firebase not initialized
    if (!firebaseInitialized) {
      return res.status(503).json({ 
        success: false, 
        error: 'Firebase authentication not configured' 
      });
    }

    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided. Please authenticate.' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach Firebase user data to request
    req.firebaseUser = decodedToken;
    req.uid = decodedToken.uid;
    req.email = decodedToken.email;
    req.firebaseEmail = decodedToken.email;
    
    next();
  } catch (error) {
    console.error('Firebase auth error:', error.message);
    
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ 
        success: false, 
        error: 'Token expired. Please login again.' 
      });
    }
    
    if (error.code === 'auth/invalid-id-token') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token. Please authenticate.' 
      });
    }
    
    return res.status(401).json({ 
      success: false, 
      error: 'Authentication failed. Please login again.' 
    });
  }
};

/**
 * Optional Firebase auth - doesn't fail if no token
 * Used for routes that can work with or without auth
 */
const optionalFirebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without auth
    return next();
  }
  
  // If token provided, verify it
  try {
    if (!firebaseInitialized) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    req.firebaseUser = decodedToken;
    req.uid = decodedToken.uid;
    req.firebaseEmail = decodedToken.email;
  } catch (error) {
    // Token invalid, but continue without auth
    console.log('Optional auth failed:', error.message);
  }
  
  next();
};

module.exports = { firebaseAuth, optionalFirebaseAuth, initializeFirebase };
