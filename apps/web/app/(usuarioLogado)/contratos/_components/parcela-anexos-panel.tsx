"use client";

import { useCallback, useEffect, useState } from "react";
import { Download, Paperclip, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  buscarAnexoParcela,
  enviarAnexoParcela,
  listarAnexosParcela,
  removerAnexoParcela,
} from "../_services/parcela-anexo.service";
import type { ParcelaAnexo, ParcelaAnexoTipo } from "../_types/parcela-anexo.type";
import {
  PARCELA_ANEXO_MAX_ARQUIVOS,
  PARCELA_ANEXO_MAX_BYTES,
  PARCELA_ANEXO_TIPO_LABEL,
  PARCELA_ANEXO_TIPOS,
} from "../_types/parcela-anexo.type";
import type { ParcelaContrato } from "../_types/parcela.type";
import { abrirArquivoBase64, fileToBase64, formatarTamanhoArquivo } from "../_utils/file-base64";

type ParcelaAnexosPanelProps = {
  contratoId: number;
  parcela: ParcelaContrato;
  onClose: () => void;
  onAnexosChange?: () => void;
};

export function ParcelaAnexosPanel({
  contratoId,
  parcela,
  onClose,
  onAnexosChange,
}: ParcelaAnexosPanelProps) {
  const [anexos, setAnexos] = useState<ParcelaAnexo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tipoUpload, setTipoUpload] = useState<ParcelaAnexoTipo>("comprovante");
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      setAnexos(await listarAnexosParcela(contratoId, parcela));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar anexos.");
    } finally {
      setLoading(false);
    }
  }, [contratoId, parcela]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    const restantes = PARCELA_ANEXO_MAX_ARQUIVOS - anexos.length;
    if (restantes <= 0) {
      toast.error(`Limite de ${PARCELA_ANEXO_MAX_ARQUIVOS} anexos por parcela.`);
      return;
    }

    const selecionados = Array.from(files).slice(0, restantes);
    if (files.length > restantes) {
      toast.warning(`Apenas ${restantes} arquivo(s) serao enviados (limite da parcela).`);
    }

    setUploading(true);

    try {
      for (const file of selecionados) {
        if (file.size > PARCELA_ANEXO_MAX_BYTES) {
          toast.error(`${file.name} excede 5MB.`);
          continue;
        }

        const base64 = await fileToBase64(file);

        await enviarAnexoParcela(contratoId, parcela, {
          tipo: tipoUpload,
          nome_original: file.name,
          mime_type: file.type || "application/octet-stream",
          tamanho_bytes: file.size,
          arquivo_base64: base64,
          valor: parcela.valorParcela,
          num_previsao: String(parcela.numPrevisao),
          cod_loja: String(parcela.codLoja),
          data_vencimento: parcela.vencimento?.slice(0, 10) ?? null,
        });
      }

      toast.success("Upload finalizado.");
      await carregar();
      onAnexosChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao enviar anexo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownload(anexoId: string | number) {
    try {
      const anexo = await buscarAnexoParcela(contratoId, parcela, anexoId);
      abrirArquivoBase64(anexo.arquivoBase64, anexo.mimeType, anexo.nomeOriginal);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao abrir anexo.");
    }
  }

  async function handleRemove(anexo: ParcelaAnexo) {
    const confirmed = window.confirm(`Remover o anexo "${anexo.nomeOriginal}"?`);
    if (!confirmed) return;

    try {
      await removerAnexoParcela(contratoId, parcela, anexo.id);
      toast.success("Anexo removido.");
      await carregar();
      onAnexosChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao remover anexo.");
    }
  }

  const limiteAtingido = anexos.length >= PARCELA_ANEXO_MAX_ARQUIVOS;

  return (
    <div className="mt-3 rounded-md border border-(--Text)/12 bg-zinc-50/80 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Paperclip className="h-4 w-4 text-(--Text)/55" />
          Comprovantes da parcela
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-(--Text)/55">
            {anexos.length}/{PARCELA_ANEXO_MAX_ARQUIVOS} arquivos
          </span>
          <button
            type="button"
            className="rounded-md p-1 hover:bg-black/5"
            aria-label="Fechar painel de anexos"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-(--Text)/55">
        Ate {PARCELA_ANEXO_MAX_ARQUIVOS} arquivos por parcela, maximo de 5MB cada.
      </p>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[180px_1fr]">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--Text)/85">Tipo do arquivo</span>
          <select
            className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
            value={tipoUpload}
            onChange={(event) => setTipoUpload(event.target.value as ParcelaAnexoTipo)}
            disabled={uploading || limiteAtingido}
          >
            {PARCELA_ANEXO_TIPOS.map((tipo) => (
              <option key={tipo} value={tipo}>
                {PARCELA_ANEXO_TIPO_LABEL[tipo]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-(--Text)/85">Enviar arquivos</span>
          <div className="relative">
            <input
              className="h-10 w-full cursor-pointer rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm file:mr-3 file:rounded file:border-0 file:bg-black/5 file:px-2 file:py-1 disabled:opacity-60"
              type="file"
              multiple
              disabled={uploading || limiteAtingido}
              onChange={(event) => {
                void handleUpload(event.target.files);
                event.target.value = "";
              }}
            />
            {uploading ? (
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-(--Text)/55">
                Enviando...
              </span>
            ) : null}
          </div>
        </label>
      </div>

      {limiteAtingido ? (
        <p className="mt-2 text-xs text-amber-700">Limite de anexos atingido para esta parcela.</p>
      ) : null}

      {erro ? <p className="mt-3 text-xs text-red-600">{erro}</p> : null}

      {loading ? (
        <p className="mt-3 text-sm text-(--Text)/60">Carregando anexos...</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {anexos.map((anexo) => (
            <li
              key={anexo.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-(--Text)/10 bg-white/65 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-(--Text)">{anexo.nomeOriginal}</p>
                <p className="text-xs text-(--Text)/55">
                  {PARCELA_ANEXO_TIPO_LABEL[anexo.tipo]} -{" "}
                  {formatarTamanhoArquivo(anexo.tamanhoBytes)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-(--Text)/15 px-2.5 py-1.5 text-xs font-medium hover:bg-black/5"
                  onClick={() => void handleDownload(anexo.id)}
                >
                  <Download className="h-3.5 w-3.5" />
                  Abrir
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                  onClick={() => void handleRemove(anexo)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remover
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && anexos.length === 0 ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-(--Text)/55">
          <Upload className="h-4 w-4" />
          Nenhum comprovante cadastrado.
        </p>
      ) : null}
    </div>
  );
}
