const { Router } = require('express');

const {
  getPipeline,
  moveCandidate,
} = require('../controllers/pipeline.controller');
const { validate } = require('../validators/validate');
const { pipelineMoveSchema } = require('../validators/schemas');

const pipelineRoutes = Router();

pipelineRoutes.get('/', getPipeline);
pipelineRoutes.post(
  '/move',
  validate({ body: pipelineMoveSchema }),
  moveCandidate
);

module.exports = { pipelineRoutes };
