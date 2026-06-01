/**
 * Tabelas do modulo (CRUD permitido).
 * Prefixo real no SQL Server: NS_controle_de_midia_
 */
export const MODULO_TABLE_PREFIX = 'NS_controle_de_midia_'

/**
 * Tabelas do ERP / legado compartilhado — SOMENTE SELECT.
 * Nunca usar insert, update, delete ou merge nessas tabelas a partir deste app.
 */
export const ERP_READONLY_TABLES = [
  'contasapagar_tab',
  'PrevisaoCompraBaixas',
  'Parametro2',
  'Fornecedores',
  'fornecedores',
  'ENTRADAS',
  'CondicaoPagamento',
  'FormaPagamento',
] as const

/** Coluna de data em PrevisaoCompraBaixas usada como data de pagamento/baixa no relatorio mensal. */
export const PREVISAO_COMPRA_BAIXAS_DATA_PAGAMENTO = 'DataChegada'

export function isModuloTable(tableName: string): boolean {
  const normalized = tableName.trim()
  return normalized.startsWith(MODULO_TABLE_PREFIX)
}

export function isErpReadonlyTable(tableName: string): boolean {
  const base = tableName.trim().split(/\s+/)[0]?.replace(/^dbo\./i, '') ?? ''
  const withoutAlias = base.split('.').pop() ?? base
  return ERP_READONLY_TABLES.some(
    (table) => table.toLowerCase() === withoutAlias.toLowerCase(),
  )
}
