/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogPosts } from "@/lib/blog/content.server";
import { buildBlogReaderPath, getBlogVisualAssets } from "@/lib/blog/presentation";
import { formatDate, isLocale, type Locale } from "@/lib/i18n";
import { buildAbsoluteUrl } from "@/lib/site-url";
import { getDictionary } from "@/lib/site-content";

type ArticleVisual = ReturnType<typeof getBlogVisualAssets>[number];

function BlogVisualImage({
  className,
  priority = false,
  sizes,
  visual,
}: {
  className?: string;
  priority?: boolean;
  sizes: string;
  visual: ArticleVisual;
}) {
  if (visual.kind === "remote") {
    return (
      <img
        src={visual.src}
        alt={visual.alt}
        className={`absolute inset-0 h-full w-full object-cover object-center ${className ?? ""}`}
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
      className={`object-cover object-center ${className ?? ""}`}
      priority={priority}
      sizes={sizes}
    />
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).blog;

  return {
    title: copy.metadataTitle,
    description: copy.metadataDescription,
    alternates: {
      canonical: buildAbsoluteUrl(buildBlogReaderPath(resolvedLocale)),
    },
  };
}

export default async function ArticlesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).blog;
  const posts = await getBlogPosts(resolvedLocale);
  const [featuredPost, ...secondaryPosts] = posts;
  const categories = new Set(posts.map((post) => post.category).filter(Boolean));
  const latestPostDate = featuredPost ? formatDate(featuredPost.date, resolvedLocale) : "-";

  return (
    <main className="min-h-screen bg-stone-100 px-3 py-5 text-stone-900 sm:px-4 sm:py-8 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[1.35rem] border border-stone-200 bg-white shadow-[0_18px_55px_rgba(28,25,23,0.07)] sm:rounded-[2rem] md:shadow-[0_25px_80px_rgba(28,25,23,0.08)]">
          <section className="border-b border-stone-200 px-4 py-5 sm:px-6 sm:py-8 md:px-10 md:py-12">
            <Link
              href={`/${resolvedLocale}#blog`}
              className="inline-flex items-center gap-2 text-xs font-medium text-stone-500 transition-colors hover:text-stone-900"
            >
              <ArrowLeft size={14} />
              Voltar ao portfólio
            </Link>

            <div className="mt-6 grid gap-5 sm:mt-8 sm:gap-8 md:grid-cols-[1.35fr_0.65fr] md:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                  Wolkendo Journal
                </p>
                <h1 className="mt-3 max-w-2xl text-2xl font-semibold leading-tight text-stone-950 sm:text-3xl md:text-4xl">
                  {copy.title} para acompanhar tecnologia com contexto.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-600 sm:mt-4 md:text-base">
                  Leituras diretas sobre desenvolvimento, dados, automação, segurança e decisões práticas para produtos digitais.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-1">
                <div className="rounded-[1.1rem] bg-stone-950 px-4 py-4 text-white sm:rounded-[1.75rem] sm:px-5 sm:py-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-300">
                    Posts ativos
                  </p>
                  <p className="mt-2 text-xl font-semibold sm:mt-3 sm:text-2xl">{posts.length}</p>
                </div>
                <div className="rounded-[1.1rem] border border-stone-200 bg-stone-50 px-4 py-4 sm:rounded-[1.75rem] sm:px-5 sm:py-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-stone-500">
                    Última publicação
                  </p>
                  <p className="mt-2 text-sm font-semibold text-stone-900 sm:mt-3 sm:text-base">{latestPostDate}</p>
                  {categories.size > 0 ? (
                    <p className="mt-2 text-xs text-stone-500">
                      {categories.size} temas em destaque
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 py-5 sm:px-6 sm:py-8 md:px-10 md:py-10">
            {featuredPost ? (
              <Link
                href={buildBlogReaderPath(resolvedLocale, featuredPost.slug)}
                className="group mb-6 block overflow-hidden rounded-[1.25rem] border border-stone-200 bg-stone-950 text-white shadow-[0_18px_55px_rgba(28,25,23,0.16)] transition-transform duration-300 sm:mb-8 sm:rounded-[2rem] md:hover:-translate-y-1"
              >
                <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="relative min-h-[190px] sm:min-h-[280px] lg:min-h-[360px]">
                    {(() => {
                      const leadVisual = getBlogVisualAssets(featuredPost)[0];
                      return (
                        <BlogVisualImage
                          priority
                          sizes="(min-width: 1024px) 560px, 100vw"
                          visual={leadVisual}
                        />
                      );
                    })()}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-stone-950/10 to-transparent lg:bg-gradient-to-r lg:from-stone-950 lg:via-stone-950/40 lg:to-transparent" />
                  </div>

                  <div className="flex flex-col justify-between p-4 sm:p-6 md:p-8">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">
                        Destaque editorial
                      </p>
                      <h2 className="mt-3 text-lg font-semibold leading-tight sm:mt-4 sm:text-xl md:text-2xl">
                        {featuredPost.title}
                      </h2>
                      <p className="mt-3 text-sm leading-5 text-stone-300 sm:mt-4 sm:leading-6">
                        {featuredPost.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                        {featuredPost.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] text-stone-200 sm:px-2.5 sm:py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-stone-300 sm:mt-8 sm:pt-5">
                      <span>{formatDate(featuredPost.date, resolvedLocale)}</span>
                      <span>{featuredPost.readTime} {copy.readTimeLabel}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {secondaryPosts.map((post) => {
                const visuals = getBlogVisualAssets(post);
                const leadVisual = visuals[0];

                return (
                  <Link
                    key={post.slug}
                    href={buildBlogReaderPath(resolvedLocale, post.slug)}
                    className="group overflow-hidden rounded-[1.25rem] border border-stone-200 bg-white shadow-[0_12px_35px_rgba(28,25,23,0.05)] transition-transform duration-300 sm:rounded-[2rem] md:hover:-translate-y-1 md:hover:shadow-[0_20px_50px_rgba(28,25,23,0.08)]"
                  >
                    <div className="relative h-36 overflow-hidden bg-stone-100 sm:h-44 md:h-56">
                      <BlogVisualImage
                        className="transition-transform duration-500 group-hover:scale-105"
                        sizes="(min-width: 1280px) 350px, (min-width: 768px) 50vw, 100vw"
                        visual={leadVisual}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/50 via-stone-950/10 to-transparent" />
                      {post.category ? (
                        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-stone-900 shadow-sm sm:left-4 sm:top-4 sm:px-2.5 sm:py-1">
                          {post.category}
                        </span>
                      ) : null}
                    </div>

                    <div className="space-y-3 px-4 py-4 sm:space-y-4 sm:px-5 sm:py-5">
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {post.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-stone-100 px-2 py-0.5 text-[11px] text-stone-600 sm:px-2.5 sm:py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div>
                        <h2 className="text-base font-semibold leading-tight text-stone-950 sm:text-lg">
                          {post.title}
                        </h2>
                        <p className="mt-2 text-sm leading-5 text-stone-600 sm:mt-3 sm:leading-6">
                          {post.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-xs text-stone-500 sm:pt-4">
                        <span>{formatDate(post.date, resolvedLocale)}</span>
                        <span>{post.readTime} {copy.readTimeLabel}</span>
                      </div>

                      <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-700 transition-colors group-hover:text-emerald-800">
                        Ler artigo
                        <ArrowRight size={14} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
