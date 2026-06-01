import { normalizarTipoContrato } from "@repo/db/client";
import { CONTRATO_STATUS, type ContratoFormValues } from "../_types/contrato.type";

export type ContratoFormErrors = Partial<Record<keyof ContratoFormValues, string>>;

function isValidNumber(value: string): boolean {
  if (!value.trim()) return true;
  return Number.isFinite(Number(value.replace(",", ".")));
}

function toNumber(value: string): number | null {
  if (!value.trim()) return null;
  return Number(value.replace(",", "."));
}

export function validarContratoForm(values: ContratoFormValues): ContratoFormErrors {
  const errors: ContratoFormErrors = {};

  if (!values.codFor.trim()) errors.codFor = "Fornecedor obrigatorio.";
  if (!values.codLoja.trim()) errors.codLoja = "Loja obrigatoria.";
  if (!values.titulo.trim()) errors.titulo = "Numero ou nome do contrato obrigatorio.";
  if (!values.descricao.trim()) errors.descricao = "Descricao obrigatoria.";
  if (!values.dataInicio) errors.dataInicio = "Data de inicio obrigatoria.";
  if (!values.codCondicaoPagamento.trim()) {
    errors.codCondicaoPagamento = "Condicao de pagamento obrigatoria.";
  }
  if (!values.codFormaPagamento.trim()) {
    errors.codFormaPagamento = "Forma de pagamento obrigatoria.";
  }

  if (values.titulo.trim().length > 180) {
    errors.titulo = "Numero ou nome do contrato deve ter no maximo 180 caracteres.";
  }

  if (values.numPrevisao.trim().length > 60) {
    errors.numPrevisao = "Num. previsao deve ter no maximo 60 caracteres.";
  }

  if (values.numCotacao.trim().length > 60) {
    errors.numCotacao = "Num. cotacao deve ter no maximo 60 caracteres.";
  }

  if (values.dataInicio && values.dataFim && values.dataFim < values.dataInicio) {
    errors.dataFim = "Data final nao pode ser menor que a inicial.";
  }

  if (!CONTRATO_STATUS.includes(values.status)) {
    errors.status = "Status invalido.";
  }

  const valorTotal = toNumber(values.valorTotal);
  const valorMensal = toNumber(values.valorMensal);

  if (!isValidNumber(values.valorTotal)) errors.valorTotal = "Valor total invalido.";
  if (!isValidNumber(values.valorMensal)) errors.valorMensal = "Valor mensal invalido.";
  if (valorTotal !== null && valorTotal < 0) errors.valorTotal = "Valor total nao pode ser negativo.";
  if (valorMensal !== null && valorMensal < 0) errors.valorMensal = "Valor mensal nao pode ser negativo.";

  if (values.codCondicaoPagamento.trim()) {
    const cod = Number(values.codCondicaoPagamento);
    if (!Number.isInteger(cod) || cod < 0) {
      errors.codCondicaoPagamento = "Condicao de pagamento invalida.";
    }
  }

  if (values.codFormaPagamento.trim()) {
    const cod = Number(values.codFormaPagamento);
    if (!Number.isInteger(cod) || cod < 0) {
      errors.codFormaPagamento = "Forma de pagamento invalida.";
    }
  }

  if (!values.dataFim && !valorMensal) {
    errors.valorMensal = "Valor mensal obrigatorio para contrato sem data fim.";
  }

  if (values.diaVencimentoPadrao.trim()) {
    const day = Number(values.diaVencimentoPadrao);
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      errors.diaVencimentoPadrao = "Dia deve estar entre 1 e 31.";
    }
  }

  if (!values.tipoContrato) {
    errors.tipoContrato = "Tipo obrigatorio.";
  } else if (!normalizarTipoContrato(values.tipoContrato)) {
    errors.tipoContrato = "Tipo de contrato invalido.";
  }

  return errors;
}

export function hasContratoFormErrors(errors: ContratoFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
