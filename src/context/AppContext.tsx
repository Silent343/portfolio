import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Lang } from "../data/content";
import { PALETTES } from "../data/content";
import { I18N, type Dict } from "../data/i18n";

interface AppState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  isEs: boolean;
  palette: string;
  setPalette: (p: string) => void;
}

const AppCtx = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");
  const [palette, setPalette] = useState<string>("Graphite + Copper");

  useEffect(() => {
    const vars = PALETTES[palette] || PALETTES["Graphite + Copper"];
    const root = document.documentElement;
    Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
  }, [palette]);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo<AppState>(
    () => ({ lang, setLang, t: I18N[lang], isEs: lang === "es", palette, setPalette }),
    [lang, palette]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/** Reveal-on-scroll hook: attaches an IntersectionObserver to [data-reveal] children. */
export function useReveal(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } }),
      { threshold: 0.12 }
    );
    root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ref]);
}
