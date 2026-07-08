import path from "node:path";
import { promises as fs } from "node:fs";
import type { BlogHeroImage, BlogPostContent } from "../types";

type LocalImageEnvironment = Partial<Record<string, string | undefined>>;

interface LocalImageCandidate {
  alt: string;
  fileName: string;
  score: number;
  src: string;
}

const supportedImageExtensions = new Set([".avif", ".jpg", ".jpeg", ".png", ".webp"]);
const defaultBlogImageLibraryDirectory = path.join(process.cwd(), "public", "blog", "library");
const defaultBlogImageLibraryPublicPath = "/blog/library";
const stopWords = new Set([
  "a",
  "ai",
  "and",
  "blog",
  "com",
  "da",
  "de",
  "do",
  "e",
  "em",
  "for",
  "ia",
  "image",
  "img",
  "of",
  "para",
  "photo",
  "tech",
  "technology",
  "the",
]);

function normalizeComparableText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeComparableText(value)
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !stopWords.has(token));
}

function getUsedHeroImageUrls(existingPosts: BlogPostContent[]) {
  return new Set(
    existingPosts
      .map((post) => post.heroImage?.src)
      .filter((src): src is string => Boolean(src)),
  );
}

function getTopicAliases(token: string) {
  const aliases: Record<string, string[]> = {
    agent: ["agents", "agente"],
    agente: ["agent", "agents"],
    analytics: ["data", "dados", "dashboard", "bi"],
    cloud: ["serverless", "infra", "infrastructure", "devops"],
    code: ["coding", "developer", "software", "programming"],
    container: ["containers", "kubernetes", "docker", "cluster"],
    containers: ["container", "kubernetes", "docker", "cluster"],
    dashboard: ["analytics", "data", "dados", "bi"],
    dados: ["data", "analytics", "dashboard", "bi"],
    devops: ["cloud", "kubernetes", "containers", "infrastructure"],
    document: ["documents", "pdf", "file", "arquivo"],
    documents: ["document", "pdf", "file", "arquivo"],
    ia: ["ai", "artificial", "intelligence", "machine", "learning"],
    kubernetes: ["container", "containers", "cluster", "devops"],
    pdf: ["document", "documents", "file", "arquivo"],
    serverless: ["cloud", "api", "infra", "infrastructure"],
  };

  return aliases[token] ?? [];
}

function scoreCandidate(fileTokens: string[], articleTokens: string[], index: number) {
  const fileTokenSet = new Set(fileTokens);
  const articleTokenSet = new Set(articleTokens);
  let score = Math.max(0, 20 - index);

  for (const token of articleTokenSet) {
    if (fileTokenSet.has(token)) {
      score += 12;
      continue;
    }

    if (getTopicAliases(token).some((alias) => fileTokenSet.has(alias))) {
      score += 7;
    }
  }

  return score;
}

function buildImageAlt(fileName: string, title: string) {
  const normalizedName = path
    .basename(fileName, path.extname(fileName))
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalizedName
    ? `Imagem de tecnologia sobre ${normalizedName} para o artigo: ${title}`
    : `Imagem de tecnologia para o artigo: ${title}`;
}

export async function selectLocalBlogHeroImage({
  category,
  description,
  environment = process.env,
  existingPosts,
  tags,
  title,
}: {
  category: string;
  description: string;
  environment?: LocalImageEnvironment;
  existingPosts: BlogPostContent[];
  tags: string[];
  title: string;
}): Promise<BlogHeroImage | undefined> {
  const libraryDirectory =
    environment.BLOG_IMAGE_LIBRARY_DIR?.trim() || defaultBlogImageLibraryDirectory;
  const publicPath =
    environment.BLOG_IMAGE_LIBRARY_PUBLIC_PATH?.trim() || defaultBlogImageLibraryPublicPath;
  const articleTokens = tokenize(`${title} ${description} ${category} ${tags.join(" ")}`);
  const usedHeroImageUrls = getUsedHeroImageUrls(existingPosts);

  let fileNames: string[];

  try {
    fileNames = await fs.readdir(libraryDirectory);
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;

    if (nodeError.code === "ENOENT") {
      return undefined;
    }

    throw error;
  }

  const candidates = fileNames
    .filter((fileName) => supportedImageExtensions.has(path.extname(fileName).toLowerCase()))
    .map((fileName, index): LocalImageCandidate => {
      const src = `${publicPath.replace(/\/$/, "")}/${encodeURIComponent(fileName)}`;
      return {
        alt: buildImageAlt(fileName, title),
        fileName,
        score: scoreCandidate(tokenize(fileName), articleTokens, index),
        src,
      };
    })
    .filter((candidate) => !usedHeroImageUrls.has(candidate.src))
    .sort((left, right) => right.score - left.score || left.fileName.localeCompare(right.fileName));

  const bestCandidate = candidates[0];

  if (!bestCandidate) {
    return undefined;
  }

  return {
    alt: bestCandidate.alt,
    source: "Biblioteca local",
    src: bestCandidate.src,
  };
}
