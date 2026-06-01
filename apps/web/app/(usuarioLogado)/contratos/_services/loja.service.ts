"use client";

import { withBasePath } from "@/utils/cliet";
import type { ApiErrorResponse } from "../_types/contrato.type";
import type { LojaOption } from "../_types/loja.type";
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
  if (/^\d+$/.test(query)) params.set("codLoja", query);
  else params.set("q", query);

  return params;
}

export async function buscarLojas(search: string, signal?: AbortSignal): Promise<LojaOption[]> {
  const params = paramsDaBusca(search);
  if (!params) return [];

  const response = await fetch(withBasePath(`/api/lojas?${params.toString()}`), {
    credentials: "include",
    cache: "no-store",
    signal,
  });

  return parseJson<LojaOption[]>(response);
}

export async function buscarLojaPorCodigo(
  codLoja: string,
  signal?: AbortSignal,
): Promise<LojaOption | null> {
  const cod = codLoja.trim();
  if (!cod) return null;

  const params = new URLSearchParams({ codLoja: cod });
  const response = await fetch(withBasePath(`/api/lojas?${params.toString()}`), {
    credentials: "include",
    cache: "no-store",
    signal,
  });

  const lista = await parseJson<LojaOption[]>(response);
  return (
    lista.find((item) => item.codLoja.trim() === cod || item.codLoja === cod) ??
    lista[0] ??
    null
  );
}
