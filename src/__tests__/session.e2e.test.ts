import request from 'supertest';
import { app, initServices, shutdownServices } from '../index';
import { seedTestData, teardownTestData } from '../__test/seedTestData';

describe('Session lifecycle e2e (scaffold) - enable when endpoints exist', () => {
  let seededQuestionId = 'test_seed_q1';
  let jwtToken = ''; // set if auth required
  let sessionId: string | null = null;

  beforeAll(async () => {
    await initServices();
    await seedTestData();
    // Optionally create or obtain a test user and jwtToken here
  }, 20000);

  afterAll(async () => {
    await teardownTestData();
    await shutdownServices();
  });

  it('POST /session/start should return a session with first question', async () => {
    const res = await request(app)
      .post('/session/start')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ countryCode: 'TEST' });

    // Example expected shape; adapt to your implementation
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('sessionId');
    expect(res.body).toHaveProperty('firstQuestion');
    sessionId = res.body.sessionId;
  });

  it('POST /session/answer - correct answer continues or completes', async () => {
    if (!sessionId) return;

    const res = await request(app)
      .post('/session/answer')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({
        sessionId,
        questionId: seededQuestionId,
        chosenOptionId: 'test_seed_q1_o1',
        clientTs: Date.now(),
      });

    expect(res.status).toBe(200);
    // expect res.body to indicate correct and maybe nextQuestion
  });

  // further tests for wrong-answer termination, pause/resume, complete & leaderboard
});
