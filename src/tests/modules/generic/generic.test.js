require('dotenv').config();
const { agent, Response } = require('supertest');
const { bootstrap } = require('./../../../lib');
let app = null;

beforeAll( async () => {
  app = await bootstrap();
});

afterAll(() =>  app = null);

describe('API Availability', () => {
  test('Health check should pass', async (done) => {
    try {
      const response = await agent(app).get('/api/v1/users/health');
      expect(response.status).toBe(200);
    } catch (e) {
      expect(e).toMatch('error');
    } finally {
      await done();
    }
  });
});
