const { Worker, Job } = require('bullmq');
const Review = require('../models/Review');
const User = require('../models/User');
const RestaurantProfile = require('../models/RestaurantProfile');
const ollamaService = require('../services/ollama.service');
const promptService = require('../services/prompt.service');
const cleanReplyUtil = require('../utils/cleanReply');
const config = require('../config/config');

// Import platform services
const googleReviewsService = require('../services/googleReviews.service');

// Create Redis connection options
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379
};

// Create the AI worker
const aiWorker = new Worker('reply-generation', async (job) => {
  await processReplyJob(job);
}, {
  connection,
  concurrency: 3,
  limiter: {
    max: 10,
    duration: 1000
  }
});

/**
 * Process a reply generation job
 */
async function processReplyJob(job) {
  const { reviewId, userId, platform, entityType, reviewText, rating } = job.data;
  
  console.log(`[AIWorker] Processing job ${job.id} for review: ${reviewId}, platform: ${platform}`);

  try {
    // Fetch review from database
    const review = await Review.findOne({ reviewId });
    
    if (!review) {
      console.log(`[AIWorker] Review not found: ${reviewId}`);
      return;
    }

    // Check if already processed
    if (review.status === 'processed' || review.status === 'pending_approval') {
      console.log(`[AIWorker] Review already processed: ${reviewId}`);
      return;
    }

    // Get user
    const user = await User.findById(userId);
    
    if (!user || !user.isActive) {
      console.log(`[AIWorker] User not found or inactive: ${userId}`);
      await Review.findByIdAndUpdate(review._id, { status: 'failed' });
      return;
    }

    // Fetch restaurant profile for reply settings
    let restaurantProfile = null;
    try {
      restaurantProfile = await RestaurantProfile.findOne({ 
        userId, 
        isActive: true 
      });
    } catch (error) {
      console.log('[AIWorker] No restaurant profile found, using defaults');
    }

    // Determine reply mode
    const replyMode = restaurantProfile?.replyMode || 'auto';

    // Check daily usage limit
    const usageInfo = user.checkDailyLimit();
    
    if (usageInfo.exceeded) {
      console.log(`[AIWorker] Daily limit exceeded for user: ${userId}`);
      await Review.findByIdAndUpdate(review._id, { status: 'ignored' });
      return;
    }

    // Generate AI reply
    const prompt = promptService.buildPrompt(reviewText, restaurantProfile);
    const rawReply = await ollamaService.generateReply(config.ollama.defaultModel, prompt);
    const replyText = cleanReplyUtil.cleanReply(rawReply);

    // Handle based on reply mode and platform
    if (replyMode === 'auto') {
      // Post reply to platform
      await postReplyToPlatform(platform, review, replyText);
      
      await Review.findByIdAndUpdate(review._id, {
        replyText,
        status: 'processed',
        replyPostedAt: new Date()
      });
      
      console.log(`[AIWorker] AI reply generated and posted for review: ${reviewId}`);
    } else {
      // Manual mode - save for approval
      await Review.findByIdAndUpdate(review._id, {
        replyText,
        status: 'pending_approval'
      });
      
      console.log(`[AIWorker] AI reply generated, awaiting approval for review: ${reviewId}`);
    }

    // Increment usage
    await user.incrementUsage();

    console.log(`[AIWorker] AI reply generated for review: ${reviewId}`);
    
    return { success: true, reviewId, status: replyMode === 'auto' ? 'processed' : 'pending_approval' };

  } catch (error) {
    console.error(`[AIWorker] Error processing review ${reviewId}:`, error.message);
    
    // Update review status to failed
    try {
      await Review.findOneAndUpdate(
        { reviewId },
        { status: 'failed' }
      );
    } catch (updateError) {
      console.error(`[AIWorker] Failed to update review status:`, updateError.message);
    }
    
    throw error; // Re-throw to trigger retry
  }
}

/**
 * Post reply to the appropriate platform
 */
async function postReplyToPlatform(platform, review, replyText) {
  switch (platform) {
    case 'google':
      await postToGoogle(review, replyText);
      break;
    case 'yelp':
      await postToYelp(review, replyText);
      break;
    case 'tripadvisor':
      await postToTripAdvisor(review, replyText);
      break;
    case 'appstore':
    case 'playstore':
      // App store reviews typically don't support replies via API
      console.log(`[AIWorker] Platform ${platform} doesn't support API replies`);
      break;
    default:
      console.log(`[AIWorker] Unknown platform: ${platform}`);
  }
}

/**
 * Post reply to Google
 */
async function postToGoogle(review, replyText) {
  try {
    const BusinessConnection = require('../models/BusinessConnection');
    const connection = await BusinessConnection.findById(review.connectionId);
    
    if (connection && connection.isActive) {
      await googleReviewsService.postReply(connection, review.reviewId, replyText);
      console.log(`[AIWorker] Reply posted to Google: ${review.reviewId}`);
    }
  } catch (error) {
    console.error(`[AIWorker] Error posting to Google:`, error.message);
    throw error;
  }
}

/**
 * Post reply to Yelp
 */
async function postToYelp(review, replyText) {
  // TODO: Implement Yelp API integration
  console.log(`[AIWorker] Yelp integration not implemented yet`);
}

/**
 * Post reply to TripAdvisor
 */
async function postToTripAdvisor(review, replyText) {
  // TODO: Implement TripAdvisor API integration
  console.log(`[AIWorker] TripAdvisor integration not implemented yet`);
}

// Worker events
aiWorker.on('completed', (job) => {
  console.log(`[AIWorker] Job ${job.id} completed`);
});

aiWorker.on('failed', (job, error) => {
  console.error(`[AIWorker] Job ${job.id} failed:`, error.message);
});

aiWorker.on('error', (error) => {
  console.error(` Worker error:`, error.message);
});

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('[AIWorker] Shutting down gracefully...');
  await aiWorker.close();
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

module.exports = {
  aiWorker,
  processReplyJob
};
