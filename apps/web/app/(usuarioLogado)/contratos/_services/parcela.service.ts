"use client";

import { withBasePath } from "@/utils/cliet";
import type { ApiErrorResponse } from "../_types/contrato.type";
import type { ParcelaContrato } from "../_types/parcela.type";

async function parseJson<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => ({}))) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(json.error ?? json.message ?? "Erro na requisicao.");
  }

  return json;
}

export async function salvarObservacaoParcela(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
  observacao: string,
): Promise<{ observacao: string | null }> {
  const params = new URLSearchParams({ origem: parcela.origem, erpChave: parcela.erpChave });
  const response = await fetch(withBasePath(`/api/contratos/${contratoId}/parcelas/observacao?${params}`), {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ observacao }),
  });
  return parseJson<{ observacao: string | null }>(response);
}

export async function listarParcelasContrato(
  contratoId: number | string,
): Promise<ParcelaContrato[]> {
  const response = await fetch(withBasePath(`/api/contratos/${contratoId}/parcelas`), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<ParcelaContrato[]>(response);
}
