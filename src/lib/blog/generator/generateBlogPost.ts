import { z } from "zod";
import { generateTextWithAi } from "./ai-provider";
import { canonicalizeUrl, sha256 } from "./deduplication";
import { BlogGeneratorError } from "./errors";
import { generateBlogHeroImage } from "./image-provider";
import { getWikimediaImage } from "./image-library";
import { selectLocalBlogHeroImage } from "./local-image-library";
import { enrichSourceLinksWithMedia } from "./source-media";
import { slugifyBlogTitle } from "./saveBlogPost";
import { stripInitialArticleHeading } from "../presentation";
import type { BlogHeroImage, BlogPostContent, BlogSourceLink, GeneratedBlogPostDraft, SelectedTopic } from "../types";

const generatedDraftSchema = z.object({
  content: z.string().min(600),
  duplicateRiskReason: z.string().default(""),
  imageQuery: z.string().min(3).max(120),
  keyTakeaways: z.array(z.string().min(20).max(180)).min(3).max(5),
  keywords: z.array(z.string().min(2)).min(3).max(8),
  publishedAtReference: z.string().min(1),
  shouldPublish: z.boolean(),
  slug: z.string().min(3).max(100),
  sourceUrls: z.array(z.string().url()).min(1),
  summary: z.string().min(40).max(220),
  title: z.string().min(12).max(120),
  whyItMatters: z.string().min(100).max(520),
});

const duplicateRiskSchema = z.object({
  duplicateRiskReason: z.string().min(1).optional(),
  shouldPublish: z.literal(false),
});

const fallbackHeroImages: Record<string, BlogHeroImage> = {
  ai: {
    alt: "Ilustração sobre inteligência artificial aplicada ao desenvolvimento de software",
    source: "Imagem local",
    src: "/ia.webp",
  },
  data: {
    alt: "Dashboard digital com dados e métricas para análise técnica",
    source: "Imagem local",
    src: "/BI.jpg",
  },
  web: {
    alt: "Ambiente de desenvolvimento web com código e interfaces modernas",
    source: "Imagem local",
    src: "/web_pro.jpg",
  },
  default: {
    alt: "Ambiente de tecnologia e desenvolvimento de software",
    source: "Imagem local",
    src: "/web_pro.jpg",
  },
};

const stopWords = new Set([
  "a",
  "as",
  "and",
  "ao",
  "com",
  "da",
  "de",
  "do",
  "dos",
  "e",
  "em",
  "for",
  "in",
  "na",
  "no",
  "o",
  "of",
  "os",
  "para",
  "the",
  "to",
  "um",
  "uma",
]);

const requiredSectionPatterns = [
  /##\s+o que (aconteceu|mudou)/i,
  /##\s+por que (isso )?importa/i,
  /##\s+impacto pr[aá]tico/i,
  /##\s+riscos? e pontos de aten[cç][aã]o/i,
  /##\s+pr[oó]ximos passos/i,
];

