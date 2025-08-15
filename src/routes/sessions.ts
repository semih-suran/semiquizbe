import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Question } from '../entities/Question';

const router = Router();

/**
 * POST /session/start
 * Body: { countryCode?: string }
 * Returns: { sessionId, firstQuestion } where firstQuestion DOES NOT include correct_option_id
 */
router.post('/start', async (req, res) => {
  const country = (
    req.body?.countryCode ||
    req.query?.country ||
    'US'
  ).toString();
  try {
    const qRepo = AppDataSource.getRepository(Question);
    // pick one random question for the country (test uses 'TEST')
    const q = await qRepo
      .createQueryBuilder('q')
      .where('q.country_code = :country', { country })
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();

    if (!q)
      return res.status(404).json({ error: 'No question found for country' });

    // safe DTO: do NOT include `correct_option_id`
    const safeQuestion = {
      id: q.id,
      country_code: q.country_code,
      question: q.question,
      options: q.options_json, // keep structure front-end expects
      explanation: undefined, // keep it hidden on start
      category: q.category,
      difficulty: q.difficulty,
      time_limit_seconds: q.time_limit_seconds,
      language: q.language,
      tags: q.tags_json,
    };

    const sessionId = `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;

    return res.status(200).json({ sessionId, firstQuestion: safeQuestion });
  } catch (err) {
    console.error('session.start error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /session/answer
 * Body: { sessionId?, questionId, chosenOptionId }
 * Returns: { isCorrect: boolean, correct_option_id }
 *
 * (Minimal: does not persist anything. Good for tests and CI.)
 */
router.post('/answer', async (req, res) => {
  const questionId = req.body?.questionId || req.body?.question_id;
  const chosenOptionId =
    req.body?.chosenOptionId ||
    req.body?.chosen_option_id ||
    req.body?.selected_option_id;

  if (!questionId || !chosenOptionId) {
    return res
      .status(400)
      .json({ error: 'questionId and chosenOptionId required' });
  }

  try {
    const qRepo = AppDataSource.getRepository(Question);
    const q = await qRepo.findOne({ where: { id: questionId } as any }); // keep as any to avoid strict typing issues

    if (!q) return res.status(404).json({ error: 'Question not found' });

    const isCorrect = q.correct_option_id === chosenOptionId;

    // Minimal response for tests. Later you can mask correct_option_id until needed.
    return res
      .status(200)
      .json({ isCorrect, correct_option_id: q.correct_option_id });
  } catch (err) {
    console.error('session.answer error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
