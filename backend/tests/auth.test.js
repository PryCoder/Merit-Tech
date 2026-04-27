const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');

const { createApp } = require('../src/app');
const { connectMongo, disconnectMongo } = require('../src/loaders/mongoose');

describe('Auth', () => {
  let mongo;
  let config;

  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    config = {
      corsOrigin: '*',
      hashSalt: 'test-salt-12345678',
      mongodb: { uri: mongo.getUri(), enabled: true },
      auth: { jwtSecret: 'test-jwt-secret-1234567890', jwtExpiresIn: '1h' },
      grok: { enabled: false },
    };

    await connectMongo({ uri: config.mongodb.uri });
  });

  afterAll(async () => {
    await disconnectMongo();
    if (mongo) await mongo.stop();
  });

  it('registers and logs in', async () => {
    const app = await createApp({ config });

    const reg = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email: 'user@example.com',
        password: 'Password123!',
        name: 'User',
      });

    expect(reg.statusCode).toBe(201);
    expect(reg.body.token).toBeTruthy();
    expect(reg.body.user.email).toBe('user@example.com');

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'user@example.com', password: 'Password123!' });

    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeTruthy();
  });
});
