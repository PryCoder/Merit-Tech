const { candidateService } = require('../services');

function getCandidate(req, res, next) {
  try {
    const result = candidateService.getCandidateProfileByPublicId(
      req.params.publicId
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

function revealCandidate(req, res, next) {
  try {
    const candidate = candidateService.revealCandidateByPublicId(
      req.params.publicId,
      {
        sessionId: req.body?.sessionId || null,
      }
    );
    res.json({ candidate: candidateService.toPublic(candidate) });
  } catch (err) {
    next(err);
  }
}

module.exports = { getCandidate, revealCandidate };
