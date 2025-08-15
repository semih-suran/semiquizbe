import { AppDataSource } from '../../src/data-source';

export default async function globalSetup() {
  // Initialize TypeORM and run migrations so tests run on a prepared DB
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  // Run migrations (idempotent)
  try {
    await AppDataSource.runMigrations();
    console.log('globalSetup: migrations applied');
  } catch (err) {
    console.warn(
      'globalSetup: runMigrations failed (tests may still proceed):',
      (err as Error).message || err
    );
  }
  // keep connection open; globalTeardown will close it
}
