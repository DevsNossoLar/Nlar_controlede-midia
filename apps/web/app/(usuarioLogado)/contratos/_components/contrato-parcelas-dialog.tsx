"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Banknote, Loader2, Paperclip, X } from "lucide-react";
import { toast } from "sonner";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { listarParcelasContrato } from "../_services/parcela.service";
import type { Contrato } from "../_types/contrato.type";
import type { ParcelaContrato } from "../_types/parcela.type";
import { formatarData, formatarMoeda } from "../_utils/contrato-format";
import { ParcelaAnexosPanel } from "./parcela-anexos-panel";

type ContratoParcelasDialogProps = {
  contrato: Contrato;
  open: boolean;
  onClose: () => void;
};

const TIPO_PARCELA_LABEL: Record<string, string> = {
  ABERTO: "Em aberto",
  PAGO: "Pago",
};

function labelTipoParcela(tipo: string): string {
  return TIPO_PARCELA_LABEL[tipo] ?? tipo;
}

export function ContratoParcelasDialog({
  contrato,
  open,
  onClose,
}: ContratoParcelasDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const [parcelas, setParcelas] = useState<ParcelaContrato[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [parcelaAnexosAberta, setParcelaAnexosAberta] = useState<ParcelaContrato | null>(null);

  useOnClickOutside(dialogRef, () => {
    if (open) onClose();
  });

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      setParcelas(await listarParcelasContrato(contrato.id));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao carregar parcelas.";
      setErro(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [contrato.id]);

  useEffect(() => {
    if (!open) return;
    setParcelaAnexosAberta(null);
    void carregar();
  }, [open, carregar]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const totalAberto = parcelas
    .filter((item) => item.tipoParcela === "ABERTO")
    .reduce((acc, item) => acc + item.valorParcela, 0);
  const totalPago = parcelas
    .filter((item) => item.tipoParcela === "PAGO")
    .reduce((acc, item) => acc + item.valorParcela, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="parcelas-dialog-title"
        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-(--Text)/15 bg-white shadow-xl"
      >
        <div className="flex items-start justify-between gap-3 border-b border-(--Text)/10 px-4 py-3">
          <div>
            <h2 id="parcelas-dialog-title" className="text-lg font-semibold">
              Parcelas do contrato
            </h2>
            <p className="mt-1 text-sm text-(--Text)/65">
              {contrato.titulo} — previsao {contrato.numPrevisao}, loja {contrato.codLoja}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1.5 hover:bg-black/5"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-auto px-4 py-3">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-(--Text)/65">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando parcelas...
            </p>
          ) : null}

          {erro ? (
            <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {erro}
            </p>
          ) : null}

          {!loading && !erro ? (
            <>
              <div className="mb-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                  <span className="text-(--Text)/65">Em aberto: </span>
                  <strong>{formatarMoeda(totalAberto)}</strong>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <span className="text-(--Text)/65">Pagas: </span>
                  <strong>{formatarMoeda(totalPago)}</strong>
                </div>
              </div>

              {parcelas.length === 0 ? (
                <p className="text-sm text-(--Text)/65">
                  Nenhuma parcela encontrada para esta previsao e loja.
                </p>
              ) : (
                <div className="overflow-auto rounded-md border border-(--Text)/12">
                  <table className="w-full min-w-[520px] text-sm">
                    <thead>
                      <tr className="border-b border-(--Text)/10 bg-zinc-50/90">
                        <th className="p-2.5 text-left font-semibold">Situacao</th>
                        <th className="p-2.5 text-left font-semibold">Valor</th>
                        <th className="p-2.5 text-left font-semibold">Vencimento</th>
                        <th className="p-2.5 text-left font-semibold">Anexos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parcelas.map((parcela, index) => {
                        const parcelaKey = `${parcela.origem}:${parcela.erpChave}`;

                        return (
                          <tr
                            key={`${parcelaKey}-${index}`}
                            className="border-b border-(--Text)/8 last:border-0"
                          >
                            <td className="p-2.5">
                              <span
                                className={
                                  parcela.tipoParcela === "PAGO"
                                    ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800"
                                    : "inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                                }
                              >
                                {labelTipoParcela(parcela.tipoParcela)}
                              </span>
                            </td>
                            <td className="p-2.5">{formatarMoeda(parcela.valorParcela)}</td>
                            <td className="p-2.5">
                              {parcela.vencimento
                                ? formatarData(parcela.vencimento.slice(0, 10))
                                : "-"}
                            </td>
                            <td className="p-2.5">
                              <button
                                type="button"
                                className="inline-flex items-center gap-1.5 rounded-md border border-(--Text)/15 px-2.5 py-1.5 text-xs font-medium hover:bg-black/5"
                                onClick={() =>
                                  setParcelaAnexosAberta((atual) =>
                                    atual &&
                                    `${atual.origem}:${atual.erpChave}` === parcelaKey
                                      ? null
                                      : parcela,
                                  )
                                }
                              >
                                <Paperclip className="h-3.5 w-3.5" />
                                {parcela.quantidadeAnexos > 0
                                  ? `${parcela.quantidadeAnexos} arquivo(s)`
                                  : "Anexos"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {parcelaAnexosAberta ? (
                <ParcelaAnexosPanel
                  contratoId={contrato.id}
                  parcela={parcelaAnexosAberta}
                  onClose={() => setParcelaAnexosAberta(null)}
                  onAnexosChange={() => void carregar()}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type ContratoParcelasButtonProps = {
  contrato: Contrato;
  variant?: "table" | "header";
};

export function ContratoParcelasButton({
  contrato,
  variant = "table",
}: ContratoParcelasButtonProps) {
  const [open, setOpen] = useState(false);
  const temPrevisao = Boolean(contrato.numPrevisao?.trim());

  if (!temPrevisao) return null;

  const buttonClass =
    variant === "header"
      ? "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
      : "inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100";

  const iconClass = variant === "header" ? "h-4 w-4" : "h-3.5 w-3.5";

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={buttonClass}>
        <Banknote className={iconClass} />
        Parcelas
      </button>
      <ContratoParcelasDialog
        contrato={contrato}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
