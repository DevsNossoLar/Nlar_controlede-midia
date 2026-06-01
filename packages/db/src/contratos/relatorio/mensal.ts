import { db } from '../../conexao/config'
import { dbConnection } from '../../conexao/dbConnection'
import { PREVISAO_COMPRA_BAIXAS_DATA_PAGAMENTO } from '../../shared/erp-readonly'
import { CONTRATOS_TABLE } from '../constants'
import type { ParcelaOrigem } from '../lancamentos/types'
import type { contratoEnum } from '../types'
import { calcularPeriodoMensal, serializarData } from './periodo'
import type {
  RelatorioMensalFiltros,
  RelatorioMensalParcela,
  RelatorioMensalParcelaRow,
  RelatorioMensalPrevistoRow,
} from './types'

/** ERP (contasapagar_tab, PrevisaoCompraBaixas, Parametro2, Fornecedores): somente SELECT */

const STATUS_ATIVOS = ['ativo', 'suspenso'] as const

function parseCodLojaNumerico(codLoja?: string | null): number | null {
  if (!codLoja?.trim()) return null
  const numero = Number(codLoja.trim())
  return Number.isFinite(numero) && numero > 0 ? numero : null
}

function normalizarParcela(
  row: RelatorioMensalParcelaRow,
  situacao: ParcelaOrigem,
): Omit<RelatorioMensalParcela, 'quantidadeAnexos'> {
  const dataReferencia = serializarData(row.dataReferencia)
  if (!dataReferencia) {
    throw new Error('Parcela sem data de referencia no relatorio mensal.')
  }

  return {
    contratoId: Number(row.contratoId),
    titulo: String(row.titulo ?? ''),
    tipoContrato: String(row.tipoContrato ?? '') as contratoEnum,
    codFor: String(row.codFor ?? ''),
    fornecedorNome: row.fornecedorNome ?? null,
    codLoja: String(row.codLoja ?? ''),
    lojaNome: row.lojaNome ?? null,
    numPrevisao: row.numPrevisao ?? null,
    numCotacao: row.numCotacao ?? null,
    valorParcela: Number(row.valorParcela ?? 0),
    situacao,
    dataReferencia,
    erpChave: String(row.erpChave ?? ''),
  }
}

export async function listParcelasAbertasPorMes(
  filtros: RelatorioMensalFiltros,
): Promise<Omit<RelatorioMensalParcela, 'quantidadeAnexos'>[]> {
  await dbConnection()

  const { inicio, fim } = calcularPeriodoMensal(filtros.ano, filtros.mes)
  const codLojaNum = parseCodLojaNumerico(filtros.codLoja)

  const query = db(`${CONTRATOS_TABLE} as C`)
    .select([
      'C.id as contratoId',
      'C.titulo',
      'C.tipo_contrato as tipoContrato',
      'C.codFor',
      db.raw('COALESCE(F.nomeFor, F.NomeFantasia) AS fornecedorNome'),
      'C.codLoja',
      'P.empresa as lojaNome',
      'C.num_previsao as numPrevisao',
      'C.num_cotacao as numCotacao',
      db.raw('CAP.ValorDoc AS valorParcela'),
      db.raw('CAP.Vencimento AS dataReferencia'),
      db.raw(
        "CONCAT('ABERTO:', CAP.COD_ENTRADA, ':', CONVERT(VARCHAR(10), CAP.Vencimento, 23)) AS erpChave",
      ),
    ])
    .joinRaw(
      'INNER JOIN dbo.contasapagar_tab AS CAP ON TRY_CAST(C.num_previsao AS INT) = CAP.NumPrevisao AND TRY_CAST(C.codLoja AS INT) = CAP.CodLoja',
    )
    .leftJoin('Parametro2 as P', 'P.codLoja', 'CAP.CodLoja')
    .joinRaw('LEFT JOIN Fornecedores AS F ON CAST(F.codFor AS VARCHAR(50)) = C.codFor')
    .where('CAP.Vencimento', '>=', inicio)
    .andWhere('CAP.Vencimento', '<', fim)
    .whereNotNull('C.num_previsao')
    .whereIn('C.status', STATUS_ATIVOS)

  if (codLojaNum !== null) {
    query.andWhere('CAP.CodLoja', codLojaNum)
  }

  const rows = (await query.orderBy('CAP.Vencimento', 'asc').orderBy('C.titulo', 'asc')) as RelatorioMensalParcelaRow[]

  return rows.map((row) => normalizarParcela(row, 'ABERTO'))
}

