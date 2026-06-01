"use client";

import { withBasePath } from "@/utils/cliet";
import type {
  CondicaoPagamentoOption,
  FormaPagamentoOption,
} from "../_types/pagamento.type";

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

async function parseJson<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => ({}))) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(json.error ?? json.message ?? "Erro na requisicao.");
  }

  return json;
}

export async function listarCondicoesPagamento(): Promise<CondicaoPagamentoOption[]> {
  const response = await fetch(withBasePath("/api/contratos/condicoes-pagamento"), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<CondicaoPagamentoOption[]>(response);
}

export async function listarFormasPagamento(): Promise<FormaPagamentoOption[]> {
  const response = await fetch(withBasePath("/api/contratos/formas-pagamento"), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<FormaPagamentoOption[]>(response);
}
