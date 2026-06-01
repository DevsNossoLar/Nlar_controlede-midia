"use client";

import { withBasePath } from "@/utils/cliet";
import type {
  ApiErrorResponse,
  RelatorioMensalFilters,
  RelatorioMensalResult,
} from "../_types/relatorio-mensal.type";

async function parseJson<T>(response: Response): Promise<T> {
  const json = (await response.json().catch(() => ({}))) as T & ApiErrorResponse;

  if (!response.ok) {
    throw new Error(json.error ?? json.message ?? "Erro na requisicao.");
  }

  return json;
}

function parseMesReferencia(mesReferencia: string): { ano: number; mes: number } {
  const [anoStr, mesStr] = mesReferencia.split("-");
  const ano = Number(anoStr);
  const mes = Number(mesStr);

  if (!Number.isInteger(ano) || !Number.isInteger(mes) || mes < 1 || mes > 12) {
    throw new Error("Mes de referencia invalido.");
  }

  return { ano, mes };
}

function buildQuery(filters: RelatorioMensalFilters): string {
  const params = new URLSearchParams();
  const { ano, mes } = parseMesReferencia(filters.mesReferencia);

  params.set("ano", String(ano));
  params.set("mes", String(mes));
  params.set("situacao", filters.situacao);

  if (filters.codLoja.trim()) {
    params.set("codLoja", filters.codLoja.trim());
  }

  return params.toString();
}

export async function buscarRelatorioMensal(
  filters: RelatorioMensalFilters,
): Promise<RelatorioMensalResult> {
  const qs = buildQuery(filters);
  const response = await fetch(withBasePath(`/api/relatorios/mensal?${qs}`), {
    credentials: "include",
    cache: "no-store",
  });

  return parseJson<RelatorioMensalResult>(response);
}

export function mesReferenciaAtual(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}`;
}

export function formatarMesReferencia(mesReferencia: string): string {
  const [anoStr, mesStr] = mesReferencia.split("-");
  const mes = Number(mesStr);
  if (!Number.isInteger(mes) || mes < 1 || mes > 12) return mesReferencia;

  const label = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    new Date(Number(anoStr), mes - 1, 1),
  );

  return `${label.charAt(0).toUpperCase()}${label.slice(1)} / ${anoStr}`;
}
