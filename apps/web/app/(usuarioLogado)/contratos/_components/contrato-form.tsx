"use client";

import Link from "next/link";
import { Save, X } from "lucide-react";
import { useState } from "react";
import { useContratoForm } from "../_hooks/use-contrato-form";
import type { ContratoAnexoPendente } from "../_types/contrato-anexo.type";
import {
  CONTRATO_STATUS,
  TIPO_CONTRATO,
  type ContratoFormValues,
  type ContratoPayload,
} from "../_types/contrato.type";
import { STATUS_LABEL, TIPO_CONTRATO_LABEL } from "../_utils/contrato-format";
import { formToCreatePayload, formToPayload } from "../_utils/contrato.mapper";
import { ContratoAnexosPendentes } from "./contrato-anexos-pendentes";
import { FornecedorSelect } from "./fornecedor-select";
import { LojaSelect } from "./loja-select";
import { PagamentoSelects } from "./pagamento-selects";

type ContratoFormProps = {
  initialValues?: ContratoFormValues;
  mode: "novo" | "editar";
  saving?: boolean;
  onSubmit: (payload: ContratoPayload, pendingAnexos?: ContratoAnexoPendente[]) => Promise<void>;
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="text-xs text-red-600">{message}</span>;
}

export function ContratoForm({
  initialValues,
  mode,
  saving,
  onSubmit,
}: ContratoFormProps) {
  const { values, errors, setField, validar } = useContratoForm(initialValues);
  const [pendingAnexos, setPendingAnexos] = useState<ContratoAnexoPendente[]>([]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validar()) return;

    const payload = mode === "novo" ? formToCreatePayload(values) : formToPayload(values);
    await onSubmit(payload, mode === "novo" ? pendingAnexos : undefined);
  }

  return (
    <form
      className="grid grid-cols-1 gap-4 rounded-md border border-(--Text)/12 bg-white/65 p-4 lg:grid-cols-2"
      onSubmit={(event) => void handleSubmit(event)}
    >
      <FornecedorSelect
        required
        value={values.codFor}
        onChange={(value) => setField("codFor", value)}
        error={errors.codFor}
      />

      <LojaSelect
        required
        value={values.codLoja}
        onChange={(value) => setField("codLoja", value)}
        error={errors.codLoja}
      />

      <PagamentoSelects
        codCondicaoPagamento={values.codCondicaoPagamento}
        codFormaPagamento={values.codFormaPagamento}
        onCondicaoChange={(value) => setField("codCondicaoPagamento", value)}
        onFormaChange={(value) => setField("codFormaPagamento", value)}
        condicaoError={errors.codCondicaoPagamento}
        formaError={errors.codFormaPagamento}
      />

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Numero ou nome do contrato *</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={values.titulo}
          onChange={(event) => setField("titulo", event.target.value)}
          placeholder="Ex: CT-2026-014 ou Campanha Dia das Maes"
        />
        <FieldError message={errors.titulo} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Num. previsao</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={values.numPrevisao}
          onChange={(event) => setField("numPrevisao", event.target.value)}
          placeholder="Ex: 123456"
        />
        <FieldError message={errors.numPrevisao} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Num. cotacao</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={values.numCotacao}
          onChange={(event) => setField("numCotacao", event.target.value)}
          placeholder="Ex: COT-2026-001"
        />
        <FieldError message={errors.numCotacao} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Tipo *</span>
        <select
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={values.tipoContrato}
          onChange={(event) =>
            setField("tipoContrato", event.target.value as ContratoFormValues["tipoContrato"])
          }
        >
          {TIPO_CONTRATO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {TIPO_CONTRATO_LABEL[tipo]}
            </option>
          ))}
        </select>
        <FieldError message={errors.tipoContrato} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Status</span>
        <select
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro) disabled:opacity-70"
          value={values.status}
          disabled={mode === "novo"}
          onChange={(event) =>
            setField("status", event.target.value as ContratoFormValues["status"])
          }
        >
          {CONTRATO_STATUS.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
        <FieldError message={errors.status} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Data inicio *</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          type="date"
          value={values.dataInicio}
          onChange={(event) => setField("dataInicio", event.target.value)}
        />
        <FieldError message={errors.dataInicio} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Data fim</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          type="date"
          value={values.dataFim}
          onChange={(event) => setField("dataFim", event.target.value)}
        />
        <p className="text-xs text-(--Text)/55">Opcional para contratos sem prazo definido.</p>
        <FieldError message={errors.dataFim} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Dia do vencimento</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          type="number"
          min="1"
          max="31"
          value={values.diaVencimentoPadrao}
          onChange={(event) => setField("diaVencimentoPadrao", event.target.value)}
          placeholder="1 a 31"
        />
        <p className="text-xs text-(--Text)/55">Dia de referencia para vencimento.</p>
        <FieldError message={errors.diaVencimentoPadrao} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Valor total</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          type="number"
          min="0"
          step="0.01"
          value={values.valorTotal}
          onChange={(event) => setField("valorTotal", event.target.value)}
          placeholder="0,00"
        />
        <p className="text-xs text-(--Text)/55">Valor fechado da campanha ou pacote pontual.</p>
        <FieldError message={errors.valorTotal} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm lg:col-span-2">
        <span className="font-medium text-(--Text)/85">Valor mensal</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          type="number"
          min="0"
          step="0.01"
          value={values.valorMensal}
          onChange={(event) => setField("valorMensal", event.target.value)}
          placeholder="0,00"
        />
        <p className="text-xs text-(--Text)/55">
          Obrigatorio para contratos sem data fim.
        </p>
        <FieldError message={errors.valorMensal} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm lg:col-span-2">
        <span className="font-medium text-(--Text)/85">Descricao *</span>
        <textarea
          className="min-h-28 rounded-md border border-(--Text)/15 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={values.descricao}
          onChange={(event) => setField("descricao", event.target.value)}
          placeholder="Resumo do contrato"
        />
        <FieldError message={errors.descricao} />
      </label>

      <label className="flex flex-col gap-1.5 text-sm lg:col-span-2">
        <span className="font-medium text-(--Text)/85">Observacao</span>
        <textarea
          className="min-h-24 rounded-md border border-(--Text)/15 bg-white/80 px-3 py-2 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={values.observacao}
          onChange={(event) => setField("observacao", event.target.value)}
          placeholder="Informacoes internas"
        />
      </label>

      {mode === "novo" ? (
        <ContratoAnexosPendentes
          anexos={pendingAnexos}
          onChange={setPendingAnexos}
          disabled={saving}
        />
      ) : null}

      <div className="flex flex-wrap gap-2 lg:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/85 disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Salvando..." : "Salvar contrato"}
        </button>
        <Link
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 px-4 text-sm font-medium transition hover:bg-black/5"
          href="/contratos"
        >
          <X className="h-4 w-4" />
          Cancelar
        </Link>
      </div>
    </form>
  );
}
