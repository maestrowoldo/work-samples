import { describe, expect, it } from "vitest";
import { canonicalizeUrl, normalizeText, sha256, tokenSimilarity } from "./deduplication";

describe("deduplication helpers", () => {
  it("normalizes text, canonicalizes URLs and hashes normalized content", () => {
    expect(normalizeText("Olá, Mundo! https://example.com?a=1")).toBe("ola mundo");
    expect(canonicalizeUrl("https://Example.com/post?utm=1#top")).toBe("https://example.com/post");
    expect(sha256("Olá mundo!")).toBe(sha256("ola mundo"));
  });

  it("calculates token similarity by token intersection over union", () => {
    expect(
      tokenSimilarity(
        "Seguro viagem internacional com cobertura e assistência ao consumidor",
        "seguro viagem com cobertura assistência consumidor",
      ),
    ).toBeGreaterThan(0.82);
  });
});

