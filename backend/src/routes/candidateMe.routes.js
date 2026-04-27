const { Router } = require('express');

const { authRequired } = require('../middleware/auth');
const {
  getDashboard,
  getProfile,
} = require('../controllers/candidateMe.controller');

const candidateMeRoutes = Router();

candidateMeRoutes.get('/dashboard', authRequired(), getDashboard);
candidateMeRoutes.get('/profile', authRequired(), getProfile);

module.exports = { candidateMeRoutes };
