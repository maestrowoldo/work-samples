import path from "node:path";
import { promises as fs } from "node:fs";
import type { BlogHeroImage } from "../types";
import { slugifyBlogTitle } from "./saveBlogPost";

type ImageEnvironment = Partial<Record<string, string | undefined>>;

interface CloudflareImageResponse {
  errors?: Array<{ message?: string }>;
  result?: {
    image?: string;
  };
  success?: boolean;
}

export const defaultGeneratedBlogImageDirectory = path.join(
  process.cwd(),
  "public",
  "blog",
  "generated",
);

function getImageProvider(environment: ImageEnvironment) {
  return environment.BLOG_IMAGE_PROVIDER?.trim().toLowerCase();
}

function resolveCloudflareConfiguration(environment: ImageEnvironment) {
  const accountId = environment.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiToken = environment.CLOUDFLARE_API_TOKEN?.trim();

  if (!accountId || !apiToken) {
    return undefined;
  }

  return {
    accountId,
    apiToken,
    model:
      environment.BLOG_IMAGE_MODEL?.trim() ||
      "@cf/black-forest-labs/flux-1-schnell",
    steps: Math.max(
      1,
      Math.min(Number.parseInt(environment.BLOG_IMAGE_STEPS ?? "3", 10) || 3, 8),
    ),
  };
}

function sanitizePromptText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizePromptText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function buildTechnicalSubjectBrief({
  category,
  description,
  tags,
  title,
}: {
  category: string;
  description: string;
  tags: string[];
  title: string;
}) {
  const fingerprint = normalizePromptText(
    `${title} ${description} ${category} ${tags.join(" ")}`,
  );

  if (/(kubernetes|container|conteiner|orchestrat|devops|cluster)/.test(fingerprint)) {
    return "Show a premium cloud operations workspace: elegant server racks, container orchestration nodes, deployment pipeline lines, abstract monitoring panels, and a clean engineer workstation. Use recognizable infrastructure concepts without logos or readable UI text.";
  }

  if (/(pdf|document|documento|file|arquivo)/.test(fingerprint)) {
    return "Show a premium document software workflow: a refined workstation, layered digital document sheets, subtle annotation shapes, secure file processing elements, and clean productivity interface blocks with no readable text or brand marks.";
  }

  if (/(serverless|cloud|edge|lambda|infraestrutura|infrastructure)/.test(fingerprint)) {
    return "Show a premium cloud architecture scene: distributed server nodes, API gateways, thin data streams, edge computing modules, and AI processing chips inside a clean technical environment.";
  }

  if (/(ia|ai|artificial intelligence|machine learning|llm|agent|agente)/.test(fingerprint)) {
    return "Show a premium AI engineering workspace: subtle neural network topology, model monitoring panels, data pipeline lines, GPU server elements, and a software workstation in a modern lab or data center.";
  }

  if (/(data|dados|analytics|dashboard|metric|bi|observability|observabilidade)/.test(fingerprint)) {
    return "Show a premium data analysis workspace: abstract dashboards, refined chart shapes, database nodes, observability signals, and a focused analytics workstation with no readable labels.";
  }

  if (/(open source|github|developer|software|web|typescript|react|programa|code)/.test(fingerprint)) {
    return "Show a premium software engineering workspace: code editor shapes without readable code, repository graph lines, terminal-like panels, package modules, and elegant developer workstation lighting.";
  }

  return "Show a premium practical software technology workspace with computers, infrastructure diagram shapes, abstract dashboards, data flows, and engineering tools.";
}

