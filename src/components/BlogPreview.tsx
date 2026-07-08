"use client";

import { Card } from "./ui";
import { FadeIn } from "./animations";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import "./BlogPreview.css";
import { useLocaleContext } from "@/components/LocaleProvider";
import { buildBlogReaderPath } from "@/lib/blog/presentation";
import type { BlogPostContent } from "@/lib/blog/types";
import { formatDate } from "@/lib/i18n";

export default function BlogPreview({
  posts,
}: {
  posts: BlogPostContent[];
}) {
  const { dictionary, locale } = useLocaleContext();
  return (
    <section className="py-10 md:py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mb-8 text-center md:mb-12">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
            {dictionary.blog.previewTitle} <span className="text-emerald-400">{dictionary.blog.previewTitleAccent}</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            {dictionary.blog.previewDescription}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.1}>
              <Link href={buildBlogReaderPath(locale, post.slug)}>
                <Card hover className="blog-card p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-400 tag-glow sm:py-1 sm:text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-base font-semibold leading-tight text-zinc-50 transition-colors hover:text-emerald-400 sm:text-lg">
                        {post.title}
                      </h3>
                      <p className="mt-2 text-sm leading-5 text-zinc-400 sm:leading-6">{post.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-800 pt-3 text-xs text-zinc-500 sm:pt-4">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.date, locale)}</span>
                      </div>
                      <span>{post.readTime} {dictionary.blog.readTimeLabel}</span>
                    </div>

                    <div className="flex items-center gap-2 text-emerald-400 transition-transform hover:translate-x-1">
                      <span className="text-xs font-medium sm:text-sm">{dictionary.blog.previewReadLabel}</span>
                      <ArrowRight size={15} />
                    </div>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href={buildBlogReaderPath(locale)}
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>{dictionary.blog.viewAllLabel}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
