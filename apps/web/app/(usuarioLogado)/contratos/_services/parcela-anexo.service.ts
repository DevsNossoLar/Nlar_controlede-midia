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

function encodeBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function encodeParcelaRef(
  origem: ParcelaContrato["origem"],
  erpChave: ParcelaContrato["erpChave"],
): string {
  return encodeBase64Url(JSON.stringify({ origem, erpChave }));
}

function parcelaRefPath(parcela: Pick<ParcelaContrato, "origem" | "erpChave">): string {
  return encodeURIComponent(encodeParcelaRef(parcela.origem, parcela.erpChave));
}

export async function listarAnexosParcela(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
): Promise<ParcelaAnexo[]> {
  const ref = parcelaRefPath(parcela);
  const response = await fetch(
    withBasePath(`/api/contratos/${contratoId}/parcelas/${ref}/anexos`),
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  return parseJson<ParcelaAnexo[]>(response);
}

export async function buscarAnexoParcela(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
  anexoId: number | string,
): Promise<ParcelaAnexoCompleto> {
  const ref = parcelaRefPath(parcela);
  const response = await fetch(
    withBasePath(`/api/contratos/${contratoId}/parcelas/${ref}/anexos/${anexoId}`),
    {
      credentials: "include",
      cache: "no-store",
    },
  );

  return parseJson<ParcelaAnexoCompleto>(response);
}

export async function enviarAnexoParcela(
  contratoId: number | string,
  parcela: ParcelaContrato,
  payload: UploadParcelaAnexoPayload,
): Promise<ParcelaAnexo> {
  const ref = parcelaRefPath(parcela);
  const response = await fetch(
    withBasePath(`/api/contratos/${contratoId}/parcelas/${ref}/anexos`),
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  return parseJson<ParcelaAnexo>(response);
}

export async function removerAnexoParcela(
  contratoId: number | string,
  parcela: Pick<ParcelaContrato, "origem" | "erpChave">,
  anexoId: number | string,
): Promise<void> {
  const ref = parcelaRefPath(parcela);
  const response = await fetch(
    withBasePath(`/api/contratos/${contratoId}/parcelas/${ref}/anexos/${anexoId}`),
    {
      method: "DELETE",
      credentials: "include",
    },
  );

  await parseJson<{ ok: boolean }>(response);
}
