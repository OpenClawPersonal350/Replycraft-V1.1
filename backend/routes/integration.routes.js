/**
 * Integration Routes
 * Google Business Profile connection management
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  connectGoogle,
  listIntegrations,
  getIntegration,
  disconnectIntegration
} = require('../controllers/integration.controller');

// All routes require authentication
router.post('/google/connect', authMiddleware, connectGoogle);
router.get('/', authMiddleware, listIntegrations);
router.get('/:id', authMiddleware, getIntegration);
router.delete('/:id', authMiddleware, disconnectIntegration);

module.exports = router;
