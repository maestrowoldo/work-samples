import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3 } from "lucide-react";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import { buildBlogReaderPath, type ArticleSection } from "@/lib/blog/presentation";
import type { BlogPostContent } from "@/lib/blog/types";
import { formatDate, type Locale } from "@/lib/i18n";

export function ArticleSidebar({
  copy,
  locale,
  post,
  relatedPosts,
  sections,
}: {
  copy: { readTimeLabel: string };
  locale: Locale;
  post: BlogPostContent;
  relatedPosts: BlogPostContent[];
  sections: ArticleSection[];
}) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-8">
      {sections.length > 0 ? (
        <nav aria-label="Neste artigo" className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Neste artigo
          </p>
          <ol className="mt-4 space-y-3">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="block border-b border-stone-100 pb-3 text-sm leading-6 text-stone-700 transition-colors last:border-none last:pb-0 hover:text-emerald-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
          Resumo rápido
        </p>
        <dl className="mt-4 space-y-4 text-sm">
          <div>
            <dt className="text-stone-500">Publicado em</dt>
            <dd className="mt-1 font-medium text-stone-950">
              {formatDate(post.date, locale)}
            </dd>
          </div>
          <div>
            <dt className="text-stone-500">Tempo de leitura</dt>
            <dd className="mt-1 inline-flex items-center gap-2 font-medium text-stone-950">
              <Clock3 size={14} />
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
      </section>

      <ArticleCTA category={post.category} locale={locale} variant="sidebar" />

      {relatedPosts.length > 0 ? (
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
            Artigos relacionados
          </p>
          <div className="mt-4 space-y-4">
            {relatedPosts.slice(0, 3).map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={buildBlogReaderPath(locale, relatedPost.slug)}
                className="group block border-b border-stone-100 pb-4 last:border-none last:pb-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
              >
                <p className="text-sm font-medium leading-6 text-stone-950 transition-colors group-hover:text-emerald-800">
                  {relatedPost.title}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {relatedPost.readTime} {copy.readTimeLabel}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Link
        href={`/${locale}#blog`}
        className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-5 text-sm font-medium text-stone-700 transition-colors hover:border-emerald-300 hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        Voltar para a página principal
        <ArrowLeft size={14} className="text-stone-400" />
      </Link>

      <Link
        href={`/${locale}#contato`}
        className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-sm font-medium text-emerald-900 transition-colors hover:border-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
      >
        Falar sobre o projeto
        <ArrowUpRight size={14} />
      </Link>
    </aside>
  );
}
