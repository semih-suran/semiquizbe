import pool from './config/db';
import redis from './config/redis';

// Quick test for Postgres
pool.query('SELECT 1+1 AS two')
  .then(res => console.log('Postgres test:', res.rows))
  .catch(err => console.error('Postgres error:', err));

// Quick test for Redis
redis.set('ping', 'pong')
  .then(() => redis.get('ping'))
  .then(val => console.log('Redis test:', val))
  .catch(err => console.error('Redis error:', err));
