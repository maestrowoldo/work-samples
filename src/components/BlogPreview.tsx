"use client";

import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { CometCard } from "@/components/ui/comet-card";
import { ArticleVisualImage } from "@/components/blog/ArticleVisualImage";
import { useLocaleContext } from "@/components/LocaleProvider";
import { buildBlogReaderPath, getBlogVisualAssets } from "@/lib/blog/presentation";
import type { BlogPostContent } from "@/lib/blog/types";
import { formatDate } from "@/lib/i18n";
import styles from "./BlogPreview.module.css";

export default function BlogPreview({ posts }: { posts: BlogPostContent[] }) {
  const { dictionary, locale } = useLocaleContext();
  const copy = dictionary.blog;

  return (
    <section className={styles.section} aria-labelledby="latest-articles-heading">
      <div className={styles.container}>
        <header className={styles.header}>
          <h2 id="latest-articles-heading" className={styles.heading}>
            {copy.previewTitle} <span>{copy.previewTitleAccent}</span>
          </h2>
          <p className={styles.intro}>{copy.previewDescription}</p>
        </header>

        <div className={styles.grid}>
          {posts.map((post) => (
            <CometCard key={post.slug}>
              <Link href={buildBlogReaderPath(locale, post.slug)} target="_blank" rel="noopener noreferrer"
                className={styles.card} aria-labelledby={`article-preview-${post.slug}`}>
                <div className={styles.cover}>
                  <ArticleVisualImage visual={getBlogVisualAssets(post)[0]}
                    sizes="(min-width: 900px) 360px, (min-width: 500px) 440px, 100vw" />
                  <div className={styles.coverShade} aria-hidden="true" />
                  {post.category && <span className={styles.category}>{post.category}</span>}
                </div>
                <div className={styles.body}>
                  <div className={styles.tags}>
                    {post.tags.slice(0, 3).map((tag) => <span key={tag} title={tag}>{tag}</span>)}
                  </div>
                  <h3 id={`article-preview-${post.slug}`} className={styles.title}>{post.title}</h3>
                  <p className={styles.description}>{post.description}</p>
                  <div className={styles.metadata}>
                    <span className={styles.date}>
                      <Calendar size={13} aria-hidden="true" />
                      <time dateTime={post.date}>{formatDate(post.date, locale)}</time>
                    </span>
                    <span>{post.readTime} {copy.readTimeLabel}</span>
                  </div>
                  <div className={styles.read}>
                    <span>{copy.previewReadLabel}</span><ArrowRight size={16} aria-hidden="true" />
                  </div>
                </div>
              </Link>
            </CometCard>
          ))}
        </div>

        <div className={styles.viewAll}>
          <Link href={buildBlogReaderPath(locale)} target="_blank" rel="noopener noreferrer">
            <span>{copy.viewAllLabel}</span><ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
