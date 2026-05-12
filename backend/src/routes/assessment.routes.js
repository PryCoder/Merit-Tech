const { Router } = require('express');

const {
  getAssessments,
  getAssessment,
  createAssessment,
  startSession,
  startSelfSession,
  getRanking,
  generateAssessment,
} = require('../controllers/assessment.controller');
const { authRequired } = require('../middleware/auth');
const { validate } = require('../validators/validate');
const {
  createAssessmentSchema,
  startSessionSchema,
  generateAssessmentSchema,
} = require('../validators/schemas');

const assessmentRoutes = Router();

assessmentRoutes.get('/', getAssessments);
assessmentRoutes.post(
  '/',
  validate({ body: createAssessmentSchema }),
  createAssessment
);

assessmentRoutes.post(
  '/generate',
  authRequired(),
  validate({ body: generateAssessmentSchema }),
  generateAssessment
);

assessmentRoutes.get('/:assessmentId', getAssessment);
assessmentRoutes.post(
  '/:assessmentId/sessions',
  validate({ body: startSessionSchema }),
  startSession
);
assessmentRoutes.post(
  '/:assessmentId/sessions/self',
  authRequired(),
  startSelfSession
);
assessmentRoutes.get('/:assessmentId/rankings', getRanking);

module.exports = { assessmentRoutes };
