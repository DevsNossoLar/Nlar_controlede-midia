import type { TipoContrato } from "../../../contratos/_types/contrato.type";

export type RelatorioMensalSituacao = "aberto" | "pago" | "ambos";

export type RelatorioMensalPeriodo = {
  ano: number;
  mes: number;
  inicio: string;
  fim: string;
};

export type RelatorioMensalParcela = {
  contratoId: number;
  titulo: string;
  tipoContrato: TipoContrato;
  codFor: string;
  fornecedorNome: string | null;
  codLoja: string;
  lojaNome: string | null;
  numPrevisao: string | null;
  numCotacao: string | null;
  valorParcela: number;
  situacao: "ABERTO" | "PAGO";
  dataReferencia: string;
  erpChave: string;
  quantidadeAnexos: number;
};

export type RelatorioMensalResumoTipo = {
  tipoContrato: TipoContrato;
  aPagar: number;
  pago: number;
  previsto: number;
  quantidadeParcelasAbertas: number;
  quantidadeParcelasPagas: number;
  quantidadeContratos: number;
};

export type RelatorioMensalTotais = {
  aPagar: number;
  pago: number;
  previsto: number;
  quantidadeParcelasAbertas: number;
  quantidadeParcelasPagas: number;
};

export type RelatorioMensalResult = {
  periodo: RelatorioMensalPeriodo;
  filtros: { codLoja: string | null; situacao: RelatorioMensalSituacao };
  totais: RelatorioMensalTotais;
  porTipo: RelatorioMensalResumoTipo[];
  parcelas: RelatorioMensalParcela[];
};

export type RelatorioMensalFilters = {
  mesReferencia: string;
  codLoja: string;
  situacao: RelatorioMensalSituacao;
};

export type ApiErrorResponse = {
  message?: string;
  error?: string;
};

export const RELATORIO_SITUACAO_OPCOES: Array<{ value: RelatorioMensalSituacao; label: string }> = [
  { value: "ambos", label: "Todas (a pagar e pagas)" },
  { value: "aberto", label: "Somente a pagar" },
  { value: "pago", label: "Somente pagas" },
];
