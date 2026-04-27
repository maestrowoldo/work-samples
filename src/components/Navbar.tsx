// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Download } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { buildLocalePath, localeLabels, locales, type Locale } from "@/lib/i18n";
import { useLocaleContext } from "@/components/LocaleProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { dictionary, locale } = useLocaleContext();
  const homePath = `/${locale}`;

  const changeLocale = (nextLocale: Locale) => {
    const hash = globalThis.location.hash || "";
    router.push(`${buildLocalePath(nextLocale, pathname)}${hash}`);
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6">
        <Link href={`${homePath}#inicio`} className="flex items-center gap-2 group">
          <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center text-zinc-950 font-bold group-hover:bg-emerald-400 transition-colors">
            WA
          </div>
          <span className="text-sm font-semibold text-zinc-100">
            Wolkendo Arias
          </span>
        </Link>

        <div className="hidden gap-6 text-sm font-medium text-zinc-300 md:flex items-center">
          {dictionary.navbar.links.map((link) => (
            <a
              key={link.href}
              href={`${homePath}${link.href}`}
              className="hover:text-emerald-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link
            href={`${homePath}/curriculum`}
            className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
          >
            <Download size={14} />
            {dictionary.navbar.cvLabel}
          </Link>
          <div className="flex items-center gap-2 rounded-full border border-zinc-800 px-2 py-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
              {dictionary.navbar.localeSwitcherLabel}
            </span>
            {locales.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => changeLocale(item)}
                className={`rounded-full px-2 py-1 text-xs transition-colors ${
                  item === locale
                    ? "bg-emerald-500 text-zinc-950"
                    : "text-zinc-300 hover:text-emerald-400"
                }`}
              >
                {localeLabels[item]}
              </button>
            ))}
          </div>
          <a
            href={`${homePath}#contato`}
            className="rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
          >
            {dictionary.navbar.contactCta}
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
              {dictionary.navbar.links.map((link) => (
                <a
                  key={link.href}
                  href={`${homePath}${link.href}`}
                  className="rounded-md px-2 py-1 text-zinc-200 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <Link
                href={`${homePath}/curriculum`}
                className="rounded-md px-2 py-1 text-zinc-200 hover:bg-zinc-900 hover:text-emerald-400 transition-colors flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <Download size={14} />
                {dictionary.navbar.mobileCvLabel}
              </Link>
              <div className="mt-2 flex items-center justify-between rounded-xl border border-zinc-800 px-3 py-2">
                <span className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {dictionary.navbar.localeSwitcherLabel}
                </span>
                <div className="flex gap-2">
                  {locales.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => changeLocale(item)}
                      className={`rounded-full px-2 py-1 text-xs transition-colors ${
                        item === locale
                          ? "bg-emerald-500 text-zinc-950"
                          : "text-zinc-300 hover:text-emerald-400"
                      }`}
                    >
                      {localeLabels[item]}
                    </button>
                  ))}
                </div>
              </div>
              <a
                href={`${homePath}#contato`}
                className="mt-2 rounded-full bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors"
                onClick={() => setOpen(false)}
              >
                {dictionary.navbar.contactCta}
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
