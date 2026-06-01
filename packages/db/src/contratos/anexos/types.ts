export const CONTRATO_ANEXO_TIPOS = [
  'contrato',
  'proposta',
  'aditivo',
  'aprovacao',
  'documento',
  'outro',
] as const

export type ContratoAnexoTipo = (typeof CONTRATO_ANEXO_TIPOS)[number]

export const CONTRATO_ANEXO_MAX_ARQUIVOS = 10
export const CONTRATO_ANEXO_MAX_BYTES = 5 * 1024 * 1024

export type ContratoAnexoMetadata = {
  id: number
  contratoId: number
  tipo: ContratoAnexoTipo
  nomeOriginal: string
  mimeType: string
  tamanhoBytes: number | null
  criadoPor: string | null
  criadoEm: Date
  atualizadoEm: Date | null
}

export type ContratoAnexoCompleto = ContratoAnexoMetadata & {
  arquivoBase64: string
}

export type CriarContratoAnexoInput = {
  contratoId: number
  tipo?: ContratoAnexoTipo
  nomeOriginal: string
  mimeType: string
  tamanhoBytes?: number | null
  arquivoBase64: string
  criadoPor?: string | null
}

export type ContratoAnexoRow = {
  id: number
  contrato_id: number
  tipo: ContratoAnexoTipo
  nome_original: string
  mime_type: string
  tamanho_bytes: number | string | null
  arquivo_base64: string
  created_by: string | null
  created_at: string | Date
  updated_at: string | Date | null
}

export type ContratoAnexoMetadataRow = Omit<ContratoAnexoRow, 'arquivo_base64'>
