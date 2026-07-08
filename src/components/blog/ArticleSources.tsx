/* eslint-disable @next/next/no-img-element */
import { ExternalLink } from "lucide-react";
import type { BlogSourceLink } from "@/lib/blog/types";

function getSourceHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function getFaviconUrl(url: string) {
  try {
    const host = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch {
    return undefined;
  }
}

export function ArticleSources({
  label,
  sources,
}: {
  label: string;
  sources: BlogSourceLink[];
}) {
  if (sources.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 border-t border-stone-200 pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Credibilidade
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-stone-950">
            {label}
          </h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-stone-500">
          Referências diretamente usadas para contextualizar o artigo.
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {sources.map((sourceLink) => {
          const faviconUrl = getFaviconUrl(sourceLink.url);

          return (
            <a
              key={sourceLink.url}
              href={sourceLink.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-stone-200 bg-white p-4 transition-colors hover:border-emerald-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50">
                  {faviconUrl ? (
                    <img src={faviconUrl} alt="" className="h-5 w-5" loading="lazy" />
                  ) : (
                    <ExternalLink size={16} className="text-stone-400" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-800">
                    {sourceLink.source}
                    {sourceLink.siteName && sourceLink.siteName !== sourceLink.source ? ` · ${sourceLink.siteName}` : ""}
                  </p>
                  <p className="mt-1 text-sm font-medium leading-6 text-stone-950">
                    {sourceLink.title}
                  </p>
                  <p className="mt-1 text-xs text-stone-500">
                    {getSourceHost(sourceLink.url)}
                  </p>
                </div>
                <ExternalLink size={14} className="mt-1 shrink-0 text-stone-400 transition-colors group-hover:text-emerald-700" />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
