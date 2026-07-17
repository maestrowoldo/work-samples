import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog/content.server";
import { locales } from "@/lib/i18n";
import { buildAbsoluteUrl } from "@/lib/site-url";

function getBaseUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://wolkendo.dev";
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const lastModified = new Date();

  const localizedPages = locales.flatMap((locale) => [
    {
      url: buildAbsoluteUrl(`/${locale}`),
      lastModified,
      changeFrequency: "weekly" as const,
      priority: locale === "pt" ? 1 : 0.9,
    },
    {
      url: buildAbsoluteUrl(`/${locale}/curriculum`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: buildAbsoluteUrl(`/${locale}/contato`),
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  const blogIndexPage = {
    url: buildAbsoluteUrl("/articles/pt"),
    lastModified,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  };

  const privacyPage = {
    url: buildAbsoluteUrl("/politica-de-privacidade"),
    lastModified,
    changeFrequency: "yearly" as const,
    priority: 0.3,
  };

  const blogPosts = (await getBlogPosts("pt")).map((post) => ({
    url: `${baseUrl}/articles/pt/${post.slug}`,
    lastModified: Number.isNaN(Date.parse(post.date)) ? lastModified : new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...localizedPages, blogIndexPage, privacyPage, ...blogPosts];
}
