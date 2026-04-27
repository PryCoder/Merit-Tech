const { store, newId } = require('../models/store');
const { sha256Hex } = require('../utils/hash');
const { assessmentService } = require('./assessment.service');

function forbidden(code, message) {
  const err = new Error(message);
  err.status = 403;
  err.code = code;
  return err;
}

function notFound(code, message) {
  const err = new Error(message);
  err.status = 404;
  err.code = code;
  return err;
}

const candidateService = {
  createCandidate({ name = null, email = null, userId = null, hashSalt }) {
    const id = newId();

    const identityInput = `${id}:${email || 'no-email'}:${hashSalt}`;
    const publicId = sha256Hex(identityInput).slice(0, 24); // short stable anon id

    const candidate = {
      id,
      publicId,
      name,
      email,
      userId: userId ? String(userId) : null,
      revealed: false,
      visibilityLog: [],
      createdAt: new Date().toISOString(),
    };

    store.candidates.set(id, candidate);
    if (candidate.userId) store.userCandidates.set(candidate.userId, id);
    return candidate;
  },

  getCandidateById(id) {
    return store.candidates.get(id) || null;
  },

  getCandidateByUserId(userId) {
    const uid = String(userId || '').trim();
    if (!uid) return null;
    const candidateId = store.userCandidates.get(uid);
    if (candidateId) return store.candidates.get(candidateId) || null;
    return (
      Array.from(store.candidates.values()).find((c) => c.userId === uid) ||
      null
    );
  },

  ensureCandidateForUser({ userId, name = null, email = null, hashSalt }) {
    const existing = candidateService.getCandidateByUserId(userId);
    if (existing) {
      // keep latest identity fields in case user updates profile
      existing.name = name ?? existing.name;
      existing.email = email ?? existing.email;
      return existing;
    }

    return candidateService.createCandidate({ name, email, userId, hashSalt });
  },

  getCandidateByPublicId(publicId) {
    const pid = String(publicId || '').trim();
    if (!pid) return null;
    return (
      Array.from(store.candidates.values()).find((c) => c.publicId === pid) ||
      null
    );
  },

  getCandidateSessionsById(candidateId) {
    return Array.from(store.sessions.values()).filter(
      (s) => s.candidateId === candidateId
    );
  },

  getCandidateProfileByPublicId(publicId) {
    const candidate = candidateService.getCandidateByPublicId(publicId);
    if (!candidate)
      throw notFound('CANDIDATE_NOT_FOUND', 'Candidate not found');

    const sessions = candidateService
      .getCandidateSessionsById(candidate.id)
      .filter((s) => s.status === 'SUBMITTED')
      .sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      )
      .map((s) => {
        const assessment = assessmentService.getAssessmentById(s.assessmentId);
        return {
          id: s.id,
          assessment: assessment
            ? {
                id: assessment.id,
                title: assessment.title,
                revealThreshold: assessment.revealThreshold,
              }
            : null,
          status: s.status,
          createdAt: s.createdAt,
          submittedAt: s.submittedAt,
          submission: s.submission,
          score: s.score,
        };
      });

    return {
      candidate: candidateService.toPublic(candidate),
      sessions,
    };
  },

  revealCandidate(id, { assessmentId = null, assessmentTitle = null } = {}) {
    const candidate = store.candidates.get(id);
    if (!candidate) return null;
    candidate.revealed = true;

    if (assessmentId) {
      candidate.visibilityLog = Array.isArray(candidate.visibilityLog)
        ? candidate.visibilityLog
        : [];
      const already = candidate.visibilityLog.some(
        (e) => e.assessmentId === assessmentId
      );
      if (!already) {
        candidate.visibilityLog.push({
          assessmentId,
          assessmentTitle: assessmentTitle || null,
          unlockedAt: new Date().toISOString(),
        });
      }
    }
    return candidate;
  },

  revealCandidateByPublicId(publicId, { sessionId = null } = {}) {
    const candidate = candidateService.getCandidateByPublicId(publicId);
    if (!candidate)
      throw notFound('CANDIDATE_NOT_FOUND', 'Candidate not found');

    if (candidate.revealed) {
      return candidate;
    }

    const sessions = candidateService
      .getCandidateSessionsById(candidate.id)
      .filter((s) => s.status === 'SUBMITTED' && s.score)
      .filter((s) => (!sessionId ? true : s.id === sessionId));

    if (sessionId && sessions.length === 0) {
      throw forbidden(
        'REVEAL_NOT_ALLOWED',
        'Candidate identity cannot be revealed for this session'
      );
    }

    let eligibleAssessment = null;
    const eligible = sessions.some((s) => {
      const assessment = assessmentService.getAssessmentById(s.assessmentId);
      if (!assessment) return false;
      const ok = s.score.score >= assessment.revealThreshold;
      if (ok) eligibleAssessment = assessment;
      return ok;
    });

    if (!eligible) {
      throw forbidden(
        'REVEAL_NOT_ALLOWED',
        'Candidate identity cannot be revealed before threshold is met'
      );
    }

    candidateService.revealCandidate(candidate.id, {
      assessmentId: eligibleAssessment?.id || null,
      assessmentTitle: eligibleAssessment?.title || null,
    });

    return candidateService.getCandidateById(candidate.id);
  },

  toPublic(candidate) {
    if (!candidate) return null;

    return {
      publicId: candidate.publicId,
      revealed: candidate.revealed,
      ...(candidate.revealed
        ? {
            name: candidate.name,
            email: candidate.email,
          }
        : {}),
    };
  },
};

module.exports = { candidateService };
