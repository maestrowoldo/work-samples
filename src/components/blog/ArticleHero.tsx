import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Clock3, UserRound } from "lucide-react";
import { ArticleVisualImage } from "@/components/blog/ArticleVisualImage";
import type { BlogVisualAsset } from "@/lib/blog/presentation";
import type { BlogPostContent } from "@/lib/blog/types";
import { formatDate, type Locale } from "@/lib/i18n";

function getImageCaption(post: BlogPostContent, visual: BlogVisualAsset) {
  if (post.heroImage?.credit || post.heroImage?.license) {
    return [post.heroImage.credit, post.heroImage.license].filter(Boolean).join(" · ");
  }

  return visual.source ? `Imagem: ${visual.source}` : undefined;
}

export function ArticleHero({
  copy,
  locale,
  post,
  visual,
}: {
  copy: { readTimeLabel: string };
  locale: Locale;
  post: BlogPostContent;
  visual: BlogVisualAsset;
}) {
  const caption = getImageCaption(post, visual);
  const shouldContainRemote = visual.kind === "remote" && visual.source !== "Wikimedia Commons";

  return (
    <header className="border-b border-stone-200 pb-10">
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500">
        <Link
          href={`/articles/${locale}`}
          className="inline-flex items-center gap-2 font-medium transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          <ArrowLeft size={14} />
          Voltar aos artigos
        </Link>
        <Link
          href={`/${locale}#blog`}
          className="inline-flex items-center gap-2 font-medium transition-colors hover:text-stone-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Portfólio
          <ArrowUpRight size={14} />
        </Link>
      </div>

      <div className="mt-10 max-w-4xl">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-stone-950 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
            Wolkendo Journal
          </span>
          {post.category ? (
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-800">
              {post.category}
            </span>
          ) : null}
        </div>

        <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-normal text-stone-950 md:text-5xl lg:text-6xl">
          {post.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-stone-600 md:text-xl md:leading-9">
          {post.description}
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-stone-500">
          <span className="inline-flex items-center gap-2">
            <UserRound size={15} />
            {post.author}
          </span>
          <span>{formatDate(post.date, locale)}</span>
          <span className="inline-flex items-center gap-2">
            <Clock3 size={15} />
            {post.readTime} {copy.readTimeLabel}
          </span>
        </div>

        {post.tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs text-stone-600">
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>

      <figure className="mt-10">
        <div className="relative overflow-hidden rounded-3xl border border-stone-200 bg-stone-950 shadow-[0_24px_70px_rgba(28,25,23,0.12)]">
          <div className="relative aspect-[16/10] min-h-[260px] md:aspect-[21/10] md:min-h-[420px]">
            <ArticleVisualImage
              fit={shouldContainRemote ? "contain" : "cover"}
              priority
              sizes="(min-width: 1280px) 1050px, 100vw"
              visual={visual}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
        {caption ? (
          <figcaption className="mt-3 text-xs leading-5 text-stone-500">
            {caption}
          </figcaption>
        ) : null}
      </figure>
    </header>
  );
}
