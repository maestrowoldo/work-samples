import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { describe, expect, it } from "vitest";
import { loadGeneratedBlogPostsFromDirectory } from "./content.server";
import { serializeMarkdownWithFrontmatter } from "./markdown";

async function createTempDirectory() {
  return fs.mkdtemp(path.join(os.tmpdir(), "blog-content-"));
}

describe("loadGeneratedBlogPostsFromDirectory", () => {
  it("loads generated markdown posts for pt", async () => {
    const temporaryDirectory = await createTempDirectory();
    try {
      const localeDirectory = path.join(temporaryDirectory, "pt");

      await fs.mkdir(localeDirectory, { recursive: true });
      await fs.writeFile(
        path.join(localeDirectory, "novo-post.md"),
        serializeMarkdownWithFrontmatter({
          content: "# Novo post\n\nTexto de teste.",
          frontmatter: {
            author: "Wolkendo Arias",
            category: "Inteligência Artificial",
            date: "2026-05-14",
            description: "Resumo do post de teste.",
            heroImage: {
              alt: "Imagem principal do post",
              source: "Example Tech",
              sourceUrl: "https://example.com/hn-story",
              src: "https://cdn.example.com/post.jpg",
            },
            keyTakeaways: [
              "Primeiro ponto prático do artigo gerado.",
              "Segundo ponto prático do artigo gerado.",
              "Terceiro ponto prático do artigo gerado.",
            ],
            readTime: 4,
            slug: "novo-post",
            sourceLinks: [
              {
                source: "Hacker News",
                title: "HN story",
                url: "https://example.com/hn-story",
              },
            ],
            tags: ["IA", "Dev"],
            title: "Novo post",
            whyItMatters:
              "O tema importa porque ajuda times técnicos a entender impactos recentes e transformar notícias em decisões práticas.",
          },
        }),
        "utf8",
      );

      const posts = await loadGeneratedBlogPostsFromDirectory(temporaryDirectory, "pt");

      expect(posts).toHaveLength(1);
      expect(posts[0]).toMatchObject({
        category: "Inteligência Artificial",
        origin: "generated",
        slug: "novo-post",
        title: "Novo post",
      });
      expect(posts[0]?.heroImage?.src).toBe("https://cdn.example.com/post.jpg");
      expect(posts[0]?.keyTakeaways).toHaveLength(3);
      expect(posts[0]?.sourceLinks).toHaveLength(1);
      expect(posts[0]?.whyItMatters).toContain("times técnicos");
    } finally {
      await fs.rm(temporaryDirectory, { force: true, recursive: true });
    }
  });

  it("returns an empty array for non-pt locales", async () => {
    const posts = await loadGeneratedBlogPostsFromDirectory("unused-directory", "en");
    expect(posts).toEqual([]);
  });
});
