const request = require('supertest');

const { createApp } = require('../src/app');

describe('GET /api/v1/health', () => {
  it('returns ok', async () => {
    const app = await createApp({
      config: {
        corsOrigin: '*',
      },
    });

    const res = await request(app).get('/api/v1/health');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
