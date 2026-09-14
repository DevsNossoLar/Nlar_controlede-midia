"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/context/user-context";
import { withBasePath } from "@/utils/cliet";
import { logger } from "@/lib/logger";

interface Notificacao {
  id: number;
  codFunc: number;
  solicitante: string;
  idSolicitacao: number;
  idRetorno?: number;
  tipo: string;
  titulo: string;
  descricao: string;
  dataNotificacao: string;
  lida: boolean;
  assuntoSolicitacao: string;
}

let globalNotificacoes: Notificacao[] = [];
let globalNotificacoesNaoLidas: Notificacao[] = [];
let subscribers: Array<() => void> = [];
let loadingTodas = false;
let loadingNaoLidas = false;
let currentCodFuncionario: string | null = null;
let pollingTimer: ReturnType<typeof setInterval> | null = null;

const isLoading = () => loadingTodas || loadingNaoLidas;

const subscribe = (callback: () => void) => {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter((sub) => sub !== callback);
    if (subscribers.length === 0 && pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
  };
};

const notifySubscribers = () => {
  subscribers.forEach((callback) => callback());
};

export function useGlobalNotifications() {
  const [, forceUpdate] = useState({});
  const { usuario } = useUser();
  const codFuncionario = usuario?.codFuncionario;
  const codFuncionarioKey = codFuncionario ? String(codFuncionario) : null;

  useEffect(() => {
    return subscribe(() => forceUpdate({}));
  }, []);

  useEffect(() => {
    if (!codFuncionarioKey) {
      currentCodFuncionario = null;
      globalNotificacoes = [];
      globalNotificacoesNaoLidas = [];
      notifySubscribers();
      return;
    }

    if (currentCodFuncionario !== codFuncionarioKey) {
      currentCodFuncionario = codFuncionarioKey;
      globalNotificacoes = [];
      globalNotificacoesNaoLidas = [];
      notifySubscribers();
    }
  }, [codFuncionarioKey]);

  const fetchNotificacoes = useCallback(async (apenasNaoLidas = false) => {
    if (!codFuncionario) {
      return;
    }

    if (apenasNaoLidas && loadingNaoLidas) {
      return;
    }

    if (!apenasNaoLidas && loadingTodas) {
      return;
    }

    if (apenasNaoLidas) {
      loadingNaoLidas = true;
    } else {
      loadingTodas = true;
    }

    notifySubscribers();

    try {
      const params = new URLSearchParams();
      if (apenasNaoLidas) {
        params.append("apenasNaoLidas", "true");
      }

      const query = params.toString();
      const response = await fetch(
        withBasePath(`/api/notificacoes${query ? `?${query}` : ""}`),
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        logger.warn(`Erro ao buscar notificacoes: status ${response.status}`);
        globalNotificacoes = [];
        globalNotificacoesNaoLidas = [];
        notifySubscribers();
        return;
      }

      const data = await response.json();
      const notificacoes = Array.isArray(data) ? data : [];

      globalNotificacoes = notificacoes;
      globalNotificacoesNaoLidas = notificacoes.filter((n: Notificacao) => !n.lida);

      notifySubscribers();
    } catch (error) {
      logger.warn("Erro ao buscar notificacoes:", error);
      globalNotificacoes = [];
      globalNotificacoesNaoLidas = [];
      notifySubscribers();
    } finally {
      if (apenasNaoLidas) {
        loadingNaoLidas = false;
      } else {
        loadingTodas = false;
      }

      notifySubscribers();
    }
  }, [codFuncionario]);

  const marcarComoLida = useCallback(
    async (id: number) => {
      if (!codFuncionario) return;

      const notificacao =
        globalNotificacoes.find((n) => n.id === id) ||
        globalNotificacoesNaoLidas.find((n) => n.id === id);
      if (!notificacao || notificacao.lida) return;

      globalNotificacoes = globalNotificacoes.map((n) =>
        n.id === id ? { ...n, lida: true } : n,
      );
      globalNotificacoesNaoLidas = globalNotificacoesNaoLidas.filter((n) => n.id !== id);
      notifySubscribers();

      try {
        const response = await fetch(withBasePath("/api/notificacoes"), {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          await fetchNotificacoes(false);
        }
      } catch (error) {
        logger.error("Erro ao marcar notificacao como lida:", error);
        await fetchNotificacoes(false);
      }
    },
    [codFuncionario, fetchNotificacoes],
  );

  const marcarTodasComoLidas = useCallback(async () => {
    if (!codFuncionario) return;

    try {
      const response = await fetch(withBasePath("/api/notificacoes/marcar-todas-lidas"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        globalNotificacoesNaoLidas = [];
        globalNotificacoes = globalNotificacoes.map((n) => ({ ...n, lida: true }));
        notifySubscribers();
      }
    } catch (error) {
      logger.error("Erro ao marcar todas como lidas:", error);
    }
  }, [codFuncionario]);

  useEffect(() => {
    if (codFuncionario && subscribers.length === 1) {
      void fetchNotificacoes(true);
    }
  }, [codFuncionario, fetchNotificacoes]);

  useEffect(() => {
    if (!codFuncionario) {
      return;
    }

    const atualizarAoVoltar = () => {
      if (document.visibilityState === "visible") {
        void fetchNotificacoes(true);
      }
    };

    window.addEventListener("focus", atualizarAoVoltar);
    document.addEventListener("visibilitychange", atualizarAoVoltar);

    return () => {
      window.removeEventListener("focus", atualizarAoVoltar);
      document.removeEventListener("visibilitychange", atualizarAoVoltar);
    };
  }, [codFuncionario, fetchNotificacoes]);

  useEffect(() => {
    if (!codFuncionario) {
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
      return;
    }

    if (pollingTimer) {
      return;
    }

    pollingTimer = setInterval(() => {
      if (codFuncionario && subscribers.length > 0) {
        void fetchNotificacoes(true);
      }
    }, 30000);

    return () => {
      if (pollingTimer && subscribers.length <= 1) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    };
  }, [codFuncionario, fetchNotificacoes]);

  return {
    notificacoes: globalNotificacoes,
    notificacoesNaoLidas: globalNotificacoesNaoLidas,
    loading: isLoading(),
    fetchNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
  };
}
