import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useTranslationsAll } from "@/hooks/useSiteData";

export type Lang = "en" | "hi" | "pa";

interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, fallback?: string) => string;
}

const Ctx = createContext<LangCtx>({ lang: "en", setLang: () => {}, t: (_, f) => f ?? "" });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const { data: translations } = useTranslationsAll();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = (localStorage.getItem("lang") as Lang) || "en";
    setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (key: string, fallback?: string) => {
    const dict = translations?.[lang] ?? {};
    return dict[key] ?? translations?.en?.[key] ?? fallback ?? key;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useT = () => useContext(Ctx);
