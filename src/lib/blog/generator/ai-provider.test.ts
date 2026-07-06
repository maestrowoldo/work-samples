import { describe, expect, it } from "vitest";
import { BlogGeneratorError } from "./errors";
import { resolveAiConfiguration } from "./ai-provider";

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
});
