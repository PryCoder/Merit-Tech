const { Router } = require('express');

const { healthRoutes } = require('./health.routes');
const { assessmentRoutes } = require('./assessment.routes');
const { sessionRoutes } = require('./session.routes');
const { mentorRoutes } = require('./mentor.routes');
const { authRoutes } = require('./auth.routes');
const { candidateRoutes } = require('./candidate.routes');
const { pipelineRoutes } = require('./pipeline.routes');
const { candidateMeRoutes } = require('./candidateMe.routes');

const routes = Router();

routes.use('/health', healthRoutes);
routes.use('/auth', authRoutes);
routes.use('/assessments', assessmentRoutes);
routes.use('/sessions', sessionRoutes);
routes.use('/mentor', mentorRoutes);
routes.use('/candidates', candidateRoutes);
routes.use('/pipeline', pipelineRoutes);
routes.use('/candidate/me', candidateMeRoutes);

module.exports = { routes };
