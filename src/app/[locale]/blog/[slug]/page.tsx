import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/metadata";
import { formatDate, locales, isLocale, type Locale } from "@/lib/i18n";
import { getBlogPost, getBlogPosts, getDictionary } from "@/lib/site-content";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getBlogPosts(locale).map((post) => ({
      locale,
      slug: post.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).blog;
  const post = getBlogPost(resolvedLocale, slug);

  if (!post) {
    return buildPageMetadata({
      locale: resolvedLocale,
      pathname: `/blog/${slug}`,
      title: copy.emptyTitle,
      description: copy.metadataDescription,
    });
  }

  return buildPageMetadata({
    locale: resolvedLocale,
    pathname: `/blog/${slug}`,
    title: `${post.title} - ${copy.title}`,
    description: post.description,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).blog;
  const post = getBlogPost(resolvedLocale, slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          <Link href={`/${resolvedLocale}/blog`} className="mb-8 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
            <ArrowLeft size={18} />
            {copy.backLabel}
          </Link>

          <article>
            <header className="mb-8">
              <h1 className="mb-4 text-4xl font-bold text-zinc-50">{post.title}</h1>

              <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time>{formatDate(post.date, resolvedLocale)}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.readTime} {copy.readTimeLabel}</span>
                </div>
                <div>{copy.byLabel} {post.author}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose prose-invert max-w-none text-zinc-300">
              {post.content.split("\n").map((paragraph, index) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={`${paragraph}-${index}`} className="mb-4 mt-8 text-3xl font-bold text-zinc-50">
                      {paragraph.replace("# ", "")}
                    </h1>
                  );
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={`${paragraph}-${index}`} className="mb-3 mt-6 text-2xl font-bold text-zinc-50">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={`${paragraph}-${index}`} className="ml-6 text-zinc-300">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }
                if (paragraph.trim() === "") {
                  return null;
                }

                return (
                  <p key={`${paragraph}-${index}`} className="mb-4 leading-relaxed text-zinc-300">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
