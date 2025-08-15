import { AppDataSource } from '../../src/data-source';
import { Question } from '../../src/entities/Question';
import { User } from '../../src/entities/User'; // ensure this file exists
import { In } from 'typeorm';

const SEED_QUESTION_ID = 'test_seed_q1';
const SEED_USER_GOOGLE_SUB = 'test-seed-sub-1';

export async function seedTestData(): Promise<void> {
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  const qRepo = AppDataSource.getRepository(Question);

  const seedQuestion = {
    id: SEED_QUESTION_ID,
    country_code: 'TEST',
    question: 'What is 2 + 2?',
    options_json: [
      { id: 'test_seed_q1_o1', text: '4' },
      { id: 'test_seed_q1_o2', text: '3' },
      { id: 'test_seed_q1_o3', text: '22' },
    ],
    correct_option_id: 'test_seed_q1_o1',
    explanation: '2 + 2 equals 4.',
    source_url_json: ['https://example.com/math'],
    category: 'Math',
    difficulty: 'Easy',
    time_limit_seconds: 30,
    language: 'en',
    tags_json: ['arithmetic', 'seed'],
    created_by: 'seed-script',
    review_status: 'approved',
  };

  // Upsert question (works whether or not it already exists)
  await qRepo.save(seedQuestion as any);

  // Seed a user using repository methods (avoid passing nulls in .values())
  try {
    const userRepo = AppDataSource.getRepository(User);

    // Build the user object conditionally — omit avatar_url if null/undefined
    const userToInsert: Partial<User> = {
      google_sub: SEED_USER_GOOGLE_SUB,
      display_name: 'Seed User',
      country_hint: 'TEST',
    };

    // Only set avatar_url when you have a non-null value
    // (If you need to insert explicit NULL in DB, that's possible but often unnecessary for tests)
    // userToInsert.avatar_url = someValueOrUndefined;

    await userRepo
      .createQueryBuilder()
      .insert()
      .values(userToInsert)
      .orIgnore() // Postgres: ON CONFLICT DO NOTHING; ts-friendly
      .execute();
  } catch (err) {
    // If users table doesn't exist yet, warn and continue.
    // globalSetup (migrations) should prevent this, but be tolerant.
    console.warn(
      'seedTestData: users table not found or insert failed; skipping user insert. Err:',
      (err as Error).message || err
    );
  }
}

export async function teardownTestData(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      const qRepo = AppDataSource.getRepository(Question);
      await qRepo.delete({ id: SEED_QUESTION_ID });

      // Try delete user if table/entity is present
      try {
        const userRepo = AppDataSource.getRepository(User);
        await userRepo.delete({ google_sub: SEED_USER_GOOGLE_SUB });
      } catch (err) {
        console.warn(
          'teardownTestData: could not delete seeded user (maybe users table missing):',
          (err as Error).message || err
        );
      }
    } else {
      console.warn(
        'teardownTestData: TypeORM not initialized; skipping deletion.'
      );
    }
  } catch (err) {
    console.error(
      'teardownTestData: unexpected error',
      (err as Error).message || err
    );
  }
}
