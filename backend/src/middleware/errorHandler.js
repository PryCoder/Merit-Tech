const { logger } = require('../utils/logger');

function errorHandler() {
  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    const status = err.statusCode || err.status || 500;

    logger.error('Unhandled error', {
      requestId: req.id,
      status,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });

    res.status(status).json({
      error: {
        code: err.code || 'INTERNAL_ERROR',
        message: status >= 500 ? 'Internal server error' : err.message,
        requestId: req.id,
      },
    });
  };
}

module.exports = { errorHandler };
