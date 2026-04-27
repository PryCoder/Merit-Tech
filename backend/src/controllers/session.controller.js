const { sessionService, ghostReplayService } = require('../services');

function getSession(req, res) {
  const session = sessionService.getSessionById(req.params.sessionId);
  if (!session)
    return res
      .status(404)
      .json({
        error: { code: 'SESSION_NOT_FOUND', message: 'Session not found' },
      });

  res.json({
    session: {
      id: session.id,
      assessmentId: session.assessmentId,
      status: session.status,
      createdAt: session.createdAt,
      submittedAt: session.submittedAt,
      score: session.score,
    },
  });
}

function appendEvent(req, res, next) {
  try {
    const event = ghostReplayService.appendEvent({
      sessionId: req.params.sessionId,
      type: req.body.type,
      payload: req.body.payload,
      ts: req.body.ts,
    });

    res.status(201).json({ event });
  } catch (err) {
    next(err);
  }
}

function getReplay(req, res) {
  const replay = ghostReplayService.getReplay(req.params.sessionId);
  if (!replay)
    return res
      .status(404)
      .json({
        error: { code: 'SESSION_NOT_FOUND', message: 'Session not found' },
      });
  res.json({ replay });
}

function submitSession(req, res, next) {
  try {
    const { session, assessment, candidate } = sessionService.submitSession({
      sessionId: req.params.sessionId,
      submission: req.body,
    });

    res.json({
      assessment: {
        id: assessment.id,
        title: assessment.title,
        revealThreshold: assessment.revealThreshold,
      },
      session: {
        id: session.id,
        status: session.status,
        submittedAt: session.submittedAt,
        score: session.score,
      },
      candidate: {
        publicId: candidate.publicId,
        revealed: candidate.revealed,
        ...(candidate.revealed
          ? { name: candidate.name, email: candidate.email }
          : {}),
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getSession, appendEvent, getReplay, submitSession };
