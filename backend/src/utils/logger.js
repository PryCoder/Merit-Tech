const fs = require('fs');
const path = require('path');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

function ensureLogsDir() {
  const logsDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
  return logsDir;
}

function formatLine(level, message, meta) {
  const ts = new Date().toISOString();
  const metaPart = meta ? ` ${JSON.stringify(meta)}` : '';
  return `${ts} ${level.toUpperCase()} ${message}${metaPart}`;
}

function createLogger() {
  const logsDir = ensureLogsDir();
  const logFile = path.join(logsDir, 'app.log');

  const minLevel = process.env.LOG_LEVEL || 'info';
  const minLevelNum = levels[minLevel] ?? levels.info;

  function write(level, message, meta) {
    if ((levels[level] ?? 999) > minLevelNum) return;

    const line = formatLine(level, message, meta);

    // stdout/stderr
    if (level === 'error') {
      // eslint-disable-next-line no-console
      console.error(line);
    } else {
      // eslint-disable-next-line no-console
      console.log(line);
    }

    try {
      fs.appendFileSync(logFile, line + '\n', { encoding: 'utf8' });
    } catch {
      // ignore file logging errors
    }
  }

  return {
    error: (msg, meta) => write('error', msg, meta),
    warn: (msg, meta) => write('warn', msg, meta),
    info: (msg, meta) => write('info', msg, meta),
    http: (msg, meta) => write('http', msg, meta),
    debug: (msg, meta) => write('debug', msg, meta),
  };
}

const logger = createLogger();

module.exports = { logger };
