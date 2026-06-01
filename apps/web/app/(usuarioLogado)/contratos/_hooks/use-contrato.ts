"use client";

import { useCallback, useEffect, useState } from "react";
import { buscarContratoPorId } from "../_services/contrato.service";
import type { Contrato } from "../_types/contrato.type";

export function useContrato(id: string) {
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setErro(null);
      setContrato(await buscarContratoPorId(id));
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao buscar contrato.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void carregar();
  }, [carregar]);

  return { contrato, setContrato, loading, erro, carregar };
}
