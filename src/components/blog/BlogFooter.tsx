import Link from "next/link";
import { Code2, Briefcase, Mail, Share2 } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const footerCopy: Record<
  Locale,
  {
    backLabel: string;
    contactLabel: string;
    description: string;
  }
> = {
  pt: {
    backLabel: "Voltar ao portfolio",
    contactLabel: "Vamos conversar",
    description: "Desenvolvimento web, automacao e dados com foco em entrega real.",
  },
  en: {
    backLabel: "Back to portfolio",
    contactLabel: "Let's talk",
    description: "Web development, automation, and data with a focus on real delivery.",
  },
  fr: {
    backLabel: "Retour au portfolio",
    contactLabel: "Parlons",
    description: "Developpement web, automatisation et donnees avec un focus sur la livraison reelle.",
  },
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
  const copy = footerCopy[locale];
  const homePath = `/${locale}`;

  return (
    <footer className="border-t border-stone-200 px-4 py-6 sm:px-6 md:px-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-stone-950">Wolkendo Arias</p>
          <p className="mt-1 max-w-md text-sm leading-6 text-stone-600">
            {copy.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={homePath}
            className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-950"
          >
            {copy.backLabel}
          </Link>
          <Link
            href={`${homePath}#contato`}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-stone-950 transition-colors hover:bg-emerald-400"
          >
            <Mail size={16} />
            {copy.contactLabel}
          </Link>
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.name}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 text-stone-500 transition-colors hover:border-emerald-500 hover:text-emerald-700"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
