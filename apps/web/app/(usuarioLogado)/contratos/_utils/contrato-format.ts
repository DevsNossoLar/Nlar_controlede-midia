import { TIPO_CONTRATO_LABEL as TIPO_CONTRATO_LABEL_DB } from "@repo/db/client";
import type { ContratoStatus, TipoContrato } from "../_types/contrato.type";
import type { FornecedorOption } from "../_types/fornecedor.type";
import type { LojaOption } from "../_types/loja.type";
import type {
  CondicaoPagamentoOption,
  FormaPagamentoOption,
} from "../_types/pagamento.type";

export const STATUS_LABEL: Record<ContratoStatus | "vencido", string> = {
  rascunho: "Rascunho",
  ativo: "Ativo",
  suspenso: "Suspenso",
  encerrado: "Encerrado",
  cancelado: "Cancelado",
  vencido: "Vencido",
};

export const TIPO_CONTRATO_LABEL: Record<TipoContrato, string> = TIPO_CONTRATO_LABEL_DB;

export function formatarMoeda(value: number | null | undefined): string {
  if (typeof value !== "number" || !Number.isFinite(value)) return "-";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatarData(value: string | null | undefined): string {
  if (!value) return "-";
  const [year, month, day] = value.slice(0, 10).split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

export function formatarDataHora(value: string | null | undefined): string {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function formatarFornecedor(fornecedor: FornecedorOption | null, codFor?: string): string {
  if (!fornecedor) return codFor ? `${codFor} - Fornecedor nao localizado` : "-";

  const partes = [fornecedor.codFor, fornecedor.nomeFor, fornecedor.nomeFantasia]
    .filter(Boolean)
    .map(String);

  return partes.join(" - ");
}

export function formatarLoja(loja: LojaOption | null, codLoja?: string): string {
  if (!loja) return codLoja ? `${codLoja} - Loja nao localizada` : "-";
  return [loja.codLoja, loja.empresa].filter(Boolean).map(String).join(" - ");
}

export function formatarCondicaoPagamento(
  condicao: CondicaoPagamentoOption | null,
  codCondicaoPagamento?: number | null,
): string {
  if (!condicao) {
    return codCondicaoPagamento === null || typeof codCondicaoPagamento === "undefined"
      ? "-"
      : `${codCondicaoPagamento} - Condicao nao localizada`;
  }

  return [condicao.codCondicaoPagamento, condicao.descricao].filter(Boolean).join(" - ");
}

export function formatarFormaPagamento(
  forma: FormaPagamentoOption | null,
  codFormaPagamento?: number | null,
): string {
  if (!forma) {
    return codFormaPagamento === null || typeof codFormaPagamento === "undefined"
      ? "-"
      : `${codFormaPagamento} - Forma nao localizada`;
  }

  return [forma.codFormaPagamento, forma.descricao].filter(Boolean).join(" - ");
}

export function statusCalculado(status: ContratoStatus, dataFim: string | null): ContratoStatus | "vencido" {
  if (status === "ativo" && dataFim) {
    const hoje = new Date().toISOString().slice(0, 10);
    if (dataFim < hoje) return "vencido";
  }

  return status;
}
