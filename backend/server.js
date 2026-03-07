const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');
const authRoutes = require('./routes/auth.routes');
const replyRoutes = require('./routes/reply.routes');
const reviewRoutes = require('./routes/review.routes');
const googleRoutes = require('./routes/google.routes');
const profileRoutes = require('./routes/profile.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Initialize cron jobs
require('./cron/resetUsage');

// Import workers (they self-initialize)
require('./workers/reviewFetcher');
require('./workers/aiWorker');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration - allow frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Expose static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reply', replyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'ReplyCraft AI Backend',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'ReplyCraft AI Backend',
    version: '1.0.0',
    endpoints: {
      health: 'GET /health',
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      generateReply: 'POST /api/reply/generate-reply',
      processReview: 'POST /api/reviews/process'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('✅ Connected to MongoDB');
    
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`🚀 ReplyCraft AI Backend running on port ${PORT}`);
      console.log(`📝 Endpoints:`);
      console.log(`   POST /api/auth/register`);
      console.log(`   POST /api/auth/login`);
      console.log(`   POST /api/reply/generate-reply`);
      console.log(`   POST /api/reviews/process`);
      console.log(`   GET /health`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
