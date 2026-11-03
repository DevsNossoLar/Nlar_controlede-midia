"use client";

import { useId, useState } from "react";
import { salvarObservacaoParcela } from "../_services/parcela.service";
import type { ParcelaContrato } from "../_types/parcela.type";

type Props = {
  contratoId: number;
  parcela: ParcelaContrato;
};

export function ParcelaObservacao({ contratoId, parcela }: Props) {
  const inputId = useId();
  const [salva, setSalva] = useState(parcela.observacao ?? "");
  const [texto, setTexto] = useState(salva);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function salvar() {
    setSalvando(true);
    setErro(null);
    setSucesso(false);
    try {
      const result = await salvarObservacaoParcela(contratoId, parcela, texto);
      const valor = result.observacao ?? "";
      setTexto(valor);
      setSalva(valor);
      setSucesso(true);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao salvar observacao.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex min-w-64 flex-col gap-2">
      <label htmlFor={inputId} className="sr-only">Observação da parcela</label>
      <textarea
        id={inputId}
        className="min-h-20 rounded-md border border-(--Text)/15 bg-white px-3 py-2 text-sm"
        value={texto}
        maxLength={2000}
        disabled={salvando}
        placeholder="Observação desta parcela"
        onChange={(event) => { setTexto(event.target.value); setSucesso(false); }}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-(--Text)/55">{texto.length}/2000</span>
        <button
          type="button"
          className="rounded-md border border-(--Text)/15 px-3 py-1.5 text-xs font-medium hover:bg-black/5 disabled:opacity-50"
          disabled={salvando || texto === salva}
          onClick={() => void salvar()}
        >
          {salvando ? "Salvando..." : "Salvar observação"}
        </button>
      </div>
      {erro ? <span role="alert" className="text-xs text-red-600">{erro}</span> : null}
      {sucesso ? <span role="status" className="text-xs text-emerald-700">Observação salva.</span> : null}
    </div>
  );
}
