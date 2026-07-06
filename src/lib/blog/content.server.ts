import path from "node:path";
import { promises as fs } from "node:fs";
import type { Locale } from "../i18n";
import { getDictionary } from "../site-content";
import { blogContentRoot, generatedBlogLocale } from "./constants";
import { normalizeSourceLinks, parseMarkdownWithFrontmatter } from "./markdown";
import type { BlogPostContent } from "./types";
export { blogContentRoot, generatedBlogLocale } from "./constants";

function normalizeBlogPost(post: BlogPostContent, origin: BlogPostContent["origin"]) {
  return {
    ...post,
    origin,
    sourceLinks: normalizeSourceLinks(post.sourceLinks),
  } satisfies BlogPostContent;
}

function sortBlogPosts(posts: BlogPostContent[]) {
  return [...posts].sort((left, right) => {
    const leftTimestamp = Date.parse(left.date);
    const rightTimestamp = Date.parse(right.date);

    if (Number.isNaN(leftTimestamp) || Number.isNaN(rightTimestamp)) {
      return left.slug.localeCompare(right.slug);
    }

    return rightTimestamp - leftTimestamp || left.slug.localeCompare(right.slug);
  });
}

function dedupeBlogPosts(posts: BlogPostContent[]) {
  const uniquePosts = new Map<string, BlogPostContent>();

  for (const post of posts) {
    if (!uniquePosts.has(post.slug)) {
      uniquePosts.set(post.slug, post);
    }
  }

  return [...uniquePosts.values()];
}

function getStaticBlogPosts(locale: Locale) {
  return getDictionary(locale).blog.posts.map((post) =>
    normalizeBlogPost(post, "static"),
  );
}

export async function loadGeneratedBlogPostsFromDirectory(
  rootDirectory: string,
  locale: Locale,
) {
  if (locale !== generatedBlogLocale) {
    return [];
  }

  const localeDirectory = path.join(rootDirectory, locale);

  let fileNames: string[];

  try {
    fileNames = await fs.readdir(localeDirectory);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  const markdownFileNames = fileNames.filter((fileName) => fileName.endsWith(".md"));
  const loadedPosts = await Promise.all(
    markdownFileNames.map(async (fileName) => {
      const absoluteFilePath = path.join(localeDirectory, fileName);

      try {
        const rawDocument = await fs.readFile(absoluteFilePath, "utf8");
        const { content, frontmatter } = parseMarkdownWithFrontmatter(rawDocument);

        return normalizeBlogPost(
          {
            author: frontmatter.author,
            category: frontmatter.category,
            content,
            date: frontmatter.date,
            description: frontmatter.description,
            readTime: frontmatter.readTime,
            slug: frontmatter.slug,
            sourceLinks: frontmatter.sourceLinks,
            tags: frontmatter.tags,
            title: frontmatter.title,
          },
          "generated",
        );
      } catch (error) {
        console.warn(
          `[blog] Ignorando post gerado inválido em ${absoluteFilePath}: ${
            error instanceof Error ? error.message : "erro desconhecido"
          }`,
        );
        return null;
      }
    }),
  );

  return loadedPosts.filter(
    (
      post,
    ): post is NonNullable<(typeof loadedPosts)[number]> => post !== null,
  );
}

export async function getBlogPosts(locale: Locale) {
  const staticPosts = getStaticBlogPosts(locale);
  const generatedPosts = await loadGeneratedBlogPostsFromDirectory(blogContentRoot, locale);

  return sortBlogPosts(dedupeBlogPosts([...generatedPosts, ...staticPosts]));
}

export async function getBlogPost(locale: Locale, slug: string) {
  const posts = await getBlogPosts(locale);
  return posts.find((post) => post.slug === slug);
}

export async function getStaticBlogParams() {
  const localizedParams = await Promise.all(
    (["pt", "en", "fr"] as const).map(async (locale) => {
      const posts = await getBlogPosts(locale);
      return posts.map((post) => ({
        locale,
        slug: post.slug,
      }));
    }),
  );

  return localizedParams.flat();
}
