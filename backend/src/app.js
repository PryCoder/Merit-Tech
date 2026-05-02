const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { requestId } = require('./middleware/requestId');
const { notFound } = require('./middleware/notFound');
const { errorHandler } = require('./middleware/errorHandler');
const { routes } = require('./routes');
const { logger } = require('./utils/logger');

async function createApp({ config }) {
  const app = express();

  const corsOrigin = config?.corsOrigin ?? '*';
  app.locals.config = config;

  app.disable('x-powered-by');

  app.use(requestId());
  app.use(helmet());
  app.use(
    cors({
      origin: corsOrigin === '*' ? true : corsOrigin,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  
  // Log HTTP requests (pipe into our logger)
  app.use(
    morgan('combined', {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );

  app.get('/', (req, res) => {
    res.json({
      name: 'Merit-Loop Engine API',
      status: 'ok',
      docs: {
        health: '/api/v1/health',
        assessments: '/api/v1/assessments',
      },
    });
  });

  app.use('/api/v1', routes);

  app.use(notFound());
  app.use(errorHandler());

  return app;
}

module.exports = { createApp };
