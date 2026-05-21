import path from "node:path";
import type { Locale } from "../i18n";

export const generatedBlogLocale: Locale = "pt";
export const blogContentRoot = path.join(process.cwd(), "src", "content", "blog");
