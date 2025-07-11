import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import it from "../locales/it.json";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

type Language = "it" | "en" | "ar";
type Translations = typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Translations> = {
  it,
  en,
  ar,
};

type NestedTranslation = {
  [key: string]: NestedTranslation | string;
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Track if this is the first load
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);
  const [language, setLanguage] = useLocalStorage<Language>("language", "it");

  const isRTL = language === "ar";

  useEffect(() => {
    // Only force Italian on the very first load
    if (isInitialLoad) {
      setLanguage("it");
      setIsInitialLoad(false);
    }

    document.documentElement.dir = isRTL ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRTL, isInitialLoad, setLanguage]);

  const getNestedTranslation = (
    obj: NestedTranslation,
    keys: string[]
  ): string | undefined => {
    let current: NestedTranslation | string = obj;
    for (const key of keys) {
      if (typeof current === "object" && current !== null && key in current) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return typeof current === "string" ? current : undefined;
  };

  const t = (key: string): string => {
    const keys = key.split(".");

    const currentLangTranslation = getNestedTranslation(
      translations[language],
      keys
    );
    if (currentLangTranslation) return currentLangTranslation;

    const fallbackTranslation = getNestedTranslation(translations.en, keys);
    return fallbackTranslation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export { LanguageContext };
