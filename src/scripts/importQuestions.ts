import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../data-source';
import { Question } from '../entities/Question';

async function importQuestions() {
  await AppDataSource.initialize();

  const rawDir = path.join(__dirname, '../../data/questions_raw');
  const files = fs.readdirSync(rawDir).filter((f) => f.endsWith('.json'));

  let imported = 0;
  let skipped = 0;

  for (const file of files) {
    console.log(`📂 Importing from ${file}...`);
    const content = fs.readFileSync(path.join(rawDir, file), 'utf8');
    const questions = JSON.parse(content);

    for (const q of questions) {
      // Validation
      if (!q.id) throw new Error(`Missing ID in ${file}`);
      if (!Array.isArray(q.options) || q.options.length < 2) {
        throw new Error(`Invalid options in ${q.id}`);
      }
      if (
        !q.correct_option_id ||
        !q.options.find(
          (o: { id: string; text: string }) => o.id === q.correct_option_id
        )
      ) {
        throw new Error(`Correct option missing/invalid for ${q.id}`);
      }
      if (q.time_limit_seconds < 5 || q.time_limit_seconds > 120) {
        throw new Error(`Invalid time limit in ${q.id}`);
      }

      const repo = AppDataSource.getRepository(Question);
      const exists = await repo.findOne({ where: { id: q.id } });

      if (exists) {
        console.log(`⏩ Skipping duplicate ID: ${q.id}`);
        skipped++;
        continue;
      }

      await repo.save({
        id: q.id,
        country_code: q.country_code,
        question: q.question,
        options_json: q.options,
        correct_option_id: q.correct_option_id,
        explanation: q.explanation || null,
        source_url_json: q.source_url || [],
        category: q.category,
        difficulty: q.difficulty,
        time_limit_seconds: q.time_limit_seconds,
        language: q.language || null,
        tags_json: q.tags || [],
        created_by: q.created_by || null,
        review_status: 'pending',
      });
      imported++;
    }
  }

  console.log(`✅ Imported: ${imported} | ⏩ Skipped: ${skipped}`);
  await AppDataSource.destroy();
}

importQuestions().catch((err) => {
  console.error('❌ Import failed:', err);
  process.exit(1);
});
