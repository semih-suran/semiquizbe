import { Pool } from 'pg';

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pgPool.on('error', (err: Error) => {
  console.error('Unexpected PG idle client error', err);
  process.exit(-1);
});

export default pgPool;
