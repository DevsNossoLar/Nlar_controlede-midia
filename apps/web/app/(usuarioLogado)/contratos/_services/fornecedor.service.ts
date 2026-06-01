"use client";

import { withBasePath } from "@/utils/cliet";
import type { ApiErrorResponse } from "../_types/contrato.type";
import type { FornecedorOption } from "../_types/fornecedor.type";
import { podeBuscar } from "../_utils/search";

async function parseJson<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => ({}))) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(json.error ?? json.message ?? "Erro na requisicao.");
  }

  return json;
}

function paramsDaBusca(search: string): URLSearchParams | null {
  const query = search.trim();
  if (!podeBuscar(query)) return null;

  const params = new URLSearchParams();
  if (/^\d+$/.test(query)) params.set("codFor", query);
  else params.set("q", query);

  return params;
}

export async function buscarFornecedores(
  search: string,
  signal?: AbortSignal,
): Promise<FornecedorOption[]> {
  const params = paramsDaBusca(search);
  if (!params) return [];

  const response = await fetch(withBasePath(`/api/fornecedores?${params.toString()}`), {
    credentials: "include",
    cache: "no-store",
    signal,
  });

  return parseJson<FornecedorOption[]>(response);
}

export async function buscarFornecedorPorCodigo(
  codFor: string,
  signal?: AbortSignal,
): Promise<FornecedorOption | null> {
  const cod = codFor.trim();
  if (!cod) return null;

  const params = new URLSearchParams({ codFor: cod });
  const response = await fetch(withBasePath(`/api/fornecedores?${params.toString()}`), {
    credentials: "include",
    cache: "no-store",
    signal,
  });

  const lista = await parseJson<FornecedorOption[]>(response);
  return lista.find((item) => item.codFor === cod) ?? lista[0] ?? null;
}
