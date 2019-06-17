require('dotenv').config();
const { OK, BAD_REQUEST } = require('http-status');
const { agent, Response } = require('supertest');
const { bootstrap } = require('./../../../lib');
let app = null;

beforeAll( async () => {
  app = await bootstrap();
});

afterAll(() =>  app = null);

describe('Reports', () => {
  test('create report', async (done) => {
    try {
      const response = await agent(app).post('/api/v1/reports').send({
        owner: 'O1',
        reg_number:'3243',
        color: 'green',
        stolen_date: '15/06/19',
        description: 'green color racing bike lost',
      });
      expect(response.status).toBe(OK);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('owner');
      expect(response.body).toHaveProperty('reg_number');
      expect(response.body).toHaveProperty('color');
      expect(response.body).toHaveProperty('stolen_date');
      expect(response.body).toHaveProperty('description');
      expect(response.body).toHaveProperty('modified');
      expect(response.body).toHaveProperty('created');
      expect(response.body.id).to.satisfy(Number.isInteger);
      expect(response.body.status).toEqual('PENDING');
    } catch (e) {
      expect(e).toMatch('All reports have been resolved');
    } finally {
      await done();
    }
  });
});
