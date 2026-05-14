import { z } from "zod";
import type { BlogSourceLink } from "./types";

const frontmatterBoundary = "---";

export const sourceLinkSchema = z.object({
  imageAlt: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
  siteName: z.string().min(1).optional(),
  source: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
});

export const storedBlogFrontmatterSchema = z.object({
  author: z.string().min(1),
  category: z.string().min(1).optional(),
  date: z.string().min(1),
  description: z.string().min(1),
  readTime: z.number().int().positive(),
  slug: z.string().min(1),
  sourceLinks: z.array(sourceLinkSchema).default([]),
  tags: z.array(z.string().min(1)).min(1),
  title: z.string().min(1),
});

export type StoredBlogFrontmatter = z.infer<typeof storedBlogFrontmatterSchema>;

export function parseMarkdownWithFrontmatter(rawDocument: string) {
  const normalizedDocument = rawDocument.replace(/\r\n/g, "\n");

  if (!normalizedDocument.startsWith(`${frontmatterBoundary}\n`)) {
    throw new Error("Documento sem frontmatter válido.");
  }

  const frontmatterEndIndex = normalizedDocument.indexOf(`\n${frontmatterBoundary}\n`, frontmatterBoundary.length);

  if (frontmatterEndIndex === -1) {
    throw new Error("Documento com fechamento de frontmatter ausente.");
  }

  const frontmatterBlock = normalizedDocument
    .slice(frontmatterBoundary.length + 1, frontmatterEndIndex)
    .trim();
  const content = normalizedDocument
    .slice(frontmatterEndIndex + `\n${frontmatterBoundary}\n`.length)
    .trim();

  let parsedFrontmatter: unknown;

  try {
    parsedFrontmatter = JSON.parse(frontmatterBlock);
  } catch (error) {
    throw new Error(
      `Frontmatter inválido: ${error instanceof Error ? error.message : "JSON malformado"}`,
    );
  }

  return {
    content,
    frontmatter: storedBlogFrontmatterSchema.parse(parsedFrontmatter),
  };
}

export function serializeMarkdownWithFrontmatter({
  content,
  frontmatter,
}: {
  content: string;
  frontmatter: StoredBlogFrontmatter;
}) {
  return [
    frontmatterBoundary,
    JSON.stringify(frontmatter, null, 2),
    frontmatterBoundary,
    "",
    content.trim(),
    "",
  ].join("\n");
}

export function normalizeSourceLinks(sourceLinks?: BlogSourceLink[]) {
  return sourceLinks ?? [];
}
