import { createHash } from "node:crypto";

export function canonicalizeUrl(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value);
    url.hash = "";
    url.search = "";
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname.replace(/\/+$/g, "");
    return url.toString();
  } catch {
    return value.trim().toLowerCase().replace(/[?#].*$/, "").replace(/\/+$/g, "");
  }
}

export function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/https?:\/\/\S+/gi, " ")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function sha256(text: string) {
  return createHash("sha256").update(normalizeText(text)).digest("hex");
}

function tokenize(text: string) {
  return new Set(
    normalizeText(text)
      .split(" ")
      .filter((token) => token.length >= 3),
  );
}

export function tokenSimilarity(a: string, b: string) {
  const leftTokens = tokenize(a);
  const rightTokens = tokenize(b);

  if (leftTokens.size === 0 && rightTokens.size === 0) {
    return 1;
  }

  if (leftTokens.size === 0 || rightTokens.size === 0) {
    return 0;
  }

  let intersectionSize = 0;

  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      intersectionSize += 1;
    }
  }

  const unionSize = new Set([...leftTokens, ...rightTokens]).size;
  return intersectionSize / unionSize;
}

