import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import HowIWork from "@/components/HowIWork";
import Projects from "@/components/Projects";
import BlogPreview from "@/components/BlogPreview";
import TechMarquee from "@/components/TechMarquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { getBlogPosts } from "@/lib/blog/content.server";
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
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const posts = (await getBlogPosts(resolvedLocale)).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section id="inicio">
          <Hero />
        </section>

        <section id="sobre" className="scroll-mt-24">
          <About />
        </section>

        <section id="experiencia" className="scroll-mt-24">
          <Experience />
        </section>

        <section id="processo" className="scroll-mt-24">
          <HowIWork />
        </section>

        <section id="projeto" className="scroll-mt-24">
          <Projects />
        </section>

        <section id="blog" className="scroll-mt-24">
          <BlogPreview posts={posts} />
        </section>

        <TechMarquee />

        <section id="contato" className="scroll-mt-24">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}
