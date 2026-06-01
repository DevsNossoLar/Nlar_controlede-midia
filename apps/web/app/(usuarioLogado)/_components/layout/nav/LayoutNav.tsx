"use client";

import { Suspense } from "react";
import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { NavegacaoModulos } from "./NavegacaoModulos";
import { withBasePath } from "@/utils/cliet";

type LayoutNavProps = {
  isCollapsed: boolean;
  onToggleNav: () => void;
};

export function LayoutNav({ isCollapsed, onToggleNav }: LayoutNavProps) {
  const toggleLabel = isCollapsed
    ? "Expandir menu lateral"
    : "Minimizar menu lateral";

  return (
    <aside
      aria-label="Menu lateral"
      data-collapsed={isCollapsed}
      className={`
        relative z-60 flex h-dvh shrink-0 flex-col
        bg-(--Layout) transition-[width] duration-300 ease-out
        ${isCollapsed ? "w-24" : "w-[min(100%,18rem)] sm:w-76"}
      `}
    >
      <div
        className={`
          relative flex h-16 shrink-0 items-center border-b border-(--Text)/10
          ${isCollapsed ? "justify-center px-2" : "justify-center px-4"}
        `}
      >
        <Image
          src={withBasePath("/selo.svg")}
          alt="Logo Nosso Solar"
          width={150}
          height={48}
          priority
          className={`
            h-auto object-contain transition-all duration-300 ease-out
            ${isCollapsed ? "max-w-16" : "max-w-36"}
          `}
        />

        <button
          type="button"
          onClick={onToggleNav}
          aria-label={toggleLabel}
          aria-pressed={!isCollapsed}
          title={toggleLabel}
          className="
            group absolute right-0 top-1/2 z-20
            inline-flex h-9 w-9 -translate-y-1/2 translate-x-1/2
            shrink-0 cursor-pointer items-center justify-center
            bg-transparent text-(--Text)/30 transition-all duration-200 ease-out
            hover:text-(--Text) active:scale-95 focus-visible:outline-none
          "
        >
          {isCollapsed ? (
            <PanelLeftOpen className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-0.5" />
          ) : (
            <PanelLeftClose className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          )}
        </button>
      </div>

      {isCollapsed ? (
        <CollapsedNavPlaceholder />
      ) : (
        <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-2">
          <Suspense fallback={<NavSkeleton />}>
            <NavegacaoModulos />
          </Suspense>
        </div>
      )}
    </aside>
  );
}

function CollapsedNavPlaceholder() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center px-3 py-4">
      <div className="mt-6 flex w-full flex-col items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-(--LayoutSecundary)/35" />
      </div>
    </div>
  );
}

function NavSkeleton() {
  return (
    <div className="space-y-2 px-2 py-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-10 rounded-xl bg-(--LayoutSecundary)/25"
        />
      ))}
    </div>
  );
}