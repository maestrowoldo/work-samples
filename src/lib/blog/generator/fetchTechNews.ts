import { BlogGeneratorError } from "./errors";
import { canonicalizeUrl, normalizeText } from "./deduplication";
import { extractTopicKeywords, getDevToTags, getGitHubSearchQueries, getPrimaryTopicCategory, matchTopicCategories } from "../topics";
import type { TechNewsItem } from "../types";

interface FetchTechNewsOptions {
  fetchImpl?: typeof fetch;
  now?: Date;
  recentOnly?: boolean;
  userPrompt?: string;
}

interface HackerNewsItemResponse {
  id: number;
  score?: number;
  text?: string;
  time?: number;
  title?: string;
  type?: string;
  url?: string;
}

interface DevToArticleResponse {
  description?: string;
  id: number;
  published_timestamp?: string;
  social_image?: string;
  tag_list?: string[] | string;
  title: string;
  url: string;
}

interface GitHubSearchResponse {
  items?: Array<{
    description?: string | null;
    full_name: string;
    html_url: string;
    id: number;
    pushed_at?: string;
    stargazers_count?: number;
    topics?: string[];
  }>;
}

const hackerNewsBaseUrl = "https://hacker-news.firebaseio.com/v0";
const devToBaseUrl = "https://dev.to/api";
const gitHubBaseUrl = "https://api.github.com";
const googleNewsSearchBaseUrl = "https://news.google.com/rss/search";
const recentWindowInDays = 21;
const requestedRecentWindowInDays = 7;
const technologyFeeds = [
  {
    source: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/technology-lab",
  },
  {
    source: "Engadget",
    url: "https://www.engadget.com/rss.xml",
  },
  {
    source: "MIT Technology Review",
    url: "https://www.technologyreview.com/feed/",
  },
  {
    source: "TechCrunch",
    url: "https://techcrunch.com/feed/",
  },
  {
    source: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
  },
  {
    source: "WIRED",
    url: "https://www.wired.com/feed/rss",
  },
] as const;

function buildFallbackUrlForHackerNews(id: number) {
  return `https://news.ycombinator.com/item?id=${id}`;
}

