"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Ban, CheckCircle2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { ContratoParcelasButton } from "../_components/contrato-parcelas-dialog";
import { ContratoDetailsCard } from "../_components/contrato-details-card";
import { useContrato } from "../_hooks/use-contrato";
import { cancelarContrato, encerrarContrato } from "../_services/contrato.service";

type Props = {
  params: Promise<{ id: string }>;
};

export default function ContratoDetalhesPage({ params }: Props) {
  const [id, setId] = useState("");
  const { contrato, loading, erro, carregar } = useContrato(id);

  useEffect(() => {
    void (async () => {
      const resolved = await params;
      setId(resolved.id);
    })();
  }, [params]);

  async function handleCancel() {
    if (!contrato) return;
    const confirmed = window.confirm(`Cancelar o contrato "${contrato.titulo}"?`);
    if (!confirmed) return;

    try {
      await cancelarContrato(String(contrato.id));
      toast.success("Contrato cancelado.");
      await carregar();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar contrato.");
    }
  }

  async function handleClose() {
    if (!contrato) return;
    const confirmed = window.confirm(`Encerrar o contrato "${contrato.titulo}"?`);
    if (!confirmed) return;

    try {
      await encerrarContrato(String(contrato.id));
      toast.success("Contrato encerrado.");
      await carregar();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao encerrar contrato.");
    }
  }

  const podeCancelar = contrato
    ? !["cancelado", "encerrado", "suspenso"].includes(contrato.status)
    : false;
  const podeEncerrar = contrato ? !["cancelado", "encerrado"].includes(contrato.status) : false;

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Detalhes do contrato</h1>
          <p className="mt-1 text-sm text-(--Text)/65">
            Dados principais, fornecedor, loja e status.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
            href="/contratos"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
          {contrato ? (
            <>
              <ContratoParcelasButton contrato={contrato} variant="header" />
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
                href={`/contratos/${contrato.id}/editar`}
              >
                <Pencil className="h-4 w-4" />
                Editar
              </Link>
            </>
          ) : null}
          {podeEncerrar ? (
            <button
              type="button"
              onClick={() => void handleClose()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100"
            >
              <CheckCircle2 className="h-4 w-4" />
              Encerrar
            </button>
          ) : null}
          {podeCancelar ? (
            <button
              type="button"
              onClick={() => void handleCancel()}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <Ban className="h-4 w-4" />
              Cancelar
            </button>
          ) : null}
        </div>
      </div>

      {loading ? <p className="text-sm text-(--Text)/65">Carregando contrato...</p> : null}
      {erro ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </p>
      ) : null}
      {contrato ? <ContratoDetailsCard contrato={contrato} /> : null}
    </div>
  );
}
