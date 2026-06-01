"use client";

import Link from "next/link";
import { Ban, CheckCircle2, Eye, Pencil } from "lucide-react";
import { ContratoParcelasButton } from "./contrato-parcelas-dialog";
import type { Contrato } from "../_types/contrato.type";

type ContratoActionsProps = {
  contrato: Contrato;
  onCancel?: (contrato: Contrato) => void;
  onClose?: (contrato: Contrato) => void;
};

export function ContratoActions({ contrato, onCancel, onClose }: ContratoActionsProps) {
  const podeCancelar = !["cancelado", "encerrado", "suspenso"].includes(contrato.status);
  const podeEncerrar = !["cancelado", "encerrado"].includes(contrato.status);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link
        className="inline-flex items-center gap-1.5 rounded-md border border-(--Text)/15 px-2.5 py-1.5 text-xs font-medium hover:bg-black/5"
        href={`/contratos/${contrato.id}`}
      >
        <Eye className="h-3.5 w-3.5" />
        Ver
      </Link>
      <Link
        className="inline-flex items-center gap-1.5 rounded-md border border-(--Text)/15 px-2.5 py-1.5 text-xs font-medium hover:bg-black/5"
        href={`/contratos/${contrato.id}/editar`}
      >
        <Pencil className="h-3.5 w-3.5" />
        Editar
      </Link>
      <ContratoParcelasButton contrato={contrato} />
      {podeEncerrar && onClose ? (
        <button
          type="button"
          onClick={() => onClose(contrato)}
          className="inline-flex items-center gap-1.5 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          Encerrar
        </button>
      ) : null}
      {podeCancelar && onCancel ? (
        <button
          type="button"
          onClick={() => onCancel(contrato)}
          className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
        >
          <Ban className="h-3.5 w-3.5" />
          Cancelar
        </button>
      ) : null}
    </div>
  );
}