function estimateReadTime(content: string) {
  const wordCount = content
    .replace(/[#*-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(3, Math.ceil(wordCount / 220));
}

function extractJsonObject(rawText: string) {
  const normalized = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  const firstBraceIndex = normalized.indexOf("{");
  const lastBraceIndex = normalized.lastIndexOf("}");

  if (firstBraceIndex === -1 || lastBraceIndex === -1) {
    throw new BlogGeneratorError("A IA não retornou um JSON válido para o post.");
  }

  return normalized.slice(firstBraceIndex, lastBraceIndex + 1);
}

function truncateText(value: string, maxLength: number) {
  const normalizedValue = value.replace(/\s+/g, " ").trim();

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1).trim()}…`;
}

function escapeControlCharactersInsideJsonStrings(jsonText: string) {
  let escapedText = "";
  let isInsideString = false;
  let isEscaped = false;

  for (const character of jsonText) {
    if (isEscaped) {
      escapedText += character;
      isEscaped = false;
      continue;
    }

    if (character === "\\") {
      escapedText += character;
      isEscaped = true;
      continue;
    }

    if (character === "\"") {
      escapedText += character;
      isInsideString = !isInsideString;
      continue;
    }

    if (isInsideString) {
      if (character === "\n") {
        escapedText += "\\n";
        continue;
      }

      if (character === "\r") {
        continue;
      }

      if (character === "\t") {
        escapedText += "\\t";
        continue;
      }
    }

    escapedText += character;
  }

  return escapedText;
}

function parseAiJsonPayload(rawResponse: string) {
  const jsonText = extractJsonObject(rawResponse);

  try {
    return JSON.parse(jsonText) as unknown;
  } catch {
    return JSON.parse(escapeControlCharactersInsideJsonStrings(jsonText)) as unknown;
  }
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function extractMeaningfulTokens(values: string[]) {
  const tokens = new Set<string>();

  for (const value of values) {
    for (const token of normalizeSearchText(value).match(/[a-z0-9]{3,}/g) ?? []) {
      if (!stopWords.has(token)) {
        tokens.add(token);
      }
    }
  }

  return [...tokens];
}

function isSupportingSourceRelevant(topic: SelectedTopic, itemTitle: string, itemSummary: string, categoryMatches: string[]) {
  const leadCategory = topic.lead.categoryMatches[0];
  const sharesCategory = leadCategory ? categoryMatches.includes(leadCategory) : false;
  const leadTokens = extractMeaningfulTokens([topic.lead.title, topic.lead.summary, ...topic.keywords]);
  const candidateText = normalizeSearchText(`${itemTitle} ${itemSummary}`);
  const sharedTokenCount = leadTokens.filter((token) => candidateText.includes(token)).length;

  return sharesCategory || sharedTokenCount >= 2;
}

function mapSourceLinks(topic: SelectedTopic): BlogSourceLink[] {
  const seenUrls = new Set<string>();

  const relevantSources = [
    topic.lead,
    ...topic.supporting.filter((item) =>
      isSupportingSourceRelevant(topic, item.title, item.summary, item.categoryMatches),
    ),
  ];

  return relevantSources
    .filter((item) => {
      if (seenUrls.has(item.url)) {
        return false;
      }

      seenUrls.add(item.url);
      return true;
    })
    .slice(0, 5)
    .map((item) => ({
      source: item.source,
      title: item.title,
      url: item.url,
    }));
}

function getFallbackHeroImage(category: string, tags: string[], title: string): BlogHeroImage {
  const fingerprint = normalizeSearchText(`${category} ${tags.join(" ")} ${title}`);

  if (/(ia|ai|inteligencia artificial|machine learning|llm|agente|agent)/.test(fingerprint)) {
    return fallbackHeroImages.ai;
  }

  if (/(power bi|dados|analytics|dashboard|data)/.test(fingerprint)) {
    return fallbackHeroImages.data;
  }

  if (/(next\.js|react|typescript|web|frontend|programa|javascript)/.test(fingerprint)) {
    return fallbackHeroImages.web;
  }

  return fallbackHeroImages.default;
}

function scoreSourceImageRelevance(sourceLink: BlogSourceLink, relevanceTokens: string[], index: number, leadUrl: string) {
  const candidateText = normalizeSearchText(
    `${sourceLink.title} ${sourceLink.imageAlt ?? ""} ${sourceLink.source} ${
      sourceLink.siteName ?? ""
    }`,
  );
  const tokenMatches = relevanceTokens.filter((token) => candidateText.includes(token));
  const leadBonus = sourceLink.url === leadUrl ? 8 : 0;
  const positionBonus = Math.max(0, 4 - index);

  return tokenMatches.length + leadBonus + positionBonus;
}

function scoreWikimediaImageRelevance(
  image: Awaited<ReturnType<typeof getWikimediaImage>>,
  relevanceTokens: string[],
) {
  if (!image) {
    return 0;
  }

  const candidateText = normalizeSearchText(
    `${image.title ?? ""} ${image.description ?? ""} ${image.credit ?? ""}`,
  );
  const tokenMatches = relevanceTokens.filter((token) => candidateText.includes(token));
  const dimensionBonus = (image.width ?? 0) >= 1200 ? 3 : (image.width ?? 0) >= 900 ? 2 : 0;
  const editorialTechnologyBonus = /(technology|software|server|data center|dashboard|artificial intelligence|machine learning|cloud|cybersecurity|workstation|network)/.test(
    candidateText,
  )
    ? 2
    : 0;

  return tokenMatches.length + dimensionBonus + editorialTechnologyBonus;
}

function isPremiumTechnologyImage(image: Awaited<ReturnType<typeof getWikimediaImage>>) {
  if (!image) {
    return false;
  }

  const width = image.width ?? 0;
  const height = image.height ?? 0;
  const candidateText = normalizeSearchText(
    `${image.title ?? ""} ${image.description ?? ""} ${image.credit ?? ""}`,
  );

  return (
    width >= 1000 &&
    height >= 500 &&
    width > height &&
    /(technology|software|server|data center|dashboard|artificial intelligence|machine learning|cloud|cybersecurity|workstation|network)/.test(
      candidateText,
    ) &&
    !/(logo|icon|diagram|map|seal|symbol)/.test(candidateText)
  );
}

function getUsedHeroImageUrls(existingPosts: BlogPostContent[]) {
  return new Set(
    existingPosts
      .map((post) => post.heroImage?.src)
      .filter((src): src is string => Boolean(src)),
  );
}

async function selectHeroImage({
  existingPosts,
  fetchImpl,
  imageQuery,
  sourceLinks,
  tags,
  title,
  topic,
}: {
  existingPosts: BlogPostContent[];
  fetchImpl?: typeof fetch;
  imageQuery?: string;
  sourceLinks: BlogSourceLink[];
  tags: string[];
  title: string;
  topic: SelectedTopic;
}): Promise<BlogHeroImage> {
  const relevanceTokens = extractMeaningfulTokens([
    topic.category,
    topic.lead.title,
    topic.summary,
    title,
    ...topic.keywords,
    ...tags,
  ]);
  const usedHeroImageUrls = getUsedHeroImageUrls(existingPosts);

  const seenImageUrls = new Set<string>();
  const candidates = sourceLinks
    .filter((sourceLink) => {
      if (
        !sourceLink.imageUrl ||
        seenImageUrls.has(sourceLink.imageUrl) ||
        usedHeroImageUrls.has(sourceLink.imageUrl)
      ) {
        return false;
      }

      seenImageUrls.add(sourceLink.imageUrl);
      return true;
    })
    .map((sourceLink, index) => {
      return {
        score: scoreSourceImageRelevance(sourceLink, relevanceTokens, index, topic.lead.url),
        sourceLink,
      };
    })
    .sort((left, right) => right.score - left.score);

  const bestCandidate = candidates.find((candidate) => candidate.score >= 3);

  if (bestCandidate) {
    return {
      alt: bestCandidate.sourceLink.imageAlt ?? bestCandidate.sourceLink.title,
      source: bestCandidate.sourceLink.siteName ?? bestCandidate.sourceLink.source,
      sourceUrl: bestCandidate.sourceLink.url,
      src: bestCandidate.sourceLink.imageUrl!,
    };
  }

  const wikimediaImage = await getWikimediaImage(
    {
      keywords: [...topic.keywords, ...tags, topic.category],
      title: `${imageQuery || title} ${topic.category} ${tags.slice(0, 3).join(" ")}`,
    },
    fetchImpl,
  );

  if (
    wikimediaImage &&
    !usedHeroImageUrls.has(wikimediaImage.url) &&
    (scoreWikimediaImageRelevance(wikimediaImage, relevanceTokens) >= 3 ||
      isPremiumTechnologyImage(wikimediaImage))
  ) {
    return {
      alt: wikimediaImage.description || wikimediaImage.title || title,
      credit: wikimediaImage.credit,
      descriptionUrl: wikimediaImage.descriptionUrl,
      height: wikimediaImage.height,
      license: wikimediaImage.license,
      licenseUrl: wikimediaImage.licenseUrl,
      mime: wikimediaImage.mime,
      originalUrl: wikimediaImage.originalUrl,
      source: "Wikimedia Commons",
      sourceUrl: wikimediaImage.descriptionUrl,
      src: wikimediaImage.url,
      width: wikimediaImage.width,
    };
  }

  return getFallbackHeroImage(topic.category, tags, title);
}

function validateGeneratedPostDraft({
  content,
  heroImage,
  keyTakeaways,
  whyItMatters,
}: Pick<GeneratedBlogPostDraft, "content" | "heroImage" | "keyTakeaways" | "whyItMatters">) {
  const sectionCount = content
    .split("\n")
    .filter((line) => line.trim().startsWith("## ")).length;
  const wordCount = content
    .replace(/[#*`>-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  if (/^#\s+/m.test(content)) {
    throw new BlogGeneratorError("Post reprovado: use o título apenas no frontmatter, sem H1 no corpo.");
  }

  if (sectionCount < 3) {
    throw new BlogGeneratorError("Post reprovado: o artigo precisa ter pelo menos 3 seções H2.");
  }

  const missingRequiredSections = requiredSectionPatterns.filter((pattern) => !pattern.test(content));

  if (missingRequiredSections.length > 0) {
    throw new BlogGeneratorError(
      "Post reprovado: o artigo não seguiu a estrutura editorial obrigatória.",
    );
  }

  if (wordCount < 240) {
    throw new BlogGeneratorError("Post reprovado: o artigo ficou curto demais para publicação.");
  }

  if (/^##\s*(fontes|links|refer[eê]ncias)\b/im.test(content)) {
    throw new BlogGeneratorError(
      "Post reprovado: links e fontes não devem aparecer no corpo do artigo.",
    );
  }

  if (/(como modelo de linguagem|nao posso|não posso|i cannot|as an ai)/i.test(content)) {
    throw new BlogGeneratorError("Post reprovado: o texto parece conter resposta genérica da IA.");
  }

  if (!heroImage.src || !heroImage.alt) {
    throw new BlogGeneratorError("Post reprovado: nenhuma imagem principal válida foi selecionada.");
  }

  if (keyTakeaways.length < 3 || whyItMatters.trim().length < 80) {
    throw new BlogGeneratorError("Post reprovado: metadados editoriais insuficientes.");
  }
}

