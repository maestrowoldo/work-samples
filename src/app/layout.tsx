// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import FloatingBackground from "@/components/FloatingBackground";
import MouseGlow from "@/components/MouseGlow";
import { defaultLocale, getHtmlLang, isLocale } from "@/lib/i18n";
import { siteUrl } from "@/lib/site-url";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Wolkendo Arias",
  description: "Portfolio profissional de Wolkendo Arias.",
  authors: [{ name: "Wolkendo Arias" }],
  creator: "Wolkendo Arias",
};

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const headerStore = await headers();
  const localeHeader = headerStore.get("x-locale") || defaultLocale;
  const htmlLang = isLocale(localeHeader) ? getHtmlLang(localeHeader) : getHtmlLang(defaultLocale);

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-zinc-950 text-zinc-50 antialiased">
        <FloatingBackground />
        <MouseGlow />
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
