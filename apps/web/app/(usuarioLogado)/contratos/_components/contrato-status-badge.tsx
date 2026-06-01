"use client";

import type { ContratoStatus } from "../_types/contrato.type";
import { STATUS_LABEL, statusCalculado } from "../_utils/contrato-format";

type ContratoStatusBadgeProps = {
  status: ContratoStatus;
  dataFim?: string | null;
};

export function ContratoStatusBadge({ status, dataFim }: ContratoStatusBadgeProps) {
  const statusAtual = statusCalculado(status, dataFim ?? null);

  const classNameByStatus: Record<typeof statusAtual, string> = {
    ativo: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rascunho: "bg-zinc-100 text-zinc-700 border-zinc-200",
    suspenso: "bg-amber-100 text-amber-700 border-amber-200",
    encerrado: "bg-blue-100 text-blue-700 border-blue-200",
    cancelado: "bg-red-100 text-red-700 border-red-200",
    vencido: "bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${classNameByStatus[statusAtual]}`}
    >
      {STATUS_LABEL[statusAtual]}
    </span>
  );
}
