"use client";

import { useEffect, useState } from "react";
import {
  listarCondicoesPagamento,
  listarFormasPagamento,
} from "../_services/pagamento.service";
import type {
  CondicaoPagamentoOption,
  FormaPagamentoOption,
} from "../_types/pagamento.type";

export function usePagamentoOptions() {
  const [condicoes, setCondicoes] = useState<CondicaoPagamentoOption[]>([]);
  const [formas, setFormas] = useState<FormaPagamentoOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function carregar() {
      try {
        setLoading(true);
        setErro(null);
        const [condicoesResult, formasResult] = await Promise.all([
          listarCondicoesPagamento(),
          listarFormasPagamento(),
        ]);

        if (!active) return;
        setCondicoes(condicoesResult);
        setFormas(formasResult);
      } catch (error) {
        if (!active) return;
        setErro(error instanceof Error ? error.message : "Erro ao carregar pagamentos.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void carregar();

    return () => {
      active = false;
    };
  }, []);

  return { condicoes, formas, loading, erro };
}
