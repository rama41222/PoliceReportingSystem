require('dotenv').config();
const { OK, BAD_REQUEST } = require('http-status');
const { agent, Response } = require('supertest');
const { bootstrap } = require('./../../../lib');
let app = null;

beforeAll( async () => {
  app = await bootstrap();
});

afterAll(() =>  app = null);

describe('Users', () => {
  test('create user without reports', async (done) => {
    try {
      const response = await agent(app).post('/api/v1/users').send({ name: 'p1' });
      expect(response.status).toBe(OK);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('is_occupied');
      expect(response.body).toHaveProperty('modified');
      expect(response.body).toHaveProperty('created');
      expect(response.body.is_occupied).toBeFalsy();
      expect(response.body.id).to.satisfy(Number.isInteger);
      expect(response.body.name).toContain('p1');
    } catch (e) {
      expect(e).toMatch('Police officers are not available');
    } finally {
      await done();
    }
  });
});
