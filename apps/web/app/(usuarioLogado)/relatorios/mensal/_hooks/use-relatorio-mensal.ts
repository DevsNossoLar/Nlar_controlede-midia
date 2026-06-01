"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buscarRelatorioMensal,
  mesReferenciaAtual,
} from "../_services/relatorio-mensal.service";
import type {
  RelatorioMensalFilters,
  RelatorioMensalResult,
} from "../_types/relatorio-mensal.type";

const DEFAULT_FILTERS: RelatorioMensalFilters = {
  mesReferencia: mesReferenciaAtual(),
  codLoja: "",
  situacao: "ambos",
};

export function useRelatorioMensal(initialFilters?: Partial<RelatorioMensalFilters>) {
  const [filters, setFilters] = useState<RelatorioMensalFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [dados, setDados] = useState<RelatorioMensalResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setLoading(true);
      setErro(null);
      setDados(await buscarRelatorioMensal(filters));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar relatorio.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  function atualizarFiltro<K extends keyof RelatorioMensalFilters>(
    key: K,
    value: RelatorioMensalFilters[K],
  ) {
    setFilters((current) => ({
      ...current,
      [key]: value,
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
