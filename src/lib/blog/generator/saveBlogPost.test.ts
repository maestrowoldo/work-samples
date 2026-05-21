import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseMarkdownWithFrontmatter } from "../markdown";
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
  it("persists the generated post as markdown without overwriting existing slugs", async () => {
    const temporaryDirectory = await createTempDirectory();
    try {
      const result = await saveBlogPost(
        {
          category: "Open Source",
          content: "# Post\n\nConteúdo original.",
          date: "2026-05-14",
          description: "Resumo do post salvo em disco.",
          readTime: 5,
          sourceLinks: [
            {
              source: "GitHub",
              title: "owner/repo",
              url: "https://github.com/owner/repo",
            },
          ],
          tags: ["Open Source", "GitHub", "Ferramentas"],
          title: "Novo Post",
        },
        {
          existingSlugs: ["novo-post"],
          outputDirectory: temporaryDirectory,
        },
      );

      expect(result.post.slug).toBe("novo-post-2");

      const persistedDocument = await fs.readFile(
        path.join(temporaryDirectory, "novo-post-2.md"),
        "utf8",
      );
      const { content, frontmatter } = parseMarkdownWithFrontmatter(persistedDocument);

      expect(frontmatter.slug).toBe("novo-post-2");
      expect(frontmatter.sourceLinks).toHaveLength(1);
      expect(content).toContain("Conteúdo original.");
    } finally {
      await fs.rm(temporaryDirectory, { force: true, recursive: true });
    }
  });
});
