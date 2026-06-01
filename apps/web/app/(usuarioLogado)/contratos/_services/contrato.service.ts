"use client";

import { withBasePath } from "@/utils/cliet";
import type {
  ApiErrorResponse,
  Contrato,
  ContratoFilters,
  ContratoPayload,
  PaginatedResponse,
} from "../_types/contrato.type";

async function parseJson<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => ({}))) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(json.error ?? json.message ?? "Erro na requisicao.");
  }

  return json;
}

function buildContratosQuery(filters: ContratoFilters): string {
  const params = new URLSearchParams();

  if (filters.search.trim()) params.set("search", filters.search.trim());
  if (filters.status) params.set("status", filters.status);
  if (filters.tipoContrato) params.set("tipoContrato", filters.tipoContrato);
  if (filters.codFor) params.set("codFor", filters.codFor);
  if (filters.codLoja) params.set("codLoja", filters.codLoja);
  if (filters.dataInicio) params.set("dataInicio", filters.dataInicio);
  if (filters.dataFim) params.set("dataFim", filters.dataFim);

  params.set("page", String(filters.page));
  params.set("perPage", String(filters.perPage));

  return params.toString();
}

export async function listarContratos(
  filters: ContratoFilters,
): Promise<PaginatedResponse<Contrato>> {
  const qs = buildContratosQuery(filters);
  const response = await fetch(withBasePath(`/api/contratos?${qs}`), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<PaginatedResponse<Contrato>>(response);
}

export async function buscarContratoPorId(id: string): Promise<Contrato> {
  const response = await fetch(withBasePath(`/api/contratos/${id}`), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<Contrato>(response);
}

export async function criarContrato(payload: ContratoPayload): Promise<Contrato> {
  const response = await fetch(withBasePath("/api/contratos"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseJson<Contrato>(response);
}

export async function atualizarContrato(
  id: string,
  payload: ContratoPayload,
): Promise<Contrato> {
  const response = await fetch(withBasePath(`/api/contratos/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return parseJson<Contrato>(response);
}

export async function cancelarContrato(id: string | number): Promise<Contrato> {
  const response = await fetch(withBasePath(`/api/contratos/${id}/cancelar`), {
    method: "PATCH",
    credentials: "include",
  });

  return parseJson<Contrato>(response);
}

export async function encerrarContrato(id: string | number): Promise<Contrato> {
  const response = await fetch(withBasePath(`/api/contratos/${id}/encerrar`), {
    method: "PATCH",
    credentials: "include",
  });

  return parseJson<Contrato>(response);
}
