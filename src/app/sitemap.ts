import process from "node:process";
import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/blog/content.server";
import { locales } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://wolkendo.dev";

  const localizedPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: locale === "pt" ? 1 : 0.9,
    },
    {
      url: `${baseUrl}/articles/${locale}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/curriculum`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/${locale}/contato`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
  ]);

  const localizedPostsByLocale = await Promise.all(
    locales.map(async (locale) =>
      (await getBlogPosts(locale)).map((post) => ({
        url: `${baseUrl}/articles/${locale}/${post.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
    ),
  );

  return [...localizedPages, ...localizedPostsByLocale.flat()];
}
