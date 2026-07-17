import process from "node:process";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/blog/ArticleBody";
import { BlogAdSenseScript } from "@/components/blog/BlogAdSenseScript";
import { ArticleCTA } from "@/components/blog/ArticleCTA";
import { BlogFooter } from "@/components/blog/BlogFooter";
import { ArticleHero } from "@/components/blog/ArticleHero";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { ArticleSources } from "@/components/blog/ArticleSources";
import { ArticleSummary } from "@/components/blog/ArticleSummary";
import { getBlogPost, getBlogPosts, getStaticBlogParams } from "@/lib/blog/content.server";
import {
  buildBlogReaderPath,
  extractArticleSections,
  getBlogVisualAssets,
  getCuratedSourceLinks,
} from "@/lib/blog/presentation";
import type { BlogPostContent } from "@/lib/blog/types";
import { getHtmlLang, isLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/site-content";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://wolkendoarias.com";
}

function toAbsoluteUrl(src: string, baseUrl: string) {
  try {
    return new URL(src, baseUrl).toString();
  } catch {
    return `${baseUrl}/og-image.png`;
  }
}

function getRelatedPosts(post: BlogPostContent, posts: BlogPostContent[]) {
  const postTags = new Set(post.tags.map((tag) => tag.toLowerCase()));

  return posts
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => {
      const sharedCategory = candidate.category && post.category && candidate.category === post.category ? 2 : 0;
      const sharedTags = candidate.tags.filter((tag) => postTags.has(tag.toLowerCase())).length;

      return {
        post: candidate,
        score: sharedCategory + sharedTags,
      };
    })
    .filter((item) => item.score > 0)
    .sort((left, right) => right.score - left.score || Date.parse(right.post.date) - Date.parse(left.post.date))
    .map((item) => item.post)
    .slice(0, 3);
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
  const baseUrl = getBaseUrl();

  if (!post) {
    return {};
  }

  const canonical = `${baseUrl}${buildBlogReaderPath(resolvedLocale, slug)}`;
  const visual = getBlogVisualAssets(post)[0];
  const imageUrl = toAbsoluteUrl(visual.src, baseUrl);

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    keywords: post.tags,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "article",
      locale: getHtmlLang(resolvedLocale).replace("-", "_"),
      url: canonical,
      siteName: "Wolkendo Arias",
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAtReference ?? post.date,
      authors: [post.author],
      tags: post.tags,
      images: [
        {
          url: imageUrl,
          alt: visual.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [imageUrl],
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

  const posts = await getBlogPosts(resolvedLocale);
  const baseUrl = getBaseUrl();
  const canonical = `${baseUrl}${buildBlogReaderPath(resolvedLocale, slug)}`;
  const visuals = getBlogVisualAssets(post);
  const heroVisual = visuals[0];
  const sections = extractArticleSections(post.content);
  const sources = getCuratedSourceLinks(post);
  const relatedPosts = getRelatedPosts(post, posts);
  const imageUrl = toAbsoluteUrl(heroVisual.src, baseUrl);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    author: {
      "@type": "Person",
      name: post.author,
    },
    citation: sources.map((source) => source.url),
    dateModified: post.date,
    datePublished: post.publishedAtReference ?? post.date,
    description: post.description,
    headline: post.title,
    image: imageUrl,
    inLanguage: getHtmlLang(resolvedLocale),
    keywords: post.tags,
    mainEntityOfPage: canonical,
    publisher: {
      "@type": "Person",
      name: "Wolkendo Arias",
    },
  };

  return (
    <>
      <BlogAdSenseScript />
      <main className="min-h-screen bg-stone-100 px-4 py-6 text-stone-900 md:px-8 md:py-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-stone-200 bg-stone-50 shadow-[0_24px_80px_rgba(28,25,23,0.08)]">
          <div className="px-5 py-7 md:px-8 md:py-9 lg:px-10">
          <ArticleHero copy={copy} locale={resolvedLocale} post={post} visual={heroVisual} />

          <div className="grid gap-10 pt-10 lg:grid-cols-[minmax(0,760px)_320px] lg:items-start lg:justify-between">
            <article className="min-w-0">
              <ArticleSummary keyTakeaways={post.keyTakeaways} whyItMatters={post.whyItMatters} />

              <div className="mt-12">
                <ArticleBody content={post.content} />
              </div>

              <div className="mt-12">
                <ArticleCTA category={post.category} locale={resolvedLocale} />
              </div>

              <ArticleSources label={copy.sourcesLabel} sources={sources} />
            </article>

            <ArticleSidebar
              copy={copy}
              locale={resolvedLocale}
              post={post}
              relatedPosts={relatedPosts}
              sections={sections}
            />
          </div>
          </div>

          <BlogFooter locale={resolvedLocale} />
        </div>
      </main>
    </>
  );
}
