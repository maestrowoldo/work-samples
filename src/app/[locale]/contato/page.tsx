import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Contact from "@/components/Contact";
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
  const copy = getDictionary(resolvedLocale).contactPage;

  return buildPageMetadata({
    locale: resolvedLocale,
    pathname: "/contato",
    title: copy.metadataTitle,
    description: copy.metadataDescription,
  });
}

export default async function LocalizedContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).contactPage;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24">
        <section className="mx-auto max-w-3xl px-4 text-center lg:px-6">
          <h1 className="text-3xl font-bold text-zinc-50 md:text-4xl">
            {copy.title}
          </h1>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            {copy.subtitle}
          </p>
        </section>
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
