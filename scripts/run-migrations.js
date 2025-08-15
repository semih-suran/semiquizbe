const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function run() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL || 'postgres://quiz:quiz_pass@localhost:5432/quizdb' });
  const client = await pool.connect();
  try {
    const files = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();
    for (const f of files) {
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, f), 'utf8');
      console.log('=== Running', f);
      await client.query(sql);
    }
    console.log('All migrations applied.');
    await client.release();
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    await client.release();
    await pool.end();
    process.exit(2);
  }
}

run();
