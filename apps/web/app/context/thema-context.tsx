'use client'

import { createContext, ReactNode, useCallback, useMemo, useContext } from "react";
import type { Tema } from "@repo/types";
import { useThemeLogic } from "../hooks/useTheme";


interface ThemaContextType {
  theme: Tema;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemaContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { theme, updateTheme } = useThemeLogic();
  const isDark = theme === 'dark';

  const toggleTheme = useCallback(() => {
    updateTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, updateTheme]);

  const value = useMemo(() => ({
    theme,
    isDark,
    toggleTheme
  }), [theme, isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  
  if(!ctx) throw new Error ('useTheme deve ser usado dentro de um ThemeProvider');

  return ctx;
}