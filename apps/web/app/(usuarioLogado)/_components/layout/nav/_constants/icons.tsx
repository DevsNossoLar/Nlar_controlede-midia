import type { ReactNode } from "react";

import { FileText, PlusCircle } from "lucide-react";

/** Icones opcionais por href de submodulo. */
export const ICONE_POR_HREF: Record<string, ReactNode> = {
  "/contratos": <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden />,
  "/contratos/novo": (
    <PlusCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
  ),
};
