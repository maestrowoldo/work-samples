import { redirect } from "next/navigation";
import { buildBlogReaderPath } from "@/lib/blog/presentation";
import { isLocale, type Locale } from "@/lib/i18n";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale: Locale = isLocale(locale) ? locale : "pt";
  redirect(buildBlogReaderPath(resolvedLocale));
}
