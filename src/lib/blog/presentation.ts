import type { Locale } from "../i18n";
import type { BlogPostContent, BlogSourceLink } from "./types";

interface BlogVisualAsset {
  alt: string;
  kind: "local" | "remote";
  src: string;
  source?: string;
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

export function getBlogVisualAssets(
  post: Pick<BlogPostContent, "category" | "tags" | "title" | "sourceLinks">,
) {
  const sourceLinkAssets = getSourceLinkVisualAssets(post.sourceLinks);

  if (sourceLinkAssets.length >= 2) {
    return sourceLinkAssets.slice(0, 4);
  }

  const fingerprint = `${post.category ?? ""} ${post.tags.join(" ")} ${post.title}`.toLowerCase();

  if (
    /(ia|ai|inteligencia artificial|machine learning|llm|agente|agent)/.test(
      fingerprint,
    )
  ) {
    return [...sourceLinkAssets, ...visualCatalog.ai].slice(0, 4);
  }

  if (/(power bi|dados|analytics|dashboard|data)/.test(fingerprint)) {
    return [...sourceLinkAssets, ...visualCatalog.data].slice(0, 4);
  }

  if (/(next\.js|react|typescript|web|frontend|programa)/.test(fingerprint)) {
    return [...sourceLinkAssets, ...visualCatalog.web].slice(0, 4);
  }

  return [...sourceLinkAssets, ...visualCatalog.default].slice(0, 4);
}

export function extractArticleSections(content: string) {
  return content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", "").trim())
    .filter(Boolean);
}
