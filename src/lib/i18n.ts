export const locales = ["pt", "en", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const localeLabels: Record<Locale, string> = {
  pt: "PT",
  en: "EN",
  fr: "FR",
};

export const localeToHtmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en-US",
  fr: "fr-FR",
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getHtmlLang(locale: Locale) {
  return localeToHtmlLang[locale];
}

export function stripLocaleFromPathname(pathname: string) {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const [, maybeLocale, ...rest] = normalizedPathname.split("/");

  if (!maybeLocale || !isLocale(maybeLocale)) {
    return normalizedPathname === "" ? "/" : normalizedPathname;
  }

  const strippedPathname = `/${rest.join("/")}`.replace(/\/+/g, "/");
  return strippedPathname === "/" ? "/" : strippedPathname.replace(/\/$/, "") || "/";
}

export function buildLocalePath(locale: Locale, pathname: string) {
  const normalizedPathname = stripLocaleFromPathname(pathname);
  return normalizedPathname === "/" ? `/${locale}` : `/${locale}${normalizedPathname}`;
}

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(localeToHtmlLang[locale], {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
