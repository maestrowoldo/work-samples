import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/LocaleProvider";
import AIAssistant from "@/components/AIAssistant";
import { getDictionary } from "@/lib/site-content";
import { isLocale, locales } from "@/lib/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  return (
    <LocaleProvider locale={locale} dictionary={getDictionary(locale)}>
      {children}
      <AIAssistant />
    </LocaleProvider>
  );
}
