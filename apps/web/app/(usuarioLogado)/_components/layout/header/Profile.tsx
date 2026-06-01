"use client";

import { User, ChevronDown } from "lucide-react";
import UserDropdown from "./UserDropdown";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarBadge,
} from "@DevsNossoLar/ui-theme/components/common";

import type { User as UserType } from "@DevsNossoLar/user-shared";

interface HeaderProfileProps {
  usuario: UserType | null;
  userImageSrc: string | null;
  isDropdownOpen: boolean;
  onToggleDropdown: () => void;
  dropdownRef: React.RefObject<HTMLDivElement | null>;
}

export default function HeaderProfile({
  usuario,
  userImageSrc,
  isDropdownOpen,
  onToggleDropdown,
  dropdownRef,
}: HeaderProfileProps) {
  return (
    <div className="relative ml-2" ref={dropdownRef}>
      <button
        onClick={onToggleDropdown}
        className="flex items-center gap-3 p-1 pr-3 rounded-xl transition-all duration-200 focus:outline-none group hover:bg-(--LayoutSecundary) cursor-pointer border border-transparent hover:border-border/50"
      >
        <div className="relative">
          <Avatar className="h-9 w-9 border-2 border-(--ThemaVerdeEscuro) shadow-sm transition-all group-hover:border-(--ThemaVerdeClaro)/50">
            <AvatarImage
              src={userImageSrc || ""}
              alt={usuario?.nomeUsuario || "Usuário"}
            />
            <AvatarFallback className="bg-muted text-foreground font-bold uppercase">
              {usuario?.nomeUsuario?.charAt(0) || (
                <User size={16} suppressHydrationWarning />
              )}
            </AvatarFallback>
            <AvatarBadge className="bg-(--ThemaVerdeClaro) border-2 border-(--ThemaVerdeEscuro) h-3 w-3" />
          </Avatar>
        </div>

        <div className="hidden md:flex flex-col text-left">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-foreground leading-none tracking-tight">
              {usuario?.nomeUsuario || "Colaborador"}
            </span>
            <ChevronDown
              size={14}
              suppressHydrationWarning
              className={`text-muted-foreground transition-transform duration-300 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </div>

          <span className="text-[10px] uppercase tracking-wider text-muted-foreground/80 font-bold mt-0.5">
            {usuario?.cargo || "Portal Nosso Solar"}
          </span>
        </div>
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 origin-top-right">
          <UserDropdown />
        </div>
      )}
    </div>
  );
}
