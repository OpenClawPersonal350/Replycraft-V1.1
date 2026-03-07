const ollamaService = require('../services/ollama.service');
const promptService = require('../services/prompt.service');
const cleanReplyUtil = require('../utils/cleanReply');
const config = require('../config/config');
const Review = require('../models/Review');
const RestaurantProfile = require('../models/RestaurantProfile');
const logger = require('../utils/logger');

/**
 * Process review - check limits, generate reply, handle approval mode
 * IDEMPOTENCY: Checks if review already processed before generating AI reply
 */
const processReview = async (req, res) => {
  try {
    const { review, reviewId, model } = req.body;
    const user = req.user;

    // IDEMPOTENCY: Check if review already processed
    if (reviewId) {
      const existingReview = await Review.findOne({ 
        userId: user._id,
        reviewId: reviewId 
      });
      
      if (existingReview) {
        if (existingReview.status === 'processed' || existingReview.status === 'pending_approval') {
          logger.warn('Duplicate review skipped - already processed', {
            userId: user._id,
            reviewId: reviewId,
            status: existingReview.status
          });
          
          return res.status(200).json({
            ignored: true,
            reason: 'duplicate review',
            status: existingReview.status,
            existingReply: existingReview.replyText
          });
        }
      }
    }

    // Validate required field
    if (!review || typeof review !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Review text is required'
      });
    }

    // Validate review is not empty
    if (review.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Review text cannot be empty'
      });
    }

    // Validate review length
    if (review.length > 5000) {
      return res.status(400).json({
        success: false,
        error: 'Review text is too long (max 5000 characters)'
      });
    }

    // Check daily usage limit
    const usageInfo = user.checkDailyLimit();
    
    if (usageInfo.exceeded) {
      logger.warn('Daily limit reached for user', { 
        userId: user._id, 
        plan: user.plan 
      });
      
      return res.status(200).json({
        ignored: true,
        reason: 'daily limit reached',
        usage: {
          used: usageInfo.used,
          limit: usageInfo.limit,
          remaining: 0
        }
      });
    }

    // Validate model if provided
    const requestedModel = model && config.allowedModels.includes(model.toLowerCase())
      ? model.toLowerCase()
      : config.ollama.defaultModel;

    // Fetch restaurant profile for reply mode
    let restaurantProfile = null;
    try {
      restaurantProfile = await RestaurantProfile.findOne({ 
        userId: user._id, 
        isActive: true 
      });
    } catch (error) {
      logger.info('No restaurant profile found, using defaults', { userId: user._id });
    }

    // Determine reply mode (default: auto)
    const replyMode = restaurantProfile?.replyMode || 'auto';

    logger.logAI('Processing review', { 
      userId: user._id, 
      reviewId,
      model: requestedModel, 
      mode: replyMode 
    });

    // Build prompt with restaurant context
    const prompt = promptService.buildPrompt(review, restaurantProfile);

    // Get response from Ollama
    const rawReply = await ollamaService.generateReply(requestedModel, prompt);

    // Clean the response
    const reply = cleanReplyUtil.cleanReply(rawReply);

    // Handle based on reply mode
    if (replyMode === 'manual') {
      // Save review with pending_approval status (don't post yet)
      // Note: For manual API calls (not from worker), we return the reply
      // For the worker, it would save to database
      
      // Increment usage counter (counts against daily limit even for manual)
      await user.incrementUsage();

      const updatedUsage = user.checkDailyLimit();

      return res.status(200).json({
        ignored: false,
        reply,
        status: 'pending_approval',
        message: 'Reply generated and awaiting approval',
        usage: {
          used: updatedUsage.used,
          limit: updatedUsage.limit,
          remaining: updatedUsage.remaining
        }
      });
    }

    // Auto mode - reply is ready to post
    // Increment usage counter
    await user.incrementUsage();

    const updatedUsage = user.checkDailyLimit();

    // Return success response
    return res.status(200).json({
      ignored: false,
      reply,
      status: 'processed',
      usage: {
        used: updatedUsage.used,
        limit: updatedUsage.limit,
        remaining: updatedUsage.remaining
      }
    });

  } catch (error) {
    console.error('Process Review Error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process review'
    });
  }
};

/**
 * Get pending reviews awaiting approval
 */
const getPendingReviews = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const reviews = await Review.find({
      userId: req.userId,
      status: 'pending_approval'
    })
    .populate('connectionId', 'locationName platform')
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit));

    const total = await Review.countDocuments({
      userId: req.userId,
      status: 'pending_approval'
    });

    return res.status(200).json({
      success: true,
      reviews,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });

  } catch (error) {
    console.error('Get Pending Reviews Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to get pending reviews'
    });
  }
};

/**
 * Approve and post reply to a review
 */
const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyText } = req.body;

    const review = await Review.findOne({
      _id: id,
      userId: req.userId,
      status: 'pending_approval'
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or not pending approval'
      });
    }

    // Use provided reply text or generate new one
    let finalReply = replyText;
    
    if (!finalReply) {
      // Generate new reply if not provided
      const prompt = promptService.buildPrompt(review.reviewText);
      const rawReply = await ollamaService.generateReply(config.ollama.defaultModel, prompt);
      finalReply = cleanReplyUtil.cleanReply(rawReply);
    }

    // For Google reviews, post to platform if connection exists
    if (review.connectionId && review.platform === 'google') {
      try {
        const BusinessConnection = require('../models/BusinessConnection');
        const googleReviewsService = require('../services/googleReviews.service');
        
        const connection = await BusinessConnection.findById(review.connectionId);
        
        if (connection && connection.isActive) {
          await googleReviewsService.postReply(connection, review.reviewId, finalReply);
          console.log(`[Review] Posted reply to Google review: ${review.reviewId}`);
        }
      } catch (error) {
        console.error('Error posting reply to Google:', error.message);
        // Continue even if posting fails - user can retry
      }
    }

    // Update review status
    review.replyText = finalReply;
    review.status = 'processed';
    review.replyPostedAt = new Date();
    await review.save();

    return res.status(200).json({
      success: true,
      message: 'Reply approved and posted',
      review
    });

  } catch (error) {
    console.error('Approve Review Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to approve review'
    });
  }
};

/**
 * Reject a review (no reply will be posted)
 */
const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      userId: req.userId,
      status: 'pending_approval'
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or not pending approval'
      });
    }

    // Update review status to rejected
    review.status = 'rejected';
    await review.save();

    return res.status(200).json({
      success: true,
      message: 'Review rejected',
      review
    });

  } catch (error) {
    console.error('Reject Review Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to reject review'
    });
  }
};

module.exports = {
  processReview,
  getPendingReviews,
  approveReview,
  rejectReview
};
