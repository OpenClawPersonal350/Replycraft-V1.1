const cron = require('node-cron');
const BusinessConnection = require('../models/BusinessConnection');
const Review = require('../models/Review');
const RestaurantProfile = require('../models/RestaurantProfile');
const googleReviewsService = require('../services/googleReviews.service');
const { queueReplyGeneration } = require('../queues/reply.queue');
const User = require('../models/User');
const logger = require('../utils/logger');

logger.info('Review Fetcher worker started');

/**
 * Fetch and queue new reviews for processing
 * IDEMPOTENCY: Checks for duplicate reviews before processing
 */
async function fetchAndQueueReviews() {
  try {
    logger.info('Running review fetch');
    
    // Get all active business connections
    const connections = await BusinessConnection.find({ isActive: true });
    
    logger.info('Found active connections', { count: connections.length });
    
    let newReviewsCount = 0;
    let duplicatesSkipped = 0;
    let queuedCount = 0;
    
    for (const connection of connections) {
      try {
        // Fetch reviews from Google
        const googleReviews = await googleReviewsService.fetchReviews(connection);
        
        // Process each review
        for (const googleReview of googleReviews) {
          const transformed = googleReviewsService.transformReview(googleReview);
          
          // IDEMPOTENCY: Check if review already exists (duplicate protection)
          const existingReview = await Review.findOne({ reviewId: transformed.reviewId });
          
          if (existingReview) {
            duplicatesSkipped++;
            logger.warn('Duplicate review skipped', {
              platform: 'google',
              externalReviewId: transformed.reviewId,
              existingStatus: existingReview.status
            });
            continue; // Skip duplicate
          }
          
          // Also check by external ID if available
          if (transformed.reviewId) {
            const existingByExternal = await Review.findOne({ 
              platform: 'google',
              externalReviewId: transformed.reviewId 
            });
            
            if (existingByExternal) {
              duplicatesSkipped++;
              logger.warn('Duplicate review skipped (external ID)', {
                platform: 'google',
                externalReviewId: transformed.reviewId,
                existingStatus: existingByExternal.status
              });
              continue;
            }
          }
          
          // Get user
          const user = await User.findById(connection.userId);
          
          if (!user || !user.isActive) {
            logger.warn('User not found or inactive', { userId: connection.userId });
            continue;
          }
          
          // Create review record first (to prevent duplicates)
          const newReview = new Review({
            reviewId: transformed.reviewId,
            externalReviewId: transformed.reviewId, // Store for idempotency
            userId: user._id,
            connectionId: connection._id,
            platform: 'google',
            reviewText: transformed.text,
            rating: transformed.rating,
            author: transformed.author,
            authorPhotoUrl: transformed.authorPhotoUrl,
            status: 'pending'
          });
          
          await newReview.save();
          newReviewsCount++;
          
          // Queue AI reply generation job
          try {
            await queueReplyGeneration({
              reviewId: transformed.reviewId,
              userId: user._id.toString(),
              platform: 'google',
              entityType: 'location',
              reviewText: transformed.text,
              rating: transformed.rating
            });
            queuedCount++;
          } catch (queueError) {
            logger.error('Failed to queue review', { reviewId: transformed.reviewId, error: queueError.message });
          }
        }
        
      } catch (error) {
        logger.error('Error fetching for connection', { connectionId: connection._id, error: error.message });
      }
    }
    
    logger.logReview('Review fetch completed', { 
      newReviews: newReviewsCount, 
      duplicatesSkipped, 
      queuedCount 
    });
    
  } catch (error) {
    logger.error('Review fetcher fatal error', { error: error.message, stack: error.stack });
  }
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', fetchAndQueueReviews);

// Also run on startup (after a short delay to ensure server is ready)
setTimeout(fetchAndQueueReviews, 10000);

module.exports = {
  fetchAndQueueReviews
};
