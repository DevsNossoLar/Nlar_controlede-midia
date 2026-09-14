import { UserProvider } from "./user-context";
import { ThemeProvider } from "@DevsNossoLar/ui-theme/contexts";

interface AuthBoundaryProps {
  children: React.ReactNode;
}

export function AuthBoundary({ children }: AuthBoundaryProps) {
  const usuarioInicial = null;

  return (
    <ThemeProvider>
      <UserProvider initialUser={usuarioInicial}>{children}</UserProvider>
    </ThemeProvider>
  );
}
