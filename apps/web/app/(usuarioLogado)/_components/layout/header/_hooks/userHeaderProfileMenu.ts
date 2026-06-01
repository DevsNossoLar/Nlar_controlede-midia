"use client";

import { useRef, useState } from "react";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import { useUser } from "@/context/user-context";
import { useUserImage } from "./useUserImage";

export function useHeaderProfileMenu() {
  const { usuario } = useUser();
  const userImageSrc = useUserImage(usuario?.imagem);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return {
    usuario,
    userImageSrc,
    dropdownRef,
    isDropdownOpen,
    toggleDropdown,
    closeDropdown,
  };
}
