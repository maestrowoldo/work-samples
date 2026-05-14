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
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
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
                <Card hover className="blog-card">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tag-glow"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-zinc-50 hover:text-emerald-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-2">{post.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(post.date, locale)}</span>
                      </div>
                      <span>{post.readTime} {dictionary.blog.readTimeLabel}</span>
                    </div>

                    <div className="flex items-center gap-2 text-emerald-400 hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">{dictionary.blog.previewReadLabel}</span>
                      <ArrowRight size={16} />
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
