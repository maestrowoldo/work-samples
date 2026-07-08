import type { BlogHeroImage } from "../types";

interface WikimediaPage {
  imageinfo?: Array<{
    descriptionurl?: string;
    extmetadata?: Record<string, { value?: string }>;
    height?: number;
    mime?: string;
    thumburl?: string;
    url?: string;
    width?: number;
  }>;
  title?: string;
}

interface WikimediaSearchResponse {
  query?: {
    pages?: Record<string, WikimediaPage>;
  };
}

export interface WikimediaImageResult {
  artist?: string;
  credit?: string;
  description?: string;
  descriptionUrl?: string;
  height?: number;
  license?: string;
  licenseUrl?: string;
  mime?: string;
  originalUrl?: string;
  title?: string;
  url: string;
  width?: number;
}

function stripHtml(value: string | undefined) {
  return (value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeSearchText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeTitle(title: string | undefined) {
  return (title ?? "Imagem de tecnologia").replace(/^File:/i, "").replace(/\.[a-z0-9]+$/i, "");
}

function isUsableImage(url: string | undefined, mime: string | undefined) {
  if (!url) {
    return false;
  }

  if (mime && !mime.startsWith("image/")) {
    return false;
  }

  return !/\.(svg|gif)$/i.test(url);
}

function buildWikimediaApiUrl(query: string) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "12",
    gsrsearch: query,
    iiextmetadatalanguage: "pt",
    iiprop: "url|mime|size|extmetadata",
    iiurlwidth: "1200",
    origin: "*",
    prop: "imageinfo",
  });

  return `https://commons.wikimedia.org/w/api.php?${params.toString()}`;
}

function buildSearchQueries({ keywords = [], title }: { keywords?: string[]; title: string }) {
  const normalizedTitle = normalizeSearchText(title);
  const normalizedKeywords = keywords.map(normalizeSearchText).filter(Boolean).slice(0, 4);
  const queries = new Set<string>();

  const fingerprint = `${normalizedTitle} ${normalizedKeywords.join(" ")}`;

  if (/(seguro|seguros|viagem|assistencia|cobertura|indenizacao|seguradora)/.test(fingerprint)) {
    queries.add("business customer service technology");
    queries.add("travel assistance mobile technology");
    queries.add("insurance protection customer service");
  }

  if (/(ia|ai|inteligencia artificial|machine learning|llm)/.test(fingerprint)) {
    queries.add("artificial intelligence technology");
    queries.add("artificial intelligence machine learning technology");
    queries.add("data center servers technology");
  }

  if (/(cloud|devops|infraestrutura|kubernetes|container|observability|observabilidade|monitoramento)/.test(fingerprint)) {
    queries.add("cloud computing data center servers");
    queries.add("server room technology");
  }

  if (/(seguranca|security|cyber|ciberseguranca|vulnerabilidade|privacy|privacidade)/.test(fingerprint)) {
    queries.add("cybersecurity network technology");
    queries.add("security operations center");
  }

  if (/(dados|data|analytics|dashboard|bi|metricas|observability|observabilidade)/.test(fingerprint)) {
    queries.add("data analytics dashboard technology");
    queries.add("business intelligence dashboard");
  }

  if (/(software|programacao|web|react|typescript|devops|cloud|dados)/.test(fingerprint)) {
    queries.add("software development workstation");
    queries.add("software engineering technology");
  }

  queries.add("modern technology workspace");
  queries.add([normalizedTitle, ...normalizedKeywords].filter(Boolean).slice(0, 5).join(" "));
  queries.add(normalizedKeywords.join(" "));

  return [...queries].filter((query) => query.length >= 3).slice(0, 6);
}

