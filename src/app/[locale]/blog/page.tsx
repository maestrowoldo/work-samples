import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildPageMetadata } from "@/lib/metadata";
import { formatDate, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/site-content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).blog;

  return buildPageMetadata({
    locale: resolvedLocale,
    pathname: "/blog",
    title: copy.metadataTitle,
    description: copy.metadataDescription,
  });
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  const copy = getDictionary(resolvedLocale).blog;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <Link href={`/${resolvedLocale}#blog`} className="mb-8 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
            <ArrowLeft size={18} />
            {copy.backLabel}
          </Link>

          <h1 className="mb-3 text-4xl font-bold text-zinc-50">{copy.title}</h1>
          <p className="mb-12 text-zinc-400">{copy.metadataDescription}</p>

          <div className="space-y-8">
            {copy.posts.map((post) => (
              <Link
                key={post.slug}
                href={`/${resolvedLocale}/blog/${post.slug}`}
                className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/60"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-zinc-50 transition-colors hover:text-emerald-400">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-zinc-400">{post.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-zinc-500">
                      <span>{formatDate(post.date, resolvedLocale)}</span>
                      <span>•</span>
                      <span>{post.readTime} {copy.readTimeLabel}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
