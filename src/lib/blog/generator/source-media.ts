import type { BlogSourceLink } from "../types";

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractMetaTagValue(html: string, selectors: string[]) {
  for (const selector of selectors) {
    const matcher = new RegExp(
      `<meta[^>]+(?:property|name)=["']${selector}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    );
    const directMatch = html.match(matcher);

    if (directMatch?.[1]) {
      return decodeHtmlEntities(directMatch[1].trim());
    }

    const reverseMatcher = new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${selector}["'][^>]*>`,
      "i",
    );
    const reverseMatch = html.match(reverseMatcher);

    if (reverseMatch?.[1]) {
      return decodeHtmlEntities(reverseMatch[1].trim());
    }
  }

  return undefined;
}

function extractTitle(html: string) {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return titleMatch?.[1] ? decodeHtmlEntities(titleMatch[1].trim()) : undefined;
}

function toAbsoluteUrl(candidateUrl: string | undefined, pageUrl: string) {
  if (!candidateUrl) {
    return undefined;
  }

  try {
    return new URL(candidateUrl, pageUrl).toString();
  } catch {
    return undefined;
  }
}

export function extractSourcePreviewFromHtml(
  html: string,
  pageUrl: string,
  fallbackTitle: string,
) {
  const normalizedHtml = html.replace(/\r\n/g, "\n");
  const imageUrl = toAbsoluteUrl(
    extractMetaTagValue(normalizedHtml, [
      "og:image:secure_url",
      "og:image",
      "twitter:image",
      "twitter:image:src",
    ]),
    pageUrl,
  );
  const siteName = extractMetaTagValue(normalizedHtml, ["og:site_name"]);
  const imageAlt =
    extractMetaTagValue(normalizedHtml, ["og:image:alt", "twitter:image:alt"]) ??
    extractMetaTagValue(normalizedHtml, ["og:title", "twitter:title"]) ??
    extractTitle(normalizedHtml) ??
    fallbackTitle;

  return {
    imageAlt,
    imageUrl,
    siteName,
  } satisfies Pick<BlogSourceLink, "imageAlt" | "imageUrl" | "siteName">;
}

export async function enrichSourceLinksWithMedia(
  sourceLinks: BlogSourceLink[],
  fetchImpl: typeof fetch = fetch,
) {
  const enrichedLinks = await Promise.all(
    sourceLinks.map(async (sourceLink) => {
      try {
        const response = await fetchImpl(sourceLink.url, {
          headers: {
            Accept: "text/html,application/xhtml+xml",
            "User-Agent": "Mozilla/5.0 (compatible; WolkendoBlogBot/1.0)",
          },
        });

        if (!response.ok) {
          return sourceLink;
        }

        const contentType = response.headers.get("content-type") ?? "";

        if (!contentType.includes("text/html")) {
          return sourceLink;
        }

        const html = await response.text();
        const preview = extractSourcePreviewFromHtml(html, sourceLink.url, sourceLink.title);

        return {
          ...sourceLink,
          imageAlt: preview.imageAlt ?? sourceLink.imageAlt,
          imageUrl: preview.imageUrl ?? sourceLink.imageUrl,
          siteName: preview.siteName ?? sourceLink.siteName,
        } satisfies BlogSourceLink;
      } catch {
        return sourceLink;
      }
    }),
  );

  return enrichedLinks;
}
