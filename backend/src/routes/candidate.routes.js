const { Router } = require('express');

const { getCandidate, revealCandidate } = require('../controllers/candidate.controller');

const candidateRoutes = Router();

candidateRoutes.get('/:publicId', getCandidate);
candidateRoutes.post('/:publicId/reveal', revealCandidate);

module.exports = { candidateRoutes };
