import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n";

function getCtaCopy(category?: string) {
  const normalizedCategory = category?.toLowerCase() ?? "";

  if (/seguro|seguros/.test(normalizedCategory)) {
    return {
      label: "Próximo passo",
      title: "Comparar proteção com mais clareza",
      description: "Leve o contexto do artigo para uma conversa objetiva sobre riscos, coberturas e prioridades.",
    };
  }

  if (/dados|data|analytics|power bi/.test(normalizedCategory)) {
    return {
      label: "Aplicação prática",
      title: "Transformar dados em decisão",
      description: "Conecte indicadores, dashboards e operação em uma experiência mais clara para o negócio.",
    };
  }

  if (/inteligência artificial|ia|ai/.test(normalizedCategory)) {
    return {
      label: "Aplicação prática",
      title: "Avaliar um uso real de IA",
      description: "Separe tendência de valor prático e desenhe uma implementação com controle técnico.",
    };
  }

  return {
    label: "Próximo passo",
    title: "Conversar sobre uma solução",
    description: "Use este diagnóstico como ponto de partida para evoluir produto, automação ou experiência digital.",
  };
}

export function ArticleCTA({
  category,
  locale,
  variant = "inline",
}: {
  category?: string;
  locale: Locale;
  variant?: "inline" | "sidebar";
}) {
  const copy = getCtaCopy(category);
  const isSidebar = variant === "sidebar";

  return (
    <Link
      href={`/${locale}#contato`}
      className={`group block rounded-2xl bg-stone-950 text-white transition-colors hover:bg-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700 ${
        isSidebar ? "p-5" : "p-6 md:p-7"
      }`}
    >
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
            {copy.label}
          </p>
          <p className={`${isSidebar ? "mt-3 text-base" : "mt-3 text-xl"} font-semibold leading-tight`}>
            {copy.title}
          </p>
          <p className={`${isSidebar ? "mt-3 text-sm" : "mt-4 text-base"} leading-7 text-stone-300`}>
            {copy.description}
          </p>
        </div>
        <ArrowUpRight size={16} className="mt-1 shrink-0 text-emerald-300 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </Link>
  );
}
