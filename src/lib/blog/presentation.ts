import type { Locale } from "../i18n";
import type { BlogHeroImage, BlogPostContent, BlogSourceLink } from "./types";

export interface BlogVisualAsset {
  alt: string;
  kind: "local" | "remote";
  src: string;
  source?: string;
}

export interface ArticleSection {
  id: string;
  title: string;
}

const visualCatalog: Record<string, BlogVisualAsset[]> = {
  ai: [
    { src: "/ia.webp", alt: "Ilustração sobre inteligência artificial", kind: "local" },
    { src: "/web_pro.jpg", alt: "Tela de desenvolvimento web e programação", kind: "local" },
    { src: "/designer.avif", alt: "Mesa de trabalho com ferramentas digitais", kind: "local" },
  ],
  data: [
    { src: "/BI.jpg", alt: "Dashboard e visualização de dados", kind: "local" },
    { src: "/web_pro.jpg", alt: "Tela com interfaces de software", kind: "local" },
    { src: "/designer.avif", alt: "Ambiente de criação digital", kind: "local" },
  ],
  web: [
    { src: "/web_pro.jpg", alt: "Interface moderna de desenvolvimento web", kind: "local" },
    { src: "/ia.webp", alt: "Visual abstrato de tecnologia", kind: "local" },
    { src: "/designer.avif", alt: "Ferramentas de produto e design", kind: "local" },
  ],
  default: [
    { src: "/web_pro.jpg", alt: "Ambiente de tecnologia e desenvolvimento", kind: "local" },
    { src: "/ia.webp", alt: "Tema visual de tecnologia", kind: "local" },
    { src: "/BI.jpg", alt: "Painel digital com dados e métricas", kind: "local" },
  ],
};

export function buildBlogReaderPath(locale: Locale, slug?: string) {
  return slug ? `/articles/${locale}/${slug}` : `/articles/${locale}`;
}

function normalizeComparableText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .toLowerCase();
}

function normalizeComparableUrl(value?: string) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return value.replace(/\/$/, "");
  }
}

function slugifyHeading(value: string) {
  const slug = normalizeComparableText(value).replace(/\s+/g, "-");
  return slug || "secao";
}

function getSourceLinkVisualAssets(sourceLinks?: BlogSourceLink[]): BlogVisualAsset[] {
  const seenUrls = new Set<string>();

  return (sourceLinks ?? [])
    .filter((sourceLink) => {
      if (!sourceLink.imageUrl || seenUrls.has(sourceLink.imageUrl)) {
        return false;
      }

      seenUrls.add(sourceLink.imageUrl);
      return true;
    })
    .map((sourceLink) => ({
      alt: sourceLink.imageAlt ?? sourceLink.title,
      kind: "remote" as const,
      source: sourceLink.siteName ?? sourceLink.source,
      src: sourceLink.imageUrl!,
    }));
}

function getHeroImageVisualAsset(heroImage?: BlogHeroImage): BlogVisualAsset | undefined {
  if (!heroImage) {
    return undefined;
  }

  return {
    alt: heroImage.alt,
    kind: heroImage.src.startsWith("/") ? "local" : "remote",
    source: heroImage.source,
    src: heroImage.src,
  };
}

export function getBlogVisualAssets(
  post: Pick<BlogPostContent, "category" | "heroImage" | "tags" | "title" | "sourceLinks" | "sourceUrl" | "sourceUrls">,
) {
  const heroImageAsset = getHeroImageVisualAsset(post.heroImage);
  const sourceLinkAssets = getSourceLinkVisualAssets(getCuratedSourceLinks(post));
  const remoteAssets = heroImageAsset
    ? sourceLinkAssets.filter((asset) => asset.src !== heroImageAsset.src)
    : sourceLinkAssets;

  if (remoteAssets.length >= 2) {
    return [...(heroImageAsset ? [heroImageAsset] : []), ...remoteAssets].slice(0, 4);
  }

  const fingerprint = `${post.category ?? ""} ${post.tags.join(" ")} ${post.title}`.toLowerCase();

  if (
    /(ia|ai|inteligencia artificial|machine learning|llm|agente|agent)/.test(
      fingerprint,
    )
  ) {
    return [...(heroImageAsset ? [heroImageAsset] : []), ...remoteAssets, ...visualCatalog.ai].slice(0, 4);
  }

  if (/(power bi|dados|analytics|dashboard|data)/.test(fingerprint)) {
    return [...(heroImageAsset ? [heroImageAsset] : []), ...remoteAssets, ...visualCatalog.data].slice(0, 4);
  }

  if (/(next\.js|react|typescript|web|frontend|programa)/.test(fingerprint)) {
    return [...(heroImageAsset ? [heroImageAsset] : []), ...remoteAssets, ...visualCatalog.web].slice(0, 4);
  }

  return [...(heroImageAsset ? [heroImageAsset] : []), ...remoteAssets, ...visualCatalog.default].slice(0, 4);
}

export function stripInitialArticleHeading(content: string) {
  const normalizedContent = content.replace(/\r\n/g, "\n").trim();
  const [firstLine = "", ...remainingLines] = normalizedContent.split("\n");

  if (!firstLine.startsWith("# ")) {
    return normalizedContent;
  }

  return remainingLines.join("\n").trim();
}

export function extractArticleSections(content: string): ArticleSection[] {
  const usedIds = new Map<string, number>();

  return stripInitialArticleHeading(content)
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", "").trim())
    .filter(Boolean)
    .map((sectionTitle) => {
      const baseId = slugifyHeading(sectionTitle);
      const count = usedIds.get(baseId) ?? 0;
      usedIds.set(baseId, count + 1);

      return {
        id: count === 0 ? baseId : `${baseId}-${count + 1}`,
        title: sectionTitle,
      };
    });
}

export function getCuratedSourceLinks(
  post: Pick<BlogPostContent, "sourceLinks" | "sourceUrl" | "sourceUrls">,
  limit = 4,
) {
  const sourceLinks = post.sourceLinks ?? [];

  if (sourceLinks.length === 0) {
    return [];
  }

  const allowedUrls = new Set(
    [post.sourceUrl, ...(post.sourceUrls ?? [])]
      .map(normalizeComparableUrl)
      .filter((sourceUrl): sourceUrl is string => Boolean(sourceUrl)),
  );

  const selectedLinks = allowedUrls.size > 0
    ? sourceLinks.filter((sourceLink) => allowedUrls.has(normalizeComparableUrl(sourceLink.url) ?? ""))
    : sourceLinks;
  const uniqueLinks = new Map<string, BlogSourceLink>();

  for (const sourceLink of selectedLinks) {
    const normalizedUrl = normalizeComparableUrl(sourceLink.url);

    if (normalizedUrl && !uniqueLinks.has(normalizedUrl)) {
      uniqueLinks.set(normalizedUrl, sourceLink);
    }
  }

  return [...uniqueLinks.values()].slice(0, limit);
}
