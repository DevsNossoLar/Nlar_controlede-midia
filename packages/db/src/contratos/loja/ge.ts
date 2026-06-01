import type { Knex } from 'knex';
import { db } from '../../conexao/config';
import { dbConnection } from '../../conexao/dbConnection';
import {
  SEARCH_MIN_CODE_LENGTH,
  SEARCH_MIN_TEXT_LENGTH,
  SEARCH_RESULT_LIMIT,
} from '../../shared/search';

export type Loja = {
  codLoja: number | string;
  empresa: string | null;
};

export type BuscarLojasParams = {
  q?: string;
  codLoja?: string;
  limit?: number;
};

function normalizeLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit) || limit <= 0) return SEARCH_RESULT_LIMIT;
  return Math.min(Math.floor(limit), SEARCH_RESULT_LIMIT);
}

function applyLojaSearch(
  query: Knex.QueryBuilder<Loja, Loja[]>,
  params: BuscarLojasParams,
): boolean {
  const codLoja = params.codLoja?.trim();
  const q = params.q?.trim();

  if (codLoja) {
    if (codLoja.length < SEARCH_MIN_CODE_LENGTH) return false;
    query.whereRaw('CAST([codLoja] AS VARCHAR(50)) LIKE ?', [`%${codLoja}%`]);
    return true;
  }

  if (!q) return false;

  if (/^\d+$/.test(q)) {
    if (q.length < SEARCH_MIN_CODE_LENGTH) return false;
    query.whereRaw('CAST([codLoja] AS VARCHAR(50)) LIKE ?', [`%${q}%`]);
    return true;
  }

  if (q.length < SEARCH_MIN_TEXT_LENGTH) return false;

  query.where('empresa', 'like', `%${q}%`);
  return true;
}

export async function buscarLojas(params: BuscarLojasParams = {}): Promise<Loja[]> {
  await dbConnection();

  const query = db<Loja>('Parametro2')
    .select('codLoja', 'empresa')
    .limit(normalizeLimit(params.limit));

  if (!applyLojaSearch(query, params)) {
    return [];
  }

  return query;
}

export async function getLojasPorCodigos(codigos: string[]): Promise<Loja[]> {
  const unique = [...new Set(codigos.map((cod) => cod.trim()).filter(Boolean))];
  if (unique.length === 0) return [];

  await dbConnection();

  const numeric = unique.map((cod) => Number(cod)).filter((cod) => Number.isFinite(cod));

  if (numeric.length === 0) {
    return db<Loja>('Parametro2').select('codLoja', 'empresa').whereIn('codLoja', unique);
  }

  return db<Loja>('Parametro2').select('codLoja', 'empresa').whereIn('codLoja', numeric);
}
