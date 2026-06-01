"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useRelatorioMensal } from "../relatorios/mensal/_hooks/use-relatorio-mensal";
import { formatarMesReferencia } from "../relatorios/mensal/_services/relatorio-mensal.service";
import { formatarMoeda } from "../contratos/_utils/contrato-format";

export default function Page() {
  const { dados, loading, erro } = useRelatorioMensal({ situacao: "ambos" });

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-(--Text)/65">
          Resumo do controle de midia e atalhos principais.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
          href="/contratos"
        >
          Abrir contratos
        </Link>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 px-3 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
          href="/relatorios/mensal"
        >
          Relatorio mensal
        </Link>
      </div>

      <section className="rounded-md border border-(--Text)/12 bg-white/65 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Resumo do mes</h2>
            <p className="mt-1 text-sm text-(--Text)/65">
              {formatarMesReferencia(
                `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`,
              )}
            </p>
          </div>
          <Link
            href="/relatorios/mensal"
            className="text-sm font-medium text-(--ThemaVerdeEscuro) hover:underline"
          >
            Ver relatorio completo
          </Link>
        </div>

        {loading && !dados ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-(--Text)/65">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando resumo...
          </p>
        ) : null}

        {erro ? (
          <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </p>
        ) : null}

        {dados ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-(--Text)/55">
                A pagar no mes
              </p>
              <p className="mt-1 text-xl font-semibold">{formatarMoeda(dados.totais.aPagar)}</p>
            </div>
            <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-(--Text)/55">
                Pagas no mes
              </p>
              <p className="mt-1 text-xl font-semibold">{formatarMoeda(dados.totais.pago)}</p>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-(--Text)/55">
                Previsto (contratos)
              </p>
              <p className="mt-1 text-xl font-semibold">{formatarMoeda(dados.totais.previsto)}</p>
            </div>
            <div className="rounded-md border border-zinc-200 bg-zinc-50 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-(--Text)/55">
                Parcelas abertas / pagas
              </p>
              <p className="mt-1 text-xl font-semibold">
                {dados.totais.quantidadeParcelasAbertas} / {dados.totais.quantidadeParcelasPagas}
              </p>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
