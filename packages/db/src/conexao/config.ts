import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import dotenv from 'dotenv';
import knex, { type Knex } from 'knex';

dotenv.config({
  path: resolve(__dirname, '../../.env'),
  override: true,
});

/** Aceita o arquivo com so o valor ou no formato `KEY=valor`. */
function stripKeyPrefix(key: string, raw: string): string {
  const trimmed = raw.replace(/^\uFEFF/, '').trim();
  const match = trimmed.match(new RegExp(`^${key}\\s*=\\s*(.*)$`, 's'));
  return (match?.[1] ?? trimmed).trim();
}

/** Procura `secrets/<KEY>.txt` subindo a partir do cwd (apps/web no dev, raiz no turbo). */
function findSecretFile(key: string): string | null {
  let dir = process.cwd();

  for (let nivel = 0; nivel < 5; nivel++) {
    const candidate = resolve(dir, 'secrets', `${key}.txt`);
    if (existsSync(candidate)) return candidate;

    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return null;
}

/**
 * Arquivo de secret tem prioridade: em Linux, `USER` (e as vezes `HOST`) ja vem do sistema
 * com o usuario logado e nunca e sobrescrito pelo .env.
 */
function env(key: string): string {
  const file = process.env[`${key}_FILE`]?.trim() || findSecretFile(key);

  if (file) {
    try {
      const value = stripKeyPrefix(key, readFileSync(file, 'utf8'));
      if (value) return value;
    } catch {
      // cai para a variavel de ambiente
    }
  }

  const v = process.env[key];

  if (typeof v === 'string' && v.trim()) return stripKeyPrefix(key, v);

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