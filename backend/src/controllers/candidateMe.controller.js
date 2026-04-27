const {
  assessmentService,
  candidateService,
  authService,
} = require('../services');

function forbidden(code, message) {
  const err = new Error(message);
  err.status = 403;
  err.code = code;
  return err;
}

function buildProgressionPoints({ sessions }) {
  const points = sessions
    .filter((s) => s.status === 'SUBMITTED' && s.score && s.submittedAt)
    .map((s) => ({
      ts: s.submittedAt,
      score: s.score.score,
      assessmentId: s.assessmentId,
      assessmentTitle:
        assessmentService.getAssessmentById(s.assessmentId)?.title ||
        'Assessment',
    }))
    .sort((a, b) => new Date(a.ts).getTime() - new Date(b.ts).getTime());

  return points;
}

async function getDashboard(req, res, next) {
  try {
    if (req.user?.role !== 'candidate')
      throw forbidden('FORBIDDEN', 'Candidate role required');

    const me = await authService.me({
      userId: req.user.id,
      config: req.app.locals.config,
    });

    const candidate = candidateService.ensureCandidateForUser({
      userId: req.user.id,
      name: me.user.name || null,
      email: me.user.email || null,
      hashSalt: req.app.locals.config?.hashSalt,
    });

    const allAssessments = assessmentService.listAssessments();
    const sessions = candidateService.getCandidateSessionsById(candidate.id);

    const submittedByAssessment = new Set(
      sessions
        .filter((s) => s.status === 'SUBMITTED')
        .map((s) => s.assessmentId)
    );

    const pendingInvites = allAssessments
      .filter((a) => !submittedByAssessment.has(a.id))
      .map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        revealThreshold: a.revealThreshold,
      }));

    const completed = sessions
      .filter((s) => s.status === 'SUBMITTED')
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
      .map((s) => {
        const assessment = assessmentService.getAssessmentById(s.assessmentId);
        return {
          sessionId: s.id,
          assessment: assessment
            ? {
                id: assessment.id,
                title: assessment.title,
                revealThreshold: assessment.revealThreshold,
              }
            : null,
          submittedAt: s.submittedAt,
          score: s.score,
          submission: s.submission,
        };
      });

    const progression = buildProgressionPoints({ sessions });

    res.json({
      user: me.user,
      candidate: { publicId: candidate.publicId, revealed: candidate.revealed },
      pendingInvites,
      completed,
      progression,
    });
  } catch (err) {
    next(err);
  }
}

async function getProfile(req, res, next) {
  try {
    if (req.user?.role !== 'candidate')
      throw forbidden('FORBIDDEN', 'Candidate role required');

    const me = await authService.me({
      userId: req.user.id,
      config: req.app.locals.config,
    });

    const candidate = candidateService.ensureCandidateForUser({
      userId: req.user.id,
      name: me.user.name || null,
      email: me.user.email || null,
      hashSalt: req.app.locals.config?.hashSalt,
    });

    res.json({
      user: me.user,
      candidate: {
        publicId: candidate.publicId,
        visibilityLog: Array.isArray(candidate.visibilityLog)
          ? candidate.visibilityLog
          : [],
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard, getProfile };
