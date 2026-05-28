import type { Metadata } from "next";
import About from "@/components/About";
import SectionPageShell from "@/components/SectionPageShell";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildSectionPageMetadata, getSectionPageCopy } from "@/lib/section-page-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getSectionPageCopy(resolvedLocale).about;

  return buildSectionPageMetadata(resolvedLocale, "/sobre", copy.title, copy.description);
}

export default function AboutPage() {
  return (
    <SectionPageShell>
      <About />
    </SectionPageShell>
  );
}
