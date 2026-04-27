const request = require('supertest');

const { createApp } = require('../src/app');
const { resetStore } = require('../src/models/store');

describe('Merit-Loop core flow', () => {
  beforeEach(() => {
    resetStore();
  });

  it('creates assessment, submits sessions, returns ranked list', async () => {
    const app = await createApp({
      config: {
        corsOrigin: '*',
        hashSalt: 'test-salt-12345678',
      },
    });

    const assessmentRes = await request(app)
      .post('/api/v1/assessments')
      .send({
        title: 'Arrays - Two Sum',
        description: 'Basic assessment',
        revealThreshold: 100,
        tasks: [{ title: 'Two Sum', prompt: 'Find two numbers...' }],
      });

    expect(assessmentRes.statusCode).toBe(201);
    const assessmentId = assessmentRes.body.assessment.id;

    // Candidate A
    const sessionA = await request(app)
      .post(`/api/v1/assessments/${assessmentId}/sessions`)
      .send({ candidateName: 'A', candidateEmail: 'a@example.com' });
    expect(sessionA.statusCode).toBe(201);

    const sessionAId = sessionA.body.session.id;

    await request(app)
      .post(`/api/v1/sessions/${sessionAId}/submit`)
      .send({ passed: true, timeMs: 120_000, hintsUsed: 0 });

    // Candidate B (worse score)
    const sessionB = await request(app)
      .post(`/api/v1/assessments/${assessmentId}/sessions`)
      .send({ candidateName: 'B', candidateEmail: 'b@example.com' });

    const sessionBId = sessionB.body.session.id;

    await request(app)
      .post(`/api/v1/sessions/${sessionBId}/submit`)
      .send({ passed: true, timeMs: 600_000, hintsUsed: 3 });

    const rankingRes = await request(app).get(
      `/api/v1/assessments/${assessmentId}/rankings`
    );

    expect(rankingRes.statusCode).toBe(200);
    expect(rankingRes.body.ranking.length).toBe(2);

    const [first, second] = rankingRes.body.ranking;
    expect(first.score.score).toBeGreaterThanOrEqual(second.score.score);

    // anonymity preserved unless threshold met
    expect(first.candidate.publicId).toBeTruthy();
    expect(Object.prototype.hasOwnProperty.call(first.candidate, 'email')).toBe(
      false
    );
  });

  it('reveals candidate identity when merit score meets threshold', async () => {
    const app = await createApp({
      config: {
        corsOrigin: '*',
        hashSalt: 'test-salt-12345678',
      },
    });

    const assessmentRes = await request(app)
      .post('/api/v1/assessments')
      .send({
        title: 'Fast',
        revealThreshold: 50,
        tasks: [{ title: 'T', prompt: 'P' }],
      });

    const assessmentId = assessmentRes.body.assessment.id;

    const sessionRes = await request(app)
      .post(`/api/v1/assessments/${assessmentId}/sessions`)
      .send({ candidateName: 'Jane', candidateEmail: 'jane@example.com' });

    const sessionId = sessionRes.body.session.id;

    const submitRes = await request(app)
      .post(`/api/v1/sessions/${sessionId}/submit`)
      .send({
        passed: true,
        timeMs: 30_000,
        hintsUsed: 0,
        testsPassed: 1,
        testsTotal: 1,
      });

    expect(submitRes.statusCode).toBe(200);
    expect(submitRes.body.candidate.revealed).toBe(true);
    expect(submitRes.body.candidate.email).toBe('jane@example.com');
  });
});
