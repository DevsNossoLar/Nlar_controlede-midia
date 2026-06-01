"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "./context/user-context";
import { LoadingScreen } from "@DevsNossoLar/ui-theme";

export default function Page() {
  const router = useRouter();

  const { usuario, carregando, permissaoParaUsarPlataforma } = useUser();

  const ultimoDestino = useRef<"negado" | "controle-de-midias" | null>(null);

  useEffect(() => {
    if (carregando) return;
    if (permissaoParaUsarPlataforma === null) return;
    if (permissaoParaUsarPlataforma === true && !usuario) {
      router.replace("/acesso-negado");
      return;
    }
    if (permissaoParaUsarPlataforma === false) {
      if (ultimoDestino.current === "negado") return;
      ultimoDestino.current = "negado";
      router.replace("/acesso-negado");
      return
    }

    if (ultimoDestino.current === "controle-de-midias") return;
    ultimoDestino.current = "controle-de-midias";
    router.replace("/dashboard")

  }, [carregando, permissaoParaUsarPlataforma, usuario, router]);

  return (
    <div className="min-h-screen h-screen flex flex-col items-center justify-center p-4 bg-(--Layout)">
      <LoadingScreen message="Verificando permissões" />
    </div>
  )
}
