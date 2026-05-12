module.exports = {
  ...require('./assessment.service'),
  ...require('./candidate.service'),
  ...require('./session.service'),
  ...require('./ghostReplay.service'),
  ...require('./meritScore.service'),
  ...require('./mentor.service'),
  ...require('./roadmap.service'),
  ...require('./taskCreator.service'),
  ...require('./auth.service'),
  ...require('./pipeline.service'),
};
