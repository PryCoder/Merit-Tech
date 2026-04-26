const { store } = require('../models/store');
const { candidateService } = require('./candidate.service');

function badRequest(code, message) {
  const err = new Error(message);
  err.status = 400;
  err.code = code;
  return err;
}

function notFound(code, message) {
  const err = new Error(message);
  err.status = 404;
  err.code = code;
  return err;
}

function forbidden(code, message) {
  const err = new Error(message);
  err.status = 403;
  err.code = code;
  return err;
}

const STAGES = ['Tech Interview', 'Culture Fit', 'Offer'];
const DEFAULT_STAGE = STAGES[0];

function ensureStage(stage) {
  if (!STAGES.includes(stage)) {
    throw badRequest('INVALID_STAGE', `Stage must be one of: ${STAGES.join(', ')}`);
  }
}

function ensureInPipeline(candidate) {
  if (!candidate?.revealed) return;
  if (!store.pipelineStages.has(candidate.id)) {
    store.pipelineStages.set(candidate.id, DEFAULT_STAGE);
  }
}

const pipelineService = {
  listPipeline() {
    const revealedCandidates = Array.from(store.candidates.values()).filter((c) => c.revealed);

    for (const c of revealedCandidates) ensureInPipeline(c);

    const byStage = Object.fromEntries(STAGES.map((s) => [s, []]));

    for (const c of revealedCandidates) {
      const stage = store.pipelineStages.get(c.id) || DEFAULT_STAGE;
      if (!byStage[stage]) byStage[stage] = [];
      byStage[stage].push({
        publicId: c.publicId,
        name: c.name,
        email: c.email,
      });
    }

    return {
      stages: STAGES,
      byStage,
    };
  },

  moveCandidate({ publicId, toStage }) {
    ensureStage(toStage);

    const candidate = candidateService.getCandidateByPublicId(publicId);
    if (!candidate) throw notFound('CANDIDATE_NOT_FOUND', 'Candidate not found');
    if (!candidate.revealed) throw forbidden('CANDIDATE_LOCKED', 'Candidate is not unlocked yet');

    store.pipelineStages.set(candidate.id, toStage);
    return pipelineService.listPipeline();
  },
};

module.exports = { pipelineService };
