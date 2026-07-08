import { beforeEach, describe, expect, it, vi } from "vitest";
import type { BlogPostContent, GeneratedBlogPostDraft, TechNewsItem } from "../types";
import { createGeneratedBlogPost } from "./createBlogPost";
import { fetchTechNews } from "./fetchTechNews";
import { generateBlogPost } from "./generateBlogPost";
import { saveBlogPost } from "./saveBlogPost";
import { AiRateLimitError, BlogGeneratorError } from "./errors";

vi.mock("../content.server", () => ({
  getBlogPosts: vi.fn(async () => [
    {
      author: "Wolkendo Arias",
      content: "# Post publicado",
      date: "2026-07-01",
      description: "Post já publicado.",
      readTime: 3,
      slug: "post-publicado",
      sourceUrl: "https://used.example/article",
      tags: ["IA"],
      title: "Post publicado",
    } satisfies BlogPostContent,
  ]),
}));

vi.mock("./fetchTechNews", async (importOriginal) => {
  const original = await importOriginal<typeof import("./fetchTechNews")>();

  return {
    ...original,
    fetchTechNews: vi.fn(),
  };
});

vi.mock("./generateBlogPost", () => ({
  generateBlogPost: vi.fn(),
}));

vi.mock("./saveBlogPost", () => ({
  saveBlogPost: vi.fn(),
}));

function newsItem(id: string, url: string, score: number): TechNewsItem {
  return {
    categoryMatches: ["Inteligência Artificial"],
    id,
    publishedAt: "2026-07-07T10:00:00.000Z",
    publishedAtReliable: true,
    score,
    source: "Example News",
    summary: `Resumo relevante para ${id}`,
    title: `Tema candidato ${id}`,
    url,
  };
}

const successfulDraft: GeneratedBlogPostDraft = {
  category: "Inteligência Artificial",
  content:
    "# Tema aprovado\n\nTexto longo.\n\n## Contexto\n\nTexto.\n\n## Impacto\n\nTexto.\n\n## Próximos passos\n\nTexto.",
  contentHash: "hash",
  date: "2026-07-07",
  description: "Resumo do tema aprovado.",
  heroImage: {
    alt: "Imagem",
    src: "/web_pro.jpg",
  },
  keyTakeaways: ["Ponto prático um.", "Ponto prático dois.", "Ponto prático três."],
  publishedAtReference: "2026-07-07T10:00:00.000Z",
  readTime: 4,
  slug: "tema-aprovado",
  sourceLinks: [
    {
      source: "Example News",
      title: "Tema candidato fresh-2",
      url: "https://fresh.example/two",
    },
  ],
  sourceUrl: "https://fresh.example/two",
  sourceUrls: ["https://fresh.example/two"],
  tags: ["IA"],
  title: "Tema aprovado",
  whyItMatters:
    "O tema importa porque ajuda a transformar fontes recentes em decisões práticas.",
};

describe("createGeneratedBlogPost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("skips already published sources and retries another topic after a rejected draft", async () => {
    vi.mocked(fetchTechNews).mockResolvedValue([
      newsItem("used", "https://used.example/article?utm=tracking", 100),
      newsItem("fresh-1", "https://fresh.example/one", 90),
      newsItem("fresh-2", "https://fresh.example/two", 80),
    ]);
    vi.mocked(generateBlogPost)
      .mockRejectedValueOnce(new BlogGeneratorError("Post reprovado: o artigo ficou curto demais para publicação."))
      .mockResolvedValueOnce(successfulDraft);
    vi.mocked(saveBlogPost).mockResolvedValue({
      filePath: "src/content/blog/pt/tema-aprovado.md",
      post: {
        author: "Wolkendo Arias",
        category: successfulDraft.category,
        content: successfulDraft.content,
        contentHash: successfulDraft.contentHash,
        date: successfulDraft.date,
        description: successfulDraft.description,
        heroImage: successfulDraft.heroImage,
        keyTakeaways: successfulDraft.keyTakeaways,
        publishedAtReference: successfulDraft.publishedAtReference,
        readTime: successfulDraft.readTime,
        slug: "tema-aprovado",
        sourceLinks: successfulDraft.sourceLinks,
        sourceUrl: successfulDraft.sourceUrl,
        sourceUrls: successfulDraft.sourceUrls,
        tags: successfulDraft.tags,
        title: successfulDraft.title,
        whyItMatters: successfulDraft.whyItMatters,
      } satisfies BlogPostContent,
    });

    const result = await createGeneratedBlogPost({
      environment: {
        AI_API_KEY: "test",
        AI_PROVIDER: "groq",
      },
      maxAttempts: 3,
    });

    expect(result.created).toBe(true);
    expect(result.attempts).toHaveLength(1);
    expect(vi.mocked(generateBlogPost).mock.calls[0]?.[0].lead.url).toBe(
      "https://fresh.example/one",
    );
    expect(vi.mocked(generateBlogPost).mock.calls[1]?.[0].lead.url).toBe(
      "https://fresh.example/two",
    );
    expect(result.post?.title).toBe("Tema aprovado");
  });

  it("stops retrying when the AI provider hits a rate limit", async () => {
    vi.mocked(fetchTechNews).mockResolvedValue([
      newsItem("fresh-1", "https://fresh.example/one", 90),
      newsItem("fresh-2", "https://fresh.example/two", 80),
    ]);
    vi.mocked(generateBlogPost).mockRejectedValueOnce(
      new AiRateLimitError("Falha na IA (groq): 429 Too Many Requests."),
    );

    const result = await createGeneratedBlogPost({
      environment: {
        AI_API_KEY: "test",
        AI_PROVIDER: "groq",
      },
      maxAttempts: 3,
    });

    expect(result.created).toBe(false);
    expect(result.reason).toContain("429 Too Many Requests");
    expect(result.attempts).toHaveLength(1);
    expect(vi.mocked(generateBlogPost)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(saveBlogPost)).not.toHaveBeenCalled();
  });
});
