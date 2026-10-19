import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CursorTrail from "./CursorTrail";

const installMatchMedia = ({
  finePointer = true,
  reducedMotion = false,
}: {
  finePointer?: boolean;
  reducedMotion?: boolean;
} = {}) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: query === "(pointer: fine)" ? finePointer : reducedMotion,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
};

describe("CursorTrail", () => {
  beforeEach(() => {
    installMatchMedia();
  });

  it("creates grid-aligned particles and removes them after animation", async () => {
    render(<CursorTrail />);
    await screen.findByTestId("cursor-trail");

    fireEvent.pointerMove(window, { clientX: 45, clientY: 79, pointerType: "mouse" });

    const particle = document.querySelector<HTMLElement>("[data-cursor-trail-particle]");
    expect(particle).toHaveStyle({ left: "48px", top: "72px" });
    expect(particle?.style.getPropertyValue("--cursor-trail-drift-x")).not.toBe("");
    expect(particle?.style.getPropertyValue("--cursor-trail-color")).not.toBe("");

    await waitFor(() => {
      expect(document.querySelector("[data-cursor-trail-particle]")).not.toBeInTheDocument();
    }, { timeout: 1_200 });
  });

  it("does not create duplicate particles inside the same grid position", async () => {
    render(<CursorTrail />);
    await screen.findByTestId("cursor-trail");

    fireEvent.pointerMove(window, { clientX: 25, clientY: 25, pointerType: "mouse" });
    fireEvent.pointerMove(window, { clientX: 34, clientY: 34, pointerType: "mouse" });

    expect(document.querySelectorAll("[data-cursor-trail-particle]")).toHaveLength(1);
  });

  it("caps the visible trail length", async () => {
    render(<CursorTrail />);
    await screen.findByTestId("cursor-trail");

    for (let index = 0; index < 20; index += 1) {
      fireEvent.pointerMove(window, {
        clientX: index * 24,
        clientY: 24,
        pointerType: "mouse",
      });
    }

    expect(document.querySelectorAll("[data-cursor-trail-particle]")).toHaveLength(20);
  });

  it("moves and hides the spatial cursor aura", async () => {
    render(<CursorTrail />);
    const overlay = await screen.findByTestId("cursor-trail");
    const aura = overlay.firstElementChild as HTMLElement;

    fireEvent.pointerMove(window, { clientX: 120, clientY: 84, pointerType: "mouse" });
    expect(aura).toHaveStyle({
      transform: "translate3d(120px, 84px, 0) translate(-50%, -50%)",
    });
    expect(aura).toHaveAttribute("data-visible", "true");

    fireEvent.pointerLeave(document);
    expect(aura).toHaveAttribute("data-visible", "false");
  });

  it("stays disabled without a fine pointer or with reduced motion", async () => {
    installMatchMedia({ finePointer: false, reducedMotion: true });
    render(<CursorTrail />);

    fireEvent.pointerMove(window, { clientX: 64, clientY: 64, pointerType: "touch" });

    await waitFor(() => {
      expect(screen.queryByTestId("cursor-trail")).not.toBeInTheDocument();
    });
  });
});
