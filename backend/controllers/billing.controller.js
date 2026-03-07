/**
 * Billing Controller
 * Handles Stripe checkout sessions and webhooks
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const logger = require('../utils/logger');

// Plan configuration
const PLANS = {
  free: {
    name: 'Free',
    priceId: process.env.STRIPE_PRICE_FREE || 'price_free',
    dailyLimit: 5,
    perMinute: 2
  },
  go: {
    name: 'Go',
    priceId: process.env.STRIPE_PRICE_GO || 'price_go',
    dailyLimit: 50,
    perMinute: 10,
    price: 2900 // $29.00
  },
  pro: {
    name: 'Pro',
    priceId: process.env.STRIPE_PRICE_PRO || 'price_pro',
    dailyLimit: 500,
    perMinute: 30,
    price: 7900 // $79.00
  },
  ultra: {
    name: 'Ultra',
    priceId: process.env.STRIPE_PRICE_ULTRA || 'price_ultra',
    dailyLimit: 2000,
    perMinute: 100,
    price: 19900 // $199.00
  }
};

/**
 * Create Stripe checkout session for plan upgrade
 */
const createCheckoutSession = async (req, res) => {
  try {
    const { plan: planType } = req.body;
    const user = req.user;

    // Validate plan
    if (!planType || !PLANS[planType]) {
      return res.status(400).json({
        success: false,
        error: 'Invalid plan. Choose from: free, go, pro, ultra'
      });
    }

    // Free plan doesn't need checkout
    if (planType === 'free') {
      return res.status(400).json({
        success: false,
        error: 'Free plan is the default plan'
      });
    }

    const plan = PLANS[planType];

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=true&plan=${planType}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing?canceled=true`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
        plan: planType
      }
    });

    logger.logBilling('Checkout session created', {
      userId: user._id,
      plan: planType,
      sessionId: session.id
    });

    return res.status(200).json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    });

  } catch (error) {
    logger.error('Failed to create checkout session', {
      error: error.message,
      userId: req.userId
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    });
  }
};

/**
 * Create billing portal session (for managing subscription)
 */
const createPortalSession = async (req, res) => {
  try {
    const user = req.user;

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user._id.toString()
        }
      });
      customerId = customer.id;

      // Save customer ID to user
      user.stripeCustomerId = customerId;
      await user.save();
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/billing`
    });

    logger.logBilling('Portal session created', {
      userId: user._id,
      customerId
    });

    return res.status(200).json({
      success: true,
      portalUrl: session.url
    });

  } catch (error) {
    logger.error('Failed to create portal session', {
      error: error.message,
      userId: req.userId
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to create portal session'
    });
  }
};

/**
 * Get current subscription status
 */
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = req.user;

    // Get subscription info using the method from User model
    const subscriptionInfo = user.getSubscriptionInfo();

    return res.status(200).json({
      success: true,
      ...subscriptionInfo
    });

  } catch (error) {
    logger.error('Failed to get subscription status', {
      error: error.message,
      userId: req.userId
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to get subscription status'
    });
  }
};

/**
 * Get available plans
 */
const getPlans = async (req, res) => {
  try {
    const plans = Object.entries(PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      dailyLimit: plan.dailyLimit,
      perMinute: plan.perMinute,
      price: plan.price ? plan.price / 100 : 0
    }));

    return res.status(200).json({
      success: true,
      plans
    });

  } catch (error) {
    logger.error('Failed to get plans', { error: error.message });
    return res.status(500).json({ success: false, error: 'Failed to get plans' });
  }
};

module.exports = {
  createCheckoutSession,
  createPortalSession,
  getSubscriptionStatus,
  getPlans,
  PLANS
};
