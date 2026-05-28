import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
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
  const copy = getDictionary(resolvedLocale).homeMeta;

  return buildPageMetadata({
    locale: resolvedLocale,
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
  });
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  await params;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section id="inicio">
          <Hero />
        </section>
      </main>

      <Footer />
    </div>
  );
}
