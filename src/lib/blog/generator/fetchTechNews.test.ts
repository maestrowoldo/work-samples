import { describe, expect, it } from "vitest";
import { BlogGeneratorError } from "./errors";
import { buildNewsSearchQueries, fetchTechNews, isRecentContentRequest } from "./fetchTechNews";

function createJsonResponse(body: unknown) {
  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}

describe("fetchTechNews", () => {
  it("builds broad search queries with insurance-specific variations", () => {
    const queries = buildNewsSearchQueries("blog mais recente sobre seguro viagem");

    expect(isRecentContentRequest("blog mais recente sobre seguro viagem")).toBe(true);
    expect(queries).toContain("seguro viagem");
    expect(queries).toContain("seguro viagem tendências");
    expect(queries).toContain("seguro viagem últimos 7 dias");
    expect(queries).toContain("seguro viagem seguradora");
    expect(queries).toContain("seguro viagem cobertura");
  });

  it("throws a friendly error when no relevant news are found", async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);

      if (url.includes("topstories") || url.includes("newstories")) {
        return createJsonResponse([]);
      }

      if (url.includes("search/repositories")) {
        return createJsonResponse({
          items: [],
        });
      }

      return createJsonResponse([]);
    };

    await expect(
      fetchTechNews({
        fetchImpl,
        now: new Date("2026-05-14T12:00:00.000Z"),
      }),
    ).rejects.toThrowError(BlogGeneratorError);
  });

  it("includes recent items from major technology RSS feeds", async () => {
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);

      if (url.includes("topstories") || url.includes("newstories")) {
        return createJsonResponse([]);
      }

      if (url.includes("search/repositories")) {
        return createJsonResponse({
          items: [],
        });
      }

      if (url.includes("theverge.com/rss")) {
        return new Response(
          `
            <rss>
              <channel>
                <item>
                  <title>New AI developer tool improves JavaScript workflows</title>
                  <link>https://www.theverge.com/example-ai-tool</link>
                  <pubDate>Thu, 14 May 2026 10:00:00 GMT</pubDate>
                  <description>Artificial intelligence, programming and developer tooling news.</description>
                </item>
              </channel>
            </rss>
          `,
          {
            headers: {
              "Content-Type": "application/rss+xml",
            },
            status: 200,
          },
        );
      }

      return new Response("<rss><channel /></rss>", {
        headers: {
          "Content-Type": "application/rss+xml",
        },
        status: 200,
      });
    };

    const items = await fetchTechNews({
      fetchImpl,
      now: new Date("2026-05-14T12:00:00.000Z"),
    });

    expect(items[0]).toMatchObject({
      publishedAtReliable: true,
      source: "The Verge",
      title: "New AI developer tool improves JavaScript workflows",
      url: "https://www.theverge.com/example-ai-tool",
    });
  });

  it("uses a 7-day window for recent prompts and ignores older dated sources", async () => {
    const requestedUrls: string[] = [];
    const fetchImpl: typeof fetch = async (input) => {
      const url = String(input);
      requestedUrls.push(url);

      if (url.includes("topstories") || url.includes("newstories")) {
        return createJsonResponse([]);
      }

      if (url.includes("search/repositories")) {
        return createJsonResponse({
          items: [],
        });
      }

      if (url.includes("news.google.com/rss/search")) {
        return new Response(
          `
            <rss>
              <channel>
                <item>
                  <title>Seguro viagem ganha novas orientações para consumidores</title>
                  <link>https://example.com/seguro-viagem-recente?utm=1</link>
                  <source>Example News</source>
                  <pubDate>Sun, 05 Jul 2026 10:00:00 GMT</pubDate>
                  <description>Seguro viagem, cobertura, assistência e proteção ao consumidor.</description>
                </item>
                <item>
                  <title>Seguro viagem antigo fora da janela</title>
                  <link>https://example.com/seguro-viagem-antigo</link>
                  <source>Example News</source>
                  <pubDate>Mon, 01 Jun 2026 10:00:00 GMT</pubDate>
                  <description>Seguro viagem antigo.</description>
                </item>
              </channel>
            </rss>
          `,
          {
            headers: {
              "Content-Type": "application/rss+xml",
            },
            status: 200,
          },
        );
      }

      return new Response("<rss><channel /></rss>", {
        headers: {
          "Content-Type": "application/rss+xml",
        },
        status: 200,
      });
    };

    const items = await fetchTechNews({
      fetchImpl,
      now: new Date("2026-07-07T12:00:00.000Z"),
      userPrompt: "blog mais recente sobre seguro viagem",
    });

    expect(requestedUrls.some((url) => url.includes("when%3A7d"))).toBe(true);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      categoryMatches: ["Seguros"],
      publishedAtReliable: true,
      source: "Example News",
      title: "Seguro viagem ganha novas orientações para consumidores",
    });
  });
});
