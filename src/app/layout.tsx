// src/app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export const metadata: Metadata = {
  title: "Wolkendo Arias - Full Stack Developer & Data Analyst",
  description:
    "Portfólio profissional de Wolkendo Arias. Desenvolvedor Full Stack, Analista de Dados e especialista em Power BI. Transformando ideias em realidade digital.",
  keywords: [
    "desenvolvedor web",
    "full stack",
    "power bi",
    "análise de dados",
    "javascript",
    "react",
    "next.js",
    "node.js",
  ],
  authors: [{ name: "Wolkendo Arias" }],
  creator: "Wolkendo Arias",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://wolkendoarias.com",
    siteName: "Wolkendo Arias",
    title: "Wolkendo Arias - Full Stack Developer & Data Analyst",
    description:
      "Portfólio profissional com projetos em desenvolvimento web, análise de dados e Power BI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Wolkendo Arias",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wolkendo Arias - Full Stack Developer",
    description:
      "Desenvolvedor Full Stack, Analista de Dados e especialista em Power BI.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="bg-zinc-950 text-zinc-50 antialiased">
        <Providers>{children}</Providers>
        <Analytics />
      </body>
    </html>
  );
}
