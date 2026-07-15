// src/components/Navbar.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, X, Download, Languages, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { buildLocalePath, type Locale } from "@/lib/i18n";
import { useLocaleContext } from "@/components/LocaleProvider";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { dictionary, locale } = useLocaleContext();
  const homePath = `/${locale}`;
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageOptions = useMemo(
    () => [
      { locale: "pt" as Locale, label: "PT", name: "Português", flagSrc: "/flags/br.svg", flagAlt: "Bandeira do Brasil" },
      { locale: "en" as Locale, label: "EN", name: "English", flagSrc: "/flags/us.svg", flagAlt: "United States flag" },
      { locale: "fr" as Locale, label: "FR", name: "Français", flagSrc: "/flags/fr.svg", flagAlt: "Drapeau de la France" },
    ],
    [],
  );
  const currentLanguage = languageOptions.find((item) => item.locale === locale) ?? languageOptions[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLocale = (nextLocale: Locale) => {
    const hash = globalThis.location.hash || "";
    router.push(`${buildLocalePath(nextLocale, pathname)}${hash}`);
    setOpen(false);
    setIsLanguageMenuOpen(false);
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
          <div className="relative" ref={languageMenuRef}>
            <button
              type="button"
              onClick={() => setIsLanguageMenuOpen((value) => !value)}
              className="inline-flex items-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-sm text-zinc-100 transition-colors hover:border-emerald-500"
            >
              <Languages size={16} className="text-emerald-400" />
              <span className="inline-flex h-6 w-8 overflow-hidden rounded-md border border-white/10">
                <Image
                  src={currentLanguage.flagSrc}
                  alt={currentLanguage.flagAlt}
                  width={32}
                  height={24}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="font-semibold">{currentLanguage.label}</span>
              <ChevronDown
                size={16}
                className={`transition-transform ${isLanguageMenuOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isLanguageMenuOpen && (
              <div className="absolute right-0 top-[calc(100%+0.75rem)] w-52 rounded-[1.75rem] border border-zinc-200/80 bg-zinc-100 p-2 shadow-2xl">
                {languageOptions.map((item) => (
                  <button
                    key={item.locale}
                    type="button"
                    onClick={() => changeLocale(item.locale)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors ${
                      item.locale === locale
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-900 hover:bg-white"
                    }`}
                  >
                    <span className="inline-flex h-9 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Image
                        src={item.flagSrc}
                        alt={item.flagAlt}
                        width={32}
                        height={24}
                        className="h-6 w-8 rounded-[4px] object-cover"
                      />
                    </span>
                    <span className="flex flex-col">
                      <span className="text-sm font-semibold">{item.name}</span>
                      <span className={`text-xs ${item.locale === locale ? "text-zinc-300" : "text-zinc-500"}`}>
                        {item.label}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <a
            href={`${homePath}#contato`}
            className="relative -top-0.5 rounded-full bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
          >
            {dictionary.navbar.contactCta}
          </a>
        </div>

        <button
          className="inline-flex items-center justify-center rounded-md border border-zinc-700 p-2 text-zinc-200 md:hidden hover:border-emerald-500 transition-colors"
          onClick={() => {
            setOpen((value) => !value);
            setIsLanguageMenuOpen(false);
          }}
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
              <div className="mt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setIsLanguageMenuOpen((value) => !value)}
                  className="flex w-full items-center justify-between rounded-2xl border border-zinc-800 bg-zinc-900/70 px-3 py-2 text-left text-zinc-100"
                >
                  <span className="flex items-center gap-2">
                    <Languages size={16} className="text-emerald-400" />
                    <span className="text-sm font-medium">
                      {dictionary.navbar.localeSwitcherLabel}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-8 overflow-hidden rounded-md border border-white/10">
                      <Image
                        src={currentLanguage.flagSrc}
                        alt={currentLanguage.flagAlt}
                        width={32}
                        height={24}
                        className="h-full w-full object-cover"
                      />
                    </span>
                    <span className="text-sm font-semibold">{currentLanguage.label}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${isLanguageMenuOpen ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>

                {isLanguageMenuOpen && (
                  <div className="rounded-[1.75rem] border border-zinc-200/80 bg-zinc-100 p-2 shadow-xl">
                    {languageOptions.map((item) => (
                      <button
                        key={item.locale}
                        type="button"
                        onClick={() => changeLocale(item.locale)}
                        className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors ${
                          item.locale === locale
                            ? "bg-zinc-900 text-white"
                            : "text-zinc-900 hover:bg-white"
                        }`}
                      >
                        <span className="inline-flex h-9 w-11 items-center justify-center rounded-xl bg-white shadow-sm">
                          <Image
                            src={item.flagSrc}
                            alt={item.flagAlt}
                            width={32}
                            height={24}
                            className="h-6 w-8 rounded-[4px] object-cover"
                          />
                        </span>
                        <span className="flex flex-col">
                          <span className="text-sm font-semibold">{item.name}</span>
                          <span className={`text-xs ${item.locale === locale ? "text-zinc-300" : "text-zinc-500"}`}>
                            {item.label}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={`${homePath}#contato`}
                className="mt-1 rounded-full bg-emerald-500 px-4 py-2 text-center text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
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
