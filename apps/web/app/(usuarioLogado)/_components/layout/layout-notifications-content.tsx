"use client";

import { useEffect } from "react";
import {
  Bell,
  CheckCheck,
  Clock3,
  Loader2,
  MessageCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Notificacao = {
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
};

interface LayoutNotificationsContentProps {
  notificacoesNaoLidas: Notificacao[];
  loading: boolean;
  fetchNotificacoes: (apenasNaoLidas?: boolean) => Promise<void>;
  marcarComoLida: (id: number) => Promise<void>;
  marcarTodasComoLidas: () => Promise<void>;
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getTipoLabel(tipo: string) {
  const normalized = tipo.toLowerCase();

  if (normalized.includes("retorno")) {
    return "Mensagem";
  }

  if (normalized.includes("status")) {
    return "Status";
  }

  return tipo || "Aviso";
}

export function LayoutNotificationsContent({
  notificacoesNaoLidas,
  loading,
  fetchNotificacoes,
  marcarComoLida,
  marcarTodasComoLidas,
}: LayoutNotificationsContentProps) {
  const notificacoesVisiveis = notificacoesNaoLidas;

  useEffect(() => {
    void fetchNotificacoes(true);
  }, [fetchNotificacoes]);

  const abrirNotificacao = async (notificacao: Notificacao) => {
    if (!notificacao.lida) {
      await marcarComoLida(notificacao.id);
    }
  };

  return (
    <div className="flex max-h-[70vh] flex-col">
      <div className="flex items-center justify-between gap-3 border-b border-(--Text)/10 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-(--Text)">Notificacoes</p>
          <p className="text-xs text-(--Text)/45">
            {notificacoesNaoLidas.length > 0
              ? `${notificacoesNaoLidas.length} nao lida(s)`
              : "Tudo em dia"}
          </p>
        </div>

        {notificacoesNaoLidas.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => void marcarTodasComoLidas()}
            className="h-8 px-2 text-xs"
          >
            <CheckCheck className="h-4 w-4" />
            Ler todas
          </Button>
        )}
      </div>

      <div className="min-h-0 overflow-y-auto p-2">
        {loading && notificacoesVisiveis.length === 0 ? (
          <div className="flex items-center justify-center gap-2 px-4 py-8 text-sm text-(--Text)/50">
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando notificacoes
          </div>
        ) : notificacoesVisiveis.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-(--Text)/5 text-(--Text)/35">
              <Bell className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-(--Text)">Nenhuma notificacao</p>
            <p className="mt-1 text-xs text-(--Text)/45">
              Quando houver avisos para voce, eles aparecem aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notificacoesVisiveis.map((notificacao) => (
              <button
                key={notificacao.id}
                type="button"
                onClick={() => void abrirNotificacao(notificacao)}
                className={`
                  block w-full rounded-lg border p-3 text-left
                  transition-colors
                  ${
                    notificacao.lida
                      ? "border-(--Text)/8 bg-(--Text)/3 hover:bg-(--Text)/5"
                      : "border-(--ThemaVerdeEscuro)/20 bg-(--ThemaVerdeEscuro)/8 hover:bg-(--ThemaVerdeEscuro)/12"
                  }
                `}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!notificacao.lida && (
                        <span className="h-2 w-2 rounded-full bg-(--ThemaVermelho)" />
                      )}
                      <Badge className="bg-(--Text)/8 text-(--Text)/55">
                        <MessageCircle className="h-3.5 w-3.5" />
                        {getTipoLabel(notificacao.tipo)}
                      </Badge>
                      {notificacao.idSolicitacao ? (
                        <span className="text-[11px] font-semibold text-(--Text)/35">
                          #{notificacao.idSolicitacao}
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-2 line-clamp-2 text-sm font-semibold text-(--Text)">
                      {notificacao.titulo || "Nova notificacao"}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-(--Text)/55">
                      {notificacao.descricao || notificacao.assuntoSolicitacao || "Sem descricao"}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-1 text-[11px] text-(--Text)/35">
                  <Clock3 className="h-3.5 w-3.5" />
                  {formatDate(notificacao.dataNotificacao)}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
