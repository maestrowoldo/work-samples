import { describe, expect, it } from "vitest";
import {
  extractArticleSections,
  getCuratedSourceLinks,
  stripInitialArticleHeading,
} from "./presentation";

describe("blog presentation helpers", () => {
  it("removes the duplicated initial H1 from article content", () => {
    expect(
      stripInitialArticleHeading(
        "# Título do artigo\n\nTexto inicial.\n\n## Seção",
      ),
    ).toBe("Texto inicial.\n\n## Seção");
  });

  it("removes any initial H1 because the page owns the canonical article title", () => {
    expect(stripInitialArticleHeading("# Outro título\n\nTexto inicial.")).toBe(
      "Texto inicial.",
    );
  });

  it("extracts stable section anchors after ignoring the initial H1", () => {
    expect(
      extractArticleSections(
        "# Título\n\n## O que aconteceu\n\nTexto\n\n## O que aconteceu",
      ),
    ).toEqual([
      { id: "o-que-aconteceu", title: "O que aconteceu" },
      { id: "o-que-aconteceu-2", title: "O que aconteceu" },
    ]);
  });

  it("keeps only source links that were directly used by the article", () => {
    const sources = getCuratedSourceLinks({
      sourceUrl: "https://example.com/lead",
      sourceUrls: ["https://example.com/lead"],
      sourceLinks: [
        {
          source: "Lead",
          title: "Main source",
          url: "https://example.com/lead",
        },
        {
          source: "Unrelated",
          title: "Unrelated story",
          url: "https://example.com/other",
        },
      ],
    });

    expect(sources).toEqual([
      {
        source: "Lead",
        title: "Main source",
        url: "https://example.com/lead",
      },
    ]);
  });
});
