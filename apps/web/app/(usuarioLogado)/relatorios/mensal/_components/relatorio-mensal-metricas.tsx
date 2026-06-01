"use client";

import type { RelatorioMensalResumoTipo, RelatorioMensalTotais } from "../_types/relatorio-mensal.type";
import { formatarMoeda, TIPO_CONTRATO_LABEL } from "../../../contratos/_utils/contrato-format";
import type { TipoContrato } from "../../../contratos/_types/contrato.type";

type RelatorioMensalMetricasProps = {
  totais: RelatorioMensalTotais;
  porTipo: RelatorioMensalResumoTipo[];
  loading?: boolean;
};

function CardMetrica({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "amber" | "emerald" | "blue" | "zinc";
}) {
  const toneClass =
    tone === "amber"
      ? "border-amber-200 bg-amber-50"
      : tone === "emerald"
        ? "border-emerald-200 bg-emerald-50"
        : tone === "blue"
          ? "border-blue-200 bg-blue-50"
          : "border-zinc-200 bg-zinc-50";

  return (
    <div className={`rounded-md border px-4 py-3 ${toneClass}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-(--Text)/55">{label}</p>
      <p className="mt-1 text-xl font-semibold text-(--Text)">{value}</p>
    </div>
  );
}

export function RelatorioMensalMetricas({ totais, porTipo, loading }: RelatorioMensalMetricasProps) {
  if (loading) {
    return <p className="text-sm text-(--Text)/65">Carregando metricas...</p>;
  }

  const quantidadeContratos = porTipo.reduce((acc, item) => acc + item.quantidadeContratos, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CardMetrica label="A pagar no mes" value={formatarMoeda(totais.aPagar)} tone="amber" />
        <CardMetrica label="Previsto (contratos)" value={formatarMoeda(totais.previsto)} tone="emerald" />
        <CardMetrica label="Pagas no mes" value={formatarMoeda(totais.pago)} tone="blue" />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <CardMetrica
          label="Parcelas abertas"
          value={String(totais.quantidadeParcelasAbertas)}
          tone="zinc"
        />
        <CardMetrica
          label="Parcelas pagas"
          value={String(totais.quantidadeParcelasPagas)}
          tone="zinc"
        />
        <CardMetrica label="Contratos vigentes" value={String(quantidadeContratos)} tone="zinc" />
      </div>
      <p className="text-xs text-(--Text)/55">
        Valores: a pagar (vencimento), previsto (contratos vigentes) e pagas (baixa no ERP). Quantidades:
        parcelas no ERP e contratos vigentes no mes. O filtro abaixo afeta apenas a lista detalhada.
      </p>

      <div className="overflow-auto rounded-md border border-(--Text)/12 bg-white/80">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-(--Text)/10 bg-zinc-50/90">
              <th className="p-3 text-left font-semibold">Tipo</th>
              <th className="p-3 text-left font-semibold">A pagar</th>
              <th className="p-3 text-left font-semibold">Previsto</th>
              <th className="p-3 text-left font-semibold">Pagas</th>
              <th className="p-3 text-left font-semibold">Parc. abertas</th>
              <th className="p-3 text-left font-semibold">Parc. pagas</th>
              <th className="p-3 text-left font-semibold">Contratos</th>
            </tr>
          </thead>
          <tbody>
            {porTipo.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-(--Text)/65">
                  Nenhum dado para o periodo selecionado.
                </td>
              </tr>
            ) : (
              porTipo.map((item) => (
                <tr key={item.tipoContrato} className="border-b border-(--Text)/8 last:border-0">
                  <td className="p-3 font-medium">
                    {TIPO_CONTRATO_LABEL[item.tipoContrato as TipoContrato] ?? item.tipoContrato}
                  </td>
                  <td className="p-3">{formatarMoeda(item.aPagar)}</td>
                  <td className="p-3">{formatarMoeda(item.previsto)}</td>
                  <td className="p-3">{formatarMoeda(item.pago)}</td>
                  <td className="p-3">{item.quantidadeParcelasAbertas}</td>
                  <td className="p-3">{item.quantidadeParcelasPagas}</td>
                  <td className="p-3">{item.quantidadeContratos}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
