import { db } from '../../conexao/config'
import { dbConnection } from '../../conexao/dbConnection'
import { CONTRATOS_TABLE, LANCAMENTO_FINANCEIRO_ANEXOS_TABLE, LANCAMENTO_FINANCEIROS_TABLE } from '../constants'
import { parseContratoId } from '../id'
import type {
  FindOrCreateLancamentoInput,
  LancamentoFinanceiroMetadata,
  LancamentoFinanceiroRow,
  ParcelaOrigem,
} from './types'

export type LancamentoAnexoCount = {
  origem: ParcelaOrigem
  erpChave: string
  quantidade: number
}

export class LancamentoFinanceiroRepository {
  async findByParcela(
    contratoId: string | number,
    origem: ParcelaOrigem,
    erpChave: string,
  ): Promise<LancamentoFinanceiroMetadata | null> {
    await dbConnection()

    const contratoIdNum = parseContratoId(contratoId)
    if (contratoIdNum === null) return null

    const row = await db<LancamentoFinanceiroRow>(LANCAMENTO_FINANCEIROS_TABLE)
      .where({
        contrato_id: contratoIdNum,
        origem,
        erp_chave: erpChave.trim(),
      })
      .first()

    return row ? this.toMetadata(row) : null
  }

  async findOrCreate(input: FindOrCreateLancamentoInput): Promise<LancamentoFinanceiroMetadata> {
    await dbConnection()

    const contrato = await db(CONTRATOS_TABLE).where({ id: input.contratoId }).first()
    if (!contrato) {
      throw new Error('Contrato nao encontrado.')
    }

    const erpChave = input.erpChave.trim()
    if (!erpChave) {
      throw new Error('erp_chave obrigatoria.')
    }

    const existing = await this.findByParcela(input.contratoId, input.origem, erpChave)
    if (existing) return existing

    const agora = new Date()
    const dataVencimento = this.normalizarData(input.dataVencimento)

    const insertedRows = await db<LancamentoFinanceiroRow>(LANCAMENTO_FINANCEIROS_TABLE)
      .insert({
        contrato_id: input.contratoId,
        origem: input.origem,
        erp_chave: erpChave,
        num_previsao: input.numPrevisao?.trim() || null,
        cod_loja: input.codLoja?.trim() || null,
        valor: input.valor,
        data_vencimento: dataVencimento,
        created_by: input.criadoPor?.trim() || null,
        created_at: agora,
        updated_at: null,
      })
      .returning('id')

    const inserted = insertedRows[0]
    if (!inserted) {
      throw new Error('Falha ao criar lancamento financeiro.')
    }

    const created = await db<LancamentoFinanceiroRow>(LANCAMENTO_FINANCEIROS_TABLE)
      .where({ id: Number(inserted.id) })
      .first()

    if (!created) {
      throw new Error('Falha ao recuperar lancamento financeiro criado.')
    }

    return this.toMetadata(created)
  }

  async countAnexosByContrato(contratoId: string | number): Promise<LancamentoAnexoCount[]> {
    await dbConnection()

    const contratoIdNum = parseContratoId(contratoId)
    if (contratoIdNum === null) return []

    const rows = await db(`${LANCAMENTO_FINANCEIRO_ANEXOS_TABLE} as A`)
      .innerJoin(`${LANCAMENTO_FINANCEIROS_TABLE} as LF`, 'LF.id', 'A.lancamento_financeiro_id')
      .where('LF.contrato_id', contratoIdNum)
      .groupBy('LF.origem', 'LF.erp_chave')
      .select('LF.origem', 'LF.erp_chave')
      .count({ quantidade: 'A.id' })

    return rows.map((row: Record<string, unknown>) => ({
      origem: row.origem as ParcelaOrigem,
      erpChave: String(row.erp_chave),
      quantidade: Number(row.quantidade ?? 0),
    }))
  }

  private normalizarData(value: Date | string | null | undefined): string | null {
    if (value === null || value === undefined) return null
    if (value instanceof Date) {
      return value.toISOString().slice(0, 10)
    }
    const trimmed = value.trim()
    if (!trimmed) return null
    return trimmed.slice(0, 10)
  }

  private toMetadata(row: LancamentoFinanceiroRow): LancamentoFinanceiroMetadata {
    return {
      id: Number(row.id),
      contratoId: Number(row.contrato_id),
      origem: row.origem,
      erpChave: row.erp_chave,
      numPrevisao: row.num_previsao,
      codLoja: row.cod_loja,
      valor: Number(row.valor),
      dataVencimento: row.data_vencimento
        ? this.toDate(row.data_vencimento)
        : null,
      criadoPor: row.created_by,
      criadoEm: this.toDate(row.created_at),
      atualizadoEm: row.updated_at ? this.toDate(row.updated_at) : null,
    }
  }

  private toDate(value: string | Date): Date {
    return value instanceof Date ? value : new Date(value)
  }
}
