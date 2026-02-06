// src/components/Footer.tsx
import { Github, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      icon: Github,
      url: "https://github.com/wolkendo",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      url: "https://linkedin.com/in/wolkendo",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/wolkendo",
    },
  ];

  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 py-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 text-xs text-zinc-500 md:flex-row lg:px-6">
        <p>&copy; {new Date().getFullYear()} Woldo Pro · Wolkendo Arias.</p>

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
