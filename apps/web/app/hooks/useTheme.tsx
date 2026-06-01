"use client"

import { useState, useCallback, useEffect } from "react";
import { themeService } from "../services/themePersistence";
import type { Tema } from "@repo/types";

export function useThemeLogic() {
  const [theme, setTheme] = useState<Tema>('light');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedTheme = themeService.getTheme();
    setTheme(savedTheme);
    themeService.applyToDOM(savedTheme);
  }, []);

  const updateTheme = useCallback((newTheme: Tema) => {
    setTheme(newTheme);
    themeService.applyToDOM(newTheme);
    themeService.persist(newTheme);
  }, []);

  return {
    theme,
    updateTheme,
  }

}