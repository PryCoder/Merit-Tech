const { WebSocketServer } = require('ws');

const {
  sessionService,
  ghostReplayService,
  mentorService,
  assessmentService,
} = require('../services');
const { logger } = require('../utils/logger');

function safeJsonParse(buf) {
  try {
    return JSON.parse(buf.toString('utf8'));
  } catch {
    return null;
  }
}

function now() {
  return Date.now();
}

function clampInt(n, min, max, fallback) {
  const v = Number.isFinite(n) ? Math.trunc(n) : fallback;
  return Math.max(min, Math.min(max, v));
}

function wsSend(ws, obj) {
  if (ws.readyState !== ws.OPEN) return;
  ws.send(JSON.stringify(obj));
}

function broadcast(clients, obj, exceptWs = null) {
  const msg = JSON.stringify(obj);
  for (const client of clients) {
    if (exceptWs && client === exceptWs) continue;
    if (client.readyState === client.OPEN) client.send(msg);
  }
}

function toWsBaseUrl(httpBaseUrl) {
  if (!httpBaseUrl) return null;
  if (httpBaseUrl.startsWith('https://')) return `wss://${httpBaseUrl.slice('https://'.length)}`;
  if (httpBaseUrl.startsWith('http://')) return `ws://${httpBaseUrl.slice('http://'.length)}`;
  return null;
}

function buildHintPrompt({ assessment, session, extraContext }) {
  const tasks = Array.isArray(assessment?.tasks) ? assessment.tasks : [];
  const taskText = tasks
    .slice(0, 1)
    .map((t) => `Task: ${t.title}\n${t.prompt}`)
    .join('\n\n');

  const code = String(session?.live?.code || '').slice(0, 8000);

  const mistakes = session?.live?.memoryBank?.mistakes || {};
  const mistakeKeys = Object.keys(mistakes);
  const mistakeSummary = mistakeKeys.length
    ? `Recent issues: ${mistakeKeys
        .slice(0, 5)
        .map((k) => `${k}(${mistakes[k]})`)
        .join(', ')}`
    : '';

  return [
    `Assessment: ${assessment?.title || 'Unknown'}`,
    taskText,
    mistakeSummary,
    extraContext ? `Context: ${extraContext}` : '',
    'Current attempt (partial code, do NOT solve it for me):',
    code,
    'Give a non-spoiler hint only.',
  ]
    .filter(Boolean)
    .join('\n\n');
}

async function streamHint({ clients, sessionId, hintObj }) {
  const hintText = String(hintObj?.hint || '').trim();
  const words = hintText.split(/(\s+)/).filter((w) => w.length > 0);
  const hintId = `${sessionId}:${now()}`;

  broadcast(clients, { type: 'HINT_STREAM_START', sessionId, hintId });

  // Fast, perception-friendly streaming; keep it simple.
  for (let i = 0; i < words.length; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 15));
    broadcast(clients, {
      type: 'HINT_STREAM_CHUNK',
      sessionId,
      hintId,
      chunk: words[i],
    });
  }

  broadcast(clients, {
    type: 'HINT_STREAM_END',
    sessionId,
    hintId,
    hint: hintText,
    style: hintObj?.style || 'non-spoiler',
  });
}