function filterAllowedSourceUrls(sourceUrls: string[], sourceLinks: BlogSourceLink[]) {
  const allowedUrls = new Map(
    sourceLinks.map((sourceLink) => [canonicalizeUrl(sourceLink.url), sourceLink.url]),
  );

  return sourceUrls
    .map((sourceUrl) => allowedUrls.get(canonicalizeUrl(sourceUrl)))
    .filter((sourceUrl): sourceUrl is string => Boolean(sourceUrl));
}

function buildPrompt({
  existingPosts,
  isRecentRequest,
  topic,
  userPrompt,
}: {
  existingPosts: BlogPostContent[];
  isRecentRequest: boolean;
  topic: SelectedTopic;
  userPrompt?: string;
}) {
  const sourceBlock = [topic.lead, ...topic.supporting]
    .slice(0, 3)
    .map(
      (item, index) =>
        `${index + 1}. ${truncateText(item.title, 130)}\nFonte: ${item.source}\nURL: ${item.url}\nData: ${item.publishedAt}\nResumo: ${truncateText(item.summary, 220)}`,
    )
    .join("\n\n");
  const existingPostsBlock = existingPosts
    .slice(0, 6)
    .map(
      (post, index) =>
        `${index + 1}. ${truncateText(post.title, 110)} (${post.slug})`,
    )
    .join("\n");

  return `
Pedido do usuário: ${userPrompt || "Gerar blog com base nas fontes recentes selecionadas."}
Tema principal: ${topic.lead.title}
Categoria principal: ${topic.category}
Palavras-chave detectadas: ${topic.keywords.join(", ")}
Resumo editorial: ${topic.summary}
Pedido de conteúdo recente: ${isRecentRequest ? "sim, usar somente fontes dos últimos 7 dias" : "não"}

Fontes para análise:
${sourceBlock}

Títulos recentes já publicados:
${existingPostsBlock || "Nenhum post existente informado."}

Escreva em pt-BR. Para seguros, use tom Prime Secure: profissional, claro e comercial sem exagero. Para outros temas, use tom técnico/profissional.

Regras:
- Use apenas as fontes listadas acima. Não invente fontes, links, datas, imagens, estatísticas ou nomes de publicações.
- Se não houver fonte suficiente ou se o tema for parecido com posts existentes, retorne shouldPublish=false e explique em duplicateRiskReason.
- Se o pedido for de conteúdo recente, use somente as fontes listadas como base dos últimos 7 dias.
- Não copie trechos literais longos das fontes.
- Faça síntese e análise própria, com ângulo novo, título diferente e exemplos diferentes dos posts existentes.
- Escreva de 260 a 480 palavras.
- Use Markdown simples compatível com um renderer baseado em linhas.
- Não inclua H1 no campo content; o título deve ficar apenas no campo title.
- Use exatamente estes subtítulos em ordem: "## O que aconteceu", "## Por que isso importa", "## Impacto prático", "## Riscos e pontos de atenção", "## Próximos passos".
- Use listas com "-".
- Não inclua seção de links no corpo.
- Para seguros, evite afirmações absolutas e não prometa coberturas específicas sem contexto. Quando fizer sentido, finalize com chamada leve para cotação/contato.
- Não mencione que o texto foi feito por IA.
- Gere imageQuery curta em inglês para Wikimedia Commons, priorizando visual editorial de tecnologia relacionado ao tema, sem depender de uma imagem literal da notícia.
- Retorne apenas JSON válido. Em content, escape quebras de linha como \\n.

Retorne somente JSON com este formato:
{
  "shouldPublish": true,
  "duplicateRiskReason": "",
  "title": "string",
  "slug": "slug-em-minusculas",
  "summary": "string curta com SEO",
  "whyItMatters": "parágrafo específico explicando a relevância do tema agora",
  "keyTakeaways": ["ponto prático 1", "ponto prático 2", "ponto prático 3"],
  "keywords": ["tag1", "tag2", "tag3"],
  "imageQuery": "short Wikimedia image search query",
  "content": "Parágrafo de abertura...\\n\\n## O que aconteceu\\n\\nParágrafo...",
  "sourceUrls": ["https://fonte-real.example/post"],
  "publishedAtReference": "2026-07-07T10:00:00.000Z"
}
`.trim();
}

