"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ChevronDown, Download, Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { buildLocalePath, type Locale } from "@/lib/i18n";
import { useLocaleContext } from "@/components/LocaleProvider";
import {
  Navbar as ResizableNavbar, NavBody, NavItems, MobileNav, NavbarLogo,
  NavbarButton, MobileNavHeader, MobileNavToggle, MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import styles from "./Navbar.module.css";

const languageOptions = [
  { locale: "pt" as Locale, label: "PT", name: "Português", flagSrc: "/flags/br.svg" },
  { locale: "en" as Locale, label: "EN", name: "English", flagSrc: "/flags/us.svg" },
  { locale: "fr" as Locale, label: "FR", name: "Français", flagSrc: "/flags/fr.svg" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { dictionary, locale } = useLocaleContext();
  const copy = dictionary.navbar;
  const homePath = `/${locale}`;
  const menuId = useId();
  const languageMenuId = useId();
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const currentLanguage = languageOptions.find((item) => item.locale === locale) ?? languageOptions[0];
  const closeMobileMenu = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    const closeMenus = () => { setOpen(false); setIsLanguageMenuOpen(false); };
    breakpoint.addEventListener("change", closeMenus);
    return () => breakpoint.removeEventListener("change", closeMenus);
  }, []);

  useEffect(() => {
    if (!isLanguageMenuOpen) return;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !languageMenuRef.current?.contains(event.target)) setIsLanguageMenuOpen(false);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsLanguageMenuOpen(false);
      languageButtonRef.current?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [isLanguageMenuOpen]);

  const changeLocale = (nextLocale: Locale) => {
    setOpen(false);
    setIsLanguageMenuOpen(false);
    if (nextLocale !== locale) {
      router.push(`${buildLocalePath(nextLocale, pathname)}${window.location.search}${window.location.hash}`);
    }
  };

  return (
    <ResizableNavbar onBlur={(event) => {
      if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
        setOpen(false);
        setIsLanguageMenuOpen(false);
      }
    }}>
      <NavBody aria-label={copy.navigationLabel}>
        <NavbarLogo href={`${homePath}#inicio`} />
        <NavItems items={copy.links.map((link) => ({ name: link.label, link: `${homePath}${link.href}` }))} />
        <div className={styles.actions}>
          <NavbarButton as={Link} href={`${homePath}/curriculum`} variant="secondary">
            <Download size={14} aria-hidden="true" />{copy.cvLabel}
          </NavbarButton>
          <div className={styles.languageControl} ref={languageMenuRef}>
            <button ref={languageButtonRef} type="button" className={styles.languageTrigger}
              aria-label={`${copy.localeSwitcherLabel}: ${currentLanguage.name}`}
              aria-expanded={isLanguageMenuOpen} aria-controls={languageMenuId}
              onClick={() => setIsLanguageMenuOpen((value) => !value)}>
              <Languages size={15} aria-hidden="true" />
              <Image src={currentLanguage.flagSrc} alt="" width={22} height={16} className={styles.flag} />
              <span>{currentLanguage.label}</span>
              <ChevronDown size={14} aria-hidden="true" className={isLanguageMenuOpen ? styles.chevronOpen : undefined} />
            </button>
            {isLanguageMenuOpen && (
              <div id={languageMenuId} className={styles.languageDropdown} role="group" aria-label={copy.localeSwitcherLabel}>
                {languageOptions.map((item) => (
                  <button key={item.locale} type="button" className={styles.languageOption}
                    aria-pressed={item.locale === locale} onClick={() => changeLocale(item.locale)}>
                    <Image src={item.flagSrc} alt="" width={26} height={19} className={styles.flag} />
                    <span>{item.name}</span><span className={styles.languageCode} aria-hidden="true">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <NavbarButton href={`${homePath}#contato`}>{copy.contactCta}</NavbarButton>
        </div>
      </NavBody>

      <MobileNav aria-label={copy.navigationLabel}>
        <MobileNavHeader>
          <NavbarLogo href={`${homePath}#inicio`} />
          <MobileNavToggle isOpen={open} aria-label={open ? copy.closeMenuLabel : copy.openMenuLabel}
            aria-controls={menuId} onClick={() => {
              setOpen((value) => !value);
              setIsLanguageMenuOpen(false);
            }} />
        </MobileNavHeader>
        <MobileNavMenu id={menuId} isOpen={open} onClose={closeMobileMenu}>
          <div className={styles.mobileLinks}>
            {copy.links.map((link) => (
              <a key={link.href} href={`${homePath}${link.href}`} onClick={closeMobileMenu}>{link.label}</a>
            ))}
          </div>
          <div className={styles.mobileLanguageSection}>
            <p><Languages size={15} aria-hidden="true" />{copy.localeSwitcherLabel}</p>
            <div className={styles.mobileLanguages} role="group" aria-label={copy.localeSwitcherLabel}>
              {languageOptions.map((item) => (
                <button key={item.locale} type="button" aria-label={item.name}
                  aria-pressed={item.locale === locale} onClick={() => changeLocale(item.locale)}>
                  <Image src={item.flagSrc} alt="" width={23} height={17} className={styles.flag} />
                  <span aria-hidden="true">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className={styles.mobileActions}>
            <NavbarButton as={Link} href={`${homePath}/curriculum`} variant="secondary" onClick={closeMobileMenu}>
              <Download size={15} aria-hidden="true" />{copy.mobileCvLabel}
            </NavbarButton>
            <NavbarButton href={`${homePath}#contato`} onClick={closeMobileMenu}>{copy.contactCta}</NavbarButton>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </ResizableNavbar>
  );
}
