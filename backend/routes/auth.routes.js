const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// POST /api/auth/firebase-login - Firebase authentication (new)
router.post('/firebase-login', authController.firebaseLogin);

// POST /api/auth/register - Register new user (legacy)
router.post('/register', authController.register);

// POST /api/auth/login - Login user (legacy)
router.post('/login', authController.login);

module.exports = router;
