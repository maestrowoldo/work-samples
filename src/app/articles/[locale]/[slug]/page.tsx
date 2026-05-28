/* eslint-disable @next/next/no-img-element */
import process from "node:process";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPost, getStaticBlogParams } from "@/lib/blog/content.server";
import { buildBlogReaderPath, extractArticleSections, getBlogVisualAssets } from "@/lib/blog/presentation";
import { formatDate, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/site-content";

function renderArticleContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    elements.push(
      <ul key={`list-${elements.length}`} className="mb-8 list-disc space-y-3 pl-6 text-lg leading-8 text-stone-700 marker:text-emerald-700">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{item}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const paragraph = line.trim();

    if (!paragraph) {
      flushList();
      return;
    }

    if (paragraph.startsWith("- ")) {
      listItems.push(paragraph.replace("- ", ""));
      return;
    }

    flushList();

    if (paragraph.startsWith("# ")) {
      elements.push(
        <h1 key={`h1-${index}`} className="mt-2 text-4xl font-semibold leading-tight text-stone-950 md:text-5xl">
          {paragraph.replace("# ", "")}
        </h1>,
      );
      return;
    }

    if (paragraph.startsWith("## ")) {
      elements.push(
        <h2 key={`h2-${index}`} className="mt-12 text-2xl font-semibold text-stone-950 md:text-3xl">
          {paragraph.replace("## ", "")}
        </h2>,
      );
      return;
    }

    elements.push(
      <p key={`p-${index}`} className="text-lg leading-8 text-stone-700">
        {paragraph}
      </p>,
    );
  });

  flushList();

  return elements;
}

export async function generateStaticParams() {
  return getStaticBlogParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const post = await getBlogPost(resolvedLocale, slug);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wolkendoarias.com";

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: `${baseUrl}${buildBlogReaderPath(resolvedLocale, slug)}`,
    },
  };
}

