const request = require('supertest');
const jwt = require('jsonwebtoken');

const { createApp } = require('../src/app');
const { resetStore } = require('../src/models/store');

describe('Assessment generation (recruiter)', () => {
  beforeEach(() => resetStore());

  it('requires auth', async () => {
    const app = await createApp({
      config: {
        corsOrigin: '*',
        hashSalt: 'test-salt-12345678',
        auth: { jwtSecret: 'test-secret-1234567890', jwtExpiresIn: '1h' },
      },
    });

    const res = await request(app).post('/api/v1/assessments/generate').send({
      jobDescription: 'We need a backend engineer to build APIs and tests. Must know Node and Mongo.',
    });

    expect(res.statusCode).toBe(401);
  });

  it('generates an assessment for recruiter', async () => {
    const secret = 'test-secret-1234567890';
    const app = await createApp({
      config: {
        corsOrigin: '*',
        hashSalt: 'test-salt-12345678',
        auth: { jwtSecret: secret, jwtExpiresIn: '1h' },
        grok: { enabled: false },
      },
    });

    const token = jwt.sign(
      { sub: 'recruiter-1', role: 'recruiter', email: 'r@example.com' },
      secret,
      { expiresIn: '1h' }
    );

    const res = await request(app)
      .post('/api/v1/assessments/generate')
      .set('Authorization', `Bearer ${token}`)
      .send({
        jobDescription:
          'Hiring a full-stack engineer. Build REST APIs with validation. Write tests. Use Node.js and MongoDB. Bonus: websockets.',
        titleHint: 'Full-stack screening',
        tasksCount: 2,
        techStack: ['node', 'mongodb'],
        difficulty: 'medium',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.assessment).toBeTruthy();
    expect(res.body.assessment.title).toBeTruthy();
    expect(Array.isArray(res.body.assessment.tasks)).toBe(true);
    expect(res.body.assessment.tasks.length).toBeGreaterThan(0);
  });
});