function cleanSummary(summary: string | undefined) {
  return (summary ?? "")
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function isRecentContentRequest(value: string | undefined) {
  if (!value) {
    return false;
  }

  return /\b(blog|post|noticia|notícia|conteudo|conteúdo|artigo)?\s*(mais\s+recente|recente|atuais|atual|ultimos|últimos|esta\s+semana|semana)\b/i.test(
    value,
  );
}

function isInsuranceRelated(value: string) {
  return /\b(seguro|seguros|seguradora|cobertura|assistencia|assistência|indenizacao|indenização|consumidor|protecao|proteção|viagem)\b/i.test(
    value,
  );
}

export function buildNewsSearchQueries(userPrompt: string | undefined) {
  const rawTopic = (userPrompt ?? "").trim();
  const topic = rawTopic
    .replace(/\b(blog|post|noticia|notícia|conteudo|conteúdo|artigo)\b/gi, " ")
    .replace(/\b(mais\s+recente|recente|atuais|atual|ultimos|últimos|sobre|de|do|da)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  const baseTopic = topic || "tecnologia";
  const variations = [
    baseTopic,
    `${baseTopic} novidades`,
    `${baseTopic} tendências`,
    `${baseTopic} guia atualizado`,
    `${baseTopic} notícia recente`,
    `${baseTopic} blog`,
    `${baseTopic} mercado`,
    `${baseTopic} dicas`,
    `${baseTopic} últimos 7 dias`,
    `${baseTopic} esta semana`,
  ];

  if (isInsuranceRelated(baseTopic)) {
    variations.push(
      `${baseTopic} seguro`,
      `${baseTopic} seguradora`,
      `${baseTopic} cobertura`,
      `${baseTopic} assistência`,
      `${baseTopic} indenização`,
      `${baseTopic} consumidor`,
      `${baseTopic} proteção`,
    );
  }

  return [...new Set(variations.map((query) => query.trim()).filter(Boolean))].slice(0, 14);
}

function extractXmlTagValue(block: string, tagName: string) {
  const match = block.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"));
  return match?.[1] ? cleanSummary(match[1]) : undefined;
}

function extractAtomLink(block: string) {
  const alternateLinkMatch = block.match(
    /<link[^>]+rel=["']alternate["'][^>]+href=["']([^"']+)["'][^>]*>/i,
  );

  if (alternateLinkMatch?.[1]) {
    return alternateLinkMatch[1].trim();
  }

  const linkMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);

  if (linkMatch?.[1]) {
    return linkMatch[1].trim();
  }

  return extractXmlTagValue(block, "link");
}

function extractSourceName(block: string) {
  const sourceMatch = block.match(/<source\b[^>]*>([\s\S]*?)<\/source>/i);
  return sourceMatch?.[1] ? cleanSummary(sourceMatch[1]) : undefined;
}

function splitXmlBlocks(xml: string, tagName: "entry" | "item") {
  return [...xml.matchAll(new RegExp(`<${tagName}\\b[\\s\\S]*?<\\/${tagName}>`, "gi"))].map(
    (match) => match[0],
  );
}

function calculateRecencyScore(publishedAt: string, now: Date) {
  const publishedAtTimestamp = Date.parse(publishedAt);

  if (Number.isNaN(publishedAtTimestamp)) {
    return 0;
  }

  const ageInHours = Math.max(0, (now.getTime() - publishedAtTimestamp) / (1000 * 60 * 60));
  return Math.max(0, 30 - ageInHours / 12);
}

function calculateItemScore(item: Omit<TechNewsItem, "score">, baseScore: number, now: Date) {
  const categoryBonus = item.categoryMatches.length * 18;
  const keywordBonus = extractTopicKeywords(`${item.title} ${item.summary}`).length * 4;
  const popularityBonus = Math.log10(baseScore + 1) * 15;
  const recencyBonus = calculateRecencyScore(item.publishedAt, now);

  return Number((categoryBonus + keywordBonus + popularityBonus + recencyBonus).toFixed(2));
}

function createTechNewsItem({
  fallbackCategory,
  id,
  publishedAt,
  publishedAtReliable,
  rawScore,
  source,
  summary,
  title,
  url,
  now,
}: {
  fallbackCategory?: string;
  id: string;
  now: Date;
  publishedAt: string;
  publishedAtReliable: boolean;
  rawScore: number;
  source: string;
  summary: string;
  title: string;
  url: string;
}): TechNewsItem | null {
  const categoryMatches = matchTopicCategories(`${title} ${summary} ${url}`);

  if (categoryMatches.length === 0 && !fallbackCategory) {
    return null;
  }

  const itemWithoutScore = {
    categoryMatches: categoryMatches.length > 0 ? categoryMatches : [fallbackCategory!],
    id,
    publishedAt,
    publishedAtReliable,
    source,
    summary,
    title,
    url,
  };

  return {
    ...itemWithoutScore,
    score: calculateItemScore(itemWithoutScore, rawScore, now),
  };
}

async function fetchJson<TResponse>(
  input: string,
  init?: RequestInit,
  fetchImpl: typeof fetch = fetch,
) {
  const response = await fetchImpl(input, init);

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${input}: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<TResponse>;
}

function normalizePublishedAt(value: string | undefined, now: Date) {
  if (!value) {
    return now.toISOString();
  }

  const timestamp = Date.parse(value);

  return Number.isNaN(timestamp) ? now.toISOString() : new Date(timestamp).toISOString();
}

async function fetchText(input: string, fetchImpl: typeof fetch = fetch) {
  const response = await fetchImpl(input, {
    headers: {
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      "User-Agent": "WolkendoBlogBot/1.0",
    },
  });

  if (!response.ok) {
    throw new Error(`Falha ao buscar ${input}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function fetchHackerNewsItems(fetchImpl: typeof fetch, now: Date) {
  const [topStoryIds, newStoryIds] = await Promise.all([
    fetchJson<number[]>(`${hackerNewsBaseUrl}/topstories.json`, undefined, fetchImpl),
    fetchJson<number[]>(`${hackerNewsBaseUrl}/newstories.json`, undefined, fetchImpl),
  ]);

  const candidateIds = [...topStoryIds.slice(0, 12), ...newStoryIds.slice(0, 12)];
  const stories = await Promise.all(
    candidateIds.map((storyId) =>
      fetchJson<HackerNewsItemResponse>(
        `${hackerNewsBaseUrl}/item/${storyId}.json`,
        undefined,
        fetchImpl,
      ),
    ),
  );

  return stories
    .filter((story) => story.type === "story" && story.title)
    .map((story) =>
      createTechNewsItem({
        id: `hn-${story.id}`,
        now,
        publishedAt: story.time
          ? new Date(story.time * 1000).toISOString()
          : now.toISOString(),
        publishedAtReliable: Boolean(story.time),
        rawScore: story.score ?? 0,
        source: "Hacker News",
        summary: cleanSummary(story.text),
        title: story.title ?? "Sem título",
        url: story.url ?? buildFallbackUrlForHackerNews(story.id),
      }),
    )
    .filter((item): item is TechNewsItem => item !== null);
}

async function fetchDevToItems(fetchImpl: typeof fetch, now: Date) {
  const tagResponses = await Promise.all(
    getDevToTags().map((tag) =>
      fetchJson<DevToArticleResponse[]>(
        `${devToBaseUrl}/articles/latest?per_page=6&tag=${encodeURIComponent(tag)}`,
        undefined,
        fetchImpl,
      ),
    ),
  );

  return tagResponses
    .flat()
    .map((article) =>
      createTechNewsItem({
        id: `devto-${article.id}`,
        now,
        publishedAt: article.published_timestamp ?? now.toISOString(),
        publishedAtReliable: Boolean(article.published_timestamp),
        rawScore: Array.isArray(article.tag_list) ? article.tag_list.length : 5,
        source: "Dev.to",
        summary: cleanSummary(article.description),
        title: article.title,
        url: article.url,
      }),
    )
    .filter((item): item is TechNewsItem => item !== null);
}

async function fetchGitHubItems(fetchImpl: typeof fetch, now: Date, searchQueries: string[]) {
  const recentDate = new Date(now.getTime() - recentWindowInDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const queries = searchQueries.length > 0 ? searchQueries.slice(0, 8) : getGitHubSearchQueries();

  const searchResponses = await Promise.all(
    queries.map((query) =>
      fetchJson<GitHubSearchResponse>(
        `${gitHubBaseUrl}/search/repositories?q=${encodeURIComponent(
          `${query} pushed:>=${recentDate} archived:false is:public`,
        )}&sort=stars&order=desc&per_page=5`,
        {
          headers: {
            Accept: "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
          },
        },
        fetchImpl,
      ),
    ),
  );

  return searchResponses
    .flatMap((response) => response.items ?? [])
    .map((repository) =>
      createTechNewsItem({
        id: `github-${repository.id}`,
        now,
        publishedAt: repository.pushed_at ?? now.toISOString(),
        publishedAtReliable: Boolean(repository.pushed_at),
        rawScore: repository.stargazers_count ?? 0,
        source: "GitHub",
        summary: cleanSummary(repository.description ?? repository.topics?.join(", ")),
        title: repository.full_name,
        url: repository.html_url,
      }),
    )
    .filter((item): item is TechNewsItem => item !== null);
}

async function fetchTechnologyFeedItems(fetchImpl: typeof fetch, now: Date) {
  const feedResults = await Promise.allSettled(
    technologyFeeds.map(async (feed) => {
      const xml = await fetchText(feed.url, fetchImpl);
      const blocks = splitXmlBlocks(xml, "item");
      const atomBlocks = blocks.length > 0 ? [] : splitXmlBlocks(xml, "entry");

      return [...blocks, ...atomBlocks].slice(0, 10).map((block, index) => {
        const title = extractXmlTagValue(block, "title") ?? "Sem título";
        const url = extractAtomLink(block) ?? feed.url;
        const publishedAt =
          extractXmlTagValue(block, "pubDate") ??
          extractXmlTagValue(block, "published") ??
          extractXmlTagValue(block, "updated") ??
          "";
        const summary =
          extractXmlTagValue(block, "description") ??
          extractXmlTagValue(block, "summary") ??
          extractXmlTagValue(block, "content:encoded") ??
          "";

        return createTechNewsItem({
          id: `feed-${feed.source}-${index}-${url}`,
          now,
          publishedAt: normalizePublishedAt(publishedAt, now),
          publishedAtReliable: Boolean(publishedAt),
          rawScore: 25 - index,
          source: feed.source,
          summary,
          title,
          url,
        });
      });
    }),
  );

  return feedResults
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item): item is TechNewsItem => item !== null);
}

function buildGoogleNewsSearchUrl(query: string, recentOnly: boolean) {
  const effectiveQuery = recentOnly ? `${query} when:7d` : query;
  const params = new URLSearchParams({
    ceid: "BR:pt-419",
    gl: "BR",
    hl: "pt-BR",
    q: effectiveQuery,
  });

  return `${googleNewsSearchBaseUrl}?${params.toString()}`;
}

async function fetchSearchFeedItems({
  fetchImpl,
  now,
  queries,
  recentOnly,
}: {
  fetchImpl: typeof fetch;
  now: Date;
  queries: string[];
  recentOnly: boolean;
}) {
  const searchResults = await Promise.allSettled(
    queries.map(async (query) => {
      const xml = await fetchText(buildGoogleNewsSearchUrl(query, recentOnly), fetchImpl);
      const blocks = splitXmlBlocks(xml, "item");
      const fallbackCategory = isInsuranceRelated(query) ? "Seguros" : getPrimaryTopicCategory([]);

      return blocks.slice(0, 8).map((block, index) => {
        const title = extractXmlTagValue(block, "title") ?? "Sem título";
        const url = extractAtomLink(block) ?? buildGoogleNewsSearchUrl(query, recentOnly);
        const publishedAt = extractXmlTagValue(block, "pubDate") ?? "";
        const summary = extractXmlTagValue(block, "description") ?? "";
        const source = extractSourceName(block) ?? "Google News";

        return createTechNewsItem({
          fallbackCategory,
          id: `search-${normalizeText(query)}-${index}-${url}`,
          now,
          publishedAt: normalizePublishedAt(publishedAt, now),
          publishedAtReliable: Boolean(publishedAt),
          rawScore: 40 - index,
          source,
          summary,
          title,
          url,
        });
      });
    }),
  );

  return searchResults
    .flatMap((result) => (result.status === "fulfilled" ? result.value : []))
    .filter((item): item is TechNewsItem => item !== null);
}

function dedupeTechNewsItems(items: TechNewsItem[]) {
  const seenKeys = new Set<string>();

  return items.filter((item) => {
    const dedupeKey = canonicalizeUrl(item.url) ?? `${item.source}:${item.url}`.toLowerCase();

    if (seenKeys.has(dedupeKey)) {
      return false;
    }

    seenKeys.add(dedupeKey);
    return true;
  });
}

function filterRecentItems(items: TechNewsItem[], now: Date, windowInDays: number, recentOnly: boolean) {
  const earliestTimestamp = now.getTime() - windowInDays * 24 * 60 * 60 * 1000;

  const datedItems = items.filter((item) => {
    if (!item.publishedAtReliable) {
      return false;
    }

    const timestamp = Date.parse(item.publishedAt);
    return !Number.isNaN(timestamp) && timestamp >= earliestTimestamp && timestamp <= now.getTime();
  });

  if (datedItems.length > 0) {
    return datedItems;
  }

  if (recentOnly) {
    console.warn(
      "[blog] Nenhuma fonte datada foi encontrada para pedido recente; usando fontes sem data confiável como fallback.",
    );
    return items.filter((item) => !item.publishedAtReliable);
  }

  return items.filter((item) => {
    const timestamp = Date.parse(item.publishedAt);
    return Number.isNaN(timestamp) || timestamp >= earliestTimestamp;
  });
}

export async function fetchTechNews(options: FetchTechNewsOptions = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? new Date();
  const recentOnly = options.recentOnly ?? isRecentContentRequest(options.userPrompt);
  const searchQueries = buildNewsSearchQueries(options.userPrompt);
  const sourceResults = await Promise.allSettled([
    fetchSearchFeedItems({
      fetchImpl,
      now,
      queries: searchQueries,
      recentOnly,
    }),
    fetchHackerNewsItems(fetchImpl, now),
    fetchDevToItems(fetchImpl, now),
    fetchGitHubItems(fetchImpl, now, options.userPrompt ? searchQueries : []),
    fetchTechnologyFeedItems(fetchImpl, now),
  ]);

  const successfulResults: TechNewsItem[] = [];

  for (const result of sourceResults) {
    if (result.status === "fulfilled") {
      successfulResults.push(...result.value);
    }
  }

  const rankedItems = dedupeTechNewsItems(
    filterRecentItems(
      successfulResults,
      now,
      recentOnly ? requestedRecentWindowInDays : recentWindowInDays,
      recentOnly,
    ),
  )
    .sort((left, right) => {
      const leftTimestamp = Date.parse(left.publishedAt);
      const rightTimestamp = Date.parse(right.publishedAt);

      if (!Number.isNaN(leftTimestamp) && !Number.isNaN(rightTimestamp)) {
        return rightTimestamp - leftTimestamp || right.score - left.score;
      }

      return right.score - left.score || left.title.localeCompare(right.title);
    })
    .slice(0, 20);

  if (rankedItems.length === 0) {
    const failureMessages = sourceResults
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map((result) => result.reason instanceof Error ? result.reason.message : "erro desconhecido");

    throw new BlogGeneratorError(
      failureMessages.length > 0
        ? `Nenhuma notícia relevante foi encontrada. Fontes consultadas retornaram erro: ${failureMessages.join(" | ")}`
        : "Nenhuma notícia relevante foi encontrada nas fontes configuradas.",
    );
  }

  return rankedItems.map((item) => ({
    ...item,
    categoryMatches: item.categoryMatches.length > 0 ? item.categoryMatches : [getPrimaryTopicCategory([])],
  }));
}
