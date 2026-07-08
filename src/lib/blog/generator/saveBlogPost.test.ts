import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseMarkdownWithFrontmatter } from "../markdown";
import { sha256 } from "./deduplication";
import { ensureUniqueSlug, saveBlogPost, slugifyBlogTitle } from "./saveBlogPost";

async function createTempDirectory() {
  return fs.mkdtemp(path.join(os.tmpdir(), "blog-save-"));
}

describe("slug helpers", () => {
  it("slugifies titles with accents", () => {
    expect(slugifyBlogTitle("IA prática para Devs: visão geral")).toBe(
      "ia-pratica-para-devs-visao-geral",
    );
  });

  it("adds a numeric suffix when the slug already exists", () => {
    expect(
      ensureUniqueSlug("novo-post", ["novo-post", "novo-post-2"]),
    ).toBe("novo-post-3");
  });
});

describe("saveBlogPost", () => {
  const generatedPost = {
    category: "Open Source",
    content: "# Post\n\nConteúdo original com detalhes suficientes para comparação editorial.",
    contentHash: sha256("Novo Post\nResumo do post salvo em disco.\n# Post\n\nConteúdo original com detalhes suficientes para comparação editorial."),
    date: "2026-05-14",
    description: "Resumo do post salvo em disco.",
    heroImage: {
      alt: "Imagem do post",
      credit: "Example photographer",
      descriptionUrl: "https://commons.wikimedia.org/wiki/File:Post.jpg",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      originalUrl: "https://upload.wikimedia.org/post-original.jpg",
      source: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Post.jpg",
      src: "https://upload.wikimedia.org/post.jpg",
    },
    keyTakeaways: [
      "Primeiro ponto prático do artigo gerado.",
      "Segundo ponto prático do artigo gerado.",
      "Terceiro ponto prático do artigo gerado.",
    ],
    publishedAtReference: "2026-05-14T10:00:00.000Z",
    readTime: 5,
    slug: "novo-post",
    sourceLinks: [
      {
        source: "GitHub",
        title: "owner/repo",
        url: "https://github.com/owner/repo?utm_source=test",
      },
    ],
    sourceUrl: "https://github.com/owner/repo",
    sourceUrls: ["https://github.com/owner/repo"],
    tags: ["Open Source", "GitHub", "Ferramentas"],
    title: "Novo Post",
    whyItMatters:
      "O tema importa porque conecta decisões técnicas recentes com impactos práticos para desenvolvimento e operação.",
  };

  it("persists the generated post as markdown with duplicate metadata", async () => {
    const temporaryDirectory = await createTempDirectory();
    try {
      const result = await saveBlogPost(generatedPost, {
        outputDirectory: temporaryDirectory,
      });

      expect(result.post.slug).toBe("novo-post");

      const persistedDocument = await fs.readFile(
        path.join(temporaryDirectory, "novo-post.md"),
        "utf8",
      );
      const { content, frontmatter } = parseMarkdownWithFrontmatter(persistedDocument);

      expect(frontmatter.slug).toBe("novo-post");
      expect(frontmatter.contentHash).toBe(generatedPost.contentHash);
      expect(frontmatter.heroImage?.src).toBe("https://upload.wikimedia.org/post.jpg");
      expect(frontmatter.imageCredit).toBe("Example photographer");
      expect(frontmatter.imageLicense).toBe("CC BY 4.0");
      expect(frontmatter.keyTakeaways).toHaveLength(3);
      expect(frontmatter.sourceLinks).toHaveLength(1);
      expect(frontmatter.sourceUrl).toBe("https://github.com/owner/repo");
      expect(frontmatter.whyItMatters).toContain("decisões técnicas");
      expect(content).toContain("Conteúdo original com detalhes suficientes");
    } finally {
      await fs.rm(temporaryDirectory, { force: true, recursive: true });
    }
  });

  it("blocks an exact duplicate slug", async () => {
    const temporaryDirectory = await createTempDirectory();
    try {
      await expect(
        saveBlogPost(generatedPost, {
          existingSlugs: ["novo-post"],
          outputDirectory: temporaryDirectory,
        }),
      ).rejects.toThrow(/slug/);
    } finally {
      await fs.rm(temporaryDirectory, { force: true, recursive: true });
    }
  });

  it("blocks duplicate sourceUrl, contentHash and highly similar content", async () => {
    const temporaryDirectory = await createTempDirectory();
    try {
      await saveBlogPost(generatedPost, {
        outputDirectory: temporaryDirectory,
      });

      await expect(
        saveBlogPost(
          {
            ...generatedPost,
            content: "# Outro título\n\nConteúdo original com detalhes suficientes para comparação editorial.",
            contentHash: sha256("Outro\nResumo diferente\nConteúdo diferente"),
            slug: "outro-post",
            title: "Outro post",
          },
          {
            outputDirectory: temporaryDirectory,
          },
        ),
      ).rejects.toThrow(/fonte principal/);

      await expect(
        saveBlogPost(
          {
            ...generatedPost,
            slug: "hash-duplicado",
            sourceLinks: [
              {
                source: "Example",
                title: "Fonte diferente",
                url: "https://example.com/fonte-hash",
              },
            ],
            sourceUrl: "https://example.com/outra-fonte",
            sourceUrls: ["https://example.com/outra-fonte"],
            title: "Hash duplicado",
          },
          {
            outputDirectory: temporaryDirectory,
          },
        ),
      ).rejects.toThrow(/hash/);

      await expect(
        saveBlogPost(
          {
            ...generatedPost,
            contentHash: sha256("conteúdo com outro hash"),
            slug: "post-muito-parecido",
            sourceLinks: [
              {
                source: "Example",
                title: "Outra fonte",
                url: "https://example.com/outra-fonte",
              },
            ],
            sourceUrl: "https://example.com/outra-fonte",
            sourceUrls: ["https://example.com/outra-fonte"],
            title: "Novo Post",
          },
          {
            outputDirectory: temporaryDirectory,
          },
        ),
      ).rejects.toThrow(/similaridade/);
    } finally {
      await fs.rm(temporaryDirectory, { force: true, recursive: true });
    }
  });
});
