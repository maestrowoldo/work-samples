import { z } from "zod";
import { generateTextWithAi } from "./ai-provider";
import { BlogGeneratorError } from "./errors";
import { enrichSourceLinksWithMedia } from "./source-media";
import type { BlogSourceLink, GeneratedBlogPostDraft, SelectedTopic } from "../types";

const generatedDraftSchema = z.object({
  content: z.string().min(200),
  description: z.string().min(40).max(220),
  tags: z.array(z.string().min(2)).min(3).max(6),
  title: z.string().min(12).max(120),
});

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

function mapSourceLinks(topic: SelectedTopic): BlogSourceLink[] {
  const seenUrls = new Set<string>();

  return [topic.lead, ...topic.supporting]
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

function buildPrompt(topic: SelectedTopic) {
  const sourceBlock = [topic.lead, ...topic.supporting]
    .map(
      (item, index) =>
        `${index + 1}. [${item.source}] ${item.title}\nURL: ${item.url}\nData: ${item.publishedAt}\nResumo: ${item.summary}`,
    )
    .join("\n\n");

  return `
Tema principal: ${topic.lead.title}
Categoria principal: ${topic.category}
Palavras-chave detectadas: ${topic.keywords.join(", ")}
Resumo editorial: ${topic.summary}

Fontes para análise:
${sourceBlock}

Escreva um artigo original em português do Brasil para blog de tecnologia.

Regras:
- Não copie trechos literais longos das fontes.
- Faça síntese e análise própria voltada para desenvolvedores.
- Explique por que o tema importa agora.
- Inclua contexto técnico, implicações práticas e próximos passos.
- Use Markdown simples compatível com um renderer baseado em linhas.
- Comece o conteúdo com "# Título do artigo".
- Use subtítulos com "##".
- Use listas com "-".
- Não inclua uma seção de links no corpo; os links serão renderizados separadamente.

Retorne somente JSON com este formato:
{
  "title": "string",
  "description": "string curta com SEO",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "# Título\\n\\nParágrafo..."
}
`.trim();
}

export async function generateBlogPost(
  topic: SelectedTopic,
  options: {
    environment?: Partial<Record<string, string | undefined>>;
    fetchImpl?: typeof fetch;
    now?: Date;
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
      prompt: buildPrompt(topic),
      systemPrompt:
        "Você é um editor técnico sênior. Escreva com clareza, senso crítico e sem copiar notícias literalmente.",
    },
    {
      environment: options.environment,
      fetchImpl: options.fetchImpl,
    },
  );

  let parsedPayload: unknown;

  try {
    parsedPayload = JSON.parse(extractJsonObject(rawResponse));
  } catch (error) {
    throw new BlogGeneratorError(
      `A IA retornou um payload impossível de interpretar. ${
        error instanceof Error ? error.message : "JSON inválido"
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
  const normalizedContent = draft.content.startsWith("# ")
    ? draft.content.trim()
    : `# ${draft.title}\n\n${draft.content.trim()}`;
  const date = (options.now ?? new Date()).toISOString().slice(0, 10);

  return {
    category: topic.category,
    content: normalizedContent,
    date,
    description: draft.description.trim(),
    readTime: estimateReadTime(normalizedContent),
    sourceLinks,
    tags: draft.tags.map((tag) => tag.trim()).filter(Boolean),
    title: draft.title.trim(),
  };
}
