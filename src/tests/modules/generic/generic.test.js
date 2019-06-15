require('dotenv').config();
const { OK } = require('http-status');
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
      const response = await agent(app).get('/api/v1/health');
      expect(response.status).toBe(OK);
    } catch (e) {
      expect(e).toMatch('error');
    } finally {
      await done();
    }
  });
});
