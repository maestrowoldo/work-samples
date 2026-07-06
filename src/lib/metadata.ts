import type { Metadata } from "next";
import { getHtmlLang, locales, type Locale } from "@/lib/i18n";
import { buildAbsoluteUrl } from "@/lib/site-url";

export function buildLocalizedUrl(locale: Locale, pathname = "/") {
  const normalizedPath = pathname === "/" ? "" : pathname;
  return buildAbsoluteUrl(`/${locale}${normalizedPath}`);
}

export function buildPageMetadata({
  description,
  keywords,
  locale,
  pathname = "/",
  title,
}: {
  description: string;
  keywords?: string[];
  locale: Locale;
  pathname?: string;
  title: string;
}): Metadata {
  const canonical = buildLocalizedUrl(locale, pathname);
  const languages = Object.fromEntries(
    locales.map((item) => [getHtmlLang(item), buildLocalizedUrl(item, pathname)]),
  );

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      type: "website",
      locale: getHtmlLang(locale).replace("-", "_"),
      url: canonical,
      siteName: "Wolkendo Arias",
      title,
      description,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "Wolkendo Arias",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
    },
  };
}
