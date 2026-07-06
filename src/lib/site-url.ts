import process from "node:process";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://wolkendo.dev"
).replace(/\/$/, "");

export function buildAbsoluteUrl(pathname = "/") {
  const normalizedPathname = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${normalizedPathname}`;
}
