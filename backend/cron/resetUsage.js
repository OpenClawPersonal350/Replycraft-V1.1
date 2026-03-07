const cron = require('node-cron');
const User = require('../models/User');

/**
 * Reset daily usage for all users at midnight
 */
const resetDailyUsage = async () => {
  try {
    console.log('[Cron] Running daily usage reset...');
    
    const result = await User.updateMany(
      { 'dailyUsage.count': { $gt: 0 } },
      {
        $set: {
          'dailyUsage.count': 0,
          'dailyUsage.lastReset': new Date()
        }
      }
    );
    
    console.log(`[Cron] Reset daily usage for ${result.modifiedCount} users`);
  } catch (error) {
    console.error('[Cron] Error resetting daily usage:', error);
  }
};

// Schedule: Run at midnight (00:00) every day
cron.schedule('0 0 * * *', resetDailyUsage);

// Also run a cleanup check every hour to handle users who might have
// crossed midnight while server was running
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const result = await User.updateMany(
      {
        'dailyUsage.lastReset': {
          $lt: new Date(now.setHours(0, 0, 0, 0))
        }
      },
      {
        $set: {
          'dailyUsage.count': 0,
          'dailyUsage.lastReset': new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log(`[Cron] Cleaned up ${result.modifiedCount} users with stale daily usage`);
    }
  } catch (error) {
    console.error('[Cron] Error in hourly cleanup:', error);
  }
});

module.exports = {
  resetDailyUsage
};
