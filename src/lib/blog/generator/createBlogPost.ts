import { getBlogPosts } from "../content.server";
import { generatedBlogLocale } from "../constants";
import type { BlogHeroImage, BlogPostContent, SavedBlogPostResult } from "../types";
import { canonicalizeUrl } from "./deduplication";
import { BlogGeneratorError } from "./errors";
import { fetchTechNews, isRecentContentRequest } from "./fetchTechNews";
import { generateBlogPost } from "./generateBlogPost";
import { saveBlogPost } from "./saveBlogPost";
import { selectTopicCandidates } from "./selectBestTopic";

interface BlogGenerationAttempt {
  reason: string;
  sourceUrl: string;
  title: string;
}

export interface CreateGeneratedBlogPostResult {
  attempts?: BlogGenerationAttempt[];
  created: boolean;
  image?: BlogHeroImage;
  post?: BlogPostContent;
  reason?: string;
  savedPost?: SavedBlogPostResult;
}

export async function createGeneratedBlogPost({
  environment,
  fetchImpl,
  maxAttempts = 4,
  now,
  userPrompt,
}: {
  environment?: Partial<Record<string, string | undefined>>;
  fetchImpl?: typeof fetch;
  maxAttempts?: number;
  now?: Date;
  userPrompt?: string;
} = {}): Promise<CreateGeneratedBlogPostResult> {
  try {
    const boundedMaxAttempts = Math.max(1, Math.min(10, maxAttempts));
    const recentOnly = isRecentContentRequest(userPrompt);
    const newsItems = await fetchTechNews({
      fetchImpl,
      now,
      recentOnly,
      userPrompt,
    });
    const existingPosts = await getBlogPosts(generatedBlogLocale);
    const usedSourceUrls = new Set(
      existingPosts
        .flatMap((post) => [
          post.sourceUrl,
          ...(post.sourceUrls ?? []),
          ...(post.sourceLinks ?? []).map((sourceLink) => sourceLink.url),
        ])
        .map(canonicalizeUrl)
        .filter((sourceUrl): sourceUrl is string => Boolean(sourceUrl)),
    );
    const freshNewsItems = newsItems.filter(
      (item) => !usedSourceUrls.has(canonicalizeUrl(item.url) ?? item.url),
    );
    const attempts: BlogGenerationAttempt[] = [];

    if (freshNewsItems.length === 0) {
      return {
        attempts,
        created: false,
        reason:
          "Nenhuma fonte nova foi encontrada. Todas as fontes candidatas já parecem ter sido publicadas.",
      };
    }

    const candidates = selectTopicCandidates(freshNewsItems, Math.max(boundedMaxAttempts * 2, 8));

    if (candidates.length === 0) {
      return {
        attempts,
        created: false,
        reason:
          "Nenhuma fonte nova foi encontrada. Todas as fontes candidatas já parecem ter sido publicadas.",
      };
    }

    for (const selectedTopic of candidates.slice(0, boundedMaxAttempts)) {
      try {
        const generatedPost = await generateBlogPost(selectedTopic, {
          environment,
          existingPosts,
          fetchImpl,
          isRecentRequest: recentOnly,
          now,
          userPrompt,
        });
        const savedPost = await saveBlogPost(generatedPost);

        return {
          attempts,
          created: true,
          image: savedPost.post.heroImage,
          post: savedPost.post,
          savedPost,
        };
      } catch (error) {
        if (!(error instanceof BlogGeneratorError)) {
          throw error;
        }

        attempts.push({
          reason: error.message,
          sourceUrl: selectedTopic.lead.url,
          title: selectedTopic.lead.title,
        });
        console.warn(
          `[blog] Tentativa reprovada para "${selectedTopic.lead.title}": ${error.message}`,
        );

        if (error.isFatal) {
          return {
            attempts,
            created: false,
            reason: error.message,
          };
        }
      }
    }

    return {
      attempts,
      created: false,
      reason:
        attempts.at(-1)?.reason ??
        "Nenhum tema candidato passou pelas validações de publicação.",
    };
  } catch (error) {
    if (error instanceof BlogGeneratorError) {
      return {
        created: false,
        reason: error.message,
      };
    }

    throw error;
  }
}
