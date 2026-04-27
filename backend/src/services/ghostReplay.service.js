const { store } = require('../models/store');

const allowedTypes = new Set([
  'KEYSTROKE',
  'RUN',
  'TEST',
  'HINT',
  'SUBMIT',
  'FOCUS',
  'BLUR',
  'CUSTOM',
]);

const ghostReplayService = {
  appendEvent({ sessionId, type, payload, ts }) {
    const session = store.sessions.get(sessionId);
    if (!session) {
      const err = new Error('Session not found');
      err.status = 404;
      err.code = 'SESSION_NOT_FOUND';
      throw err;
    }

    if (!allowedTypes.has(type)) {
      const err = new Error('Invalid event type');
      err.status = 400;
      err.code = 'INVALID_EVENT_TYPE';
      throw err;
    }

    const event = {
      type,
      payload: payload ?? null,
      ts: ts || Date.now(),
    };

    session.replay.events.push(event);
    session.replay.updatedAt = new Date().toISOString();

    return event;
  },

  getReplay(sessionId) {
    const session = store.sessions.get(sessionId);
    if (!session) return null;
    return session.replay;
  },
};

module.exports = { ghostReplayService };
