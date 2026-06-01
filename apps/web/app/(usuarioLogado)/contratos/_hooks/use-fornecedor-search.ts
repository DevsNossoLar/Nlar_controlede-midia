"use client";

import { useEffect, useState } from "react";
import {
  buscarFornecedorPorCodigo,
  buscarFornecedores,
} from "../_services/fornecedor.service";
import type { FornecedorOption } from "../_types/fornecedor.type";
import { podeBuscar } from "../_utils/search";

export function useFornecedorSearch(debouncedSearch: string, selectedCod?: string) {
  const [options, setOptions] = useState<FornecedorOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    const query = debouncedSearch.trim();

    if (!podeBuscar(query)) {
      setOptions([]);
      setLoading(false);
      setErro(null);
      return;
    }

    const controller = new AbortController();

    void (async () => {
      try {
        setLoading(true);
        setErro(null);
        setOptions(await buscarFornecedores(query, controller.signal));
      } catch (error) {
        if (controller.signal.aborted || (error instanceof DOMException && error.name === "AbortError")) {
          return;
        }
        setErro(error instanceof Error ? error.message : "Erro ao buscar fornecedores.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [debouncedSearch]);

  useEffect(() => {
    const cod = selectedCod?.trim();
    if (!cod) return;

    const controller = new AbortController();

    void (async () => {
      try {
        const item = await buscarFornecedorPorCodigo(cod, controller.signal);
        if (!item) return;

        setOptions((current) => {
          if (current.some((option) => option.codFor === item.codFor)) return current;
          return [item, ...current];
        });
      } catch {
        if (controller.signal.aborted) return;
      }
    })();

    return () => controller.abort();
  }, [selectedCod]);

  return { options, loading, erro };
}
