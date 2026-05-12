const { assessmentService, sessionService, taskCreatorService } = require('../services');

function forbidden(code, message) {
  const err = new Error(message);
  err.status = 403;
  err.code = code;
  return err;
}

function getAssessments(req, res) {
  res.json({ assessments: assessmentService.listAssessments() });
}

function getAssessment(req, res) {
  const assessment = assessmentService.getAssessmentById(
    req.params.assessmentId
  );
  if (!assessment)
    return res
      .status(404)
      .json({
        error: {
          code: 'ASSESSMENT_NOT_FOUND',
          message: 'Assessment not found',
        },
      });
  res.json({ assessment });
}

function createAssessment(req, res) {
  const assessment = assessmentService.createAssessment(req.body);
  res.status(201).json({ assessment });
}

function startSession(req, res, next) {
  try {
    const { session, candidate, assessment } = sessionService.startSession({
      assessmentId: req.params.assessmentId,
      candidateName: req.body.candidateName,
      candidateEmail: req.body.candidateEmail,
      config: req.app.locals.config,
    });

    res.status(201).json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        revealThreshold: assessment.revealThreshold,
      },
      session: {
        id: session.id,
        status: session.status,
        createdAt: session.createdAt,
      },
      candidate: { publicId: candidate.publicId, revealed: candidate.revealed },
    });
  } catch (err) {
    next(err);
  }
}

async function startSelfSession(req, res, next) {
  try {
    if (req.user?.role !== 'candidate')
      throw forbidden('FORBIDDEN', 'Candidate role required');

    const { session, candidate, assessment } =
      await sessionService.startSessionForUser({
        assessmentId: req.params.assessmentId,
        userId: req.user.id,
        config: req.app.locals.config,
      });

    res.status(201).json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        revealThreshold: assessment.revealThreshold,
      },
      session: {
        id: session.id,
        status: session.status,
        createdAt: session.createdAt,
      },
      candidate: { publicId: candidate.publicId, revealed: candidate.revealed },
    });
  } catch (err) {
    next(err);
  }
}

function getRanking(req, res, next) {
  try {
    const result = sessionService.getRankingByAssessment({
      assessmentId: req.params.assessmentId,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function generateAssessment(req, res, next) {
  try {
    if (!req.user || (req.user.role !== 'recruiter' && req.user.role !== 'company'))
      throw forbidden('FORBIDDEN', 'Recruiter or company role required');

    const draft = await taskCreatorService.generateAssessmentDraft({
      jobDescription: req.body.jobDescription,
      titleHint: req.body.titleHint,
      difficulty: req.body.difficulty,
      techStack: req.body.techStack,
      tasksCount: req.body.tasksCount,
      revealThreshold: req.body.revealThreshold,
      config: req.app.locals.config,
    });

    const assessment = assessmentService.createAssessment({
      companyId: req.body.companyId ?? req.user.id,
      title: draft.title,
      description: draft.description || '',
      tasks: draft.tasks,
      revealThreshold: draft.revealThreshold ?? req.body.revealThreshold ?? 70,
      techStack: draft.techStack || req.body.techStack || [],
      mentorStrictness: draft.mentorStrictness ?? 5,
    });

    res.status(201).json({
      assessment,
      draftSource: req.app.locals.config?.groq?.enabled
        ? req.app.locals.config?.groq?.provider || 'groq'
        : 'deterministic',
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAssessments,
  getAssessment,
  createAssessment,
  startSession,
  startSelfSession,
  getRanking,
  generateAssessment,
};
