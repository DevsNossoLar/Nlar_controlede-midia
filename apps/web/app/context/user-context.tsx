'use client';

import { useRouter } from 'next/navigation';
import { withBasePath } from '@/utils/cliet';
import { createContext, useCallback, useState, useEffect, useMemo, useContext } from 'react';
import type { User } from '@DevsNossoLar/user-shared';

interface UserContextProps {
  usuario: User | null;
  carregando: boolean;
  error: string | null;
  permissaoParaUsarPlataforma: boolean | null;
  logout: () => Promise<void>;
  buscarUsuario: () => Promise<User | null>;
  verificarPermissao: () => Promise<void>;
}

interface UserProviderProps {
  children: React.ReactNode;
  initialUser: User | null;
}



const UserContext = createContext<UserContextProps | undefined>(undefined);

export function UserProvider({ children, initialUser = null }: UserProviderProps) {
  const [error, setError] = useState<string | null>(null);
  const [usuario, setUsuario] = useState<User | null>(initialUser);
  const [carregando, setCarregando] = useState(false);
  const [permissaoParaUsarPlataforma, setPermissaoParaUsarPlataforma] = useState<boolean | null>(null);

  const router = useRouter();

  const buscarUsuario = useCallback(async (): Promise<User | null> => {
    try {
      const urlMe = withBasePath('/api/user/me');

      const res = await fetch(urlMe, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })

      if (!res.ok) throw new Error(`Status API: ${res.status}`);

      const raw = await res.json();

      const user: User = raw?.data != null && typeof raw === "object" ? raw.data : raw;

      setUsuario(user);
      return user;

    } catch {
      setUsuario(null);

      return null;
    }

  }, []);

  const verificarPermissao = useCallback(async (): Promise<void> => {
    setCarregando(true);
    setError(null);

    try {
      const res = await fetch(withBasePath('/api/user/verificar-permissao-para-usar-plataforma'), {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      })

      if (!res.ok) {
        setPermissaoParaUsarPlataforma(false);
        setUsuario(null);
        router.replace('/acesso-negado');
        return;
      }

      const permitido = Boolean(await res.json());
      setPermissaoParaUsarPlataforma(permitido);

      if (permitido) {
        await buscarUsuario();
        return;
      } else {
        setUsuario(null);
      }

    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao verificar permissão para usar plataforma";
      setError(message);
      setPermissaoParaUsarPlataforma(false);
    } finally {
      setCarregando(false);
    }
  }, [buscarUsuario, router]);

  useEffect(() => {
    verificarPermissao();
  }, [verificarPermissao]);

  const logout = useCallback(async (): Promise<void> => {
    setUsuario(null);
    setPermissaoParaUsarPlataforma(null);
    router.replace("/")
  }, [router]);

  const value = useMemo(() => ({
    usuario,
    carregando,
    error,
    permissaoParaUsarPlataforma,
    logout,
    buscarUsuario,
    verificarPermissao,
  }), [
    usuario,
    carregando,
    error,
    permissaoParaUsarPlataforma,
    logout,
    buscarUsuario,
    verificarPermissao
  ]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function UserProfileProvider({ children, initialUser = null }: UserProviderProps) {
  return (
    <UserProvider initialUser={initialUser}>
      {children}
    </UserProvider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  
  return context;
}
