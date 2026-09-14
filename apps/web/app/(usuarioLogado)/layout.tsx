import { ServicesChatLayoutShell } from "./_components/layout/services-chat-layout-shell";

export const dynamic = "force-dynamic";


export default function Layout({ children }: { children: React.ReactNode }) {


  const conexaoSocket = 'https://services.marketinglojasnossolar.com.br';

  return (
    <ServicesChatLayoutShell chatWsBaseUrl={conexaoSocket}>
      {children}
    </ServicesChatLayoutShell>
  );
}
