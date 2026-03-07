const cron = require('node-cron');
const BusinessConnection = require('../models/BusinessConnection');
const Review = require('../models/Review');
const RestaurantProfile = require('../models/RestaurantProfile');
const googleReviewsService = require('../services/googleReviews.service');
const { queueReplyGeneration } = require('../queues/reply.queue');
const User = require('../models/User');

/**
 * Fetch and queue new reviews for processing
 */
async function fetchAndQueueReviews() {
  try {
    console.log(`[${new Date().toISOString()}] [ReviewFetcher] Running review fetch...`);
    
    // Get all active business connections
    const connections = await BusinessConnection.find({ isActive: true });
    
    console.log(`[ReviewFetcher] Found ${connections.length} active connections`);
    
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
          
          // Check if review already exists (duplicate protection)
          const existingReview = await Review.findOne({ reviewId: transformed.reviewId });
          
          if (existingReview) {
            duplicatesSkipped++;
            continue; // Skip duplicate
          }
          
          // Get user
          const user = await User.findById(connection.userId);
          
          if (!user || !user.isActive) {
            console.log(`[ReviewFetcher] User not found or inactive: ${connection.userId}`);
            continue;
          }
          
          // Create review record first (to prevent duplicates)
          const newReview = new Review({
            reviewId: transformed.reviewId,
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
            console.error(`[ReviewFetcher] Failed to queue review ${transformed.reviewId}:`, queueError.message);
          }
        }
        
      } catch (error) {
        console.error(`[ReviewFetcher] Error fetching for connection ${connection._id}:`, error.message);
      }
    }
    
    console.log(`[ReviewFetcher] Processed ${newReviewsCount} new reviews, skipped ${duplicatesSkipped} duplicates, queued ${queuedCount} for AI processing`);
    
  } catch (error) {
    console.error(`[ReviewFetcher] Fatal error:`, error.message);
  }
}

// Run every 5 minutes
cron.schedule('*/5 * * * *', fetchAndQueueReviews);

// Also run on startup (after a short delay to ensure server is ready)
setTimeout(fetchAndQueueReviews, 10000);

module.exports = {
  fetchAndQueueReviews
};
