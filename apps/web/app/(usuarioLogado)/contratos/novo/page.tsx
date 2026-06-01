"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { ContratoForm } from "../_components/contrato-form";
import { criarContrato } from "../_services/contrato.service";
import type { ContratoAnexoPendente } from "../_types/contrato-anexo.type";
import type { ContratoPayload } from "../_types/contrato.type";
import { uploadAnexosPendentes } from "../_utils/upload-anexos-pendentes";

export default function NovoContratoPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(payload: ContratoPayload, pendingAnexos?: ContratoAnexoPendente[]) {
    try {
      setSaving(true);
      setErro(null);
      const created = await criarContrato(payload);

      if (pendingAnexos && pendingAnexos.length > 0) {
        await uploadAnexosPendentes(created.id, pendingAnexos);
      }

      toast.success(
        pendingAnexos?.length
          ? "Contrato criado e anexos enviados com sucesso."
          : "Contrato criado com sucesso.",
      );
      router.push(`/contratos/${created.id}`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao criar contrato.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Novo contrato</h1>
          <p className="mt-1 text-sm text-(--Text)/65">
            Cadastre os dados principais do contrato.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
          href="/contratos"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      {erro ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </p>
      ) : null}

      <ContratoForm mode="novo" saving={saving} onSubmit={handleSubmit} />
    </div>
  );
}
