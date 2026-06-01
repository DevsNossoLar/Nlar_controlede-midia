import { contratoEnum } from "@repo/db/client";
import type {
  Contrato,
  ContratoFormValues,
  ContratoPayload,
} from "../_types/contrato.type";

export const CONTRATO_FORM_INICIAL: ContratoFormValues = {
  codFor: "",
  codLoja: "",
  titulo: "",
  numPrevisao: "",
  numCotacao: "",
  descricao: "",
  tipoContrato: contratoEnum.DIVERSOS,
  valorTotal: "",
  valorMensal: "",
  codCondicaoPagamento: "",
  codFormaPagamento: "",
  dataInicio: "",
  dataFim: "",
  status: "ativo",
  recorrente: false,
  diaVencimentoPadrao: "",
  observacao: "",
};

function numberOrNull(value: string): number | null {
  const trimmed = value.trim().replace(",", ".");
  if (!trimmed) return null;
  return Number(trimmed);
}

function integerOrNull(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return Number(trimmed);
}

function textOrNull(value: string): string | null {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function inferirRecorrente(dataFim: string): boolean {
  return !dataFim.trim();
}

export function contratoToFormValues(contrato: Contrato): ContratoFormValues {
  return {
    codFor: contrato.codFor,
    codLoja: contrato.codLoja,
    titulo: contrato.titulo,
    numPrevisao: contrato.numPrevisao ?? "",
    numCotacao: contrato.numCotacao ?? "",
    descricao: contrato.descricao ?? "",
    tipoContrato: contrato.tipoContrato,
    valorTotal: contrato.valorTotal === null ? "" : String(contrato.valorTotal),
    valorMensal: contrato.valorMensal === null ? "" : String(contrato.valorMensal),
    codCondicaoPagamento:
      contrato.codCondicaoPagamento === null ? "" : String(contrato.codCondicaoPagamento),
    codFormaPagamento:
      contrato.codFormaPagamento === null ? "" : String(contrato.codFormaPagamento),
    dataInicio: contrato.dataInicio ?? "",
    dataFim: contrato.dataFim ?? "",
    status: contrato.status,
    recorrente: contrato.recorrente,
    diaVencimentoPadrao:
      contrato.diaVencimentoPadrao === null ? "" : String(contrato.diaVencimentoPadrao),
    observacao: contrato.observacao ?? "",
  };
}

export function formToPayload(values: ContratoFormValues): ContratoPayload {
  return {
    codFor: values.codFor.trim(),
    codLoja: values.codLoja.trim(),
    titulo: values.titulo.trim(),
    numPrevisao: textOrNull(values.numPrevisao),
    numCotacao: textOrNull(values.numCotacao),
    descricao: textOrNull(values.descricao),
    tipoContrato: values.tipoContrato,
    valorTotal: numberOrNull(values.valorTotal),
    valorMensal: numberOrNull(values.valorMensal),
    codCondicaoPagamento: integerOrNull(values.codCondicaoPagamento),
    codFormaPagamento: integerOrNull(values.codFormaPagamento),
    dataInicio: values.dataInicio,
    dataFim: textOrNull(values.dataFim),
    status: values.status,
    recorrente: inferirRecorrente(values.dataFim),
    diaVencimentoPadrao: integerOrNull(values.diaVencimentoPadrao),
    observacao: textOrNull(values.observacao),
  };
}

export function formToCreatePayload(values: ContratoFormValues): ContratoPayload {
  const payload = formToPayload(values);

  return {
    codFor: payload.codFor,
    codLoja: payload.codLoja,
    titulo: payload.titulo,
    numPrevisao: payload.numPrevisao,
    numCotacao: payload.numCotacao,
    descricao: payload.descricao,
    tipoContrato: payload.tipoContrato,
    valorTotal: payload.valorTotal,
    valorMensal: payload.valorMensal,
    codCondicaoPagamento: payload.codCondicaoPagamento,
    codFormaPagamento: payload.codFormaPagamento,
    dataInicio: payload.dataInicio,
    dataFim: payload.dataFim,
    recorrente: payload.recorrente,
    diaVencimentoPadrao: payload.diaVencimentoPadrao,
    observacao: payload.observacao,
  };
}
