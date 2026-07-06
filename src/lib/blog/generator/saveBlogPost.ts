import path from "node:path";
import { promises as fs } from "node:fs";
import { getDictionary } from "../../site-content";
import { generatedBlogLocale } from "../constants";
import { serializeMarkdownWithFrontmatter } from "../markdown";
import type { BlogPostContent, GeneratedBlogPostDraft, SavedBlogPostResult } from "../types";

export const generatedBlogOutputDirectory = path.join(
  process.cwd(),
  "src",
  "content",
  "blog",
  generatedBlogLocale,
);

export function slugifyBlogTitle(title: string) {
  const normalizedTitle = title
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  return normalizedTitle
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function ensureUniqueSlug(baseSlug: string, existingSlugs: Iterable<string>) {
  const normalizedExistingSlugs = new Set([...existingSlugs].map((slug) => slug.toLowerCase()));
  const normalizedBaseSlug = baseSlug || `post-${new Date().toISOString().slice(0, 10)}`;

  if (!normalizedExistingSlugs.has(normalizedBaseSlug.toLowerCase())) {
    return normalizedBaseSlug;
  }

  let index = 2;

  while (normalizedExistingSlugs.has(`${normalizedBaseSlug}-${index}`.toLowerCase())) {
    index += 1;
  }

  return `${normalizedBaseSlug}-${index}`;
}

async function listGeneratedSlugs(directory: string) {
  try {
    const fileNames = await fs.readdir(directory);
    return fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => fileName.replace(/\.md$/i, ""));
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

function getStaticSlugs() {
  return getDictionary(generatedBlogLocale).blog.posts.map((post) => post.slug);
}

export async function saveBlogPost(
  generatedPost: GeneratedBlogPostDraft,
  options: {
    author?: string;
    existingSlugs?: Iterable<string>;
    outputDirectory?: string;
  } = {},
): Promise<SavedBlogPostResult> {
  const outputDirectory = options.outputDirectory ?? generatedBlogOutputDirectory;
  const existingSlugs = options.existingSlugs
    ? new Set(options.existingSlugs)
    : new Set([...getStaticSlugs(), ...(await listGeneratedSlugs(outputDirectory))]);
  const slug = ensureUniqueSlug(slugifyBlogTitle(generatedPost.title), existingSlugs);

  await fs.mkdir(outputDirectory, { recursive: true });

  const post: BlogPostContent = {
    author: options.author ?? "Wolkendo Arias",
    category: generatedPost.category,
    content: generatedPost.content,
    date: generatedPost.date,
    description: generatedPost.description,
    origin: "generated",
    readTime: generatedPost.readTime,
    slug,
    sourceLinks: generatedPost.sourceLinks,
    tags: generatedPost.tags,
    title: generatedPost.title,
  };
  const filePath = path.join(outputDirectory, `${slug}.md`);

  await fs.writeFile(
    filePath,
    serializeMarkdownWithFrontmatter({
      content: post.content,
      frontmatter: {
        author: post.author,
        category: post.category,
        date: post.date,
        description: post.description,
        readTime: post.readTime,
        slug: post.slug,
        sourceLinks: post.sourceLinks ?? [],
        tags: post.tags,
        title: post.title,
      },
    }),
    "utf8",
  );

  return {
    filePath,
    post,
  };
}
