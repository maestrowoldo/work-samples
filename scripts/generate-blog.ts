import path from "node:path";
import process from "node:process";
import { existsSync, readFileSync } from "node:fs";
import {
  BlogGeneratorError,
  fetchTechNews,
  generateBlogPost,
  resolveAiConfiguration,
  saveBlogPost,
  selectBestTopic,
} from "../src/lib/blog/generator";

function loadEnvironmentFile(fileName: string) {
  const filePath = path.join(process.cwd(), fileName);

  if (!existsSync(filePath)) {
    return;
  }

  const fileContents = readFileSync(filePath, "utf8");

  for (const line of fileContents.split(/\r?\n/)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const normalizedValue = rawValue.replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = normalizedValue;
    }
  }
}

loadEnvironmentFile(".env");
loadEnvironmentFile(".env.local");

async function main() {
  resolveAiConfiguration();

  console.log("Buscando notícias recentes de tecnologia...");
  const newsItems = await fetchTechNews();

  console.log(`Notícias relevantes encontradas: ${newsItems.length}`);
  const selectedTopic = selectBestTopic(newsItems);
  console.log(`Tema selecionado: ${selectedTopic.lead.title}`);
  console.log(`Categoria: ${selectedTopic.category}`);

  console.log("Gerando rascunho do post com IA...");
  const generatedPost = await generateBlogPost(selectedTopic);

  console.log("Salvando post na estrutura atual do blog...");
  const savedPost = await saveBlogPost(generatedPost);
  const relativeFilePath = path.relative(process.cwd(), savedPost.filePath);

  console.log("");
  console.log("Post gerado com sucesso:");
  console.log(`- Título: ${savedPost.post.title}`);
  console.log(`- Slug: ${savedPost.post.slug}`);
  console.log(`- Arquivo: ${relativeFilePath}`);
  console.log("- Fontes:");

  for (const sourceLink of savedPost.post.sourceLinks ?? []) {
    console.log(`  * [${sourceLink.source}] ${sourceLink.title} - ${sourceLink.url}`);
  }
}

main().catch((error) => {
  if (error instanceof BlogGeneratorError) {
    console.error(`Erro ao gerar post: ${error.message}`);
  } else if (error instanceof Error) {
    console.error(`Erro inesperado ao gerar post: ${error.message}`);
  } else {
    console.error("Erro inesperado ao gerar post.");
  }

  process.exitCode = 1;
});
