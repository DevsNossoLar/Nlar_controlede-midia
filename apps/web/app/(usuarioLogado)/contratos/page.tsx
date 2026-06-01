"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { ContratoFilters } from "./_components/contrato-filters";
import { ContratosTable } from "./_components/contratos-table";
import { useContratos } from "./_hooks/use-contratos";
import { cancelarContrato, encerrarContrato } from "./_services/contrato.service";
import type { Contrato } from "./_types/contrato.type";

export default function ContratosPage() {
  const {
    dados,
    loading,
    erro,
    filters,
    atualizarFiltro,
    limparFiltros,
    carregar,
  } = useContratos();

  async function handleCancel(contrato: Contrato) {
    const confirmed = window.confirm(`Cancelar o contrato "${contrato.titulo}"?`);
    if (!confirmed) return;

    try {
      await cancelarContrato(contrato.id);
      toast.success("Contrato cancelado.");
      await carregar();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao cancelar contrato.");
    }
  }

  async function handleClose(contrato: Contrato) {
    const confirmed = window.confirm(`Encerrar o contrato "${contrato.titulo}"?`);
    if (!confirmed) return;

    try {
      await encerrarContrato(contrato.id);
      toast.success("Contrato encerrado.");
      await carregar();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao encerrar contrato.");
    }
  }

  const pagination = dados?.pagination;

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Contratos</h1>
          <p className="mt-1 text-sm text-(--Text)/65">
            Controle de contratos de midia, servicos e fornecedores.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
          href="/contratos/novo"
        >
          <PlusCircle className="h-4 w-4" />
          Novo contrato
        </Link>
      </div>

      <ContratoFilters
        filters={filters}
        onChange={atualizarFiltro}
        onClear={limparFiltros}
        onRefresh={() => void carregar()}
      />

      {erro ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </p>
      ) : null}

      {pagination ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-(--Text)/65">
          <span>
            {pagination.total} contrato(s) encontrado(s), pagina {pagination.page} de{" "}
            {Math.max(pagination.totalPages, 1)}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.page <= 1 || loading}
              onClick={() => atualizarFiltro("page", Math.max(1, pagination.page - 1))}
              className="h-9 rounded-md border border-(--Text)/15 px-3 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              type="button"
              disabled={pagination.page >= pagination.totalPages || loading}
              onClick={() => atualizarFiltro("page", pagination.page + 1)}
              className="h-9 rounded-md border border-(--Text)/15 px-3 disabled:opacity-50"
            >
              Proxima
            </button>
          </div>
        </div>
      ) : null}

      <ContratosTable
        contratos={dados?.data ?? []}
        loading={loading}
        onCancel={(contrato) => void handleCancel(contrato)}
        onClose={(contrato) => void handleClose(contrato)}
      />
    </div>
  );
}
