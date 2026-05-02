const http = require('http');

const { createApp } = require('./src/app');
const { loadConfig } = require('./src/config');
const { bootstrap } = require('./src/loaders');
const { logger } = require('./src/utils/logger');
const cors = require('cors');

async function main() {
  const config = loadConfig();
  await bootstrap({ config });
  const app = await createApp({ config });

  const server = http.createServer(app);

  server.listen(config.port, () => {
    logger.info(
      `API listening on http://localhost:${config.port} (${config.nodeEnv})`
    );
  });

  const shutdown = (signal) => {
    logger.warn(`Received ${signal}; shutting down...`);
    server.close(() => {
      logger.info('HTTP server closed');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
