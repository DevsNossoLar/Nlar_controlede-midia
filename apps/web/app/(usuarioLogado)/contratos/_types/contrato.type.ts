import { CONTRATO_TIPOS, contratoEnum } from "@repo/db/client";
import type { FornecedorOption } from "./fornecedor.type";
import type { LojaOption } from "./loja.type";
import type { CondicaoPagamentoOption, FormaPagamentoOption } from "./pagamento.type";

export const CONTRATO_STATUS = [
  "rascunho",
  "ativo",
  "suspenso",
  "encerrado",
  "cancelado",
] as const;

export const CONTRATO_STATUS_FILTRO = [...CONTRATO_STATUS, "vencido"] as const;

export const TIPO_CONTRATO = CONTRATO_TIPOS;

export type ContratoStatus = (typeof CONTRATO_STATUS)[number];
export type ContratoStatusFiltro = (typeof CONTRATO_STATUS_FILTRO)[number];
export type TipoContrato = contratoEnum;

export type Contrato = {
  id: number;
  codFor: string;
  titulo: string;
  descricao: string | null;
  codLoja: string;
  tipoContrato: TipoContrato;
  numPrevisao: string | null;
  numCotacao: string | null;
  valorTotal: number | null;
  valorMensal: number | null;
  codCondicaoPagamento: number | null;
  codFormaPagamento: number | null;
  dataInicio: string;
  dataFim: string | null;
  status: ContratoStatus;
  recorrente: boolean;
  diaVencimentoPadrao: number | null;
  observacao: string | null;
  criadoPor: string | null;
  criadoEm: string;
  atualizadoEm: string | null;
  fornecedor: FornecedorOption | null;
  loja: LojaOption | null;
  condicaoPagamento: CondicaoPagamentoOption | null;
  formaPagamento: FormaPagamentoOption | null;
};

export type ContratoListItem = Contrato;

export type ContratoFilters = {
  search: string;
  status: "" | ContratoStatusFiltro;
  tipoContrato: "" | TipoContrato;
  codFor: string;
  codLoja: string;
  dataInicio: string;
  dataFim: string;
  page: number;
  perPage: number;
};

export type ContratoFormValues = {
  codFor: string;
  codLoja: string;
  titulo: string;
  numPrevisao: string;
  numCotacao: string;
  descricao: string;
  tipoContrato: TipoContrato;
  valorTotal: string;
  valorMensal: string;
  codCondicaoPagamento: string;
  codFormaPagamento: string;
  dataInicio: string;
  dataFim: string;
  status: ContratoStatus;
  recorrente: boolean;
  diaVencimentoPadrao: string;
  observacao: string;
};

export type ContratoPayload = {
  codFor: string;
  codLoja: string;
  titulo: string;
  numPrevisao: string | null;
  numCotacao: string | null;
  descricao: string | null;
  tipoContrato: TipoContrato;
  valorTotal: number | null;
  valorMensal: number | null;
  codCondicaoPagamento: number | null;
  codFormaPagamento: number | null;
  dataInicio: string;
  dataFim: string | null;
  status?: ContratoStatus;
  recorrente: boolean;
  diaVencimentoPadrao: number | null;
  observacao: string | null;
};

export type PaginatedResponse<T> = {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

export type ApiErrorResponse = {
  message?: string;
  error?: string;
};
