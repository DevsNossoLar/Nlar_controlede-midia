import type { Knex } from 'knex'
import { db } from '../conexao/config'
import { dbConnection } from '../conexao/dbConnection'
import { Contrato } from './contrato.class'
import { CONTRATOS_TABLE } from './constants'
import { parseContratoId } from './id'
import {
  contratoEnum,
  ContratoProps,
  ContratoRow,
  ContratosListResult,
  CriarContratoInput,
  isTipoContratoValido,
  ListContratosFilters,
  statusContratoEnum,
  atualizarContratoInput,
} from './types'

const DEFAULT_PAGE = 1
const DEFAULT_PER_PAGE = 20
const MAX_PER_PAGE = 100

const ORDER_COLUMN_BY_FIELD: Record<
  NonNullable<ListContratosFilters['orderBy']>,
  string
> = {
  titulo: 'titulo',
  dataInicio: 'data_inicio',
  dataFim: 'data_fim',
  valorTotal: 'valor_total',
  createdAt: 'created_at',
}

export class ContratosRepository {
  async create(input: CriarContratoInput): Promise<ContratoProps> {
    await dbConnection()

    const contrato = Contrato.criarContrato(input)
    const props = contrato.toJson()

    const insertedRows = await db<ContratoRow>(CONTRATOS_TABLE)
      .insert(this.toInsertRow(props))
      .returning('id')

    const inserted = insertedRows[0]
    if (!inserted) {
      throw new Error('Falha ao criar contrato.')
    }

    const id = Number(inserted.id)
    return this.findByIdOrThrow(id)
  }

