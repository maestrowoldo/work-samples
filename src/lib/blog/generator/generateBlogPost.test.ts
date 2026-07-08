import os from "node:os";
import path from "node:path";
import { promises as fs } from "node:fs";
import { describe, expect, it } from "vitest";
import { BlogGeneratorError } from "./errors";
import { generateBlogPost } from "./generateBlogPost";
import type { SelectedTopic } from "../types";

const topic: SelectedTopic = {
  category: "Inteligência Artificial",
  keywords: ["ai", "llm", "observability"],
  lead: {
    categoryMatches: ["Inteligência Artificial"],
    id: "lead",
    publishedAt: "2026-07-07T10:00:00.000Z",
    publishedAtReliable: true,
    score: 100,
    source: "Dev.to",
    summary: "Observability for AI systems, applications, infrastructure and LLM workflows.",
    title: "Observability Design for the AI Era",
    url: "https://example.com/lead",
  },
  summary:
    "Tema principal: observability for AI systems. Categoria: Inteligência Artificial.",
  supporting: [
    {
      categoryMatches: ["DevOps"],
      id: "supporting",
      publishedAt: "2026-07-07T11:00:00.000Z",
      publishedAtReliable: true,
      score: 80,
      source: "GitHub",
      summary: "A repository about dashboards and operational monitoring.",
      title: "Monitoring dashboard for developers",
      url: "https://example.com/supporting",
    },
  ],
};

function buildContent(sectionCount = 5) {
  const paragraph =
    "A observabilidade para sistemas com inteligência artificial exige uma leitura mais cuidadosa de sinais técnicos, custos, latência, qualidade de resposta e comportamento em produção. Times de desenvolvimento precisam conectar métricas de aplicação, infraestrutura, pipelines e modelos para identificar falhas antes que elas afetem usuários reais. Essa prática também cria uma base comum para produto, segurança e operação discutirem riscos com evidências em vez de dependerem apenas de percepções isoladas.";
  const requiredSections = [
    "O que aconteceu",
    "Por que isso importa",
    "Impacto prático",
    "Riscos e pontos de atenção",
    "Próximos passos",
  ].slice(0, sectionCount);

  return [
    "# Observabilidade para a era da inteligência artificial",
    paragraph,
    ...requiredSections.map((sectionTitle) =>
      [
        `## ${sectionTitle}`,
        paragraph,
        "- Mapear sinais relevantes antes de escolher ferramentas.",
        "- Relacionar incidentes técnicos com impacto de produto.",
      ].join("\n\n"),
    ),
  ].join("\n\n");
}

function buildAiPayload(content = buildContent()) {
  return {
    content,
    duplicateRiskReason: "",
    imageQuery: "artificial intelligence monitoring dashboard",
    keyTakeaways: [
      "A observabilidade precisa conectar aplicação, infraestrutura, pipelines e comportamento dos modelos.",
      "A imagem principal deve refletir a fonte mais relacionada ao tema central do artigo.",
      "A revisão editorial impede que posts genéricos sejam publicados automaticamente.",
    ],
    keywords: ["inteligência artificial", "observabilidade", "devops"],
    publishedAtReference: "2026-07-07T10:00:00.000Z",
    shouldPublish: true,
    slug: "observabilidade-para-a-era-da-inteligencia-artificial",
    sourceUrls: ["https://example.com/lead"],
    summary:
      "Como estruturar observabilidade para aplicações com inteligência artificial em produção.",
    title: "Observabilidade para a era da inteligência artificial",
    whyItMatters:
      "O tema importa agora porque aplicações com IA dependem de sinais confiáveis para operar em produção, reduzir riscos e ajudar times técnicos a tomar decisões melhores.",
  };
}

function createFetchImpl(aiPayload: ReturnType<typeof buildAiPayload>): typeof fetch {
  return async (input) => {
    const url = String(input);

    if (url.includes("/chat/completions")) {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: JSON.stringify(aiPayload),
              },
            },
          ],
        }),
        {
          headers: {
            "content-type": "application/json",
          },
          status: 200,
        },
      );
    }

    if (url === "https://example.com/lead") {
      return new Response(
        `
          <html>
            <head>
              <meta property="og:site_name" content="Example AI" />
              <meta property="og:image" content="https://cdn.example.com/ai-observability.jpg" />
              <meta property="og:image:alt" content="AI observability dashboard for LLM systems" />
            </head>
          </html>
        `,
        {
          headers: {
            "content-type": "text/html; charset=utf-8",
          },
          status: 200,
        },
      );
    }

    if (url.includes("commons.wikimedia.org/w/api.php")) {
      return new Response(
        JSON.stringify({
          query: {
            pages: {
              "123": {
                imageinfo: [
                  {
                    descriptionurl: "https://commons.wikimedia.org/wiki/File:AI_dashboard.jpg",
                    extmetadata: {
                      ImageDescription: {
                        value: "Artificial intelligence observability dashboard",
                      },
                      Credit: {
                        value: "Example photographer",
                      },
                      LicenseShortName: {
                        value: "CC BY-SA 4.0",
                      },
                      LicenseUrl: {
                        value: "https://creativecommons.org/licenses/by-sa/4.0/",
                      },
                    },
                    height: 900,
                    mime: "image/jpeg",
                    thumburl: "https://upload.wikimedia.org/ai-dashboard-1200.jpg",
                    url: "https://upload.wikimedia.org/ai-dashboard.jpg",
                    width: 1200,
                  },
                ],
                title: "File:AI_dashboard.jpg",
              },
            },
          },
        }),
        {
          headers: {
            "content-type": "application/json",
          },
          status: 200,
        },
      );
    }

    return new Response(
      `
        <html>
          <head>
            <meta property="og:site_name" content="Example DevOps" />
            <meta property="og:image" content="https://cdn.example.com/devops.jpg" />
            <meta property="og:image:alt" content="DevOps monitoring dashboard" />
          </head>
        </html>
      `,
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
        },
        status: 200,
      },
    );
  };
}

