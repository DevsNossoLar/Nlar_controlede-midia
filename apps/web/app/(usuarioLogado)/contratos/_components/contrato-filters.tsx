"use client";

import { RotateCcw, Search } from "lucide-react";
import {
  CONTRATO_STATUS_FILTRO,
  TIPO_CONTRATO,
  type ContratoFilters,
} from "../_types/contrato.type";
import { STATUS_LABEL, TIPO_CONTRATO_LABEL } from "../_utils/contrato-format";
import { FornecedorSelect } from "./fornecedor-select";
import { LojaSelect } from "./loja-select";

type ContratoFiltersProps = {
  filters: ContratoFilters;
  onChange: <K extends keyof ContratoFilters>(key: K, value: ContratoFilters[K]) => void;
  onClear: () => void;
  onRefresh: () => void;
};

export function ContratoFilters({
  filters,
  onChange,
  onClear,
  onRefresh,
}: ContratoFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-3 rounded-md border border-(--Text)/12 bg-white/60 p-4 lg:grid-cols-6">
      <label className="flex flex-col gap-1.5 text-sm lg:col-span-2">
        <span className="font-medium text-(--Text)/85">Busca</span>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-(--Text)/45" />
          <input
            className="h-10 w-full rounded-md border border-(--Text)/15 bg-white/80 pl-9 pr-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
            placeholder="Numero, descricao, codigo ou tipo"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Status</span>
        <select
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={filters.status}
          onChange={(event) =>
            onChange("status", event.target.value as ContratoFilters["status"])
          }
        >
          <option value="">Todos</option>
          {CONTRATO_STATUS_FILTRO.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABEL[status]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Tipo</span>
        <select
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          value={filters.tipoContrato}
          onChange={(event) =>
            onChange("tipoContrato", event.target.value as ContratoFilters["tipoContrato"])
          }
        >
          <option value="">Todos</option>
          {TIPO_CONTRATO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {TIPO_CONTRATO_LABEL[tipo]}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Inicio de</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          type="date"
          value={filters.dataInicio}
          onChange={(event) => onChange("dataInicio", event.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-medium text-(--Text)/85">Fim ate</span>
        <input
          className="h-10 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm outline-none transition focus:border-(--ThemaVerdeEscuro)"
          type="date"
          value={filters.dataFim}
          onChange={(event) => onChange("dataFim", event.target.value)}
        />
      </label>

      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={onRefresh}
          className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-(--Text)/15 bg-white/80 px-3 text-sm font-medium transition hover:bg-black/5"
        >
          <Search className="h-4 w-4" />
          Buscar
        </button>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-(--Text)/15 bg-white/80 transition hover:bg-black/5"
          title="Limpar filtros"
          aria-label="Limpar filtros"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
      </div>

      <div className="lg:col-span-3">
        <FornecedorSelect
          label="Fornecedor"
          value={filters.codFor}
          onChange={(value) => onChange("codFor", value)}
        />
      </div>

      <div className="lg:col-span-3">
        <LojaSelect
          label="Loja"
          value={filters.codLoja}
          onChange={(value) => onChange("codLoja", value)}
        />
      </div>
    </div>
  );
}
