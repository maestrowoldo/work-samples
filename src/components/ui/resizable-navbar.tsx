"use client";

import {
  createContext, forwardRef, useContext, useEffect, useId, useRef, useState,
  type ButtonHTMLAttributes, type ElementType, type HTMLAttributes,
  type MouseEventHandler, type ReactNode,
} from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion, useIsPresent, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import clsx from "clsx";
import styles from "./resizable-navbar.module.css";

const NavbarContext = createContext({ compact: false, reducedMotion: false });

export const Navbar = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(function Navbar({ children, className, ...props }, ref) {
  const [compact, setCompact] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const update = () => setCompact(window.scrollY > 80);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <NavbarContext.Provider value={{ compact, reducedMotion: !!reducedMotion }}>
      <header ref={ref} className={clsx(styles.navbar, className)} {...props}>{children}</header>
    </NavbarContext.Provider>
  );
});

export function NavBody({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  const { compact, reducedMotion } = useContext(NavbarContext);
  return (
    <motion.nav aria-label={props["aria-label"]} className={clsx(styles.desktop, className)}
      data-compact={compact} initial={false}
      animate={{ maxWidth: compact ? 1080 : 1200, y: compact ? 4 : 0,
        padding: compact ? "8px 14px" : "12px 20px", borderRadius: compact ? 40 : 24 }}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 30 }}>
      {children}
    </motion.nav>
  );
}

export function NavbarLogo({ href }: { href: string }) {
  return (
    <Link href={href} className={styles.logo}>
      <span className={styles.logoSymbol} aria-hidden="true">WA</span>
      <span className={styles.logoName}>Wolkendo Arias</span>
    </Link>
  );
}

export function NavItems({ items }: { items: Array<{ name: string; link: string }> }) {
  const [hovered, setHovered] = useState<number | null>(null);
  const id = useId();
  const { reducedMotion } = useContext(NavbarContext);
  return (
    <LayoutGroup id={id}>
      <div className={styles.items} onMouseLeave={() => setHovered(null)}>
        {items.map((item, index) => (
          <a key={item.link} href={item.link} className={styles.item}
            onMouseEnter={() => setHovered(index)} onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}>
            <AnimatePresence>
              {hovered === index && (
                <motion.span className={styles.itemHighlight} aria-hidden="true"
                  layoutId={reducedMotion ? undefined : "navbar-highlight"}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.18 }} />
              )}
            </AnimatePresence>
            <span className={styles.itemLabel}>{item.name}</span>
          </a>
        ))}
      </div>
    </LayoutGroup>
  );
}

interface NavbarButtonProps {
  as?: ElementType;
  href?: string;
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}

export function NavbarButton({ as, href, children, className, variant = "primary", onClick }: NavbarButtonProps) {
  const Component = as ?? (href ? "a" : "button");
  return (
    <Component href={href} type={href ? undefined : "button"} onClick={onClick}
      className={clsx(styles.button, variant === "primary" ? styles.primary : styles.secondary, className)}>
      {children}
    </Component>
  );
}

export function MobileNav({ children, className, ...props }: HTMLAttributes<HTMLElement>) {
  const { compact, reducedMotion } = useContext(NavbarContext);
  return (
    <motion.nav aria-label={props["aria-label"]} className={clsx(styles.mobile, className)}
      data-compact={compact} initial={false}
      animate={{ maxWidth: compact ? 520 : 620, y: compact ? 4 : 0 }}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 30 }}>
      {children}
    </motion.nav>
  );
}

export function MobileNavHeader({ children }: { children: ReactNode }) {
  return <div className={styles.mobileHeader}>{children}</div>;
}

export function MobileNavToggle({ isOpen, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { isOpen: boolean }) {
  return (
    <button type="button" className={styles.toggle} aria-expanded={isOpen} {...props}>
      {isOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
    </button>
  );
}

interface MobileNavMenuProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
  children: ReactNode;
}

function MobileMenuContent({ id, children }: Pick<MobileNavMenuProps, "id" | "children">) {
  const { reducedMotion } = useContext(NavbarContext);
  const present = useIsPresent();
  return (
    <motion.div id={id} data-mobile-nav-menu="" className={styles.mobileMenu} inert={!present}
      initial={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
      transition={{ duration: reducedMotion ? 0 : 0.18 }}>
      {children}
    </motion.div>
  );
}

export function MobileNavMenu({ isOpen, onClose, id, children }: MobileNavMenuProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const container = anchorRef.current?.parentElement;
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !container?.contains(event.target)) onClose();
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
      container?.querySelector<HTMLButtonElement>("button[aria-controls]")?.focus();
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [isOpen, onClose]);

  return (
    <div ref={anchorRef}>
      <AnimatePresence>{isOpen && <MobileMenuContent id={id}>{children}</MobileMenuContent>}</AnimatePresence>
    </div>
  );
}