export async function listParcelasPagasPorMes(
  filtros: RelatorioMensalFiltros,
): Promise<Omit<RelatorioMensalParcela, 'quantidadeAnexos'>[]> {
  await dbConnection()

  const { inicio, fim } = calcularPeriodoMensal(filtros.ano, filtros.mes)
  const codLojaNum = parseCodLojaNumerico(filtros.codLoja)
  const dataPagamentoCol = PREVISAO_COMPRA_BAIXAS_DATA_PAGAMENTO

  const query = db(`${CONTRATOS_TABLE} as C`)
    .select([
      'C.id as contratoId',
      'C.titulo',
      'C.tipo_contrato as tipoContrato',
      'C.codFor',
      db.raw('COALESCE(F.nomeFor, F.NomeFantasia) AS fornecedorNome'),
      'C.codLoja',
      'P.empresa as lojaNome',
      'C.num_previsao as numPrevisao',
      'C.num_cotacao as numCotacao',
      db.raw('PCB.ValorNota AS valorParcela'),
      db.raw(`PCB.[${dataPagamentoCol}] AS dataReferencia`),
      db.raw(
        "CONCAT('PAGO:', PCB.NumPrevisao, ':', PCB.CodLoja, ':', CAST(PCB.ValorNota AS VARCHAR(32))) AS erpChave",
      ),
    ])
    .joinRaw(
      'INNER JOIN dbo.PrevisaoCompraBaixas AS PCB ON TRY_CAST(C.num_previsao AS INT) = PCB.NumPrevisao AND TRY_CAST(C.codLoja AS INT) = PCB.CodLoja',
    )
    .leftJoin('Parametro2 as P', 'P.codLoja', 'PCB.CodLoja')
    .joinRaw('LEFT JOIN Fornecedores AS F ON CAST(F.codFor AS VARCHAR(50)) = C.codFor')
    .whereRaw(`PCB.[${dataPagamentoCol}] >= ?`, [inicio])
    .andWhereRaw(`PCB.[${dataPagamentoCol}] < ?`, [fim])
    .whereNotNull('C.num_previsao')
    .whereIn('C.status', STATUS_ATIVOS)

  if (codLojaNum !== null) {
    query.andWhere('PCB.CodLoja', codLojaNum)
  }

  const rows = (await query
    .orderBy(`PCB.${dataPagamentoCol}`, 'asc')
    .orderBy('C.titulo', 'asc')) as RelatorioMensalParcelaRow[]

  return rows.map((row) => normalizarParcela(row, 'PAGO'))
}

export async function resumoPrevistoPorTipo(
  filtros: RelatorioMensalFiltros,
): Promise<Array<{ tipoContrato: contratoEnum; previsto: number; quantidadeContratos: number }>> {
  await dbConnection()

  const { inicio, fim } = calcularPeriodoMensal(filtros.ano, filtros.mes)
  const codLoja = filtros.codLoja?.trim() || null

  /** Vigencia no mes + valor_mensal => previsto mensal (com ou sem data_fim). Sem valor_mensal: valor_total no mes da data_inicio. */
  const query = db(`${CONTRATOS_TABLE} as C`)
    .select([
      'C.tipo_contrato as tipoContrato',
      db.raw(`
        SUM(
          CASE
            WHEN COALESCE(C.valor_mensal, 0) > 0 THEN COALESCE(C.valor_mensal, 0)
            WHEN C.data_inicio >= ? AND C.data_inicio < ? THEN COALESCE(C.valor_total, 0)
            ELSE 0
          END
        ) AS previsto
      `, [inicio, fim]),
      db.raw('COUNT(*) AS quantidadeContratos'),
    ])
    .whereRaw('C.data_inicio <= DATEADD(day, -1, CAST(? AS DATE))', [fim])
    .andWhere(function vigenciaAtiva() {
      this.whereNull('C.data_fim').orWhere('C.data_fim', '>=', inicio)
    })
    .whereIn('C.status', STATUS_ATIVOS)
    .groupBy('C.tipo_contrato')

  if (codLoja) {
    query.andWhere('C.codLoja', codLoja)
  }

  const rows = (await query) as RelatorioMensalPrevistoRow[]

  return rows.map((row) => ({
    tipoContrato: String(row.tipoContrato ?? '') as contratoEnum,
    previsto: Number(row.previsto ?? 0),
    quantidadeContratos: Number(row.quantidadeContratos ?? 0),
  }))
}

export { calcularPeriodoMensal }
