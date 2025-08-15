import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isCompiled = path.extname(__filename) === '.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false, // Never true in production
  logging: true,
  entities: [
    isCompiled
      ? path.join(__dirname, '/entities/*.js')
      : path.join(__dirname, '/entities/*.ts'),
  ],
  migrations: [
    isCompiled
      ? path.join(__dirname, '/migrations/*.js')
      : path.join(__dirname, '/migrations/*.ts'),
  ],
});
