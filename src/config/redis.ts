import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
export const redis = new Redis(redisUrl);

redis.on('error', (err) => {
  console.error('Redis error', err);
});

export default redis;