function attachWsServer({ server, config }) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  // sessionId -> { clients:Set<WebSocket>, interval: NodeJS.Timeout }
  const sessionRooms = new Map();

  function getRoom(sessionId) {
    let room = sessionRooms.get(sessionId);
    if (!room) {
      room = { clients: new Set(), interval: null };
      sessionRooms.set(sessionId, room);
    }
    return room;
  }

  async function maybeAutoHint(sessionId) {
    const session = sessionService.getSessionById(sessionId);
    if (!session || session.status !== 'IN_PROGRESS') return;
    const assessment = assessmentService.getAssessmentById(session.assessmentId);
    if (!assessment) return;

    const lastEditAt = session?.live?.lastEditAt;
    if (!lastEditAt) return;

    const idleMs = now() - lastEditAt;
    const lastHintAt = session?.live?.lastHintAt ?? 0;
    const sinceHintMs = now() - lastHintAt;

    // Heuristics: nudge at ~25s idle, broader at ~60s idle.
    const shouldHint = idleMs >= 25_000 && sinceHintMs >= 45_000;
    if (!shouldHint) return;

    const attemptNumber = (session?.live?.hintAttempts || 0) + 1;
    session.live.hintAttempts = attemptNumber;
    session.live.hintsUsed = (session.live.hintsUsed || 0) + 1;
    session.live.lastHintAt = now();

    const extraContext =
      idleMs >= 60_000
        ? 'User seems stuck; give an architectural / strategy-level tip.'
        : 'User seems stuck; give a small conceptual nudge.';

    const prompt = buildHintPrompt({ assessment, session, extraContext });

    let hint;
    try {
      hint = await mentorService.getHint({
        prompt,
        attemptNumber,
        config,
      });
    } catch (err) {
      logger.warn('Auto-hint failed', { sessionId, message: err?.message });
      return;
    }

    try {
      ghostReplayService.appendEvent({
        sessionId,
        type: 'HINT',
        payload: { hint: hint.hint, style: hint.style, auto: true },
      });
    } catch {
      // ignore replay failures
    }

    const room = getRoom(sessionId);
    await streamHint({ clients: room.clients, sessionId, hintObj: hint });
  }

  function ensureRoomInterval(sessionId) {
    const room = getRoom(sessionId);
    if (room.interval) return;

    room.interval = setInterval(() => {
      maybeAutoHint(sessionId).catch(() => null);
    }, 5_000);
    room.interval.unref?.();
  }

  function cleanupRoomIfEmpty(sessionId) {
    const room = sessionRooms.get(sessionId);
    if (!room) return;
    if (room.clients.size > 0) return;

    if (room.interval) clearInterval(room.interval);
    sessionRooms.delete(sessionId);
  }

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url, 'http://localhost');
    const sessionId = url.searchParams.get('sessionId') || '';

    const session = sessionService.getSessionById(sessionId);
    if (!session) {
      wsSend(ws, {
        type: 'ERROR',
        code: 'SESSION_NOT_FOUND',
        message: 'Session not found',
      });
      ws.close();
      return;
    }

    const room = getRoom(sessionId);
    room.clients.add(ws);
    ensureRoomInterval(sessionId);

    // Send snapshot for session persistence.
    wsSend(ws, {
      type: 'WELCOME',
      sessionId,
      snapshot: {
        code: session?.live?.code || '',
        language: session?.live?.language || 'javascript',
        version: session?.live?.version || 0,
      },
      hintsUsed: session?.live?.hintsUsed || 0,
      serverTime: now(),
    });

    ws.on('message', async (buf) => {
      const msg = safeJsonParse(buf);
      if (!msg || typeof msg?.type !== 'string') {
        wsSend(ws, {
          type: 'ERROR',
          code: 'BAD_MESSAGE',
          message: 'Invalid message',
        });
        return;
      }

      const s = sessionService.getSessionById(sessionId);
      if (!s) {
        wsSend(ws, {
          type: 'ERROR',
          code: 'SESSION_NOT_FOUND',
          message: 'Session not found',
        });
        return;
      }

      // touch activity
      if (!s.live) s.live = {};
      s.live.lastActivityAt = now();

      if (msg.type === 'PING') {
        wsSend(ws, { type: 'PONG', sessionId, ts: now() });
        return;
      }

      if (msg.type === 'EDITOR_SYNC') {
        if (s.status !== 'IN_PROGRESS') return;
        const code = typeof msg.code === 'string' ? msg.code : '';
        const language = typeof msg.language === 'string' ? msg.language : 'javascript';
        const version = clampInt(msg.version, 0, 1_000_000_000, (s.live.version || 0) + 1);

        const prevLen = typeof s.live.code === 'string' ? s.live.code.length : 0;
        const prevEditAt = s.live.lastEditAt || null;

        s.live.code = code.slice(0, 200_000); // hard cap
        s.live.language = language.slice(0, 40);
        s.live.version = version;
        s.live.lastEditAt = now();

        // Authenticity heuristic: sudden large jump in a very short time window.
        const newLen = s.live.code.length;
        const delta = Math.abs(newLen - prevLen);
        const dt = prevEditAt ? now() - prevEditAt : null;
        const pasteSuspected = delta >= 250 && dt !== null && dt <= 900;

        try {
          ghostReplayService.appendEvent({
            sessionId,
            type: 'KEYSTROKE',
            payload: {
              version,
              language: s.live.language,
              code: s.live.code,
            },
            ts: msg.ts,
          });

          if (pasteSuspected) {
            ghostReplayService.appendEvent({
              sessionId,
              type: 'CUSTOM',
              payload: {
                flag: 'PASTE_SUSPECTED',
                delta,
                dtMs: dt,
                version,
              },
              ts: msg.ts,
            });
          }
        } catch {
          // ignore replay errors
        }

        broadcast(room.clients, {
          type: 'CODE_UPDATE',
          sessionId,
          code: s.live.code,
          language: s.live.language,
          version: s.live.version,
        }, ws);

        wsSend(ws, { type: 'ACK', sessionId, ack: 'EDITOR_SYNC', version });
        return;
      }

      if (msg.type === 'REQUEST_HINT') {
        if (s.status !== 'IN_PROGRESS') return;
        const assessment = assessmentService.getAssessmentById(s.assessmentId);
        if (!assessment) {
          wsSend(ws, {
            type: 'ERROR',
            code: 'ASSESSMENT_NOT_FOUND',
            message: 'Assessment not found',
          });
          return;
        }

        const userPrompt = typeof msg.prompt === 'string' ? msg.prompt : '';
        const attemptNumber = (s?.live?.hintAttempts || 0) + 1;
        s.live.hintAttempts = attemptNumber;
        s.live.hintsUsed = (s.live.hintsUsed || 0) + 1;
        s.live.lastHintAt = now();

        const prompt = buildHintPrompt({
          assessment,
          session: s,
          extraContext: userPrompt ? `User asked: ${userPrompt}` : null,
        });

        let hint;
        try {
          hint = await mentorService.getHint({ prompt, attemptNumber, config });
        } catch (err) {
          wsSend(ws, {
            type: 'ERROR',
            code: 'HINT_FAILED',
            message: 'Hint generation failed',
          });
          return;
        }

        try {
          ghostReplayService.appendEvent({
            sessionId,
            type: 'HINT',
            payload: { hint: hint.hint, style: hint.style, auto: false },
          });
        } catch {
          // ignore
        }

        await streamHint({ clients: room.clients, sessionId, hintObj: hint });
        return;
      }

      if (msg.type === 'RUN_RESULT') {
        if (s.status !== 'IN_PROGRESS') return;
        const outcome = typeof msg.outcome === 'string' ? msg.outcome : 'unknown';
        const errorCode = typeof msg.errorCode === 'string' ? msg.errorCode : null;
        const timeMs = Number.isFinite(msg.timeMs) ? msg.timeMs : null;

        if (!s.live.memoryBank) s.live.memoryBank = { mistakes: {}, lastRun: null };
        s.live.memoryBank.lastRun = { outcome, errorCode, timeMs, ts: now() };
        if (errorCode) {
          s.live.memoryBank.mistakes[errorCode] = (s.live.memoryBank.mistakes[errorCode] || 0) + 1;
        }

        try {
          ghostReplayService.appendEvent({
            sessionId,
            type: 'RUN',
            payload: { outcome, errorCode, timeMs },
            ts: msg.ts,
          });
        } catch {
          // ignore
        }

        wsSend(ws, { type: 'ACK', sessionId, ack: 'RUN_RESULT' });
        return;
      }

      wsSend(ws, {
        type: 'ERROR',
        code: 'UNKNOWN_TYPE',
        message: `Unknown message type: ${msg.type}`,
      });
    });

    ws.on('close', () => {
      room.clients.delete(ws);
      cleanupRoomIfEmpty(sessionId);
    });

    ws.on('error', (err) => {
      logger.warn('WS error', { sessionId, message: err?.message });
    });
  });

  logger.info('WebSocket server attached at /ws');

  return { wss };
}

module.exports = { attachWsServer, toWsBaseUrl };
