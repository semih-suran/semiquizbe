import request from 'supertest';
import { app, initServices, shutdownServices } from '../index';
import { seedTestData, teardownTestData } from '../__test/seedTestData';

describe('Questions API (integration) with deterministic seed', () => {
  const seededQuestionId = 'test_seed_q1';

  beforeAll(async () => {
    await initServices();
    await seedTestData();
  }, 20000);

  afterAll(async () => {
    await teardownTestData();
    await shutdownServices();
  });

  it('GET /questions returns safe DTO (no correct_option_id) and includes seeded question when filtered by TEST', async () => {
    const res = await request(app).get('/questions?country=TEST&limit=5');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);

    // find our seeded question in the returned array (if random ordering, search)
    const found = (res.body as any[]).find((q) => q.id === seededQuestionId);
    // It should be present
    expect(found).toBeDefined();
    if (found) {
      expect(found).not.toHaveProperty('correct_option_id');
      expect(found).toHaveProperty('question', 'What is 2 + 2?');
      expect(found).toHaveProperty('options');
      expect(Array.isArray(found.options)).toBe(true);
    }
  });

  it('POST /questions/:id/answer returns isCorrect true when correct option provided', async () => {
    const res = await request(app)
      .post(`/questions/${seededQuestionId}/answer`)
      .send({ selected_option_id: 'test_seed_q1_o1' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('isCorrect', true);
    expect(res.body).toHaveProperty('correct_option_id', 'test_seed_q1_o1');
    expect(res.body).toHaveProperty('explanation');
  });

  it('POST /questions/:id/answer returns isCorrect false when wrong option provided', async () => {
    const res = await request(app)
      .post(`/questions/${seededQuestionId}/answer`)
      .send({ selected_option_id: 'test_seed_q1_o2' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('isCorrect', false);
    expect(res.body).toHaveProperty('correct_option_id', 'test_seed_q1_o1');
  });
});
