"use client";

import { Suspense } from "react";
import { NavegacaoModulos } from "./nav/NavegacaoModulos";

type NavLateralProps = {
  isCollapsed: boolean;
};

export function NavLateral({ isCollapsed }: NavLateralProps) {
  if (isCollapsed) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center px-3 py-4">
        <div className="mt-6 flex w-full flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-(--LayoutSecundary)/35" />
        </div>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto px-2 pb-4 pt-2">
      <Suspense
        fallback={
          <div className="space-y-2 px-2 py-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-10 rounded-xl bg-(--LayoutSecundary)/25"
              />
            ))}
          </div>
        }
      >
        <NavegacaoModulos />
      </Suspense>
    </div>
  );
}
