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

type ArticleVisual = ReturnType<typeof getBlogVisualAssets>[number];

function getSourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getPracticalContext(category?: string) {
  const normalizedCategory = category?.toLowerCase() ?? "";

  if (/seguro|seguros/.test(normalizedCategory)) {
    return "Use esta leitura como ponto de partida para comparar cenários, entender riscos e preparar perguntas melhores antes de contratar ou revisar uma proteção.";
  }

  if (/seguran/.test(normalizedCategory)) {
    return "Use esta leitura para revisar riscos, priorizar correções e transformar alertas técnicos em ações objetivas.";
  }

  if (/dados|data|analytics|power bi/.test(normalizedCategory)) {
    return "Use esta leitura para conectar dados, indicadores e decisões com mais clareza antes de montar dashboards ou relatórios.";
  }

  if (/inteligência artificial|ia|ai/.test(normalizedCategory)) {
    return "Use esta leitura para separar tendência de aplicação real e avaliar onde a IA pode gerar valor sem aumentar riscos desnecessários.";
  }

  return "Use esta leitura para transformar contexto técnico em decisões práticas de produto, operação ou desenvolvimento.";
}

function BlogVisualImage({
  className,
  fit = "cover",
  priority = false,
  sizes,
  visual,
}: {
  className?: string;
  fit?: "contain" | "cover";
  priority?: boolean;
  sizes: string;
  visual: ArticleVisual;
}) {
  const objectClass = fit === "contain" ? "object-contain" : "object-cover";

  if (visual.kind === "remote") {
    return (
      <img
        src={visual.src}
        alt={visual.alt}
        className={`absolute inset-0 h-full w-full ${objectClass} object-center ${className ?? ""}`}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={visual.src}
      alt={visual.alt}
      fill
      className={`${objectClass} object-center ${className ?? ""}`}
      priority={priority}
      sizes={sizes}
    />
  );
}

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
              <span>{post.category ?? "Artigo"}</span>
            </div>
            <Link
              href={`/${resolvedLocale}#blog`}
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
                <div className="relative aspect-[16/10] min-h-[260px] bg-stone-950 md:min-h-[380px]">
                  <BlogVisualImage
                    fit={heroVisual.kind === "remote" ? "contain" : "cover"}
                    priority
                    sizes="(min-width: 1024px) 650px, 100vw"
                    visual={heroVisual}
                  />
                </div>
                <div className="grid gap-3 p-3">
                  {galleryVisuals.map((visual) => (
                    <div key={`${visual.kind}-${visual.src}`} className="relative aspect-[16/9] min-h-[150px] overflow-hidden rounded-[1.5rem] bg-stone-900">
                      <BlogVisualImage
                        fit={visual.kind === "remote" ? "contain" : "cover"}
                        sizes="(min-width: 1024px) 280px, 100vw"
                        visual={visual}
                      />
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
                {post.whyItMatters ??
                  "Este artigo resume as fontes consultadas, reorganiza os pontos centrais em linguagem própria e destaca o impacto prático para desenvolvimento, produto e operação técnica."}
              </p>
            </div>

            {post.keyTakeaways && post.keyTakeaways.length > 0 ? (
              <section className="mt-6 rounded-[1.75rem] border border-stone-200 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                  Pontos principais
                </p>
                <ul className="mt-4 space-y-3">
                  {post.keyTakeaways.map((takeaway) => (
                    <li
                      key={takeaway}
                      className="border-b border-stone-100 pb-3 text-base leading-7 text-stone-700 last:border-none last:pb-0"
                    >
                      {takeaway}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

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
                          <p className="mt-2 text-sm text-stone-500">
                            {getSourceHost(sourceLink.url)}
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
                Resumo rápido
              </p>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-stone-500">Publicado em</dt>
                  <dd className="mt-1 font-medium text-stone-950">
                    {formatDate(post.date, resolvedLocale)}
                  </dd>
                </div>
                <div>
                  <dt className="text-stone-500">Tempo de leitura</dt>
                  <dd className="mt-1 font-medium text-stone-950">
                    {post.readTime} {copy.readTimeLabel}
                  </dd>
                </div>
                {post.category ? (
                  <div>
                    <dt className="text-stone-500">Tema</dt>
                    <dd className="mt-1 font-medium text-stone-950">{post.category}</dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="rounded-[1.75rem] bg-stone-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                Aplicação prática
              </p>
              <p className="mt-3 text-sm leading-7 text-stone-300">
                {getPracticalContext(post.category)}
              </p>
            </div>

            <Link
              href={`/${resolvedLocale}#contato`}
              className="flex items-center justify-between rounded-[1.75rem] bg-emerald-700 p-6 text-white transition-colors hover:bg-emerald-800"
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-100">
                  Próximo passo
                </p>
                <p className="mt-2 text-lg font-semibold">
                  Conversar sobre uma solução
                </p>
              </div>
              <ArrowUpRight size={18} className="text-emerald-100" />
            </Link>

            <Link
              href={`/${resolvedLocale}#blog`}
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
