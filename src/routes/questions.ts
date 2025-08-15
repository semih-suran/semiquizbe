import { Router } from 'express';
import { AppDataSource } from '../data-source';
import { Question } from '../entities/Question';

const router = Router();
const questionRepo = AppDataSource.getRepository(Question);

// GET /questions?country=CN&limit=5
router.get('/', async (req, res) => {
  try {
    const { country, limit = 10 } = req.query;

    const query = questionRepo.createQueryBuilder('q');

    if (country) {
      query.where('q.country_code = :country', { country });
    }

    query.orderBy('RANDOM()').limit(Number(limit));

    const questions = await query.getMany();

    // Safe DTO: remove correct_option_id
    const safeQuestions = questions.map((q) => ({
      id: q.id,
      country_code: q.country_code,
      question: q.question,
      options: q.options_json,
      category: q.category,
      difficulty: q.difficulty,
      time_limit_seconds: q.time_limit_seconds,
      tags: q.tags_json,
    }));

    res.json(safeQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// POST /questions/:id/answer
router.post('/:id/answer', async (req, res) => {
  try {
    const { id } = req.params;
    const { selected_option_id } = req.body;

    if (!selected_option_id) {
      return res.status(400).json({ error: 'selected_option_id is required' });
    }

    const question = await questionRepo.findOne({ where: { id } });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const isCorrect = question.correct_option_id === selected_option_id;

    res.json({
      isCorrect,
      correct_option_id: question.correct_option_id,
      explanation: question.explanation,
      source_url: question.source_url_json,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to check answer' });
  }
});

export default router;
