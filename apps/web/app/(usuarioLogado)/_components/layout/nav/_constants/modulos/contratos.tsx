import { FileText } from "lucide-react";
import type { DefinicaoModuloPlataforma } from "../estrutura-modulos-navegacao";

export const MODULO_CONTRATOS: DefinicaoModuloPlataforma = {
  id: "contratos",
  rotulo: "Contratos",
  hrefPrincipal: "/contratos",
  icone: <FileText className="h-4 w-4 shrink-0" aria-hidden />,
  submodulos: [
    {
      rotulo: "Listagem",
      href: "/contratos",
      correspondenciaExata: true,
    },
    {
      rotulo: "Novo contrato",
      href: "/contratos/novo",
      correspondenciaExata: true,
    },
    {
      rotulo: "Relatorio mensal",
      href: "/relatorios/mensal",
      correspondenciaExata: true,
    },
  ],
};
