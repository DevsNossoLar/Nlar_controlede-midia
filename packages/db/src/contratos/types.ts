export enum contratoEnum {
  TELEVISAO = 'televisao',
  RADIO = 'radio',
  CARRO_DE_SOM = 'carro_de_som',
  PAINEL_DE_LED = 'painel_de_led',
  CORREIOS = 'correios',
  FRETE_RAPIDO = 'frete_rapido',
  OUTDOOR = 'outdoor',
  INFLUENCER = 'influencer',
  COMUNICACAO_VISUAL = 'comunicacao_visual',
  ENTREGA_DIGITAL = 'entrega_digital',
  COMISSAO_AGENCIA = 'comissao_agencia',
  GOOGLE_FACEBOOK = 'google_facebook',
  LAB8_TRAFEGO_PAGAMENTO = 'lab8_trafego_pagamento',
  RAD_NWSYS_KIGI = 'rad_nwsys_kigi',
  IDX_DATA_LB_LINK = 'idx_data_lb_link',
  SERASA_CLEAR_SALE = 'serasa_clear_sale',
  SAFETEC_LICENCAS_EMAIL = 'safetec_licencas_email',
  LISTENX = 'listenx',
  ANYMARKET = 'anymarket',
  RD_STATION = 'rd_station',
  DIVERSOS = 'diversos',
}

export const TIPO_CONTRATO_LABEL: Record<contratoEnum, string> = {
  [contratoEnum.TELEVISAO]: 'TELEVISÃO',
  [contratoEnum.RADIO]: 'RÁDIO',
  [contratoEnum.CARRO_DE_SOM]: 'CARRO DE SOM',
  [contratoEnum.PAINEL_DE_LED]: 'PAINEL DE LED',
  [contratoEnum.CORREIOS]: 'CORREIOS',
  [contratoEnum.FRETE_RAPIDO]: 'FRETE RÁPIDO',
  [contratoEnum.OUTDOOR]: 'OUTDOOR',
  [contratoEnum.INFLUENCER]: 'INFLUENCER',
  [contratoEnum.COMUNICACAO_VISUAL]: 'SERVIÇOS DE COMUNICAÇÃO VISUAL',
  [contratoEnum.ENTREGA_DIGITAL]: 'ENTREGA DIGITAL',
  [contratoEnum.COMISSAO_AGENCIA]: 'COMISSÃO AGÊNCIA',
  [contratoEnum.GOOGLE_FACEBOOK]: 'GOOGLE FACEBOOK',
  [contratoEnum.LAB8_TRAFEGO_PAGAMENTO]: 'LAB8 TRAFEGO PAGAMENTO',
  [contratoEnum.RAD_NWSYS_KIGI]: 'RAD - NWSYS KIGI SISTEMAS',
  [contratoEnum.IDX_DATA_LB_LINK]: 'IDX DATA (LB LINK)',
  [contratoEnum.SERASA_CLEAR_SALE]: 'SERASA (CLEAR SALE)',
  [contratoEnum.SAFETEC_LICENCAS_EMAIL]: 'SAFETEC LICENÇAS E-MAIL',
  [contratoEnum.LISTENX]: 'LISTENX',
  [contratoEnum.ANYMARKET]: 'ANYMARKET',
  [contratoEnum.RD_STATION]: 'RD STATION',
  [contratoEnum.DIVERSOS]: 'DIVERSOS',
}

/** Valores gravados no banco (sem chaves UPPER_CASE do enum TS). */
export const CONTRATO_TIPOS = Object.values(contratoEnum).filter(
  (value): value is contratoEnum =>
    typeof value === 'string' && value === value.toLowerCase(),
)

const TIPOS_CONTRATO_SET = new Set<string>(CONTRATO_TIPOS)

export function normalizarTipoContrato(value: string): contratoEnum | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  if (TIPOS_CONTRATO_SET.has(trimmed)) {
    return trimmed as contratoEnum
  }

  const fromEnumKey = (contratoEnum as Record<string, string>)[trimmed]
  if (fromEnumKey && TIPOS_CONTRATO_SET.has(fromEnumKey)) {
    return fromEnumKey as contratoEnum
  }

  const lower = trimmed.toLowerCase()
  if (TIPOS_CONTRATO_SET.has(lower)) {
    return lower as contratoEnum
  }

  return null
}

export function isTipoContratoValido(value: string): value is contratoEnum {
  return normalizarTipoContrato(value) !== null
}

export enum statusContratoEnum {
  RASCUNHO = 'rascunho',
  ATIVO = 'ativo',
  SUSPENSO = 'suspenso',
  ENCERRADO = 'encerrado',
  CANCELADO = 'cancelado',
}

export type StatusContratoCalculado = statusContratoEnum | 'vencido'

export type ContratoProps = {
  id?: number
  codFor: string
  titulo: string
  descricao: string | null
  codLoja: string
  tipoContrato: contratoEnum
  numPrevisao: string | null
  numCotacao: string | null
  valorTotal: number | null
  valorMensal: number | null
  codCondicaoPagamento: number | null
  codFormaPagamento: number | null
  dataInicio: string
  dataFim: string | null
  status: statusContratoEnum
  recorrente: boolean
  diaVencimentoPadrao: number | null
  observacao: string | null
  criadoPor: string | null
  criadoEm: Date
  atualizadoEm: Date | null
}

export type CriarContratoInput = {
  codFor?: string
  titulo?: string
  numContrato?: string | null
  descricao?: string | null
  codLoja?: string | null
  tipoContrato?: contratoEnum
  numPrevisao?: string | null
  numCotacao?: string | null
  valorTotal?: number | null
  valorContratado?: number | null
  valorMensal?: number | null
  codCondicaoPagamento?: number | null
  codFormaPagamento?: number | null
  dataInicio: string
  dataFim?: string | null
  recorrente?: boolean
  diaVencimentoPadrao?: number | null
  observacao?: string | null
  criadoPor?: string | null
}

export type AtualizarContratoInput = Partial<
  Omit<CriarContratoInput, 'codFor' | 'criadoPor'>
> & {
  codFor?: string
  status?: statusContratoEnum
}

export type atualizarContratoInput = AtualizarContratoInput

export type ListContratosFilters = {
  codFor?: string
  codLoja?: string
  tipoContrato?: contratoEnum
  status?: StatusContratoCalculado
  dataInicio?: string
  dataFim?: string
  search?: string
  orderBy?: 'titulo' | 'dataInicio' | 'dataFim' | 'valorTotal' | 'createdAt'
  orderDir?: 'asc' | 'desc'
  page?: number
  perPage?: number
}

export type ContratosListResult = {
  data: ContratoProps[]
  pagination: {
    page: number
    perPage: number
    total: number
    totalPages: number
  }
}

export type ContratoRow = {
  id: number
  codFor: string
  titulo: string
  descricao: string | null
  codLoja: string
  tipo_contrato: contratoEnum
  num_previsao: string | null
  num_cotacao: string | null
  valor_total: number | string | null
  valor_mensal: number | string | null
  cod_condicao_pagamento: number | string | null
  cod_forma_pagamento: number | string | null
  data_inicio: string | Date
  data_fim: string | Date | null
  status: statusContratoEnum
  recorrente: boolean | number
  dia_vencimento_padrao: number | null
  observacao: string | null
  created_by: string | null
  created_at: string | Date
  updated_at: string | Date | null
}
