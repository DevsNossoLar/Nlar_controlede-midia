import type { ParcelaOrigem } from "@repo/db";

export type ParcelaQueryRef = {
  origem: ParcelaOrigem;
  erpChave: string;
};


export function parseParcelaQuery(searchParams: URLSearchParams): ParcelaQueryRef | null {
  const origem = searchParams.get("origem")?.trim();
  const erpChave = searchParams.get("erpChave")?.trim();

  if (origem !== "ABERTO" && origem !== "PAGO") return null;
  if (!erpChave) return null;

  return { origem, erpChave };
}
