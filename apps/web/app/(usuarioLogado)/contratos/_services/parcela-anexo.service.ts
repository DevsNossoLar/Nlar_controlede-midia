"use client";

import { withBasePath } from "@/utils/cliet";
import type { ApiErrorResponse } from "../_types/contrato.type";
import type {
  ParcelaAnexo,
  ParcelaAnexoCompleto,
  UploadParcelaAnexoPayload,
} from "../_types/parcela-anexo.type";
import type { ParcelaContrato } from "../_types/parcela.type";

async function parseJson<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => ({}))) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(json.error ?? json.message ?? "Erro na requisicao.");
  }

  return json;
}

function anexosUrl(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
  anexoId?: number | string,
): string {
  const params = new URLSearchParams({
    origem: parcela.origem,
    erpChave: parcela.erpChave,
  });
  if (anexoId !== undefined) {
    params.set("anexoId", String(anexoId));
  }
  return withBasePath(`/api/contratos/${contratoId}/parcelas/anexos?${params.toString()}`);
}

export async function listarAnexosParcela(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
): Promise<ParcelaAnexo[]> {
  const response = await fetch(anexosUrl(contratoId, parcela), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<ParcelaAnexo[]>(response);
}

export async function buscarAnexoParcela(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
  anexoId: number | string,
): Promise<ParcelaAnexoCompleto> {
  const response = await fetch(anexosUrl(contratoId, parcela, anexoId), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<ParcelaAnexoCompleto>(response);
}

export async function enviarAnexoParcela(
  contratoId: number | string,
  parcela: ParcelaContrato,
  payload: UploadParcelaAnexoPayload,
): Promise<ParcelaAnexo> {
  const response = await fetch(anexosUrl(contratoId, parcela), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJson<ParcelaAnexo>(response);
}

export async function removerAnexoParcela(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
  anexoId: number | string,
): Promise<void> {
  const response = await fetch(anexosUrl(contratoId, parcela, anexoId), {
    method: "DELETE",
    credentials: "include",
  });

  await parseJson<{ ok: boolean }>(response);
}
