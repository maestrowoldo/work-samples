"use client";

import { createContext, useContext } from "react";
import type { Locale } from "@/lib/i18n";
import type { SiteDictionary } from "@/lib/site-content";

interface LocaleContextValue {
  dictionary: SiteDictionary;
  locale: Locale;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  children,
  dictionary,
  locale,
}: {
  children: React.ReactNode;
  dictionary: SiteDictionary;
  locale: Locale;
}) {
  return (
    <LocaleContext.Provider value={{ dictionary, locale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);

  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }

  return context;
}
