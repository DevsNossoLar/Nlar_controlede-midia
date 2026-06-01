// services/themePersistence.ts
import type { Tema } from "@repo/types";

export const themeService = {
  // Aplica o tema no DOM
  applyToDOM(theme: Tema) {
    if (typeof document === "undefined") return;

    const root = document.documentElement;
    root.classList.remove("light");

    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
      return;
    }

    root.classList.remove("dark");
    root.style.colorScheme = "light";
  },

  // Lê o tema salvo ou retorna 'light' como padrão
  getTheme(): Tema {
    if (typeof window === 'undefined') return 'light';
    const stored = localStorage.getItem('theme') as Tema | null;
    return stored === 'dark' || stored === 'light' ? stored : 'light';
  },

  // Salva o tema no localStorage
  saveTheme(theme: Tema): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('theme', theme);
  },

  // Alias para saveTheme (compatibilidade com useThemeManager)
  persist(theme: Tema): void {
    this.saveTheme(theme);
  },

  // Preferência do sistema (prefers-color-scheme)
  getSystemPreference(): Tema {
    if (typeof window === 'undefined') return 'light';
    const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return dark ? 'dark' : 'light';
  },

  // Observa mudança da preferência do sistema
  watchSystemChange(cb: (theme: Tema) => void): () => void {
    if (typeof window === 'undefined') return () => {};
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => cb(mq.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  },
};
