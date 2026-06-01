import type { contratoEnum } from '../types'
import type { ParcelaOrigem } from '../lancamentos/types'

export type RelatorioMensalSituacao = 'aberto' | 'pago' | 'ambos'

export type RelatorioMensalFiltros = {
  ano: number
  mes: number
  codLoja?: string | null
  situacao?: RelatorioMensalSituacao
}

export type RelatorioMensalPeriodo = {
  ano: number
  mes: number
  inicio: string
  fim: string
}

export type RelatorioMensalParcela = {
  contratoId: number
  titulo: string
  tipoContrato: contratoEnum
  codFor: string
  fornecedorNome: string | null
  codLoja: string
  lojaNome: string | null
  numPrevisao: string | null
  numCotacao: string | null
  valorParcela: number
  situacao: ParcelaOrigem
  /** Vencimento (ABERTO) ou data de pagamento/baixa (PAGO). */
  dataReferencia: string
  erpChave: string
  quantidadeAnexos: number
}

export type RelatorioMensalResumoTipo = {
  tipoContrato: contratoEnum
  aPagar: number
  pago: number
  previsto: number
  quantidadeParcelasAbertas: number
  quantidadeParcelasPagas: number
  quantidadeContratos: number
}

export type RelatorioMensalTotais = {
  aPagar: number
  pago: number
  previsto: number
  quantidadeParcelasAbertas: number
  quantidadeParcelasPagas: number
}

export type RelatorioMensalResult = {
  periodo: RelatorioMensalPeriodo
  filtros: { codLoja: string | null; situacao: RelatorioMensalSituacao }
  totais: RelatorioMensalTotais
  porTipo: RelatorioMensalResumoTipo[]
  parcelas: RelatorioMensalParcela[]
}

export type RelatorioMensalParcelaRow = {
  contratoId?: number | string
  titulo?: string
  tipoContrato?: string
  codFor?: string
  fornecedorNome?: string | null
  codLoja?: string
  lojaNome?: string | null
  numPrevisao?: string | null
  numCotacao?: string | null
  valorParcela?: number | string
  situacao?: string
  dataReferencia?: string | Date
  erpChave?: string
}

export type RelatorioMensalPrevistoRow = {
  tipoContrato?: string
  previsto?: number | string
  quantidadeContratos?: number | string
}
