import { describe, expect, it } from "vitest";
import { selectBestTopic } from "./selectBestTopic";

describe("selectBestTopic", () => {
  it("prefers the highest-ranked item and keeps supporting sources diverse", () => {
    const selectedTopic = selectBestTopic([
      {
        categoryMatches: ["Inteligência Artificial"],
        id: "1",
        publishedAt: "2026-05-14T10:00:00.000Z",
        score: 95,
        source: "Hacker News",
        summary: "Novo agente de IA focado em fluxos para desenvolvimento.",
        title: "AI agents for developer workflows",
        url: "https://example.com/hn",
      },
      {
        categoryMatches: ["Inteligência Artificial", "Open Source"],
        id: "2",
        publishedAt: "2026-05-14T09:00:00.000Z",
        score: 81,
        source: "GitHub",
        summary: "Repositório open source para agentes de código.",
        title: "awesome-ai-agents",
        url: "https://example.com/github",
      },
      {
        categoryMatches: ["Inteligência Artificial"],
        id: "3",
        publishedAt: "2026-05-13T18:00:00.000Z",
        score: 77,
        source: "Dev.to",
        summary: "Análise sobre como integrar agentes em produtos web.",
        title: "Shipping agent experiences in web apps",
        url: "https://example.com/devto",
      },
    ]);

    expect(selectedTopic.category).toBe("Inteligência Artificial");
    expect(selectedTopic.lead.id).toBe("1");
    expect(selectedTopic.supporting).toHaveLength(2);
    expect(new Set(selectedTopic.supporting.map((item) => item.source)).size).toBe(2);
  });
});
