import { describe, expect, it } from "vitest";
import { AiRateLimitError, BlogGeneratorError } from "./errors";
import { generateTextWithAi, resolveAiConfiguration } from "./ai-provider";

describe("resolveAiConfiguration", () => {
  it("throws a friendly error when AI_PROVIDER is missing", () => {
    expect(() => resolveAiConfiguration({})).toThrowError(BlogGeneratorError);
    expect(() => resolveAiConfiguration({})).toThrow(
      "AI_PROVIDER inválido ou ausente",
    );
  });

  it("throws a friendly error when AI_API_KEY is missing", () => {
    expect(() =>
      resolveAiConfiguration({
        AI_PROVIDER: "groq",
      }),
    ).toThrow("AI_API_KEY não está configurada");
  });

  it("resolves defaults for a supported provider", () => {
    expect(
      resolveAiConfiguration({
        AI_API_KEY: "test-key",
        AI_PROVIDER: "groq",
      }),
    ).toMatchObject({
      model: "llama-3.3-70b-versatile",
      provider: "groq",
    });
  });

  it("rejects Groq safeguard models for article generation", () => {
    expect(() =>
      resolveAiConfiguration({
        AI_API_KEY: "test-key",
        AI_MODEL: "openai/gpt-oss-safeguard-20b",
        AI_PROVIDER: "groq",
      }),
    ).toThrow("não é indicado para gerar artigos");
  });

  it("does not force provider JSON mode for Groq requests", async () => {
    let requestBody: Record<string, unknown> | undefined;
    const response = await generateTextWithAi(
      {
        prompt: "Retorne JSON.",
        systemPrompt: "Responda somente JSON.",
      },
      {
        environment: {
          AI_API_KEY: "test-key",
          AI_PROVIDER: "groq",
        },
        fetchImpl: async (_input, init) => {
          requestBody = JSON.parse(String(init?.body)) as Record<string, unknown>;

          return new Response(
            JSON.stringify({
              choices: [
                {
                  message: {
                    content: "{\"ok\":true}",
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
        },
      },
    );

    expect(response).toBe("{\"ok\":true}");
    expect(requestBody).toMatchObject({
      max_tokens: 1400,
      temperature: 0.3,
    });
    expect(requestBody).not.toHaveProperty("response_format");
  });

  it("turns provider rate limits into a fatal retry message", async () => {
    await expect(
      generateTextWithAi(
        {
          prompt: "Retorne JSON.",
          systemPrompt: "Responda somente JSON.",
        },
        {
          environment: {
            AI_API_KEY: "test-key",
            AI_PROVIDER: "groq",
          },
          fetchImpl: async () =>
            new Response(
              JSON.stringify({
                error: {
                  message:
                    "Rate limit reached. Please try again in 28.08s. Need more tokens?",
                },
              }),
              {
                status: 429,
                statusText: "Too Many Requests",
              },
            ),
        },
      ),
    ).rejects.toThrow(AiRateLimitError);

    await expect(
      generateTextWithAi(
        {
          prompt: "Retorne JSON.",
          systemPrompt: "Responda somente JSON.",
        },
        {
          environment: {
            AI_API_KEY: "test-key",
            AI_PROVIDER: "groq",
          },
          fetchImpl: async () =>
            new Response("Rate limit reached. Please try again in 28.08s.", {
              status: 429,
              statusText: "Too Many Requests",
            }),
        },
      ),
    ).rejects.toThrow("Aguarde 28.08s");
  });
});