function mapImageResult(page: WikimediaPage): WikimediaImageResult | null {
  const imageInfo = page.imageinfo?.[0];
  const imageUrl = imageInfo?.thumburl ?? imageInfo?.url;

  if (!isUsableImage(imageUrl, imageInfo?.mime)) {
    return null;
  }

  const metadata = imageInfo?.extmetadata ?? {};
  const artist = stripHtml(metadata.Artist?.value);
  const credit = stripHtml(metadata.Credit?.value) || artist;
  const description = stripHtml(
    metadata.ImageDescription?.value ?? metadata.ObjectName?.value ?? metadata.Caption?.value,
  );
  const license = stripHtml(
    metadata.LicenseShortName?.value ?? metadata.License?.value ?? metadata.UsageTerms?.value,
  );
  const licenseUrl = stripHtml(metadata.LicenseUrl?.value);

  return {
    artist: artist || undefined,
    credit: credit || undefined,
    description: description || undefined,
    descriptionUrl: imageInfo?.descriptionurl,
    height: imageInfo?.height,
    license: license || undefined,
    licenseUrl: licenseUrl || undefined,
    mime: imageInfo?.mime,
    originalUrl: imageInfo?.url,
    title: normalizeTitle(page.title),
    url: imageUrl!,
    width: imageInfo?.width,
  } satisfies WikimediaImageResult;
}

function scoreImage(image: WikimediaImageResult) {
  const width = image.width ?? 0;
  const height = image.height ?? 0;
  const imageText = normalizeSearchText(`${image.title ?? ""} ${image.description ?? ""}`);
  const sizeBonus = width >= 1200 ? 140 : width >= 800 ? 100 : width / 10;
  const landscapeBonus = width > height && height >= 500 ? 18 : 0;
  const metadataBonus = [image.credit, image.license, image.licenseUrl].filter(Boolean).length * 5;
  const editorialTechnologyBonus = /(technology|software|server|data center|dashboard|artificial intelligence|machine learning|cloud|cybersecurity|workstation|network)/.test(
    imageText,
  )
    ? 30
    : 0;
  const lowEditorialValuePenalty = /(logo|icon|screenshot|diagram|map|graph|chart|seal|symbol)/.test(
    imageText,
  )
    ? 45
    : 0;

  return (
    sizeBonus +
    Math.min(width, height) / 100 +
    landscapeBonus +
    metadataBonus +
    editorialTechnologyBonus -
    lowEditorialValuePenalty
  );
}

export async function getWikimediaImage(
  input: {
    keywords?: string[];
    title: string;
  },
  fetchImpl: typeof fetch = fetch,
): Promise<WikimediaImageResult | null> {
  for (const query of buildSearchQueries(input)) {
    try {
      const response = await fetchImpl(buildWikimediaApiUrl(query), {
        headers: {
          Accept: "application/json",
          "Api-User-Agent": "WolkendoBlogBot/1.0 (portfolio blog generator)",
          "User-Agent": "WolkendoBlogBot/1.0 (portfolio blog generator)",
        },
      });

      if (!response.ok) {
        console.warn(`[blog] Wikimedia retornou ${response.status} para query "${query}".`);
        continue;
      }

      const payload = (await response.json()) as WikimediaSearchResponse;
      const candidates = Object.values(payload.query?.pages ?? {})
        .map(mapImageResult)
        .filter((image): image is WikimediaImageResult => image !== null)
        .sort((left, right) => scoreImage(right) - scoreImage(left));
      const bestImage = candidates.find((image) => (image.width ?? 0) >= 800) ?? candidates[0];

      if (bestImage) {
        return bestImage;
      }
    } catch (error) {
      console.warn(
        `[blog] Falha ao buscar imagem no Wikimedia: ${
          error instanceof Error ? error.message : "erro desconhecido"
        }`,
      );
    }
  }

  return null;
}

export async function findWikimediaHeroImage(
  queries: string[],
  fetchImpl: typeof fetch = fetch,
): Promise<BlogHeroImage | undefined> {
  for (const query of queries) {
    const image = await getWikimediaImage({ title: query }, fetchImpl);

    if (image) {
      return {
        alt: normalizeTitle(query),
        credit: image.credit,
        descriptionUrl: image.descriptionUrl,
        height: image.height,
        license: image.license,
        licenseUrl: image.licenseUrl,
        mime: image.mime,
        originalUrl: image.originalUrl,
        source: "Wikimedia Commons",
        sourceUrl: image.descriptionUrl,
        src: image.url,
        width: image.width,
      };
    }
  }

  return undefined;
}
