"use client";

import { useState } from "react";
import LayoutHeader from "./_components/layout/header/LayoutHeader";
import { Footer } from "@DevsNossoLar/ui-theme/components/layouts";
import { LayoutNav } from "./_components/layout/nav/LayoutNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isNavCollapsed, setIsNavCollapsed] = useState(false);
  const toggleNav = () => setIsNavCollapsed((s) => !s);

  return (
    <div className="app-shell-bg text-foreground flex min-h-dvh w-full overflow-hidden">
      <LayoutNav isCollapsed={isNavCollapsed} onToggleNav={toggleNav} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <LayoutHeader isNavCollapsed={isNavCollapsed} onToggleNav={toggleNav} />

        <div className="relative flex min-h-0 flex-1 flex-col">

          <div className="app-main-surface flex min-h-0 flex-1 flex-col overflow-hidden rounded-bl-2xl rounded-tl-2xl">

            <main className="custom-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto bg-(--LayoutSecundary)">
              <div className="flex-1 px-4 py-5 sm:px-6 sm:py-6">
                {children}
              </div>

              <div className="flex justify-end p-2">
                <Footer />
              </div>

            </main>


          </div>
        </div>
      </div>
    </div>
  );
}