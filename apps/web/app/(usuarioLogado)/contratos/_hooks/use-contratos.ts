"use client";

import { useCallback, useEffect, useState } from "react";
import { listarContratos } from "../_services/contrato.service";
import type {
  ContratoFilters,
  ContratoListItem,
  PaginatedResponse,
} from "../_types/contrato.type";

const DEFAULT_FILTERS: ContratoFilters = {
  search: "",
  status: "",
  tipoContrato: "",
  codFor: "",
  codLoja: "",
  dataInicio: "",
  dataFim: "",
  page: 1,
  perPage: 20,
};

export function useContratos() {
  const [filters, setFilters] = useState<ContratoFilters>(DEFAULT_FILTERS);
  const [dados, setDados] = useState<PaginatedResponse<ContratoListItem> | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      setDados(await listarContratos(filters));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao listar contratos.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function atualizarFiltro<K extends keyof ContratoFilters>(
    key: K,
    value: ContratoFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? Number(value) : 1,
    }));
  }

  function limparFiltros() {
    setFilters(DEFAULT_FILTERS);
  }

  return {
    dados,
    loading,
    erro,
    filters,
    atualizarFiltro,
    limparFiltros,
    carregar,
  };
}
