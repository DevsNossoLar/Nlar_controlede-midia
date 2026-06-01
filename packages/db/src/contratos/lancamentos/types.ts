export const PARCELA_ORIGENS = ['ABERTO', 'PAGO'] as const
export type ParcelaOrigem = (typeof PARCELA_ORIGENS)[number]

export const LANCAMENTO_ANEXO_TIPOS = ['comprovante', 'boleto', 'outro'] as const
export type LancamentoAnexoTipo = (typeof LANCAMENTO_ANEXO_TIPOS)[number]

export const LANCAMENTO_ANEXO_MAX_ARQUIVOS = 10
export const LANCAMENTO_ANEXO_MAX_BYTES = 5 * 1024 * 1024

export type LancamentoFinanceiroMetadata = {
  id: number
  contratoId: number
  origem: ParcelaOrigem
  erpChave: string
  numPrevisao: string | null
  codLoja: string | null
  valor: number
  dataVencimento: Date | null
  criadoPor: string | null
  criadoEm: Date
  atualizadoEm: Date | null
}

export type FindOrCreateLancamentoInput = {
  contratoId: number
  origem: ParcelaOrigem
  erpChave: string
  numPrevisao?: string | null
  codLoja?: string | null
  valor: number
  dataVencimento?: Date | string | null
  criadoPor?: string | null
}

export type LancamentoFinanceiroRow = {
  id: number
  contrato_id: number
  origem: ParcelaOrigem
  erp_chave: string
  num_previsao: string | null
  cod_loja: string | null
  valor: number | string
  data_vencimento: string | Date | null
  created_by: string | null
  created_at: string | Date
  updated_at: string | Date | null
}

export type LancamentoAnexoMetadata = {
  id: number
  lancamentoFinanceiroId: number
  tipo: LancamentoAnexoTipo
  nomeOriginal: string
  mimeType: string
  tamanhoBytes: number | null
  criadoPor: string | null
  criadoEm: Date
  atualizadoEm: Date | null
}

export type LancamentoAnexoCompleto = LancamentoAnexoMetadata & {
  arquivoBase64: string
}

export type CriarLancamentoAnexoInput = {
  lancamentoFinanceiroId: number
  contratoId: number
  tipo?: LancamentoAnexoTipo
  nomeOriginal: string
  mimeType: string
  tamanhoBytes?: number | null
  arquivoBase64: string
  criadoPor?: string | null
}

export type LancamentoAnexoRow = {
  id: number
  lancamento_financeiro_id: number
  tipo: LancamentoAnexoTipo
  nome_original: string
  mime_type: string
  tamanho_bytes: number | string | null
  arquivo_base64: string
  created_by: string | null
  created_at: string | Date
  updated_at: string | Date | null
}

export type LancamentoAnexoMetadataRow = Omit<LancamentoAnexoRow, 'arquivo_base64'>
