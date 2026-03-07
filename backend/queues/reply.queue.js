const { Queue } = require('bullmq');
const config = require('../config/config');

// Create Redis connection options
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379
};

// Create the reply queue
const replyQueue = new Queue('reply-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true,
    removeOnFail: false,
    timeout: 60000 // 60 second timeout
  }
});

/**
 * Add a reply generation job to the queue
 */
async function queueReplyGeneration(data) {
  const { reviewId, userId, platform, entityType, reviewText, rating } = data;

  const job = await replyQueue.add('generateReply', {
    reviewId,
    userId,
    platform,
    entityType,
    reviewText,
    rating,
    queuedAt: new Date().toISOString()
  }, {
    priority: rating <= 2 ? 1 : 2 // Higher priority for negative reviews
  });

  console.log(`[ReplyQueue] Job added to queue: ${job.id}, reviewId: ${reviewId}`);
  
  return job;
}

/**
 * Add bulk reply generation jobs
 */
async function queueBulkReplyGeneration(jobs) {
  const bulkJobs = jobs.map(data => ({
    name: 'generateReply',
    data: {
      ...data,
      queuedAt: new Date().toISOString()
    },
    priority: data.rating <= 2 ? 1 : 2
  }));

  const results = await replyQueue.addBulk(bulkJobs);
  console.log(`[ReplyQueue] Bulk jobs added: ${results.length}`);
  
  return results;
}

/**
 * Get queue statistics
 */
async function getQueueStats() {
  const counts = await replyQueue.getJobCounts('waiting', 'active', 'completed', 'failed');
  return counts;
}

/**
 * Clean old completed/failed jobs
 */
async function cleanOldJobs() {
  await replyQueue.clean(1000 * 60 * 60 * 24, 100); // Clean jobs older than 24 hours
}

module.exports = {
  replyQueue,
  queueReplyGeneration,
  queueBulkReplyGeneration,
  getQueueStats,
  cleanOldJobs
};