function buildCloudflareImagePrompt({
  category,
  description,
  tags,
  title,
  whyItMatters,
}: {
  category: string;
  description: string;
  tags: string[];
  title: string;
  whyItMatters: string;
}) {
  const subjectBrief = buildTechnicalSubjectBrief({
    category,
    description,
    tags,
    title,
  });
  const topicText = [
    `Title: ${title}`,
    `Category: ${category}`,
    `Summary: ${description}`,
    `Why it matters: ${whyItMatters}`,
    `Tags: ${tags.slice(0, 6).join(", ")}`,
  ]
    .map(sanitizePromptText)
    .filter(Boolean)
    .join(". ");

  return [
    "Create a premium editorial wide horizontal technical image for a professional technology blog article.",
    subjectBrief,
    topicText,
    "Visual style: high-end SaaS editorial photography mixed with subtle 3D technical elements, premium product-marketing quality, polished but believable, clean composition, sharp focal point, restrained depth of field.",
    "Use a sophisticated palette with graphite, white, emerald, cyan, and warm neutral accents; avoid neon cyberpunk, plastic-looking renders, clutter, and cheap stock-photo style.",
    "The scene must clearly look like technology, software, cloud infrastructure, documents, data, or AI engineering depending on the article topic.",
    "The entire scene must be indoors in a modern office, data center, server room, lab, or software engineering workstation.",
    "Keep the composition simple and lightweight: fewer objects, clean background, large negative space, no noisy textures, no dense particle effects, no excessive reflections.",
    "Do not show mountains, hills, valleys, forests, beaches, sunsets, open sky, outdoor landscapes, nature scenery, travel scenery, people hiking, or generic wallpaper backgrounds.",
    "No visible words, no readable letters, no logos, no brand marks, no watermarks, no fake app names, no UI screenshots with readable text.",
    "Use realistic studio lighting, crisp technical details, professional color contrast, and a polished composition suitable for a blog hero image.",
  ].join(" ");
}

function getCloudflareErrorMessage(payload: CloudflareImageResponse, fallback: string) {
  return payload.errors?.map((error) => error.message).filter(Boolean).join("; ") || fallback;
}

async function writeGeneratedImage({
  base64Image,
  outputDirectory,
  slug,
}: {
  base64Image: string;
  outputDirectory: string;
  slug: string;
}) {
  const normalizedSlug = slugifyBlogTitle(slug) || `blog-image-${Date.now()}`;
  const fileName = `${normalizedSlug}.jpg`;
  const absoluteFilePath = path.join(outputDirectory, fileName);

  await fs.mkdir(outputDirectory, { recursive: true });
  await fs.writeFile(absoluteFilePath, Buffer.from(base64Image, "base64"));

  return `/blog/generated/${fileName}`;
}

export async function generateBlogHeroImage({
  category,
  description,
  environment = process.env,
  fetchImpl = fetch,
  outputDirectory = defaultGeneratedBlogImageDirectory,
  slug,
  tags,
  title,
  whyItMatters,
}: {
  category: string;
  description: string;
  environment?: ImageEnvironment;
  fetchImpl?: typeof fetch;
  outputDirectory?: string;
  slug: string;
  tags: string[];
  title: string;
  whyItMatters: string;
}): Promise<BlogHeroImage | undefined> {
  if (getImageProvider(environment) !== "cloudflare") {
    return undefined;
  }

  const configuration = resolveCloudflareConfiguration(environment);

  if (!configuration) {
    console.warn(
      "[blog] Cloudflare image provider configurado, mas CLOUDFLARE_ACCOUNT_ID ou CLOUDFLARE_API_TOKEN está ausente.",
    );
    return undefined;
  }

  try {
    const endpoint = `https://api.cloudflare.com/client/v4/accounts/${configuration.accountId}/ai/run/${configuration.model}`;
    const response = await fetchImpl(endpoint, {
      body: JSON.stringify({
        prompt: buildCloudflareImagePrompt({
          category,
          description,
          tags,
          title,
          whyItMatters,
        }),
        steps: configuration.steps,
      }),
      headers: {
        Authorization: `Bearer ${configuration.apiToken}`,
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    const payload = (await response.json()) as CloudflareImageResponse;

    if (!response.ok || payload.success === false) {
      console.warn(
        `[blog] Cloudflare não gerou imagem: ${getCloudflareErrorMessage(
          payload,
          `${response.status} ${response.statusText}`,
        )}`,
      );
      return undefined;
    }

    const base64Image = payload.result?.image;

    if (!base64Image) {
      console.warn("[blog] Cloudflare retornou resposta sem imagem.");
      return undefined;
    }

    const src = await writeGeneratedImage({
      base64Image,
      outputDirectory,
      slug,
    });

    return {
      alt: `Imagem editorial gerada para o artigo: ${title}`,
      source: "Cloudflare Workers AI",
      src,
    };
  } catch (error) {
    console.warn(
      `[blog] Falha ao gerar imagem no Cloudflare: ${
        error instanceof Error ? error.message : "erro desconhecido"
      }`,
    );
    return undefined;
  }
}
