import { db } from '../../conexao/config'
import { dbConnection } from '../../conexao/dbConnection'
import { CONTRATOS_TABLE, CONTRATO_ANEXOS_TABLE } from '../constants'
import { parseContratoAnexoId, parseContratoId } from './id'
import {
  CONTRATO_ANEXO_MAX_ARQUIVOS,
  CONTRATO_ANEXO_MAX_BYTES,
  CONTRATO_ANEXO_TIPOS,
  type ContratoAnexoCompleto,
  type ContratoAnexoMetadata,
  type ContratoAnexoMetadataRow,
  type ContratoAnexoRow,
  type ContratoAnexoTipo,
  type CriarContratoAnexoInput,
} from './types'

const METADATA_COLUMNS = [
  'id',
  'contrato_id',
  'tipo',
  'nome_original',
  'mime_type',
  'tamanho_bytes',
  'created_by',
  'created_at',
  'updated_at',
] as const

export class ContratoAnexosRepository {
  async listByContratoId(contratoId: string | number): Promise<ContratoAnexoMetadata[]> {
    await dbConnection()

    const id = parseContratoId(contratoId)
    if (id === null) return []

    const rows = await db<ContratoAnexoMetadataRow>(CONTRATO_ANEXOS_TABLE)
      .select([...METADATA_COLUMNS])
      .where({ contrato_id: id })
      .orderBy('created_at', 'desc')

    return rows.map((row) => this.toMetadata(row))
  }

  async findById(
    contratoId: string | number,
    anexoId: string | number,
  ): Promise<ContratoAnexoCompleto | null> {
    await dbConnection()

    const contratoIdNum = parseContratoId(contratoId)
    const anexoIdNum = parseContratoAnexoId(anexoId)
    if (contratoIdNum === null || anexoIdNum === null) return null

    const row = await db<ContratoAnexoRow>(CONTRATO_ANEXOS_TABLE)
      .where({ id: anexoIdNum, contrato_id: contratoIdNum })
      .first()

    return row ? this.toCompleto(row) : null
  }

  async create(input: CriarContratoAnexoInput): Promise<ContratoAnexoMetadata> {
    await dbConnection()

    const contrato = await db(CONTRATOS_TABLE).where({ id: input.contratoId }).first()
    if (!contrato) {
      throw new Error('Contrato nao encontrado.')
    }

    const countRow = await db(CONTRATO_ANEXOS_TABLE)
      .where({ contrato_id: input.contratoId })
      .count<{ total: number | string }[]>({ total: '*' })
      .first()

    const total = Number(countRow?.total ?? 0)
    if (total >= CONTRATO_ANEXO_MAX_ARQUIVOS) {
      throw new Error(`Limite de ${CONTRATO_ANEXO_MAX_ARQUIVOS} anexos por contrato.`)
    }

    const tipo = this.validarTipo(input.tipo)
    const nomeOriginal = input.nomeOriginal.trim()
    const mimeType = input.mimeType.trim()
    const arquivoBase64 = this.normalizarBase64(input.arquivoBase64)
    const tamanhoBytes = this.resolverTamanhoBytes(input.tamanhoBytes, arquivoBase64)

    if (!nomeOriginal) {
      throw new Error('nome_original obrigatorio.')
    }

    if (!mimeType) {
      throw new Error('mime_type obrigatorio.')
    }

    if (!arquivoBase64) {
      throw new Error('arquivo_base64 obrigatorio.')
    }

    if (tamanhoBytes > CONTRATO_ANEXO_MAX_BYTES) {
      throw new Error('Arquivo excede o limite de 5MB.')
    }

    const agora = new Date()

    const insertedRows = await db<ContratoAnexoRow>(CONTRATO_ANEXOS_TABLE)
      .insert({
        contrato_id: input.contratoId,
        tipo,
        nome_original: nomeOriginal,
        mime_type: mimeType,
        tamanho_bytes: tamanhoBytes,
        arquivo_base64: arquivoBase64,
        created_by: input.criadoPor?.trim() || null,
        created_at: agora,
        updated_at: null,
      })
      .returning('id')

    const inserted = insertedRows[0]
    if (!inserted) {
      throw new Error('Falha ao criar anexo.')
    }

    const created = await this.findById(input.contratoId, Number(inserted.id))
    if (!created) {
      throw new Error('Falha ao recuperar anexo criado.')
    }

    const { arquivoBase64: _arquivo, ...metadata } = created
    return metadata
  }

  async delete(contratoId: string | number, anexoId: string | number): Promise<boolean> {
    await dbConnection()

    const contratoIdNum = parseContratoId(contratoId)
    const anexoIdNum = parseContratoAnexoId(anexoId)
    if (contratoIdNum === null || anexoIdNum === null) return false

    const deleted = await db<ContratoAnexoRow>(CONTRATO_ANEXOS_TABLE)
      .where({ id: anexoIdNum, contrato_id: contratoIdNum })
      .delete()

    return deleted > 0
  }

  private validarTipo(tipo: ContratoAnexoTipo | undefined): ContratoAnexoTipo {
    const value = tipo ?? 'outro'
    if (!CONTRATO_ANEXO_TIPOS.includes(value)) {
      throw new Error('tipo de anexo invalido.')
    }

    return value
  }

  private normalizarBase64(value: string): string {
    const trimmed = value.trim()
    if (!trimmed) return ''

    const [, payload] = trimmed.split(',')
    return (payload ?? trimmed).replace(/\s/g, '')
  }

  private resolverTamanhoBytes(
    informado: number | null | undefined,
    arquivoBase64: string,
  ): number {
    if (typeof informado === 'number' && Number.isFinite(informado) && informado >= 0) {
      return Math.floor(informado)
    }

    return Math.floor((arquivoBase64.length * 3) / 4)
  }

  private toMetadata(row: ContratoAnexoMetadataRow): ContratoAnexoMetadata {
    return {
      id: Number(row.id),
      contratoId: Number(row.contrato_id),
      tipo: row.tipo,
      nomeOriginal: row.nome_original,
      mimeType: row.mime_type,
      tamanhoBytes: this.toNumberOrNull(row.tamanho_bytes),
      criadoPor: row.created_by,
      criadoEm: this.toDate(row.created_at),
      atualizadoEm: row.updated_at ? this.toDate(row.updated_at) : null,
    }
  }

  private toCompleto(row: ContratoAnexoRow): ContratoAnexoCompleto {
    return {
      ...this.toMetadata(row),
      arquivoBase64: row.arquivo_base64,
    }
  }

  private toNumberOrNull(value: number | string | null): number | null {
    if (value === null) return null
    return Number(value)
  }

  private toDate(value: string | Date): Date {
    return value instanceof Date ? value : new Date(value)
  }
}
