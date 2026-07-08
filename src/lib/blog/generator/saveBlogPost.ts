import path from "node:path";
import { promises as fs } from "node:fs";
import { getDictionary } from "../../site-content";
import { generatedBlogLocale } from "../constants";
import { parseMarkdownWithFrontmatter, serializeMarkdownWithFrontmatter } from "../markdown";
import type { BlogPostContent, GeneratedBlogPostDraft, SavedBlogPostResult } from "../types";
import { canonicalizeUrl, sha256, tokenSimilarity } from "./deduplication";
import { BlogGeneratorError } from "./errors";

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

async function listGeneratedPosts(directory: string) {
  try {
    const fileNames = await fs.readdir(directory);
    const markdownFileNames = fileNames.filter((fileName) => fileName.endsWith(".md"));
    const posts = await Promise.all(
      markdownFileNames.map(async (fileName): Promise<BlogPostContent | null> => {
        try {
          const rawDocument = await fs.readFile(path.join(directory, fileName), "utf8");
          const { content, frontmatter } = parseMarkdownWithFrontmatter(rawDocument);

          const post: BlogPostContent = {
            author: frontmatter.author,
            category: frontmatter.category,
            content,
            contentHash: frontmatter.contentHash,
            date: frontmatter.date,
            description: frontmatter.description,
            heroImage: frontmatter.heroImage,
            imageCredit: frontmatter.imageCredit,
            imageDescriptionUrl: frontmatter.imageDescriptionUrl,
            imageLicense: frontmatter.imageLicense,
            imageLicenseUrl: frontmatter.imageLicenseUrl,
            imageOriginalUrl: frontmatter.imageOriginalUrl,
            keyTakeaways: frontmatter.keyTakeaways,
            origin: "generated",
            publishedAtReference: frontmatter.publishedAtReference,
            readTime: frontmatter.readTime,
            slug: frontmatter.slug,
            sourceLinks: frontmatter.sourceLinks,
            sourceUrl: frontmatter.sourceUrl,
            sourceUrls: frontmatter.sourceUrls,
            tags: frontmatter.tags,
            title: frontmatter.title,
            whyItMatters: frontmatter.whyItMatters,
          };

          return post;
        } catch {
          return null;
        }
      }),
    );

    return posts.filter((post): post is BlogPostContent => post !== null);
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

function getStaticPosts() {
  return getDictionary(generatedBlogLocale).blog.posts;
}

function getPostSourceUrls(post: Pick<BlogPostContent, "sourceLinks" | "sourceUrl" | "sourceUrls">) {
  return [
    post.sourceUrl,
    ...(post.sourceUrls ?? []),
    ...(post.sourceLinks ?? []).map((sourceLink) => sourceLink.url),
  ]
    .map(canonicalizeUrl)
    .filter((sourceUrl): sourceUrl is string => Boolean(sourceUrl));
}

function getDuplicateCheckText(
  post: Pick<BlogPostContent, "content" | "description" | "title">,
) {
  return `${post.title}\n${post.description}\n${post.content}`;
}

function assertPostIsUnique({
  candidate,
  existingPosts,
}: {
  candidate: BlogPostContent;
  existingPosts: BlogPostContent[];
}) {
  const candidateSourceUrls = new Set(getPostSourceUrls(candidate));
  const candidateHash = candidate.contentHash ?? sha256(getDuplicateCheckText(candidate));
  const existingSlug = existingPosts.find(
    (post) => post.slug.toLowerCase() === candidate.slug.toLowerCase(),
  );

  if (existingSlug) {
    throw new BlogGeneratorError(`Post duplicado: já existe um blog com slug "${candidate.slug}".`);
  }

  const existingSource = existingPosts.find((post) =>
    getPostSourceUrls(post).some((sourceUrl) => candidateSourceUrls.has(sourceUrl)),
  );

  if (existingSource) {
    throw new BlogGeneratorError(
      `Post duplicado: a fonte principal já foi usada em "${existingSource.title}".`,
    );
  }

  const existingHash = existingPosts.find((post) => post.contentHash === candidateHash);

  if (existingHash) {
    throw new BlogGeneratorError(
      `Post duplicado: o hash de conteúdo já existe em "${existingHash.title}".`,
    );
  }

  const recentPosts = existingPosts.slice(0, 50);
  const candidateText = getDuplicateCheckText(candidate);
  const similarPost = recentPosts
    .map((post) => ({
      post,
      similarity: tokenSimilarity(candidateText, getDuplicateCheckText(post)),
    }))
    .find((item) => item.similarity >= 0.82);

  if (similarPost) {
    throw new BlogGeneratorError(
      `Post duplicado: similaridade ${(similarPost.similarity * 100).toFixed(0)}% com "${similarPost.post.title}".`,
    );
  }
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
  const generatedPosts = await listGeneratedPosts(outputDirectory);
  const existingPosts =
    options.existingSlugs
      ? [...getStaticPosts(), ...generatedPosts].filter((post) =>
          options.existingSlugs
            ? [...options.existingSlugs].some(
                (slug) => slug.toLowerCase() === post.slug.toLowerCase(),
              )
            : true,
        )
      : [...getStaticPosts(), ...generatedPosts];
  const existingSlugs = new Set([
    ...getStaticSlugs(),
    ...(options.existingSlugs ?? []),
    ...(await listGeneratedSlugs(outputDirectory)),
  ]);
  const slug = slugifyBlogTitle(generatedPost.slug ?? generatedPost.title);

  await fs.mkdir(outputDirectory, { recursive: true });

  const post: BlogPostContent = {
    author: options.author ?? "Wolkendo Arias",
    category: generatedPost.category,
    content: generatedPost.content,
    contentHash: generatedPost.contentHash ?? sha256(`${generatedPost.title}\n${generatedPost.description}\n${generatedPost.content}`),
    date: generatedPost.date,
    description: generatedPost.description,
    heroImage: generatedPost.heroImage,
    imageCredit: generatedPost.heroImage.credit,
    imageDescriptionUrl: generatedPost.heroImage.descriptionUrl,
    imageLicense: generatedPost.heroImage.license,
    imageLicenseUrl: generatedPost.heroImage.licenseUrl,
    imageOriginalUrl: generatedPost.heroImage.originalUrl,
    keyTakeaways: generatedPost.keyTakeaways,
    origin: "generated",
    publishedAtReference: generatedPost.publishedAtReference,
    readTime: generatedPost.readTime,
    slug,
    sourceUrl: generatedPost.sourceUrl,
    sourceUrls: generatedPost.sourceUrls,
    sourceLinks: generatedPost.sourceLinks,
    tags: generatedPost.tags,
    title: generatedPost.title,
    whyItMatters: generatedPost.whyItMatters,
  };

  assertPostIsUnique({
    candidate: post,
    existingPosts: [
      ...existingPosts,
      ...[...existingSlugs]
        .filter((existingSlug) => !existingPosts.some((item) => item.slug === existingSlug))
        .map((existingSlug) => ({
          author: "",
          content: "",
          date: "",
          description: "",
          readTime: 1,
          slug: existingSlug,
          tags: ["legacy"],
          title: existingSlug,
        })),
    ],
  });
  const filePath = path.join(outputDirectory, `${slug}.md`);

  await fs.writeFile(
    filePath,
    serializeMarkdownWithFrontmatter({
      content: post.content,
      frontmatter: {
        author: post.author,
        category: post.category,
        contentHash: post.contentHash,
        date: post.date,
        description: post.description,
        heroImage: post.heroImage,
        imageCredit: post.imageCredit,
        imageDescriptionUrl: post.imageDescriptionUrl,
        imageLicense: post.imageLicense,
        imageLicenseUrl: post.imageLicenseUrl,
        imageOriginalUrl: post.imageOriginalUrl,
        keyTakeaways: post.keyTakeaways,
        publishedAtReference: post.publishedAtReference,
        readTime: post.readTime,
        slug: post.slug,
        sourceUrl: post.sourceUrl,
        sourceUrls: post.sourceUrls,
        sourceLinks: post.sourceLinks ?? [],
        tags: post.tags,
        title: post.title,
        whyItMatters: post.whyItMatters,
      },
    }),
    "utf8",
  );

  return {
    filePath,
    post,
  };
}
