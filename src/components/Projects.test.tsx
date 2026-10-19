import { createElement } from "react";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ImageProps } from "next/image";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/site-content";
import { LocaleProvider } from "./LocaleProvider";
import Projects from "./Projects";

vi.mock("next/image", () => ({
  default: ({ src, alt }: ImageProps) => createElement("img", { src: typeof src === "string" ? src : "", alt }),
}));
vi.mock("framer-motion", async (importOriginal) => ({
  ...await importOriginal<typeof import("framer-motion")>(),
  useReducedMotion: () => true,
}));

// JSDOM has no native dialog lifecycle; real focus trapping is checked in the browser.
const originalShowModal = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "showModal");
const originalClose = Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype, "close");

beforeAll(() => {
  Object.defineProperties(HTMLDialogElement.prototype, {
    showModal: { configurable: true, value(this: HTMLDialogElement) {
      this.setAttribute("open", "");
      this.querySelector<HTMLButtonElement>("button")?.focus();
    } },
    close: { configurable: true, value(this: HTMLDialogElement) { this.removeAttribute("open"); } },
  });
});

afterAll(() => {
  for (const [key, descriptor] of [["showModal", originalShowModal], ["close", originalClose]] as const) {
    if (descriptor) Object.defineProperty(HTMLDialogElement.prototype, key, descriptor);
    else Reflect.deleteProperty(HTMLDialogElement.prototype, key);
  }
});

beforeEach(() => {
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
    matches: true, media: query, addListener: vi.fn(), removeListener: vi.fn(),
    addEventListener: vi.fn(), removeEventListener: vi.fn(),
  })));
});

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
  vi.unstubAllGlobals();
});

function renderProjects(locale: Locale = "pt") {
  const dictionary = getDictionary(locale);
  return {
    ...render(<LocaleProvider locale={locale} dictionary={dictionary}><Projects /></LocaleProvider>),
    copy: dictionary.projects,
  };
}

describe("expandable projects", () => {
  it("opens the selected case with its full details, technologies and external destination", async () => {
    const { copy } = renderProjects();
    expect(screen.getAllByRole("button", { name: /^Ver detalhes:/ })).toHaveLength(4);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const project = copy.items[1];
    fireEvent.click(screen.getByRole("button", { name: `${copy.detailsLabel}: ${project.title}` }));
    const dialog = await screen.findByRole("dialog", { name: project.title });
    await waitFor(() => {
      for (const value of [project.problem, project.solution, project.impact, ...project.tech]) {
        expect(within(dialog).getByText(value)).toBeVisible();
      }
    });
    expect(within(dialog).getByRole("link", { name: copy.visitLabel })).toHaveAttribute("href", project.href);
    expect(within(dialog).getByRole("link", { name: copy.visitLabel })).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("restores the previous scroll styles and the trigger focus after Escape", async () => {
    document.body.style.overflow = "scroll";
    document.body.style.paddingRight = "7px";
    const { copy } = renderProjects();
    const trigger = screen.getByRole("button", { name: `${copy.detailsLabel}: ${copy.items[0].title}` });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = await screen.findByRole("dialog");
    expect(document.body.style.overflow).toBe("hidden");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("scroll");
    expect(document.body.style.paddingRight).toBe("7px");
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on a backdrop click while keeping content clicks and drags inside open", async () => {
    const { copy } = renderProjects();
    fireEvent.click(screen.getByRole("button", { name: `${copy.detailsLabel}: ${copy.items[0].title}` }));
    const dialog = await screen.findByRole("dialog");
    const description = within(dialog).getByText(copy.items[0].description);
    fireEvent.pointerDown(description);
    fireEvent.click(description);
    expect(dialog).toBeInTheDocument();
    fireEvent.pointerDown(description);
    fireEvent.click(dialog);
    expect(dialog).toBeInTheDocument();
    fireEvent.pointerDown(dialog);
    fireEvent.click(dialog);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("keeps local destinations localized and closes with the close control", async () => {
    const source = getDictionary("en");
    const project = { ...source.projects.items[0], href: "/curriculum" };
    const dictionary = { ...source, projects: { ...source.projects, items: [project] } };
    const copy = dictionary.projects;
    render(<LocaleProvider locale="en" dictionary={dictionary}><Projects /></LocaleProvider>);
    fireEvent.click(screen.getByRole("button", { name: `${copy.detailsLabel}: ${project.title}` }));
    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link", { name: copy.visitLabel })).toHaveAttribute("href", "/en/curriculum");
    fireEvent.click(within(dialog).getByRole("button", { name: copy.closeLabel }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.body.style.overflow).toBe("");
  });

  it("cleans up scroll locking when the section is unmounted with a case open", async () => {
    document.body.style.overflow = "clip";
    const { copy, unmount } = renderProjects();
    fireEvent.click(screen.getByRole("button", { name: `${copy.detailsLabel}: ${copy.items[0].title}` }));
    await screen.findByRole("dialog");
    unmount();
    expect(document.body.style.overflow).toBe("clip");
  });

  it("cycles keyboard focus between the dialog controls", async () => {
    const { copy } = renderProjects();
    fireEvent.click(screen.getByRole("button", { name: `${copy.detailsLabel}: ${copy.items[0].title}` }));
    const dialog = await screen.findByRole("dialog");
    const close = within(dialog).getByRole("button", { name: copy.closeLabel });
    const visit = within(dialog).getByRole("link", { name: copy.visitLabel });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(visit).toHaveFocus();
    fireEvent.keyDown(visit, { key: "Tab" });
    expect(close).toHaveFocus();
  });
});
