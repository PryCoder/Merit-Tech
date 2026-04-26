const { mentorService } = require('../services');

async function getHint(req, res, next) {
  try {
    const hint = await mentorService.getHint({
      prompt: req.body.prompt,
      attemptNumber: req.body.attemptNumber,
      config: req.app.locals.config,
    });

    res.json(hint);
  } catch (err) {
    next(err);
  }
}

module.exports = { getHint };
