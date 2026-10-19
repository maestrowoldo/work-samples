import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ImageProps } from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/site-content";
import { LocaleProvider } from "./LocaleProvider";
import Navbar from "./Navbar";

const navigation = vi.hoisted(() => ({ pathname: "/pt", push: vi.fn() }));
vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ push: navigation.push }),
}));
vi.mock("next/image", () => ({
  default: ({ src, alt }: ImageProps) => createElement("img", { src: typeof src === "string" ? src : "", alt }),
}));
vi.mock("framer-motion", async (importOriginal) => ({
  ...await importOriginal<typeof import("framer-motion")>(),
  useReducedMotion: () => true,
}));

beforeEach(() => {
  navigation.pathname = "/pt";
  navigation.push.mockReset();
  vi.stubGlobal("scrollY", 0);
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
    matches: true, media: query, addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
});

afterEach(() => {
  cleanup();
  window.history.replaceState({}, "", "/");
  vi.unstubAllGlobals();
});

function renderNavbar(locale: Locale = "pt") {
  const dictionary = getDictionary(locale);
  return {
    ...render(<LocaleProvider locale={locale} dictionary={dictionary}><Navbar /></LocaleProvider>),
    copy: dictionary.navbar,
  };
}

describe("resizable portfolio navbar", () => {
  it.each(["pt", "en", "fr"] as const)("preserves the navigation and destinations in %s", (locale) => {
    const { copy } = renderNavbar(locale);
    for (const link of copy.links) {
      expect(screen.getByRole("link", { name: link.label, exact: true })).toHaveAttribute("href", `/${locale}${link.href}`);
    }
    expect(screen.getByRole("link", { name: copy.cvLabel, exact: true })).toHaveAttribute("href", `/${locale}/curriculum`);
    expect(screen.getByRole("link", { name: copy.contactCta })).toHaveAttribute("href", `/${locale}#contato`);
  });

  it("compacts on scroll and expands again at the top", () => {
    const { copy } = renderNavbar();
    const desktop = screen.getAllByRole("navigation", { name: copy.navigationLabel })[0];
    expect(desktop).toHaveAttribute("data-compact", "false");
    vi.stubGlobal("scrollY", 140);
    fireEvent.scroll(window);
    expect(desktop).toHaveAttribute("data-compact", "true");
    vi.stubGlobal("scrollY", 0);
    fireEvent.scroll(window);
    expect(desktop).toHaveAttribute("data-compact", "false");
  });

  it("opens the mobile links and closes the panel after selecting a section", async () => {
    const { copy } = renderNavbar();
    const toggle = screen.getByRole("button", { name: copy.openMenuLabel });
    fireEvent.click(toggle);
    const menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(within(menu).getByRole("link", { name: copy.mobileCvLabel })).toHaveAttribute("href", "/pt/curriculum");
    const projectsLink = within(menu).getByRole("link", { name: copy.links[4].label });
    projectsLink.addEventListener("click", (event) => event.preventDefault(), { once: true });
    fireEvent.click(projectsLink);
    await waitFor(() => expect(menu).not.toBeInTheDocument());
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("dismisses the mobile menu with Escape or an outside click", async () => {
    const { copy } = renderNavbar();
    const toggle = screen.getByRole("button", { name: copy.openMenuLabel });
    fireEvent.click(toggle);
    let menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    within(menu).getByRole("link", { name: copy.links[0].label }).focus();
    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() => expect(menu).not.toBeInTheDocument());
    expect(toggle).toHaveFocus();
    fireEvent.click(toggle);
    menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(menu).not.toBeInTheDocument());
  });

  it("changes the desktop language while keeping the current route, query and anchor", () => {
    navigation.pathname = "/pt/contato";
    window.history.replaceState({}, "", "/pt/contato?from=menu#contato");
    const { copy } = renderNavbar();
    const language = screen.getByRole("button", { name: `${copy.localeSwitcherLabel}: Português` });
    fireEvent.click(language);
    fireEvent.click(screen.getByRole("button", { name: "English", exact: true }));
    expect(navigation.push).toHaveBeenCalledWith("/en/contato?from=menu#contato");
    expect(language).toHaveAttribute("aria-expanded", "false");
  });

  it("changes the mobile language and closes the menu", async () => {
    window.history.replaceState({}, "", "/pt#projeto");
    const { copy } = renderNavbar();
    const toggle = screen.getByRole("button", { name: copy.openMenuLabel });
    fireEvent.click(toggle);
    const menu = document.getElementById(toggle.getAttribute("aria-controls")!)!;
    fireEvent.click(within(menu).getByRole("button", { name: "Français" }));
    expect(navigation.push).toHaveBeenCalledWith("/fr#projeto");
    await waitFor(() => expect(menu).not.toBeInTheDocument());
  });

  it("closes the language disclosure with Escape and returns focus to its trigger", () => {
    const { copy } = renderNavbar();
    const language = screen.getByRole("button", { name: `${copy.localeSwitcherLabel}: Português` });
    fireEvent.click(language);
    screen.getByRole("button", { name: "English", exact: true }).focus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(language).toHaveAttribute("aria-expanded", "false");
    expect(language).toHaveFocus();
  });
});
