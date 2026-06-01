"use client";

import Link from "next/link";
import type { RelatorioMensalParcela, RelatorioMensalSituacao } from "../_types/relatorio-mensal.type";
import {
  formatarData,
  formatarLoja,
  formatarMoeda,
  TIPO_CONTRATO_LABEL,
} from "../../../contratos/_utils/contrato-format";
import type { TipoContrato } from "../../../contratos/_types/contrato.type";

type RelatorioMensalParcelasTableProps = {
  parcelas: RelatorioMensalParcela[];
  situacao: RelatorioMensalSituacao;
  loading?: boolean;
};

const SITUACAO_LABEL = {
  ABERTO: "A pagar",
  PAGO: "Paga",
} as const;

export function RelatorioMensalParcelasTable({
  parcelas,
  situacao,
  loading,
}: RelatorioMensalParcelasTableProps) {
  if (loading) {
    return <p className="text-sm text-(--Text)/65">Carregando parcelas...</p>;
  }

  const mostrarSituacao = situacao === "ambos";
  const labelData =
    situacao === "pago"
      ? "Data pagamento"
      : situacao === "aberto"
        ? "Vencimento"
        : "Vencimento / pagamento";

  const mensagemVazia =
    situacao === "pago"
      ? "Nenhuma parcela paga registrada no mes selecionado."
      : situacao === "aberto"
        ? "Nenhuma parcela em aberto com vencimento no mes selecionado."
        : "Nenhuma parcela encontrada para o mes selecionado.";

  return (
    <div className="overflow-auto rounded-md border border-(--Text)/12 bg-white/80">
      <table className="w-full min-w-[1120px] text-sm">
        <thead>
          <tr className="border-b border-(--Text)/10 bg-zinc-50/90">
            {mostrarSituacao ? <th className="p-3 text-left font-semibold">Situacao</th> : null}
            <th className="p-3 text-left font-semibold">{labelData}</th>
            <th className="p-3 text-left font-semibold">Valor</th>
            <th className="p-3 text-left font-semibold">Fornecedor</th>
            <th className="p-3 text-left font-semibold">Loja</th>
            <th className="p-3 text-left font-semibold">Tipo</th>
            <th className="p-3 text-left font-semibold">Contrato</th>
            <th className="p-3 text-left font-semibold">Num. cotacao</th>
            <th className="p-3 text-left font-semibold">Anexos</th>
          </tr>
        </thead>
        <tbody>
          {parcelas.length === 0 ? (
            <tr>
              <td colSpan={mostrarSituacao ? 9 : 8} className="p-4 text-(--Text)/65">
                {mensagemVazia}
              </td>
            </tr>
          ) : (
            parcelas.map((parcela) => (
              <tr
                key={`${parcela.situacao}-${parcela.contratoId}-${parcela.erpChave}`}
                className="border-b border-(--Text)/8 last:border-0"
              >
                {mostrarSituacao ? (
                  <td className="p-3">
                    <span
                      className={
                        parcela.situacao === "PAGO"
                          ? "inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800"
                          : "inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800"
                      }
                    >
                      {SITUACAO_LABEL[parcela.situacao]}
                    </span>
                  </td>
                ) : null}
                <td className="p-3">{formatarData(parcela.dataReferencia)}</td>
                <td className="p-3">{formatarMoeda(parcela.valorParcela)}</td>
                <td className="p-3">{parcela.fornecedorNome ?? parcela.codFor}</td>
                <td className="p-3">
                  {formatarLoja(
                    parcela.lojaNome ? { codLoja: parcela.codLoja, empresa: parcela.lojaNome } : null,
                    parcela.codLoja,
                  )}
                </td>
                <td className="p-3">
                  {TIPO_CONTRATO_LABEL[parcela.tipoContrato as TipoContrato] ?? parcela.tipoContrato}
                </td>
                <td className="p-3">
                  <Link
                    href={`/contratos/${parcela.contratoId}`}
                    className="font-medium text-(--ThemaVerdeEscuro) hover:underline"
                  >
                    {parcela.titulo}
                  </Link>
                </td>
                <td className="p-3">{parcela.numCotacao ?? "-"}</td>
                <td className="p-3">
                  {parcela.quantidadeAnexos > 0 ? (
                    <span className="inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                      {parcela.quantidadeAnexos} arquivo(s)
                    </span>
                  ) : (
                    <span className="text-(--Text)/45">-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
