import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';
import knex, { type Knex } from 'knex';

dotenv.config({
  path: resolve(__dirname, '../../.env'),
  override: true,
});

function env(key: string): string {
  const v = process.env[key];

  if (typeof v === 'string' && v.trim()) return v.trim();

  const file = process.env[`${key}_FILE`];

  if (typeof file === 'string' && file.trim()) {
    try {
      return readFileSync(file.trim(), 'utf8').trim();
    } catch {
      return '';
    }
  }

  return '';
}

const developmentConfig: Knex.Config = {
  client: 'mssql',
  connection: {
    server: env('HOST'),
    user: env('USER'),
    password: env('PASSWORD'),
    database: env('DATABASE'),
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
};

export const db = knex(developmentConfig);

export const DB = Symbol('DB');

export const dbProvider = {
  provide: DB,
  useValue: db,
};