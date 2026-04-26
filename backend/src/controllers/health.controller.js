const { healthService } = require('../services/health.service');

async function getHealth(req, res) {
  const health = await healthService.getHealth();
  res.json(health);
}

module.exports = { getHealth };
