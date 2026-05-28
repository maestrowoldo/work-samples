import type { Metadata } from "next";
import HowIWork from "@/components/HowIWork";
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
  const copy = getSectionPageCopy(resolvedLocale).process;

  return buildSectionPageMetadata(resolvedLocale, "/processo", copy.title, copy.description);
}

export default function ProcessPage() {
  return (
    <SectionPageShell>
      <HowIWork />
    </SectionPageShell>
  );
}
