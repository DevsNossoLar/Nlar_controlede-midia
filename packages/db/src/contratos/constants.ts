export const CONTRATOS_TABLE = 'NS_controle_de_midia_contratos'
export const CONTRATO_ANEXOS_TABLE = 'NS_controle_de_midia_contrato_anexos'
export const LANCAMENTO_FINANCEIROS_TABLE = 'NS_controle_de_midia_lancamento_financeiros'
export const LANCAMENTO_FINANCEIRO_ANEXOS_TABLE =
  'NS_controle_de_midia_lancamento_financeiro_anexos'

/** Reexport — tabelas fora do prefixo NS_controle_de_midia_* sao somente leitura (ERP). */
export { MODULO_TABLE_PREFIX, ERP_READONLY_TABLES } from '../shared/erp-readonly'
