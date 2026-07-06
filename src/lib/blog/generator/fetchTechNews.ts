import { BlogGeneratorError } from "./errors";
import { extractTopicKeywords, getDevToTags, getGitHubSearchQueries, getPrimaryTopicCategory, matchTopicCategories } from "../topics";
import type { TechNewsItem } from "../types";

interface FetchTechNewsOptions {
  fetchImpl?: typeof fetch;
  now?: Date;
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
const recentWindowInDays = 21;

function buildFallbackUrlForHackerNews(id: number) {
  return `https://news.ycombinator.com/item?id=${id}`;
}

function cleanSummary(summary: string | undefined) {
  return (summary ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
  id,
  publishedAt,
  rawScore,
  source,
  summary,
  title,
  url,
  now,
}: {
  id: string;
  now: Date;
  publishedAt: string;
  rawScore: number;
  source: string;
  summary: string;
  title: string;
  url: string;
}): TechNewsItem | null {
  const categoryMatches = matchTopicCategories(`${title} ${summary} ${url}`);

  if (categoryMatches.length === 0) {
    return null;
  }

  const itemWithoutScore = {
    categoryMatches,
    id,
    publishedAt,
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
        rawScore: Array.isArray(article.tag_list) ? article.tag_list.length : 5,
        source: "Dev.to",
        summary: cleanSummary(article.description),
        title: article.title,
        url: article.url,
      }),
    )
    .filter((item): item is TechNewsItem => item !== null);
}

async function fetchGitHubItems(fetchImpl: typeof fetch, now: Date) {
  const recentDate = new Date(now.getTime() - recentWindowInDays * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const searchResponses = await Promise.all(
    getGitHubSearchQueries().map((query) =>
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
        rawScore: repository.stargazers_count ?? 0,
        source: "GitHub",
        summary: cleanSummary(repository.description ?? repository.topics?.join(", ")),
        title: repository.full_name,
        url: repository.html_url,
      }),
    )
    .filter((item): item is TechNewsItem => item !== null);
}

function dedupeTechNewsItems(items: TechNewsItem[]) {
  const seenKeys = new Set<string>();

  return items.filter((item) => {
    const dedupeKey = `${item.source}:${item.url}`.toLowerCase();

    if (seenKeys.has(dedupeKey)) {
      return false;
    }

    seenKeys.add(dedupeKey);
    return true;
  });
}

function filterRecentItems(items: TechNewsItem[], now: Date) {
  const earliestTimestamp = now.getTime() - recentWindowInDays * 24 * 60 * 60 * 1000;

  return items.filter((item) => {
    const timestamp = Date.parse(item.publishedAt);
    return Number.isNaN(timestamp) || timestamp >= earliestTimestamp;
  });
}

export async function fetchTechNews(options: FetchTechNewsOptions = {}) {
  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? new Date();
  const sourceResults = await Promise.allSettled([
    fetchHackerNewsItems(fetchImpl, now),
    fetchDevToItems(fetchImpl, now),
    fetchGitHubItems(fetchImpl, now),
  ]);

  const successfulResults: TechNewsItem[] = [];

  for (const result of sourceResults) {
    if (result.status === "fulfilled") {
      successfulResults.push(...result.value);
    }
  }

  const rankedItems = dedupeTechNewsItems(filterRecentItems(successfulResults, now)).sort(
    (left, right) => right.score - left.score || left.title.localeCompare(right.title),
  );

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
