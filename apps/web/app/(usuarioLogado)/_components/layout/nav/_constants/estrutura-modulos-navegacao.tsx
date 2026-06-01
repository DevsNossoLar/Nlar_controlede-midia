import type { ReactNode } from "react";

import { MODULO_CONTRATOS } from "./modulos/contratos";

import {
  LayoutDashboard,
} from "lucide-react";


export type ItemSubmoduloNavegacao = {
  rotulo: string;
  href: string;
  correspondenciaExata?: boolean;
};

export type DefinicaoModuloPlataforma = {
  id: string;
  rotulo: string;
  hrefPrincipal: string;
  icone: ReactNode;
  submodulos: ItemSubmoduloNavegacao[];
  desenvolvimento?: boolean;
};

export const ITENS_NAVEGACAO_SUPERIORES: ItemSubmoduloNavegacao[] = [
  {
    rotulo: "Painel inicial",
    href: "/dashboard",
  },
];

export const MODULOS_PLATAFORMA: DefinicaoModuloPlataforma[] = [MODULO_CONTRATOS];


export function iconeItemSuperior(href: string): ReactNode {
  if (href === "/dashboard")
    return <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />;
  return null;
}