export default async function ArticleReaderPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).blog;
  const post = await getBlogPost(resolvedLocale, slug);

  if (!post) {
    notFound();
  }

  const visuals = getBlogVisualAssets(post);
  const sections = extractArticleSections(post.content);
  const heroVisual = visuals[0];
  const galleryVisuals = visuals.slice(1, 4);

  return (
    <main className="min-h-screen bg-stone-100 px-4 py-6 text-stone-900 md:px-8 md:py-10">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-stone-200 bg-white shadow-[0_25px_80px_rgba(28,25,23,0.08)]">
        <div className="border-b border-stone-200 px-6 py-4 md:px-10">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-stone-500">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                Wolkendo Journal
              </span>
              <span>Leitura separada do portfólio</span>
            </div>
            <Link
              href={`/${resolvedLocale}/blog`}
              className="inline-flex items-center gap-2 transition-colors hover:text-stone-900"
            >
              Portfólio
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="min-w-0">
            <Link
              href={buildBlogReaderPath(resolvedLocale)}
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 transition-colors hover:text-stone-900"
            >
              <ArrowLeft size={16} />
              Voltar aos artigos
            </Link>

            <header className="mt-8 border-b border-stone-200 pb-8">
              {post.category ? (
                <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">
                  {post.category}
                </span>
              ) : null}

              <h1 className="mt-4 text-4xl font-semibold leading-tight text-stone-950 md:text-6xl">
                {post.title}
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-600">
                {post.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-stone-500">
                <span>{formatDate(post.date, resolvedLocale)}</span>
                <span className="text-stone-300">•</span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 size={16} />
                  {post.readTime} {copy.readTimeLabel}
                </span>
                <span className="text-stone-300">•</span>
                <span>{copy.byLabel} {post.author}</span>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-sm text-stone-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-stone-100">
              <div className="grid gap-3 md:grid-cols-[1.55fr_1fr]">
                <div className="relative min-h-[340px]">
                  {heroVisual.kind === "remote" ? (
                    <img
                      src={heroVisual.src}
                      alt={heroVisual.alt}
                      className="absolute inset-0 h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <Image
                      src={heroVisual.src}
                      alt={heroVisual.alt}
                      fill
                      className="object-cover"
                    />
                  )}
                  {heroVisual.source ? (
                    <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-stone-900">
                      {heroVisual.source}
                    </span>
                  ) : null}
                </div>
                <div className="grid gap-3 p-3">
                  {galleryVisuals.map((visual) => (
                    <div key={`${visual.kind}-${visual.src}`} className="relative min-h-[164px] overflow-hidden rounded-[1.5rem]">
                      {visual.kind === "remote" ? (
                        <img
                          src={visual.src}
                          alt={visual.alt}
                          className="absolute inset-0 h-full w-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Image
                          src={visual.src}
                          alt={visual.alt}
                          fill
                          className="object-cover"
                        />
                      )}
                      {visual.source ? (
                        <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-medium text-white">
                          {visual.source}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Por que este tema importa
              </p>
              <p className="mt-3 text-lg leading-8 text-stone-700">
                Este artigo resume as fontes consultadas, reorganiza os pontos centrais em linguagem própria e destaca o impacto prático para desenvolvimento, produto e operação técnica.
              </p>
            </div>

            <div className="mt-12 space-y-6">
              {renderArticleContent(post.content)}
            </div>

            {post.sourceLinks && post.sourceLinks.length > 0 ? (
              <section className="mt-14 rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-stone-950">
                  {copy.sourcesLabel}
                </h2>
                <div className="mt-5 space-y-4">
                  {post.sourceLinks.map((sourceLink) => (
                    <a
                      key={sourceLink.url}
                      href={sourceLink.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-[1.5rem] border border-stone-200 bg-white p-5 transition-colors hover:border-emerald-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 gap-4">
                          {sourceLink.imageUrl ? (
                            <div className="relative hidden h-24 w-28 shrink-0 overflow-hidden rounded-[1rem] md:block">
                              <img
                                src={sourceLink.imageUrl}
                                alt={sourceLink.imageAlt ?? sourceLink.title}
                                className="absolute inset-0 h-full w-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : null}
                          <div className="min-w-0">
                          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
                            {sourceLink.siteName ?? sourceLink.source}
                          </p>
                          <p className="mt-2 text-lg font-medium text-stone-950">
                            {sourceLink.title}
                          </p>
                          <p className="mt-2 break-all text-sm text-stone-500">
                            {sourceLink.url}
                          </p>
                          </div>
                        </div>
                        <ExternalLink size={18} className="mt-1 shrink-0 text-stone-400" />
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          <aside className="space-y-6">
            {sections.length > 0 ? (
              <div className="rounded-[1.75rem] border border-stone-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Neste artigo
                </p>
                <ul className="mt-4 space-y-3">
                  {sections.map((section) => (
                    <li key={section} className="border-b border-stone-100 pb-3 text-sm leading-6 text-stone-700 last:border-none last:pb-0">
                      {section}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                Experiência de leitura
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-stone-950">
                Layout separado do portfólio
              </h2>
              <p className="mt-3 text-sm leading-7 text-stone-600">
                Esta página isola o artigo em fundo branco, sem competir com o visual escuro do portfólio principal.
              </p>
            </div>

            <div className="rounded-[1.75rem] bg-stone-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Visual do tema
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                Quando as fontes do artigo expõem `og:image` ou `twitter:image`, essas imagens são reaproveitadas na própria experiência editorial do post.
              </p>
            </div>

            <Link
              href={`/${resolvedLocale}/blog`}
              className="flex items-center justify-between rounded-[1.75rem] border border-stone-200 bg-white p-6 transition-colors hover:border-emerald-300"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">
                  Portfólio
                </p>
                <p className="mt-2 text-lg font-semibold text-stone-950">
                  Voltar para a página principal
                </p>
              </div>
              <ArrowLeft size={18} className="text-stone-400" />
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}
