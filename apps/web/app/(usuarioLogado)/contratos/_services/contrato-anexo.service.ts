"use client";

import { withBasePath } from "@/utils/cliet";
import type { ApiErrorResponse } from "../_types/contrato.type";
import type {
  ContratoAnexo,
  ContratoAnexoCompleto,
  UploadContratoAnexoPayload,
} from "../_types/contrato-anexo.type";

async function parseJson<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => ({}))) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(json.error ?? json.message ?? "Erro na requisicao.");
  }

  return json;
}

export async function listarAnexosContrato(
  contratoId: number | string,
): Promise<ContratoAnexo[]> {
  const response = await fetch(withBasePath(`/api/contratos/${contratoId}/anexos`), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<ContratoAnexo[]>(response);
}

export async function buscarAnexoContrato(
  contratoId: number | string,
  anexoId: number | string,
): Promise<ContratoAnexoCompleto> {
  const response = await fetch(
    withBasePath(`/api/contratos/${contratoId}/anexos/${anexoId}`),
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  return parseJson<ContratoAnexoCompleto>(response);
}

export async function enviarAnexoContrato(
  contratoId: number | string,
  payload: UploadContratoAnexoPayload,
): Promise<ContratoAnexo> {
  const response = await fetch(withBasePath(`/api/contratos/${contratoId}/anexos`), {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return parseJson<ContratoAnexo>(response);
}

export async function removerAnexoContrato(
  contratoId: number | string,
  anexoId: number | string,
): Promise<void> {
  const response = await fetch(
    withBasePath(`/api/contratos/${contratoId}/anexos/${anexoId}`),
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  await parseJson<{ ok: boolean }>(response);
}
