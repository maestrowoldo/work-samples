import { redirect } from "next/navigation";
import { buildBlogReaderPath } from "@/lib/blog/presentation";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  redirect(buildBlogReaderPath(resolvedLocale, slug));
}
