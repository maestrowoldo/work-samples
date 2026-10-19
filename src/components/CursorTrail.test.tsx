import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CursorTrail from "./CursorTrail";

const installMatchMedia = ({ finePointer = true, reducedMotion = false } = {}) => {
  vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
    matches: query === "(pointer: fine)" ? finePointer : reducedMotion,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })));
};

describe("CursorTrail", () => {
  let now = 0;
  let nextFrame = 0;
  let frames: Map<number, FrameRequestCallback>;

  const tick = (timestamp: number) => {
    now = timestamp;
    const pending = [...frames.values()];
    frames.clear();
    act(() => pending.forEach((callback) => callback(now)));
  };
  const move = (x: number, y: number) => {
    fireEvent.pointerMove(window, { clientX: x, clientY: y, pointerType: "mouse" });
  };
  const mainLine = () => document.querySelector<SVGPathElement>('[data-cursor-trail-line="main"]')!;

  beforeEach(() => {
    installMatchMedia();
    now = 0;
    nextFrame = 0;
    frames = new Map();
    vi.spyOn(performance, "now").mockImplementation(() => now);
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => frames.delete(id)));
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("connects pointer movement with continuous curves ending at the cursor", () => {
    render(<CursorTrail />);
    move(45, 79);
    move(150, 110);
    tick(16);

    expect(mainLine().getAttribute("d")).toContain(" Q ");
    expect(mainLine().getAttribute("d")).toMatch(/L 150\.0 110\.0$/);
    const gradients = document.querySelectorAll("linearGradient");
    expect(gradients[0]).toHaveAttribute("x2", "150");
    expect(gradients[0]).toHaveAttribute("y2", "110");
  });

  it("fades the ribbon after movement stops and stops requesting frames", () => {
    render(<CursorTrail />);
    move(40, 40);
    move(160, 100);
    tick(16);
    const svg = document.querySelector("svg")!;
    const initialOpacity = Number(svg.style.opacity);
    tick(250);
    expect(Number(svg.style.opacity)).toBeLessThan(initialOpacity);
    expect(Number(svg.style.opacity)).toBeGreaterThan(0);
    tick(900);
    expect(mainLine()).toHaveAttribute("d", "");
    expect(svg.style.opacity).toBe("0");
    expect(frames.size).toBe(0);
  });

  it("keeps the trail short when the pointer jumps across the viewport", () => {
    render(<CursorTrail />);
    move(10, 20);
    move(4000, 20);
    tick(16);
    const path = mainLine().getAttribute("d")!;
    const tailX = Number(path.match(/^M ([\d.]+)/)![1]);
    expect(4000 - tailX).toBeLessThan(400);
    expect(path).not.toContain("NaN");
    expect(path).toMatch(/L 4000\.0 20\.0$/);
    expect(frames.size).toBe(1);
  });

  it("moves the comet head and clears the ribbon when the pointer leaves", () => {
    render(<CursorTrail />);
    const overlay = screen.getByTestId("cursor-trail");
    move(120, 84);
    move(180, 84);
    tick(16);
    expect(overlay.firstElementChild).toHaveStyle({
      transform: "translate3d(180px, 84px, 0) translate(-50%, -50%)",
    });
    expect(overlay.firstElementChild).toHaveAttribute("data-visible", "true");
    fireEvent.pointerLeave(document);
    expect(overlay.firstElementChild).toHaveAttribute("data-visible", "false");
    expect(overlay.children[1]).toHaveAttribute("data-visible", "false");
    expect(mainLine()).toHaveAttribute("d", "");
    expect(frames.size).toBe(0);
  });

  it("reacts to links and clicks and resets when the window loses focus", () => {
    render(<><CursorTrail /><button>Project</button><button disabled>Unavailable</button></>);
    const aura = screen.getByTestId("cursor-trail").firstElementChild!;
    const button = screen.getByRole("button", { name: "Project" });
    fireEvent.pointerMove(button, { clientX: 120, clientY: 84, pointerType: "mouse" });
    expect(aura).toHaveAttribute("data-interactive", "true");
    fireEvent.pointerDown(button, { pointerType: "mouse" });
    expect(aura).toHaveAttribute("data-pressed", "true");
    fireEvent.pointerUp(button, { pointerType: "mouse" });
    expect(aura).toHaveAttribute("data-pressed", "false");
    fireEvent.pointerMove(screen.getByRole("button", { name: "Unavailable" }), {
      clientX: 150, clientY: 84, pointerType: "mouse",
    });
    tick(16);
    expect(aura).toHaveAttribute("data-interactive", "false");
    fireEvent.blur(window);
    expect(aura).toHaveAttribute("data-visible", "false");
    expect(mainLine()).toHaveAttribute("d", "");
    expect(frames.size).toBe(0);
  });

  it("cancels its pending animation and detaches events on unmount", () => {
    const { unmount } = render(<CursorTrail />);
    move(10, 20);
    move(100, 100);
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    move(150, 150);
    expect(frames.size).toBe(0);
  });

  it.each([
    { finePointer: false, reducedMotion: false },
    { finePointer: true, reducedMotion: true },
  ])("stays disabled with pointer preferences %j", (preferences) => {
    installMatchMedia(preferences);
    render(<CursorTrail />);
    move(100, 100);
    expect(screen.queryByTestId("cursor-trail")).not.toBeInTheDocument();
    expect(frames.size).toBe(0);
  });
});
