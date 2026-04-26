const { store, newId } = require('../models/store');
const { assessmentService } = require('./assessment.service');
const { candidateService } = require('./candidate.service');
const { meritScoreService } = require('./meritScore.service');
const { User } = require('../models/User');

function notFound(code, message) {
  const err = new Error(message);
  err.status = 404;
  err.code = code;
  return err;
}

const sessionService = {
  startSession({ assessmentId, candidateName = null, candidateEmail = null, config }) {
    const assessment = assessmentService.getAssessmentById(assessmentId);
    if (!assessment) throw notFound('ASSESSMENT_NOT_FOUND', 'Assessment not found');

    const candidate = candidateService.createCandidate({
      name: candidateName,
      email: candidateEmail,
      hashSalt: config.hashSalt,
    });

    const sessionId = newId();
    const session = {
      id: sessionId,
      assessmentId,
      candidateId: candidate.id,
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      submittedAt: null,
      replay: {
        sessionId,
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      submission: null,
      score: null,
    };

    store.sessions.set(sessionId, session);

    return {
      session,
      candidate,
      assessment,
    };
  },

  async startSessionForUser({ assessmentId, userId, config }) {
    const assessment = assessmentService.getAssessmentById(assessmentId);
    if (!assessment) throw notFound('ASSESSMENT_NOT_FOUND', 'Assessment not found');

    if (!config?.mongodb?.enabled) {
      const err = new Error('MongoDB not configured');
      err.status = 503;
      err.code = 'MONGODB_DISABLED';
      throw err;
    }

    const user = await User.findById(userId);
    if (!user) throw notFound('USER_NOT_FOUND', 'User not found');

    const candidate = candidateService.ensureCandidateForUser({
      userId: String(user._id),
      name: user.name || null,
      email: user.email || null,
      hashSalt: config.hashSalt,
    });

    const sessionId = newId();
    const session = {
      id: sessionId,
      assessmentId,
      candidateId: candidate.id,
      status: 'IN_PROGRESS',
      createdAt: new Date().toISOString(),
      submittedAt: null,
      replay: {
        sessionId,
        events: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      submission: null,
      score: null,
    };

    store.sessions.set(sessionId, session);

    return { session, candidate, assessment };
  },

  getSessionById(sessionId) {
    return store.sessions.get(sessionId) || null;
  },

  submitSession({ sessionId, submission }) {
    const session = store.sessions.get(sessionId);
    if (!session) throw notFound('SESSION_NOT_FOUND', 'Session not found');

    if (session.status === 'SUBMITTED') {
      const err = new Error('Session already submitted');
      err.status = 409;
      err.code = 'SESSION_ALREADY_SUBMITTED';
      throw err;
    }

    const computed = meritScoreService.computeScore(submission);

    session.status = 'SUBMITTED';
    session.submittedAt = new Date().toISOString();
    session.submission = {
      ...submission,
      createdAt: session.submittedAt,
    };
    session.score = {
      ...computed,
      createdAt: session.submittedAt,
    };

    // Add SUBMIT event to replay timeline
    session.replay.events.push({
      type: 'SUBMIT',
      payload: {
        passed: !!submission.passed,
        timeMs: submission.timeMs ?? null,
        hintsUsed: submission.hintsUsed ?? 0,
      },
      ts: Date.now(),
    });

    const assessment = assessmentService.getAssessmentById(session.assessmentId);
    const candidate = candidateService.getCandidateById(session.candidateId);

    // Blind eval: reveal only if score meets threshold
    if (assessment && candidate && session.score.score >= assessment.revealThreshold) {
      candidateService.revealCandidate(candidate.id);
    }

    return { session, assessment, candidate };
  },

  getRankingByAssessment({ assessmentId }) {
    const assessment = assessmentService.getAssessmentById(assessmentId);
    if (!assessment) throw notFound('ASSESSMENT_NOT_FOUND', 'Assessment not found');

    const sessions = Array.from(store.sessions.values()).filter(
      (s) => s.assessmentId === assessmentId && s.status === 'SUBMITTED' && s.score
    );

    sessions.sort((a, b) => b.score.score - a.score.score);

    const ranking = sessions.map((s) => {
      const candidate = candidateService.getCandidateById(s.candidateId);
      return {
        sessionId: s.id,
        score: s.score,
        submission: s.submission,
        candidate: candidateService.toPublic(candidate),
        submittedAt: s.submittedAt,
      };
    });

    return {
      assessment: {
        id: assessment.id,
        title: assessment.title,
        revealThreshold: assessment.revealThreshold,
      },
      ranking,
    };
  },
};

module.exports = { sessionService };
