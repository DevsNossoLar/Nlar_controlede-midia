"use client";

import { TooltipProvider } from "@DevsNossoLar/ui-theme/components/shadcn";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import HeaderActions from "./Actions";
import HeaderProfile from "./Profile";
import LayoutHeaderSkeleton from "./Header.Skeleton";


import { useUser } from "@/context/user-context";
import { useTheme } from "@/context/thema-context";
import { useHeaderProfileMenu } from "./_hooks/userHeaderProfileMenu";

type LayoutHeaderProps = {
  isNavCollapsed: boolean;
  onToggleNav: () => void;
};

export default function LayoutHeader({
  isNavCollapsed,
  onToggleNav,
}: LayoutHeaderProps) {
  const { carregando } = useUser();
  const { isDark, toggleTheme } = useTheme();

  const {
    usuario,
    userImageSrc,
    dropdownRef,
    isDropdownOpen,
    toggleDropdown,
  } = useHeaderProfileMenu();

  if (carregando) {
    return <LayoutHeaderSkeleton />;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <header className="sticky top-0 z-50 flex w-full shrink-0 items-center gap-4 border-b border-(--Text)/12 bg-(--Layout) px-4 py-3 backdrop-blur-md sm:px-5 h-16">
        <button
          type="button"
          onClick={onToggleNav}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-(--Text)/12 text-(--Text)/70 transition hover:bg-black/5"
          aria-label={isNavCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isNavCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" aria-hidden />
          ) : (
            <PanelLeftClose className="h-4 w-4" aria-hidden />
          )}
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
          <HeaderActions isDark={isDark} onToggleTheme={toggleTheme} />

          <HeaderProfile
            usuario={usuario}
            userImageSrc={userImageSrc}
            isDropdownOpen={isDropdownOpen}
            onToggleDropdown={toggleDropdown}
            dropdownRef={dropdownRef}
          />
        </div>
      </header>
    </TooltipProvider>
  );
}
