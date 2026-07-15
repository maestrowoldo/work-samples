import { Briefcase, Code2, Share2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const footerCopy = {
  eyebrow: "Blog de tecnologia",
  description:
    "Ideias sobre tecnologia, produto, automacao e dados aplicadas a entregas reais.",
  copyright: "© 2026 Wolkendo Dev. Todos os direitos reservados.",
  socialLabel: "Redes",
};

const socialLinks = [
  {
    name: "GitHub",
    icon: Code2,
    url: "https://github.com/maestrowoldo",
  },
  {
    name: "LinkedIn",
    icon: Briefcase,
    url: "https://www.linkedin.com/in/wolkendo-arias/",
  },
  {
    name: "Instagram",
    icon: Share2,
    url: "https://instagram.com/maestro_woldo",
  },
];

export function BlogFooter({ locale }: { locale: Locale }) {
  void locale;

  return (
    <footer className="border-t border-stone-200 bg-stone-950 px-4 py-4 text-stone-100 sm:px-6 md:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-300">
            {footerCopy.eyebrow}
          </p>
          <p className="mt-1.5 max-w-lg text-sm leading-5 text-stone-300">
            {footerCopy.description}
          </p>
          <p className="mt-2 text-xs text-stone-500">
            {footerCopy.copyright}
          </p>
        </div>

        <div className="flex items-center gap-2" aria-label={footerCopy.socialLabel}>
          {socialLinks.map((link) => {
            const Icon = link.icon;

            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-stone-400 transition-colors hover:border-emerald-400/70 hover:bg-emerald-500/10 hover:text-emerald-300"
              >
                <Icon size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
