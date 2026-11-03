import type { Knex } from 'knex';
import { db } from '../../conexao/config';
import { dbConnection } from '../../conexao/dbConnection';

import {
  apenasDigitos,
  documentoSemZerosAEsquerda,
  ehBuscaPorDocumento,
  SEARCH_MIN_CODE_LENGTH,
  SEARCH_MIN_DOCUMENTO_LENGTH,
  SEARCH_MIN_TEXT_LENGTH,
  SEARCH_RESULT_LIMIT,
} from '../../shared/search';

export type Fornecedor = {
  codFor: number;
  nomeFor: string;
  NomeFantasia: string;
  CGC: string | null;
};

export type BuscarFornecedoresParams = {
  q?: string;
  codFor?: string;
  /** CPF/CNPJ; mascara e ignorada na comparacao. */
  documento?: string;
  limit?: number;
};

/** O ERP pode gravar CGC com ou sem mascara; compara so os digitos. */
const CGC_SOMENTE_DIGITOS =
  "REPLACE(REPLACE(REPLACE(REPLACE(ISNULL([CGC], ''), '.', ''), '-', ''), '/', ''), ' ', '')";

function applyDocumentoSearch(
  query: Knex.QueryBuilder<Fornecedor, Fornecedor[]>,
  documento: string,
): boolean {
  if (apenasDigitos(documento).length < SEARCH_MIN_DOCUMENTO_LENGTH) return false;
  const digitos = documentoSemZerosAEsquerda(documento);
  if (!digitos) return false;
  query.whereRaw(`${CGC_SOMENTE_DIGITOS} LIKE ?`, [`%${digitos}%`]);
  return true;
}

function normalizeLimit(limit?: number): number {
  if (!limit || !Number.isFinite(limit) || limit <= 0) return SEARCH_RESULT_LIMIT;
  return Math.min(Math.floor(limit), SEARCH_RESULT_LIMIT);
}

function applyFornecedorSearch(
  query: Knex.QueryBuilder<Fornecedor, Fornecedor[]>,
  params: BuscarFornecedoresParams,
): boolean {
  const codFor = params.codFor?.trim();
  const documento = params.documento?.trim();
  const q = params.q?.trim();

  if (documento) return applyDocumentoSearch(query, documento);

  if (codFor) {
    if (codFor.length < SEARCH_MIN_CODE_LENGTH) return false;
    query.whereRaw('CAST([codFor] AS VARCHAR(50)) LIKE ?', [`%${codFor}%`]);
    return true;
  }

  if (!q) return false;

  if (ehBuscaPorDocumento(q)) return applyDocumentoSearch(query, q);

  if (/^\d+$/.test(q)) {
    if (q.length < SEARCH_MIN_CODE_LENGTH) return false;
    query.whereRaw('CAST([codFor] AS VARCHAR(50)) LIKE ?', [`%${q}%`]);
    return true;
  }

  if (q.length < SEARCH_MIN_TEXT_LENGTH) return false;

  const pattern = `%${q}%`;
  query.andWhere((builder) => {
    builder.where('nomeFor', 'like', pattern).orWhere('NomeFantasia', 'like', pattern);
  });

  return true;
}

export async function buscarFornecedores(
  params: BuscarFornecedoresParams = {},
): Promise<Fornecedor[]> {
  await dbConnection();

  const query = db<Fornecedor>('fornecedores')
    .select('codFor', 'nomeFor', 'NomeFantasia', 'CGC')
    .limit(normalizeLimit(params.limit));

  if (!applyFornecedorSearch(query, params)) {
    return [];
  }

  return query;
}

export async function getFornecedoresPorCodigos(codigos: string[]): Promise<Fornecedor[]> {
  const unique = [...new Set(codigos.map((cod) => cod.trim()).filter(Boolean))];
  if (unique.length === 0) return [];

  await dbConnection();

  const numeric = unique.map((cod) => Number(cod)).filter((cod) => Number.isFinite(cod));

  if (numeric.length === 0) return [];

  return db<Fornecedor>('fornecedores')
    .select('codFor', 'nomeFor', 'NomeFantasia', 'CGC')
    .whereIn('codFor', numeric);
}
