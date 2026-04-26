const os = require('os');

const healthService = {
  async getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptimeSec: Math.round(process.uptime()),
      hostname: os.hostname(),
      node: process.version,
    };
  },
};

module.exports = { healthService };