  async list(filters: ListContratosFilters = {}): Promise<ContratosListResult> {
    await dbConnection()

    const page = this.normalizePage(filters.page)
    const perPage = this.normalizePerPage(filters.perPage)
    const query = db<ContratoRow>(CONTRATOS_TABLE)

    this.applyFilters(query, filters)

    const countRow = await query.clone().count<{ total: number | string }[]>({ total: '*' }).first()
    const total = Number(countRow?.total ?? 0)
    const orderColumn = ORDER_COLUMN_BY_FIELD[filters.orderBy ?? 'createdAt']
    const orderDir = filters.orderDir ?? 'desc'

    const rows = await query
      .clone()
      .select('*')
      .orderBy(orderColumn, orderDir)
      .offset((page - 1) * perPage)
      .limit(perPage)

    return {
      data: rows.map((row) => this.toProps(row)),
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async findById(id: string | number): Promise<ContratoProps | null> {
    await dbConnection()

    const contratoId = parseContratoId(id)
    if (contratoId === null) return null

    const row = await db<ContratoRow>(CONTRATOS_TABLE).where({ id: contratoId }).first()
    return row ? this.toProps(row) : null
  }

  async update(id: string | number, input: atualizarContratoInput): Promise<ContratoProps | null> {
    await dbConnection()

    const contratoId = parseContratoId(id)
    if (contratoId === null) return null

    const current = await this.findById(contratoId)
    if (!current) return null

    const contrato = Contrato.restaurar(current)
    contrato.atualizar(input)
    const props = contrato.toJson()

    await db<ContratoRow>(CONTRATOS_TABLE)
      .where({ id: contratoId })
      .update(this.toUpdateRow(props))

    return this.findById(contratoId)
  }

  async cancel(id: string | number): Promise<ContratoProps | null> {
    await dbConnection()

    const contratoId = parseContratoId(id)
    if (contratoId === null) return null

    const current = await this.findById(contratoId)
    if (!current) return null

    const contrato = Contrato.restaurar(current)
    contrato.cancelar()
    const props = contrato.toJson()

    await db<ContratoRow>(CONTRATOS_TABLE)
      .where({ id: contratoId })
      .update({
        status: props.status,
        updated_at: props.atualizadoEm,
      })

    return this.findById(contratoId)
  }

  async close(id: string | number): Promise<ContratoProps | null> {
    await dbConnection()

    const contratoId = parseContratoId(id)
    if (contratoId === null) return null

    const current = await this.findById(contratoId)
    if (!current) return null

    const contrato = Contrato.restaurar(current)
    contrato.encerrar()
    const props = contrato.toJson()

    await db<ContratoRow>(CONTRATOS_TABLE)
      .where({ id: contratoId })
      .update({
        status: props.status,
        updated_at: props.atualizadoEm,
      })

    return this.findById(contratoId)
  }

  private async findByIdOrThrow(id: number): Promise<ContratoProps> {
    const contrato = await this.findById(id)
    if (!contrato) {
      throw new Error('Contrato não encontrado após criação.')
    }

    return contrato
  }

  private applyFilters(
    query: Knex.QueryBuilder<ContratoRow, ContratoRow[]>,
    filters: ListContratosFilters,
  ): void {
    if (filters.codFor) {
      query.where('codFor', filters.codFor)
    }

    if (filters.codLoja) {
      query.where('codLoja', filters.codLoja)
    }

    if (filters.tipoContrato) {
      query.where('tipo_contrato', filters.tipoContrato)
    }

    if (filters.status === 'vencido') {
      query
        .where('status', statusContratoEnum.ATIVO)
        .whereNotNull('data_fim')
        .where('data_fim', '<', this.today())
    } else if (filters.status) {
      query.where('status', filters.status)
    }

    if (filters.dataInicio) {
      query.where('data_inicio', '>=', filters.dataInicio)
    }

    if (filters.dataFim) {
      query.where('data_fim', '<=', filters.dataFim)
    }

    if (filters.search?.trim()) {
      const search = `%${filters.search.trim()}%`

      query.andWhere((builder) => {
        builder
          .where('titulo', 'like', search)
          .orWhere('tipo_contrato', 'like', search)
          .orWhere('num_previsao', 'like', search)
          .orWhere('num_cotacao', 'like', search)
          .orWhere('observacao', 'like', search)
          .orWhere('codFor', 'like', search)
          .orWhere('codLoja', 'like', search)
      })
    }
  }

  private toInsertRow(props: ContratoProps): Omit<ContratoRow, 'id'> {
    return {
      codFor: props.codFor,
      titulo: props.titulo,
      descricao: props.descricao,
      codLoja: props.codLoja,
      tipo_contrato: props.tipoContrato,
      num_previsao: props.numPrevisao,
      num_cotacao: props.numCotacao,
      valor_total: props.valorTotal,
      valor_mensal: props.valorMensal,
      cod_condicao_pagamento: props.codCondicaoPagamento,
      cod_forma_pagamento: props.codFormaPagamento,
      data_inicio: props.dataInicio,
      data_fim: props.dataFim,
      status: props.status,
      recorrente: props.recorrente,
      dia_vencimento_padrao: props.diaVencimentoPadrao,
      observacao: props.observacao,
      created_by: props.criadoPor,
      created_at: props.criadoEm,
      updated_at: props.atualizadoEm,
    }
  }

  private toRow(props: ContratoProps): ContratoRow {
    return {
      id: props.id!,
      ...this.toInsertRow(props),
    }
  }

  private toUpdateRow(props: ContratoProps): Partial<ContratoRow> {
    const { id: _id, created_at: _createdAt, created_by: _createdBy, ...row } = this.toRow(props)
    return row
  }

  private toProps(row: ContratoRow): ContratoProps {
    const tipoContrato = isTipoContratoValido(row.tipo_contrato)
      ? row.tipo_contrato
      : contratoEnum.DIVERSOS

    return {
      id: Number(row.id),
      codFor: row.codFor,
      titulo: row.titulo,
      descricao: row.descricao,
      codLoja: row.codLoja,
      tipoContrato,
      numPrevisao: row.num_previsao ?? null,
      numCotacao: row.num_cotacao ?? null,
      valorTotal: this.toNumberOrNull(row.valor_total),
      valorMensal: this.toNumberOrNull(row.valor_mensal),
      codCondicaoPagamento: this.toNumberOrNull(row.cod_condicao_pagamento),
      codFormaPagamento: this.toNumberOrNull(row.cod_forma_pagamento),
      dataInicio: this.toDateString(row.data_inicio),
      dataFim: this.toDateStringOrNull(row.data_fim),
      status: row.status,
      recorrente: Boolean(row.recorrente),
      diaVencimentoPadrao: row.dia_vencimento_padrao,
      observacao: row.observacao,
      criadoPor: row.created_by,
      criadoEm: this.toDate(row.created_at),
      atualizadoEm: row.updated_at ? this.toDate(row.updated_at) : null,
    }
  }

  private normalizePage(value: number | undefined): number {
    return value && Number.isFinite(value) && value > 0 ? Math.floor(value) : DEFAULT_PAGE
  }

  private normalizePerPage(value: number | undefined): number {
    if (!value || !Number.isFinite(value) || value <= 0) return DEFAULT_PER_PAGE
    return Math.min(Math.floor(value), MAX_PER_PAGE)
  }

  private toNumberOrNull(value: number | string | null): number | null {
    if (value === null) return null
    return Number(value)
  }

  private toDate(value: string | Date): Date {
    return value instanceof Date ? value : new Date(value)
  }

  private toDateString(value: string | Date): string {
    if (value instanceof Date) return value.toISOString().slice(0, 10)
    return value.slice(0, 10)
  }

  private toDateStringOrNull(value: string | Date | null): string | null {
    return value ? this.toDateString(value) : null
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10)
  }
}
