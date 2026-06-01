import { db } from '../../conexao/config'
import { dbConnection } from '../../conexao/dbConnection'
import {
  LANCAMENTO_FINANCEIRO_ANEXOS_TABLE,
  LANCAMENTO_FINANCEIROS_TABLE,
} from '../constants'
import { parseContratoId } from '../id'
import {
  LANCAMENTO_ANEXO_MAX_ARQUIVOS,
  LANCAMENTO_ANEXO_MAX_BYTES,
  LANCAMENTO_ANEXO_TIPOS,
  type CriarLancamentoAnexoInput,
  type LancamentoAnexoCompleto,
  type LancamentoAnexoMetadata,
  type LancamentoAnexoMetadataRow,
  type LancamentoAnexoRow,
  type LancamentoAnexoTipo,
} from './types'

const METADATA_COLUMNS = [
  'id',
  'lancamento_financeiro_id',
  'tipo',
  'nome_original',
  'mime_type',
  'tamanho_bytes',
  'created_by',
  'created_at',
  'updated_at',
] as const

export class LancamentoFinanceiroAnexosRepository {
  async listByLancamentoId(
    contratoId: string | number,
    lancamentoFinanceiroId: string | number,
  ): Promise<LancamentoAnexoMetadata[]> {
    await dbConnection()

    const contratoIdNum = parseContratoId(contratoId)
    const lancamentoIdNum = parseContratoId(lancamentoFinanceiroId)
    if (contratoIdNum === null || lancamentoIdNum === null) return []

    const lancamento = await this.assertLancamentoDoContrato(contratoIdNum, lancamentoIdNum)
    if (!lancamento) return []

    const rows = await db<LancamentoAnexoMetadataRow>(LANCAMENTO_FINANCEIRO_ANEXOS_TABLE)
      .select([...METADATA_COLUMNS])
      .where({ lancamento_financeiro_id: lancamentoIdNum })
      .orderBy('created_at', 'desc')

    return rows.map((row) => this.toMetadata(row))
  }

  async findById(
    contratoId: string | number,
    lancamentoFinanceiroId: string | number,
    anexoId: string | number,
  ): Promise<LancamentoAnexoCompleto | null> {
    await dbConnection()

    const contratoIdNum = parseContratoId(contratoId)
    const lancamentoIdNum = parseContratoId(lancamentoFinanceiroId)
    const anexoIdNum = parseContratoId(anexoId)
    if (contratoIdNum === null || lancamentoIdNum === null || anexoIdNum === null) {
      return null
    }

    const lancamento = await this.assertLancamentoDoContrato(contratoIdNum, lancamentoIdNum)
    if (!lancamento) return null

    const row = await db<LancamentoAnexoRow>(LANCAMENTO_FINANCEIRO_ANEXOS_TABLE)
      .where({ id: anexoIdNum, lancamento_financeiro_id: lancamentoIdNum })
      .first()

    return row ? this.toCompleto(row) : null
  }

  async create(input: CriarLancamentoAnexoInput): Promise<LancamentoAnexoMetadata> {
    await dbConnection()

    const lancamento = await this.assertLancamentoDoContrato(
      input.contratoId,
      input.lancamentoFinanceiroId,
    )
    if (!lancamento) {
      throw new Error('Lancamento financeiro nao encontrado.')
    }

    const countRow = await db(LANCAMENTO_FINANCEIRO_ANEXOS_TABLE)
      .where({ lancamento_financeiro_id: input.lancamentoFinanceiroId })
      .count<{ total: number | string }[]>({ total: '*' })
      .first()

    const total = Number(countRow?.total ?? 0)
    if (total >= LANCAMENTO_ANEXO_MAX_ARQUIVOS) {
      throw new Error(`Limite de ${LANCAMENTO_ANEXO_MAX_ARQUIVOS} anexos por parcela.`)
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

    if (tamanhoBytes > LANCAMENTO_ANEXO_MAX_BYTES) {
      throw new Error('Arquivo excede o limite de 5MB.')
    }

    const agora = new Date()

    const insertedRows = await db<LancamentoAnexoRow>(LANCAMENTO_FINANCEIRO_ANEXOS_TABLE)
      .insert({
        lancamento_financeiro_id: input.lancamentoFinanceiroId,
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

    const created = await this.findById(
      input.contratoId,
      input.lancamentoFinanceiroId,
      Number(inserted.id),
    )
    if (!created) {
      throw new Error('Falha ao recuperar anexo criado.')
    }

    const { arquivoBase64: _arquivo, ...metadata } = created
    return metadata
  }

  async delete(
    contratoId: string | number,
    lancamentoFinanceiroId: string | number,
    anexoId: string | number,
  ): Promise<boolean> {
    await dbConnection()

    const contratoIdNum = parseContratoId(contratoId)
    const lancamentoIdNum = parseContratoId(lancamentoFinanceiroId)
    const anexoIdNum = parseContratoId(anexoId)
    if (contratoIdNum === null || lancamentoIdNum === null || anexoIdNum === null) {
      return false
    }

    const lancamento = await this.assertLancamentoDoContrato(contratoIdNum, lancamentoIdNum)
    if (!lancamento) return false

    const deleted = await db<LancamentoAnexoRow>(LANCAMENTO_FINANCEIRO_ANEXOS_TABLE)
      .where({ id: anexoIdNum, lancamento_financeiro_id: lancamentoIdNum })
      .delete()

    return deleted > 0
  }

  private async assertLancamentoDoContrato(
    contratoId: number,
    lancamentoFinanceiroId: number,
  ): Promise<boolean> {
    const row = await db(LANCAMENTO_FINANCEIROS_TABLE)
      .where({ id: lancamentoFinanceiroId, contrato_id: contratoId })
      .first()

    return Boolean(row)
  }

  private validarTipo(tipo: LancamentoAnexoTipo | undefined): LancamentoAnexoTipo {
    const value = tipo ?? 'outro'
    if (!LANCAMENTO_ANEXO_TIPOS.includes(value)) {
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

  private toMetadata(row: LancamentoAnexoMetadataRow): LancamentoAnexoMetadata {
    return {
      id: Number(row.id),
      lancamentoFinanceiroId: Number(row.lancamento_financeiro_id),
      tipo: row.tipo,
      nomeOriginal: row.nome_original,
      mimeType: row.mime_type,
      tamanhoBytes: this.toNumberOrNull(row.tamanho_bytes),
      criadoPor: row.created_by,
      criadoEm: this.toDate(row.created_at),
      atualizadoEm: row.updated_at ? this.toDate(row.updated_at) : null,
    }
  }

  private toCompleto(row: LancamentoAnexoRow): LancamentoAnexoCompleto {
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
