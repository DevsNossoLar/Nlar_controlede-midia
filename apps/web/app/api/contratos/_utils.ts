import {
  getCondicoesPagamentoPrazo,
  getFornecedoresPorCodigos,
  getFormasDePagamento,
  getLojasPorCodigos,
  parseContratoId,
  type ContratoProps,
  type ContratosListResult,
} from "@repo/db";

export function parseContratoIdParam(id: string): number | null {
  return parseContratoId(id);
}

export type FornecedorResumo = {
  codFor: string;
  nomeFor: string | null;
  nomeFantasia: string | null;
};

export type LojaResumo = {
  codLoja: string;
  empresa: string | null;
};

export type CondicaoPagamentoResumo = {
  codCondicaoPagamento: string;
  descricao: string;
};

export type FormaPagamentoResumo = {
  codFormaPagamento: string;
  descricao: string;
};

export type ContratoComRelacionamentos = ContratoProps & {
  fornecedor: FornecedorResumo | null;
  loja: LojaResumo | null;
  condicaoPagamento: CondicaoPagamentoResumo | null;
  formaPagamento: FormaPagamentoResumo | null;
};

type FornecedorRow = {
  codFor?: string | number | null;
  nomeFor?: string | null;
  nomeFantasia?: string | null;
  NomeFantasia?: string | null;
};

type LojaRow = {
  codLoja?: string | number | null;
  empresa?: string | null;
};

type CondicaoPagamentoRow = {
  CodCondicaoPgto?: string | number | null;
  Descricao?: string | null;
};

type FormaPagamentoRow = {
  CodFormaPgto?: string | number | null;
  DescricaoFormaPagamento?: string | null;
};

export function normalizarFornecedor(row: FornecedorRow): FornecedorResumo {
  return {
    codFor: String(row.codFor ?? ""),
    nomeFor: row.nomeFor ?? null,
    nomeFantasia: row.nomeFantasia ?? row.NomeFantasia ?? null,
  };
}

export function normalizarLoja(row: LojaRow): LojaResumo {
  return {
    codLoja: String(row.codLoja ?? ""),
    empresa: row.empresa ?? null,
  };
}

export function normalizarCondicaoPagamento(
  row: CondicaoPagamentoRow,
): CondicaoPagamentoResumo {
  return {
    codCondicaoPagamento: String(row.CodCondicaoPgto ?? ""),
    descricao: row.Descricao ?? "",
  };
}

export function normalizarFormaPagamento(row: FormaPagamentoRow): FormaPagamentoResumo {
  return {
    codFormaPagamento: String(row.CodFormaPgto ?? ""),
    descricao: row.DescricaoFormaPagamento ?? "",
  };
}

async function carregarRelacionamentosPorCodigos(codForList: string[], codLojaList: string[]) {
  const [fornecedoresRaw, lojasRaw] = await Promise.all([
    getFornecedoresPorCodigos(codForList),
    getLojasPorCodigos(codLojaList),
  ]);

  const fornecedores = (fornecedoresRaw as FornecedorRow[]).map(normalizarFornecedor);
  const lojas = (lojasRaw as LojaRow[]).map(normalizarLoja);

  return {
    fornecedoresPorCodigo: new Map(fornecedores.map((item) => [item.codFor, item])),
    lojasPorCodigo: new Map(lojas.map((item) => [item.codLoja, item])),
  };
}

async function carregarPagamentos() {
  const [condicoesRaw, formasRaw] = await Promise.all([
    getCondicoesPagamentoPrazo(),
    getFormasDePagamento(),
  ]);

  const condicoes = (condicoesRaw as CondicaoPagamentoRow[]).map(normalizarCondicaoPagamento);
  const formas = (formasRaw as FormaPagamentoRow[]).map(normalizarFormaPagamento);

  return {
    condicoesPorCodigo: new Map(
      condicoes.map((item) => [item.codCondicaoPagamento, item]),
    ),
    formasPorCodigo: new Map(formas.map((item) => [item.codFormaPagamento, item])),
  };
}

export async function enriquecerContrato(
  contrato: ContratoProps,
): Promise<ContratoComRelacionamentos> {
  const [
    { fornecedoresPorCodigo, lojasPorCodigo },
    { condicoesPorCodigo, formasPorCodigo },
  ] = await Promise.all([
    carregarRelacionamentosPorCodigos([contrato.codFor], [contrato.codLoja]),
    carregarPagamentos(),
  ]);

  return {
    ...contrato,
    fornecedor: fornecedoresPorCodigo.get(contrato.codFor) ?? null,
    loja: lojasPorCodigo.get(contrato.codLoja) ?? null,
    condicaoPagamento:
      contrato.codCondicaoPagamento === null
        ? null
        : condicoesPorCodigo.get(String(contrato.codCondicaoPagamento)) ?? null,
    formaPagamento:
      contrato.codFormaPagamento === null
        ? null
        : formasPorCodigo.get(String(contrato.codFormaPagamento)) ?? null,
  };
}

export async function enriquecerContratosResult(
  result: ContratosListResult,
): Promise<ContratosListResult & { data: ContratoComRelacionamentos[] }> {
  const codForList = [...new Set(result.data.map((contrato) => contrato.codFor).filter(Boolean))];
  const codLojaList = [...new Set(result.data.map((contrato) => contrato.codLoja).filter(Boolean))];

  const [
    { fornecedoresPorCodigo, lojasPorCodigo },
    { condicoesPorCodigo, formasPorCodigo },
  ] = await Promise.all([
    carregarRelacionamentosPorCodigos(codForList, codLojaList),
    carregarPagamentos(),
  ]);

  return {
    ...result,
    data: result.data.map((contrato) => ({
      ...contrato,
      fornecedor: fornecedoresPorCodigo.get(contrato.codFor) ?? null,
      loja: lojasPorCodigo.get(contrato.codLoja) ?? null,
      condicaoPagamento:
        contrato.codCondicaoPagamento === null
          ? null
          : condicoesPorCodigo.get(String(contrato.codCondicaoPagamento)) ?? null,
      formaPagamento:
        contrato.codFormaPagamento === null
          ? null
          : formasPorCodigo.get(String(contrato.codFormaPagamento)) ?? null,
    })),
  };
}
