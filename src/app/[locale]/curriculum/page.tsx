import type { Metadata } from "next";
import CurriculumPage from "@/components/CurriculumPage";
import { buildPageMetadata } from "@/lib/metadata";
import { getDictionary } from "@/lib/site-content";
import { isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).curriculum;

  return buildPageMetadata({
    locale: resolvedLocale,
    pathname: "/curriculum",
    title: copy.metadataTitle,
    description: copy.metadataDescription,
  });
}

export default function LocalizedCurriculumPage() {
  return <CurriculumPage />;
}
