import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_URL =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || '127.0.0.1'}:${process.env.REDIS_PORT || 6379}`;

// Use lazyConnect:true so the client does NOT open socket immediately on require/import.
// This prevents a background handle before tests call initServices().
const redis = new Redis(REDIS_URL, { lazyConnect: true });

// Keep error logging guarded to not spam tests (initServices() will log successes)
redis.on('error', (err: unknown) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error('❌ Redis error:', err);
  }
});

export default redis;
