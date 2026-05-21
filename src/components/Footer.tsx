// src/components/Footer.tsx
"use client";

import { Code2, Briefcase, Share2 } from "lucide-react";
import { useLocaleContext } from "@/components/LocaleProvider";

export default function Footer() {
  const { dictionary } = useLocaleContext();
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

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 text-xs text-zinc-500 md:flex-row lg:px-6">
        <p>&copy; {new Date().getFullYear()} {dictionary.footer.copyright}</p>

        <div className="flex items-center gap-4">
          {socialLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.name}
                className="text-zinc-500 transition-all hover:text-emerald-400 hover:scale-110"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
