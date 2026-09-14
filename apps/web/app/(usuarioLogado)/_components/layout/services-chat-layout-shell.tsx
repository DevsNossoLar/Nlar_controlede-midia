"use client";

import { useUser } from "@/context/user-context";
import { withBasePath } from "@/utils/cliet";

import { ChatProvider } from "@DevsNossoLar/ui-theme/contexts";
import { ChatDock } from "@DevsNossoLar/ui-theme/components/chat";
import { LayoutCompleto } from "@DevsNossoLar/ui-theme/components/layouts";
import { useGlobalNotifications } from "@/hooks/useGlobalNotifications";
import { LayoutNotificationsContent } from "./layout-notifications-content";
import { NavLateral } from "./nav-lateral";

export function ServicesChatLayoutShell({
  children,
  chatWsBaseUrl,
}: {
  children: React.ReactNode;
  chatWsBaseUrl?: string | null;
}) {
  const { usuario } = useUser();
  const {
    notificacoesNaoLidas,
    loading: notificacoesLoading,
    fetchNotificacoes,
    marcarComoLida,
    marcarTodasComoLidas,
  } = useGlobalNotifications();

  return (
    <ChatProvider
      wsBaseUrl={chatWsBaseUrl}
      wsPath="/chat.io"
      accessTokenPath="/api/chat/access-token"
      resolveApiPath={withBasePath}
    >
      <LayoutCompleto
        user={usuario}
        main={children}
        hasNotifications={notificacoesNaoLidas.length > 0}
        Notifications={
          usuario ? (
            <LayoutNotificationsContent
              notificacoesNaoLidas={notificacoesNaoLidas}
              loading={notificacoesLoading}
              fetchNotificacoes={fetchNotificacoes}
              marcarComoLida={marcarComoLida}
              marcarTodasComoLidas={marcarTodasComoLidas}
            />
          ) : undefined
        }
        NavLateral={({ isCollapsed }) => (
          <NavLateral isCollapsed={isCollapsed} />
        )}
        chat={
          <ChatDock
            user={usuario}
            defaultOpen={false}
            showPresenceToasts={false}
            showAttentionToasts={true}
            attentionSoundPath="/sounds/jean2.ogg"
            allowedModes={["suporte"]}
            defaultMode="suporte"
          />
        }
      />
    </ChatProvider>
  );
}
