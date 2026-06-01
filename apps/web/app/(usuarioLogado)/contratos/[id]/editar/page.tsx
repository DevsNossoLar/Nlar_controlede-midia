"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ContratoAnexos } from "../../_components/contrato-anexos";
import { ContratoForm } from "../../_components/contrato-form";
import { useContrato } from "../../_hooks/use-contrato";
import { atualizarContrato } from "../../_services/contrato.service";
import type { ContratoPayload } from "../../_types/contrato.type";
import { contratoToFormValues } from "../../_utils/contrato.mapper";

type Props = {
  params: Promise<{ id: string }>;
};

export default function EditarContratoPage({ params }: Props) {
  const router = useRouter();
  const [id, setId] = useState("");
  const [saving, setSaving] = useState(false);
  const [erroSalvar, setErroSalvar] = useState<string | null>(null);
  const { contrato, loading, erro } = useContrato(id);

  useEffect(() => {
    void (async () => {
      const resolved = await params;
      setId(resolved.id);
    })();
  }, [params]);

  const initialValues = useMemo(
    () => (contrato ? contratoToFormValues(contrato) : undefined),
    [contrato],
  );

  async function handleSubmit(payload: ContratoPayload) {
    if (!id) return;

    try {
      setSaving(true);
      setErroSalvar(null);
      const updated = await atualizarContrato(id, payload);
      toast.success("Contrato atualizado.");
      router.push(`/contratos/${updated.id}`);
    } catch (error) {
      setErroSalvar(error instanceof Error ? error.message : "Erro ao atualizar contrato.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Editar contrato</h1>
          <p className="mt-1 text-sm text-(--Text)/65">
            Atualize os dados principais do contrato.
          </p>
        </div>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
          href={id ? `/contratos/${id}` : "/contratos"}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
      </div>

      {loading ? <p className="text-sm text-(--Text)/65">Carregando contrato...</p> : null}
      {erro ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </p>
      ) : null}
      {erroSalvar ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erroSalvar}
        </p>
      ) : null}

      {initialValues ? (
        <>
          <ContratoForm
            key={contrato?.id}
            mode="editar"
            initialValues={initialValues}
            saving={saving}
            onSubmit={handleSubmit}
          />
          {id ? <ContratoAnexos contratoId={Number(id)} /> : null}
        </>
      ) : null}
    </div>
  );
}
