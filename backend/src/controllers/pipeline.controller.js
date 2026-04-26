const { pipelineService } = require('../services');

function getPipeline(req, res, next) {
  try {
    const result = pipelineService.listPipeline();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

function moveCandidate(req, res, next) {
  try {
    const result = pipelineService.moveCandidate({
      publicId: req.body.publicId,
      toStage: req.body.toStage,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPipeline, moveCandidate };