export async function generateBlogPost(
  topic: SelectedTopic,
  options: {
    environment?: Partial<Record<string, string | undefined>>;
    existingPosts?: BlogPostContent[];
    fetchImpl?: typeof fetch;
    imageOutputDirectory?: string;
    isRecentRequest?: boolean;
    now?: Date;
    userPrompt?: string;
  } = {},
): Promise<GeneratedBlogPostDraft> {
  const sourceLinks = await enrichSourceLinksWithMedia(
    mapSourceLinks(topic),
    options.fetchImpl,
  );

  if (sourceLinks.length === 0) {
    throw new BlogGeneratorError(
      "Nenhuma fonte confiável foi selecionada para gerar o post do blog.",
    );
  }

  const rawResponse = await generateTextWithAi(
    {
      prompt: buildPrompt({
        existingPosts: options.existingPosts ?? [],
        isRecentRequest: options.isRecentRequest ?? false,
        topic,
        userPrompt: options.userPrompt,
      }),
      systemPrompt:
        "Você é um editor sênior. Responda somente JSON válido, escreva em pt-BR, use apenas fontes fornecidas e nunca invente links, datas, fontes ou imagens.",
    },
    {
      environment: options.environment,
      fetchImpl: options.fetchImpl,
    },
  );

  let parsedPayload: unknown;

  try {
    parsedPayload = parseAiJsonPayload(rawResponse);
  } catch (error) {
    throw new BlogGeneratorError(
      `A IA retornou um payload impossível de interpretar. ${
        error instanceof Error ? error.message : "JSON inválido"
      }`,
    );
  }

  const duplicateRisk = duplicateRiskSchema.safeParse(parsedPayload);

  if (duplicateRisk.success) {
    throw new BlogGeneratorError(
      `Post não publicado pela IA: ${
        duplicateRisk.data.duplicateRiskReason ?? "risco de duplicidade ou fontes insuficientes"
      }`,
    );
  }

  let draft: z.infer<typeof generatedDraftSchema>;

  try {
    draft = generatedDraftSchema.parse(parsedPayload);
  } catch (error) {
    throw new BlogGeneratorError(
      `A IA retornou um formato de post inválido. ${
        error instanceof Error ? error.message : "schema fora do esperado"
      }`,
    );
  }
  const normalizedContent = stripInitialArticleHeading(draft.content.trim());
  const date = (options.now ?? new Date()).toISOString().slice(0, 10);
  const normalizedTags = draft.keywords.map((tag) => tag.trim()).filter(Boolean);
  const allowedSourceUrls = filterAllowedSourceUrls(draft.sourceUrls, sourceLinks);

  if (!draft.shouldPublish) {
    throw new BlogGeneratorError(
      `Post não publicado pela IA: ${draft.duplicateRiskReason || "sem motivo informado"}`,
    );
  }

  if (allowedSourceUrls.length === 0) {
    throw new BlogGeneratorError(
      "Post reprovado: a IA não retornou nenhuma fonte real entre as fontes fornecidas.",
    );
  }

  const normalizedSlug = slugifyBlogTitle(draft.slug || draft.title);
  const localHeroImage = await selectLocalBlogHeroImage({
    category: topic.category,
    description: draft.summary.trim(),
    environment: options.environment,
    existingPosts: options.existingPosts ?? [],
    tags: normalizedTags,
    title: draft.title.trim(),
  });
  const generatedHeroImage =
    localHeroImage ??
    (await generateBlogHeroImage({
      category: topic.category,
      description: draft.summary.trim(),
      environment: options.environment,
      fetchImpl: options.fetchImpl,
      outputDirectory: options.imageOutputDirectory,
      slug: normalizedSlug,
      tags: normalizedTags,
      title: draft.title.trim(),
      whyItMatters: draft.whyItMatters.trim(),
    }));
  const heroImage =
    generatedHeroImage ??
    (await selectHeroImage({
      existingPosts: options.existingPosts ?? [],
      fetchImpl: options.fetchImpl,
      imageQuery: draft.imageQuery,
      sourceLinks,
      tags: normalizedTags,
      title: draft.title,
      topic,
    }));
  const contentHash = sha256(`${draft.title}\n${draft.summary}\n${normalizedContent}`);
  const keyTakeaways = draft.keyTakeaways
    .map((takeaway) => takeaway.trim())
    .filter(Boolean);
  const generatedPost: GeneratedBlogPostDraft = {
    category: topic.category,
    content: normalizedContent,
    contentHash,
    date,
    description: draft.summary.trim(),
    heroImage,
    imageQuery: draft.imageQuery.trim(),
    keyTakeaways,
    publishedAtReference: draft.publishedAtReference,
    readTime: estimateReadTime(normalizedContent),
    slug: normalizedSlug,
    sourceUrl: allowedSourceUrls[0],
    sourceUrls: allowedSourceUrls,
    sourceLinks,
    tags: normalizedTags,
    title: draft.title.trim(),
    whyItMatters: draft.whyItMatters.trim(),
  };

  validateGeneratedPostDraft(generatedPost);

  return generatedPost;
}
