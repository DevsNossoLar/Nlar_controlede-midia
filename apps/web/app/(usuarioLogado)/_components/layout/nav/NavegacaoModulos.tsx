"use client";

import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  iconeItemSuperior,
  MODULOS_PLATAFORMA,
  ITENS_NAVEGACAO_SUPERIORES
} from "./_constants/estrutura-modulos-navegacao";

import { ICONE_POR_HREF } from "./_constants/icons";

function caminhoAtivo(
  pathname: string,
  href: string,
  correspondenciaExata?: boolean,
  searchParamsString = "",
) {
  const pathComQuery = href.split("#")[0] ?? href;
  const [path, query = ""] = pathComQuery.split("?");

  if (query) {
    const atual = new URLSearchParams(searchParamsString);
    const esperado = new URLSearchParams(query);
    const queryAtiva = Array.from(esperado.entries()).every(
      ([key, value]) => atual.get(key) === value,
    );

    return pathname === path && queryAtiva;
  }

  if (correspondenciaExata) return pathname === path;
  if (pathname === path) return true;
  if (path !== "/" && pathname.startsWith(`${path}/`)) return true;
  return false;
}

export function NavegacaoModulos() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const searchParamsString = searchParams.toString();
  const [moduloExpandido, setModuloExpandido] = useState<string | null>(null);

  const moduloEncontrado = useMemo(
    () =>
      MODULOS_PLATAFORMA.find((modulo) => {
        const rotas = [
          modulo.hrefPrincipal,
          ...modulo.submodulos.map((sub) => sub.href),
        ];
        return rotas.some((href) => {
          const path = href.split("?")[0] ?? href;
          return pathname === path || pathname.startsWith(`${path}/`);
        });
      }),
    [pathname],
  );

  useEffect(() => {
    if (moduloEncontrado?.id) setModuloExpandido(moduloEncontrado.id);
  }, [moduloEncontrado?.id]);

  return (
    <nav className="flex flex-col px-2 pt-4 gap-4" aria-label="Navegação principal">

      {ITENS_NAVEGACAO_SUPERIORES.map((item) => {
        const ativo = caminhoAtivo(
          pathname,
          item.href,
          item.correspondenciaExata,
          searchParamsString,
        );

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`
              group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium outline-none transition-colors duration-200  hover:bg-(--LayoutSecundary)/55
              ${ativo ? "text-(--ThemaVerdeEscuro) bg-(--LayoutSecundary)/20" : "text-(--Text)/85"}
            `}
          >
            {iconeItemSuperior(item.href)}
            <span className="whitespace-nowrap">{item.rotulo}</span>

            {ativo ? (
              <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-(--ThemaVerdeEscuro)" />
            ) : (
              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-transparent opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-(--Text)/25" />
            )}
          </Link>
        );
      })}

      <div className="flex flex-col gap-2">

        <div className="mx-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-(--Text)/45">
          Módulos
        </div>

        {MODULOS_PLATAFORMA.map((modulo) => {
          const hrefPrincipal = modulo.hrefPrincipal;
          const expandido = moduloExpandido === modulo.id;
          const moduloSelecionado =
            caminhoAtivo(pathname, hrefPrincipal, false, searchParamsString) ||
            modulo.submodulos.some((sub) =>
              caminhoAtivo(
                pathname,
                sub.href,
                sub.correspondenciaExata,
                searchParamsString,
              ),
            );

          return (
            <div key={modulo.id}>

              <div
                className={`
                  group flex items-center rounded-xl text-sm font-medium outline-none transition-colors duration-200  cursor-pointer px-3 py-2.5
                  ${moduloSelecionado ?
                    "text-(--ThemaVerdeEscuro) bg-(--ThemaVerdeEscuro)/10"
                    :
                    "text-(--Text)/85"
                  }
                `}
              >

                <button
                  type="button"
                  className="flex w-10 shrink-0 items-center justify-center transition-colors"
                  aria-expanded={expandido}
                  aria-controls={`submodulos-${modulo.id}`}
                  onClick={() =>
                    setModuloExpandido((atual) =>
                      atual === modulo.id ? null : modulo.id,
                    )
                  }
                >
                  {expandido ? (
                    <ChevronDown className="h-4 w-4" aria-hidden />
                  ) : (
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  )}
                </button>

                {modulo.desenvolvimento ? (
                  <div
                    className="
                    flex flex-1 cursor-not-allowed select-none items-center gap-2 border-l border-(--Text)/10 py-2.5 pr-3 text-sm font-medium text-(--Text)/50
                  "
                    aria-disabled="true"
                    title="Módulo em desenvolvimento"
                  >
                    {modulo.icone}
                    <span className="min-w-0 flex-1 whitespace-nowrap leading-tight">
                      {modulo.rotulo}
                    </span>
                    <span className="shrink-0 rounded-md border border-(--ThemaVermelho)/22 bg-(--ThemaVermelho)/12 px-1.5 py-0.5 text-[9px] font-bold tracking-tight text-(--ThemaVermelho)">
                      Em desenv.
                    </span>
                  </div>
                ) : (
                  <Link
                    href={hrefPrincipal}
                    className={`
                    flex flex-1 items-center gap-2 text-sm font-semibold transition-colors
                   
                  `}
                  >
                    {modulo.icone}
                    <span className="min-w-0 flex-1 whitespace-nowrap leading-tight">
                      {modulo.rotulo}
                    </span>
                  </Link>
                )}

                {moduloSelecionado ? (
                  <span className="ml-auto h-2 w-2 shrink-0 rounded-full bg-(--ThemaVerdeEscuro)" />
                ) : (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-transparent opacity-0 transition-opacity group-hover:opacity-100 group-hover:bg-(--Text)/25" />
                )}

              </div>

              {expandido ? (
                <div
                  id={`submodulos-${modulo.id}`}
                  className=" ml-3 flex flex-col gap-1 border-l-2 border-(--ThemaVermelho) pl-3 py-1"
                >
                  {modulo.submodulos.map((sub) => {
                    const hrefSubmodulo = sub.href;
                    const ativo = caminhoAtivo(
                      pathname,
                      hrefSubmodulo,
                      sub.correspondenciaExata,
                      searchParamsString,
                    );

                    if (modulo.desenvolvimento) {
                      return (
                        <div
                          key={hrefSubmodulo}
                          className="
                          flex cursor-not-allowed select-none items-center gap-2 rounded-lg px-2 py-2 text-sm text-(--Text)/45
                        "
                          aria-disabled="true"
                          title="Módulo em desenvolvimento"
                        >
                          {ICONE_POR_HREF[hrefSubmodulo] ?? ICONE_POR_HREF[sub.href] ?? null}
                          <span className="leading-tight">{sub.rotulo}</span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={hrefSubmodulo}
                        href={hrefSubmodulo}
                        className={`
                          flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors duration-150 cursor-pointer
                          ${ativo ? 
                            "text-(--ThemaVerdeEscuro) bg-(--ThemaVerdeEscuro)/10"
                            :"text-(--Text)/80 hover:bg-(--LayoutSecundary)/45"
                          }
                        `}
                      >
                        {ICONE_POR_HREF[hrefSubmodulo] ?? ICONE_POR_HREF[sub.href] ?? null}
                        <span className="leading-tight">{sub.rotulo}</span>
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
