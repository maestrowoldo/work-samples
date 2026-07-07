import { BlogGeneratorError } from "./errors";
import { extractTopicKeywords, getPrimaryTopicCategory } from "../topics";
import type { SelectedTopic, TechNewsItem } from "../types";

function selectSupportingItems(lead: TechNewsItem, items: TechNewsItem[]) {
  const selectedItems: TechNewsItem[] = [];
  const usedSources = new Set<string>([lead.source]);
  const leadCategory = lead.categoryMatches[0];
  const leadKeywords = extractTopicKeywords(`${lead.title} ${lead.summary}`);

  for (const item of items) {
    if (item.id === lead.id) {
      continue;
    }

    const sharesCategory = leadCategory ? item.categoryMatches.includes(leadCategory) : false;
    const sharesKeyword = leadKeywords.some((keyword) =>
      `${item.title} ${item.summary}`.toLowerCase().includes(keyword.toLowerCase()),
    );

    if (!sharesCategory && !sharesKeyword) {
      continue;
    }

    if (usedSources.has(item.source)) {
      continue;
    }

    usedSources.add(item.source);
    selectedItems.push(item);

    if (selectedItems.length === 4) {
      break;
    }
  }

  if (selectedItems.length >= 2) {
    return selectedItems;
  }

  for (const item of items) {
    if (item.id === lead.id || selectedItems.some((selectedItem) => selectedItem.id === item.id)) {
      continue;
    }

    selectedItems.push(item);

    if (selectedItems.length === 4) {
      break;
    }
  }

  return selectedItems;
}

function buildSelectedTopic(lead: TechNewsItem, rankedItems: TechNewsItem[]): SelectedTopic {
  const supporting = selectSupportingItems(lead, rankedItems);
  const category = getPrimaryTopicCategory(lead.categoryMatches);
  const keywords = extractTopicKeywords(
    [lead, ...supporting].map((item) => `${item.title} ${item.summary}`).join(" "),
  ).slice(0, 8);

  return {
    category,
    keywords,
    lead,
    summary: `Tema principal: ${lead.title}. Categoria: ${category}. Fontes de apoio: ${supporting
      .map((item) => `${item.source}: ${item.title}`)
      .join(" | ")}`,
    supporting,
  };
}

export function selectTopicCandidates(items: TechNewsItem[], limit = 8): SelectedTopic[] {
  if (items.length === 0) {
    throw new BlogGeneratorError(
      "Nenhuma notícia relevante foi recebida para seleção do tema do post.",
    );
  }

  const rankedItems = [...items].sort(
    (left, right) => right.score - left.score || left.title.localeCompare(right.title),
  );

  return rankedItems.slice(0, limit).map((lead) => buildSelectedTopic(lead, rankedItems));
}

export function selectBestTopic(items: TechNewsItem[]): SelectedTopic {
  return selectTopicCandidates(items, 1)[0];
}
