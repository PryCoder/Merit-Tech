const { logger } = require('../utils/logger');
const { startJobs } = require('../jobs');
const { connectMongo } = require('./mongoose');

async function bootstrap({ config } = {}) {
  // Bootstrapping: DB connections, caches, event subscriptions, etc.
  if (config?.mongodb?.enabled) {
    try {
      await connectMongo({ uri: config.mongodb.uri });
    } catch (err) {
      // For local dev/demo we can still run the in-memory endpoints without Mongo.
      // Production should fail fast so we don't run a partially broken service.
      if (config?.nodeEnv === 'production') throw err;
      logger.warn('MongoDB connection failed; continuing without MongoDB', {
        message: err?.message,
      });
    }
  } else {
    logger.debug('MongoDB disabled (no MONGODB_URI)');
  }
  startJobs();
  logger.debug('Bootstrap complete');
}

module.exports = { bootstrap };
