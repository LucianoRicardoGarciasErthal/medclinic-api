import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/User.js';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.DB_LOGGING === 'true',
  entities: [User],
  migrations: ['src/database/migrations/*.ts'],
  migrationsTableName: 'migrations',
});