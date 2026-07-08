import path from "node:path";
import process from "node:process";
import { existsSync, readFileSync } from "node:fs";
import {
  BlogGeneratorError,
  createGeneratedBlogPost,
  resolveAiConfiguration,
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
  const userPrompt = process.argv.slice(2).join(" ").trim() || undefined;

  console.log(
    userPrompt
      ? `Gerando blog para o pedido: ${userPrompt}`
      : "Gerando blog com base nas fontes recentes selecionadas...",
  );
  const result = await createGeneratedBlogPost({
    userPrompt,
  });

  if (!result.created || !result.savedPost) {
    console.log("");
    console.log("Post não publicado:");
    console.log(`- Motivo: ${result.reason ?? "sem motivo informado"}`);
    if (result.attempts?.length) {
      console.log("- Tentativas:");
      for (const attempt of result.attempts) {
        console.log(`  * ${attempt.title} - ${attempt.reason}`);
      }
    }
    return;
  }

  const relativeFilePath = path.relative(process.cwd(), result.savedPost.filePath);

  console.log("");
  console.log("Post gerado com sucesso:");
  console.log(`- Título: ${result.savedPost.post.title}`);
  console.log(`- Slug: ${result.savedPost.post.slug}`);
  console.log(`- Arquivo: ${relativeFilePath}`);
  console.log(`- Imagem: ${result.image?.src ?? "sem imagem"}`);
  if (result.attempts?.length) {
    console.log(`- Tentativas reprovadas antes desta: ${result.attempts.length}`);
  }
  console.log("- Fontes:");

  for (const sourceLink of result.savedPost.post.sourceLinks ?? []) {
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
