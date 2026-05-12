const { Router } = require('express');

const {
  getSession,
  appendEvent,
  getReplay,
  getResults,
  submitSession,
} = require('../controllers/session.controller');
const { validate } = require('../validators/validate');
const { replayEventSchema, submitSchema } = require('../validators/schemas');

const sessionRoutes = Router();

sessionRoutes.get('/:sessionId', getSession);
sessionRoutes.get('/:sessionId/replay', getReplay);
sessionRoutes.get('/:sessionId/results', getResults);
sessionRoutes.post(
  '/:sessionId/events',
  validate({ body: replayEventSchema }),
  appendEvent
);
sessionRoutes.post(
  '/:sessionId/submit',
  validate({ body: submitSchema }),
  submitSession
);

module.exports = { sessionRoutes };
