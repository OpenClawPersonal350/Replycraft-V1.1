const ollamaService = require('../services/ollama.service');
const promptService = require('../services/prompt.service');
const cleanReplyUtil = require('../utils/cleanReply');
const config = require('../config/config');
const RestaurantProfile = require('../models/RestaurantProfile');

/**
 * Generate professional reply to customer review (direct AI generation)
 */
const generateReply = async (req, res) => {
  try {
    const { review, model } = req.body;
    const user = req.user;

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
      return res.status(429).json({
        success: false,
        error: 'Daily limit exceeded for your plan',
        usage: usageInfo
      });
    }

    // Validate model if provided
    const requestedModel = model && config.allowedModels.includes(model.toLowerCase())
      ? model.toLowerCase()
      : config.ollama.defaultModel;

    // Fetch restaurant profile if exists
    let restaurantProfile = null;
    try {
      restaurantProfile = await RestaurantProfile.findOne({ 
        userId: user._id, 
        isActive: true 
      });
    } catch (error) {
      // Continue without profile if lookup fails
      console.log('No restaurant profile found, using defaults');
    }

    // Build prompt with restaurant context
    const prompt = promptService.buildPrompt(review, restaurantProfile);

    // Get response from Ollama
    const rawReply = await ollamaService.generateReply(requestedModel, prompt);

    // Clean the response
    const reply = cleanReplyUtil.cleanReply(rawReply);

    // Increment usage counter
    await user.incrementUsage();

    // Get updated usage
    const updatedUsage = user.checkDailyLimit();

    // Return success response
    return res.status(200).json({
      success: true,
      reply,
      usage: {
        used: updatedUsage.used,
        limit: updatedUsage.limit,
        remaining: updatedUsage.remaining
      }
    });

  } catch (error) {
    console.error('Generate Reply Error:', error);

    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate reply'
    });
  }
};

module.exports = {
  generateReply
};
