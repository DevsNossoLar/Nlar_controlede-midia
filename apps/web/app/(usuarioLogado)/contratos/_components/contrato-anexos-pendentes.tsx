"use client";

import { useState } from "react";
import { Paperclip, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import type { ContratoAnexoPendente, ContratoAnexoTipo } from "../_types/contrato-anexo.type";
import {
  CONTRATO_ANEXO_MAX_ARQUIVOS,
  CONTRATO_ANEXO_MAX_BYTES,
  CONTRATO_ANEXO_TIPO_LABEL,
  CONTRATO_ANEXO_TIPOS,
} from "../_types/contrato-anexo.type";
import { formatarTamanhoArquivo } from "../_utils/file-base64";

type ContratoAnexosPendentesProps = {
  anexos: ContratoAnexoPendente[];
  onChange: (anexos: ContratoAnexoPendente[]) => void;
  disabled?: boolean;
};

export function ContratoAnexosPendentes({
  anexos,
  onChange,
  disabled,
}: ContratoAnexosPendentesProps) {
  const [tipoUpload, setTipoUpload] = useState<ContratoAnexoTipo>("outro");

  function handleSelect(files: FileList | null) {
    if (!files || files.length === 0) return;

    const restantes = CONTRATO_ANEXO_MAX_ARQUIVOS - anexos.length;
    if (restantes <= 0) {
      toast.error(`Limite de ${CONTRATO_ANEXO_MAX_ARQUIVOS} anexos por contrato.`);
      return;
    }

    const selecionados = Array.from(files).slice(0, restantes);
    if (files.length > restantes) {
      toast.warning(`Apenas ${restantes} arquivo(s) serao adicionados (limite do contrato).`);
    }

    const novos: ContratoAnexoPendente[] = [];

    for (const file of selecionados) {
      if (file.size > CONTRATO_ANEXO_MAX_BYTES) {
        toast.error(`${file.name} excede 5MB.`);
        continue;
      }

      novos.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        tipo: tipoUpload,
      });
    }

    if (novos.length > 0) {
      onChange([...anexos, ...novos]);
    }
  }

  function handleRemove(id: string) {
    onChange(anexos.filter((item) => item.id !== id));
  }

  const limiteAtingido = anexos.length >= CONTRATO_ANEXO_MAX_ARQUIVOS;

  return (
    <section className="rounded-md border border-(--Text)/12 bg-white/70 p-4 lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Paperclip className="h-4 w-4 text-(--Text)/55" />
          Anexos
        </div>
        <span className="text-xs text-(--Text)/55">
          {anexos.length}/{CONTRATO_ANEXO_MAX_ARQUIVOS} arquivos
        </span>
      </div>

      <p className="mt-2 text-xs text-(--Text)/55">
        Selecione os arquivos agora. Eles serao enviados apos salvar o contrato.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr]">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--Text)/85">Tipo do arquivo</span>
          <select
            className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
            value={tipoUpload}
            onChange={(event) => setTipoUpload(event.target.value as ContratoAnexoTipo)}
            disabled={disabled || limiteAtingido}
          >
            {CONTRATO_ANEXO_TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {CONTRATO_ANEXO_TIPO_LABEL[tipo]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--Text)/85">Selecionar arquivos</span>
          <input
            className="h-10 w-full cursor-pointer rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm file:mr-3 file:rounded file:border-0 file:bg-black/5 file:px-2 file:py-1 disabled:opacity-60"
            type="file"
            multiple
            disabled={disabled || limiteAtingido}
            onChange={(event) => {
              handleSelect(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </div>

      {limiteAtingido ? (
        <p className="mt-2 text-xs text-amber-700">Limite de anexos atingido.</p>
      ) : null}

      {anexos.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2">
          {anexos.map((anexo) => (
            <li
              key={anexo.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-(--Text)/10 bg-white/65 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-(--Text)">{anexo.file.name}</p>
                <p className="text-xs text-(--Text)/55">
                  {CONTRATO_ANEXO_TIPO_LABEL[anexo.tipo]} -{" "}
                  {formatarTamanhoArquivo(anexo.file.size)}
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-60"
                disabled={disabled}
                onClick={() => handleRemove(anexo.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remover
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 flex items-center gap-2 text-sm text-(--Text)/55">
          <Upload className="h-4 w-4" />
          Nenhum anexo selecionado.
        </p>
      )}
    </section>
  );
}
