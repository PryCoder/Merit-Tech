const mongoose = require('mongoose');
const { logger } = require('../utils/logger');

function redactMongoUri(uri) {
  if (!uri) return uri;

  try {
    const url = new URL(uri);
    if (url.password) url.password = '***';
    return url.toString();
  } catch {
    // Fallback for non-standard/invalid URIs
    return uri.replace(/\/\/([^:@/]+):([^@/]+)@/g, '//$1:***@');
  }
}

function buildMongoHint(err, uri) {
  const message = String(err?.message || '');

  // Local dev: Mongo not running / wrong port
  if (
    err?.name === 'MongoServerSelectionError' ||
    message.includes('ECONNREFUSED')
  ) {
    return 'MongoDB is unreachable. If you want local dev, start MongoDB (e.g. `docker compose -f docker/docker-compose.dev.yml up -d mongo`) or update MONGODB_URI to a reachable host/port.';
  }

  // Auth failures (Atlas or self-hosted)
  if (
    message.toLowerCase().includes('authentication failed') ||
    message.toLowerCase().includes('bad auth')
  ) {
    const isAtlas =
      String(uri || '').startsWith('mongodb+srv://') ||
      String(err?.codeName || '').includes('Atlas');
    if (isAtlas) {
      return 'MongoDB Atlas authentication failed. Verify the Atlas database user/password in MONGODB_URI and ensure your IP is allowed in Atlas Network Access.';
    }
    return 'MongoDB authentication failed. Verify username/password in MONGODB_URI (and authSource if applicable).';
  }

  return 'Check MONGODB_URI, credentials, and network access.';
}

async function connectMongo({ uri }) {
  if (!uri) return { enabled: false, connected: false };

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV !== 'production',
    });
  } catch (err) {
    logger.error('MongoDB connection failed', {
      uri: redactMongoUri(uri),
      name: err?.name,
      code: err?.code,
      codeName: err?.codeName,
      message: err?.message,
      hint: buildMongoHint(err, uri),
    });
    throw err;
  }

  logger.info('MongoDB connected');
  return { enabled: true, connected: true };
}

async function disconnectMongo() {
  if (mongoose.connection.readyState === 0) return;
  await mongoose.disconnect();
  logger.info('MongoDB disconnected');
}

module.exports = { connectMongo, disconnectMongo };
