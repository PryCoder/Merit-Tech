const { Router } = require('express');

const {
  getSession,
  appendEvent,
  getReplay,
  submitSession,
} = require('../controllers/session.controller');
const { validate } = require('../validators/validate');
const { replayEventSchema, submitSchema } = require('../validators/schemas');

const sessionRoutes = Router();

sessionRoutes.get('/:sessionId', getSession);
sessionRoutes.get('/:sessionId/replay', getReplay);
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
