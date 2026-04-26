const { logger } = require('../utils/logger');

function startJobs() {
  // Placeholder for background workers (cron, queues, etc.)
  // Keep this empty until we define concrete background tasks.
  logger.debug('Jobs initialized');
}

module.exports = { startJobs };
