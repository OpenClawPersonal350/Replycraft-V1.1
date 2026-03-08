/**
 * AI Configuration Routes
 */

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  getConfigurations,
  getConfiguration,
  createConfiguration,
  updateConfiguration,
  deleteConfiguration,
  setDefaultConfiguration
} = require('../controllers/aiConfig.controller');

// All routes require authentication
router.get('/', authMiddleware, getConfigurations);
router.get('/:id', authMiddleware, getConfiguration);
router.post('/', authMiddleware, createConfiguration);
router.put('/:id', authMiddleware, updateConfiguration);
router.delete('/:id', authMiddleware, deleteConfiguration);
router.post('/:id/set-default', authMiddleware, setDefaultConfiguration);

module.exports = router;
