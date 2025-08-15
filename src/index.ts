import express from 'express';
import dotenv from 'dotenv';
import pool from './config/db';
import redis from './config/redis';
import { AppDataSource } from './data-source';
import questionsRouter from './routes/questions';
import sessionsRouter from './routes/sessions';

dotenv.config();

const app = express();
app.use(express.json());

app.get('/ping', (_req, res) => res.send('pong'));

app.get('/health', async (_req, res) => {
  const checks: Record<string, any> = {
    redis: false,
    postgres: false,
    typeorm: false,
  };

  try {
    const val = await redis.get('ping');
    checks.redis = val === 'pong';
  } catch (_err) {
    checks.redis = false;
  }

  try {
    const r = await pool.query('SELECT 1+1 AS two');
    checks.postgres =
      Array.isArray(r.rows) &&
      r.rows.length > 0 &&
      (r.rows[0] as any).two === 2;
  } catch (_err) {
    checks.postgres = false;
  }

  checks.typeorm = !!AppDataSource.isInitialized;
  const healthy = checks.redis && checks.postgres && checks.typeorm;
  res.status(healthy ? 200 : 503).json({ healthy, checks });
});

app.use('/questions', questionsRouter);

app.use('/session', sessionsRouter);

async function initServices(): Promise<void> {
  // TypeORM
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      if (process.env.NODE_ENV !== 'test')
        console.log('✅ TypeORM Data Source initialized');
    } catch (err) {
      console.error('❌ Error initializing TypeORM:', err);
    }
  }

  // Postgres pool test
  try {
    const res = await pool.query('SELECT 1+1 AS two');
    if (process.env.NODE_ENV !== 'test')
      console.log('✅ Postgres connected:', res.rows);
  } catch (err) {
    console.error('❌ Postgres error:', err);
  }

  // Redis: explicit connect (because we used lazyConnect:true)
  try {
    // connect only if not already connected
    if ((redis as any).status !== 'ready') {
      // ioredis connect returns a promise
      await (redis as any).connect();
    }
    // perform a quick set/get to verify
    await redis.set('ping', 'pong');
    const val = await redis.get('ping');
    if (process.env.NODE_ENV !== 'test')
      console.log('✅ Redis connected:', val);
  } catch (err) {
    console.error('❌ Redis error:', err);
  }
}

async function shutdownServices(): Promise<void> {
  try {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🛑 TypeORM connection closed');
    }
  } catch (err) {
    console.error('Error closing TypeORM:', err);
  }

  try {
    await pool.end();
    console.log('🛑 Postgres pool closed');
  } catch (err) {
    console.error('Error closing Postgres pool:', err);
  }

  try {
    // remove listeners
    try {
      (redis as any).removeAllListeners?.();
    } catch (_) {}
    // try graceful quit with timeout
    const quitPromise = (redis as any).quit
      ? (redis as any).quit()
      : Promise.resolve();
    const quitOk = await Promise.race([
      quitPromise.then(() => true).catch(() => false),
      new Promise<boolean>((r) => setTimeout(() => r(false), 1200)),
    ]);
    if (!quitOk) {
      try {
        (redis as any).disconnect?.();
      } catch (_) {}
    }
    // extra force: close internal stream(s)
    try {
      const clientAny = redis as any;
      const maybeStream =
        clientAny.connector?.stream ??
        clientAny.stream ??
        clientAny._socket ??
        null;
      if (maybeStream) {
        try {
          maybeStream.end?.();
        } catch (_) {}
        setTimeout(() => {
          try {
            maybeStream.destroy?.();
          } catch (_) {}
        }, 50);
      }
    } catch (_) {}
    await new Promise((r) => setTimeout(r, 160));
    console.log('🛑 Redis client closed (best-effort)');
  } catch (err) {
    console.error('Error closing Redis client:', err);
  }
}

// Start app when not testing
if (process.env.NODE_ENV !== 'test') {
  initServices()
    .then(() => {
      const PORT = process.env.PORT || 3000;
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Startup error:', err);
      process.exit(1);
    });
}

export { app, initServices, shutdownServices };