function createMalformedJsonFetchImpl(): typeof fetch {
  const validPayload = buildAiPayload();
  const rawJsonWithControlCharacters = `{
    "shouldPublish": true,
    "duplicateRiskReason": "",
    "title": "${validPayload.title}",
    "slug": "${validPayload.slug}",
    "summary": "${validPayload.summary}",
    "whyItMatters": "${validPayload.whyItMatters}",
    "keyTakeaways": ["${validPayload.keyTakeaways[0]}", "${validPayload.keyTakeaways[1]}", "${validPayload.keyTakeaways[2]}"],
    "keywords": ["inteligência artificial", "observabilidade", "devops"],
    "imageQuery": "${validPayload.imageQuery}",
    "content": "${validPayload.content}",
    "sourceUrls": ["https://example.com/lead"],
    "publishedAtReference": "${validPayload.publishedAtReference}"
  }`;

  return async (input) => {
    const url = String(input);

    if (url.includes("/chat/completions")) {
      return new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: rawJsonWithControlCharacters,
              },
            },
          ],
        }),
        {
          headers: {
            "content-type": "application/json",
          },
          status: 200,
        },
      );
    }

    return createFetchImpl(validPayload)(input);
  };
}

describe("generateBlogPost", () => {
  it("uses a matching local image library asset before generating an AI image", async () => {
    const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "blog-library-"));

    try {
      await fs.writeFile(path.join(temporaryDirectory, "ai-observability-dashboard.jpg"), "image");

      const post = await generateBlogPost(topic, {
        environment: {
          AI_API_KEY: "test-key",
          AI_PROVIDER: "groq",
          BLOG_IMAGE_LIBRARY_DIR: temporaryDirectory,
          BLOG_IMAGE_LIBRARY_PUBLIC_PATH: "/blog/library",
          BLOG_IMAGE_PROVIDER: "cloudflare",
          CLOUDFLARE_ACCOUNT_ID: "account",
          CLOUDFLARE_API_TOKEN: "token",
        },
        fetchImpl: async (input, init) => {
          const url = String(input);

          expect(url).not.toContain("api.cloudflare.com/client/v4/accounts/account/ai/run/");
          return createFetchImpl(buildAiPayload())(input, init);
        },
        now: new Date("2026-07-07T12:00:00.000Z"),
      });

      expect(post.heroImage).toMatchObject({
        alt: "Imagem de tecnologia sobre ai observability dashboard para o artigo: Observabilidade para a era da inteligência artificial",
        source: "Biblioteca local",
        src: "/blog/library/ai-observability-dashboard.jpg",
      });
    } finally {
      await fs.rm(temporaryDirectory, { force: true, recursive: true });
    }
  });

  it("generates a local Cloudflare image before using source or Wikimedia fallbacks", async () => {
    const temporaryDirectory = await fs.mkdtemp(path.join(os.tmpdir(), "blog-image-"));
    const imageBytes = Buffer.from("fake-jpeg");

    try {
      const post = await generateBlogPost(topic, {
        environment: {
          AI_API_KEY: "test-key",
          AI_PROVIDER: "groq",
          BLOG_IMAGE_PROVIDER: "cloudflare",
          CLOUDFLARE_ACCOUNT_ID: "account",
          CLOUDFLARE_API_TOKEN: "token",
        },
        fetchImpl: async (input, init) => {
          const url = String(input);

          if (url.includes("api.cloudflare.com/client/v4/accounts/account/ai/run/")) {
            expect(init?.method).toBe("POST");
            expect(init?.headers).toMatchObject({
              Authorization: "Bearer token",
              "Content-Type": "application/json",
            });
            expect(JSON.parse(String(init?.body))).toMatchObject({
              prompt: expect.stringContaining("server racks"),
              steps: 4,
            });
            expect(JSON.parse(String(init?.body)).prompt).toContain("Do not show mountains");
            expect(JSON.parse(String(init?.body)).prompt).toContain("No visible words");

            return new Response(
              JSON.stringify({
                result: {
                  image: imageBytes.toString("base64"),
                },
                success: true,
              }),
              {
                headers: {
                  "content-type": "application/json",
                },
                status: 200,
              },
            );
          }

          return createFetchImpl(buildAiPayload())(input, init);
        },
        imageOutputDirectory: temporaryDirectory,
        now: new Date("2026-07-07T12:00:00.000Z"),
      });

      expect(post.heroImage).toMatchObject({
        alt: "Imagem editorial gerada para o artigo: Observabilidade para a era da inteligência artificial",
        source: "Cloudflare Workers AI",
        src: "/blog/generated/observabilidade-para-a-era-da-inteligencia-artificial.jpg",
      });

      await expect(
        fs.readFile(
          path.join(
            temporaryDirectory,
            "observabilidade-para-a-era-da-inteligencia-artificial.jpg",
          ),
        ),
      ).resolves.toEqual(imageBytes);
    } finally {
      await fs.rm(temporaryDirectory, { force: true, recursive: true });
    }
  });

  it("falls back to the source image before using Wikimedia", async () => {
    const post = await generateBlogPost(topic, {
      environment: {
        AI_API_KEY: "test-key",
        AI_PROVIDER: "groq",
      },
      fetchImpl: createFetchImpl(buildAiPayload()),
      now: new Date("2026-07-07T12:00:00.000Z"),
    });

    expect(post.heroImage).toMatchObject({
      alt: "AI observability dashboard for LLM systems",
      source: "Example AI",
      sourceUrl: "https://example.com/lead",
      src: "https://cdn.example.com/ai-observability.jpg",
    });
    expect(post.contentHash).toHaveLength(64);
    expect(post.content.startsWith("# ")).toBe(false);
    expect(post.keyTakeaways).toHaveLength(3);
    expect(post.sourceUrl).toBe("https://example.com/lead");
    expect(post.whyItMatters).toContain("aplicações com IA");
  });

  it("uses a relevant Wikimedia image when source pages do not provide images", async () => {
    const post = await generateBlogPost(topic, {
      environment: {
        AI_API_KEY: "test-key",
        AI_PROVIDER: "groq",
      },
      fetchImpl: async (input, init) => {
        const url = String(input);

        if (url === "https://example.com/lead" || url === "https://example.com/supporting") {
          return new Response("<html><head><title>No image</title></head></html>", {
            headers: {
              "content-type": "text/html; charset=utf-8",
            },
            status: 200,
          });
        }

        return createFetchImpl(buildAiPayload())(input, init);
      },
      now: new Date("2026-07-07T12:00:00.000Z"),
    });

    expect(post.heroImage).toMatchObject({
      license: "CC BY-SA 4.0",
      source: "Wikimedia Commons",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:AI_dashboard.jpg",
      src: "https://upload.wikimedia.org/ai-dashboard-1200.jpg",
    });
  });

  it("falls back to the source image when Cloudflare does not return an image", async () => {
    const post = await generateBlogPost(topic, {
      environment: {
        AI_API_KEY: "test-key",
        AI_PROVIDER: "groq",
        BLOG_IMAGE_PROVIDER: "cloudflare",
        CLOUDFLARE_ACCOUNT_ID: "account",
        CLOUDFLARE_API_TOKEN: "token",
      },
      fetchImpl: async (input, init) => {
        const url = String(input);

        if (url.includes("api.cloudflare.com/client/v4/accounts/account/ai/run/")) {
          return new Response(
            JSON.stringify({
              errors: [{ message: "quota exceeded" }],
              success: false,
            }),
            {
              headers: {
                "content-type": "application/json",
              },
              status: 200,
            },
          );
        }

        return createFetchImpl(buildAiPayload())(input, init);
      },
      now: new Date("2026-07-07T12:00:00.000Z"),
    });

    expect(post.heroImage).toMatchObject({
      alt: "AI observability dashboard for LLM systems",
      source: "Example AI",
      sourceUrl: "https://example.com/lead",
      src: "https://cdn.example.com/ai-observability.jpg",
    });
  });

  it("blocks generated posts without enough article structure", async () => {
    await expect(
      generateBlogPost(topic, {
        environment: {
          AI_API_KEY: "test-key",
          AI_PROVIDER: "groq",
        },
        fetchImpl: createFetchImpl(buildAiPayload(buildContent(2))),
      }),
    ).rejects.toThrow(BlogGeneratorError);
  });

  it("recovers AI JSON when content contains raw line breaks inside the JSON string", async () => {
    const post = await generateBlogPost(topic, {
      environment: {
        AI_API_KEY: "test-key",
        AI_PROVIDER: "groq",
      },
      fetchImpl: createMalformedJsonFetchImpl(),
      now: new Date("2026-07-07T12:00:00.000Z"),
    });

    expect(post.title).toBe("Observabilidade para a era da inteligência artificial");
    expect(post.content).toContain("## O que aconteceu");
  });
});
