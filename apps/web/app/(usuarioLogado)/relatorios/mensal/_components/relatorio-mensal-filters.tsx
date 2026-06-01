"use client";

import { RotateCcw, Search } from "lucide-react";
import { LojaSelect } from "../../../contratos/_components/loja-select";
import {
  RELATORIO_SITUACAO_OPCOES,
  type RelatorioMensalFilters,
} from "../_types/relatorio-mensal.type";

type RelatorioMensalFiltersProps = {
  filters: RelatorioMensalFilters;
  onChange: <K extends keyof RelatorioMensalFilters>(
    key: K,
    value: RelatorioMensalFilters[K],
  ) => void;
  onClear: () => void;
  onRefresh: () => void;
};

export function RelatorioMensalFilters({
  filters,
  onChange,
  onClear,
  onRefresh,
}: RelatorioMensalFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-md border border-(--Text)/12 bg-white/60 p-4 lg:grid-cols-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Mes de referencia</span>
        <input
          type="month"
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={filters.mesReferencia}
          onChange={(event) => onChange("mesReferencia", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Lista de parcelas</span>
        <select
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={filters.situacao}
          onChange={(event) =>
            onChange("situacao", event.target.value as RelatorioMensalFilters["situacao"])
          }
        >
          {RELATORIO_SITUACAO_OPCOES.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
      </label>

      <LojaSelect
        label="Loja"
        value={filters.codLoja}
        onChange={(value) => onChange("codLoja", value)}
      />

      <div className="flex items-end gap-2 lg:col-span-2">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
        >
          <Search className="h-4 w-4" />
          Atualizar
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/75 px-3 text-sm font-medium transition hover:bg-black/5"
        >
          <RotateCcw className="h-4 w-4" />
          Limpar
        </button>
      </div>
    </div>
  );
}
