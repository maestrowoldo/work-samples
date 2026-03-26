// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Download } from "lucide-react";

const links = [
  { href: "#inicio", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#experiencia", label: "Experiência" },
  { href: "#processo", label: "Processo" },
  { href: "#projeto", label: "Projetos" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href="#inicio" className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold group-hover:bg-emerald-400 transition-colors">
            WA
          </div>
          <span className="text-sm font-semibold text-zinc-100">
            Wolkendo Arias
          </span>
        </Link>

        <div className="hidden gap-6 text-sm font-medium text-zinc-300 md:flex items-center">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-emerald-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/curriculum"
            className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
          >
            <Download size={14} />
            CV
          </Link>
          <a
            href="#contato"
            className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
          >
            Vamos conversar
          </a>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md border border-zinc-700 p-2 text-zinc-200 md:hidden hover:border-emerald-500 transition-colors"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        {open && (
          <div className="absolute inset-x-0 top-full border-b border-zinc-800 bg-zinc-950 px-4 pb-4 pt-2 md:hidden">
            <div className="flex flex-col gap-2 text-sm">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-2 py-1 text-zinc-200 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/curriculum"
                className="rounded-md px-2 py-1 text-zinc-200 hover:bg-zinc-900 hover:text-emerald-400 transition-colors flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Download size={14} />
                Ver CV
              </Link>
              <a
                href="#contato"
                className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
                onClick={() => setOpen(false)}
              >
                Vamos conversar
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
