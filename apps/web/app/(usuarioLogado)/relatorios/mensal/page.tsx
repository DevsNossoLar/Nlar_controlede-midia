"use client";

import { Loader2 } from "lucide-react";
import { RelatorioMensalFilters } from "./_components/relatorio-mensal-filters";
import { RelatorioMensalMetricas } from "./_components/relatorio-mensal-metricas";
import { RelatorioMensalParcelasTable } from "./_components/relatorio-mensal-parcelas-table";
import { useRelatorioMensal } from "./_hooks/use-relatorio-mensal";
import { formatarMesReferencia } from "./_services/relatorio-mensal.service";

export default function RelatorioMensalPage() {
  const {
    dados,
    loading,
    erro,
    filters,
    atualizarFiltro,
    limparFiltros,
    carregar,
  } = useRelatorioMensal();

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Relatorio mensal</h1>
        <p className="mt-1 text-sm text-(--Text)/65">
          Resumo do mes com a pagar, previsto e pagas por tipo. A lista de parcelas pode ser filtrada
          abaixo.
        </p>
      </div>

      <RelatorioMensalFilters
        filters={filters}
        onChange={atualizarFiltro}
        onClear={limparFiltros}
        onRefresh={() => void carregar()}
      />

      {loading && !dados ? (
        <p className="flex items-center gap-2 text-sm text-(--Text)/65">
          <Loader2 className="h-4 w-4 animate-spin" />
          Carregando relatorio de {formatarMesReferencia(filters.mesReferencia)}...
        </p>
      ) : null}

      {erro ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {erro}
        </p>
      ) : null}

      {dados ? (
        <>
          <p className="text-sm text-(--Text)/65">
            Periodo: {formatarMesReferencia(filters.mesReferencia)}
            {dados.filtros.codLoja ? ` — loja ${dados.filtros.codLoja}` : " — todas as lojas"}
          </p>

          <RelatorioMensalMetricas
            totais={dados.totais}
            porTipo={dados.porTipo}
            loading={loading}
          />

          <div className="flex flex-col gap-3">
            <div>
              <h2 className="text-lg font-semibold">Parcelas do mes</h2>
              <p className="mt-1 text-xs text-(--Text)/55">
                {filters.situacao === "pago"
                  ? "Pagas no ERP (PrevisaoCompraBaixas, coluna DataChegada)."
                  : filters.situacao === "aberto"
                    ? "Em aberto no ERP (contas a pagar, por vencimento)."
                    : "Abertas por vencimento e pagas por data de baixa no ERP."}{" "}
                Contratos sem numero de previsao nao aparecem. Tabelas externas: somente SELECT.
              </p>
            </div>
            <RelatorioMensalParcelasTable
              parcelas={dados.parcelas}
              situacao={filters.situacao}
              loading={loading}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
