import { act, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import FloatingBackground from "./FloatingBackground";

describe("FloatingBackground", () => {
  const ctx = {
    clearRect: vi.fn(),
    setTransform: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    fillStyle: "",
  };
  let reducedMotion = false;
  let hidden = false;
  let nextFrame = 0;
  let frames: Map<number, FrameRequestCallback>;
  let motionListeners: Set<() => void>;

  const tick = (timestamp: number) => {
    const pending = [...frames.values()];
    frames.clear();
    act(() => pending.forEach((callback) => callback(timestamp)));
  };

  beforeEach(() => {
    vi.clearAllMocks();
    reducedMotion = false;
    hidden = false;
    nextFrame = 0;
    frames = new Map();
    motionListeners = new Set();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
    vi.spyOn(document, "hidden", "get").mockImplementation(() => hidden);
    vi.spyOn(Math, "random").mockReturnValue(0.1);
    vi.stubGlobal("innerWidth", 1440);
    vi.stubGlobal("innerHeight", 900);
    vi.stubGlobal("devicePixelRatio", 3);
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      get matches() { return reducedMotion; },
      addEventListener: (_event: string, listener: () => void) => motionListeners.add(listener),
      removeEventListener: (_event: string, listener: () => void) => motionListeners.delete(listener),
    })));
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback);
      return nextFrame;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => frames.delete(id)));
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("caps pixel density and reduces the star count when resized to mobile", () => {
    const { container, unmount } = render(<FloatingBackground />);
    const canvas = container.querySelector("canvas")!;
    expect(canvas.width).toBe(2880);
    expect(canvas.height).toBe(1800);
    expect(ctx.setTransform).toHaveBeenLastCalledWith(2, 0, 0, 2, 0, 0);
    const desktopArcs = ctx.arc.mock.calls.length / 2;

    ctx.arc.mockClear();
    vi.stubGlobal("innerWidth", 390);
    vi.stubGlobal("innerHeight", 844);
    fireEvent(window, new Event("resize"));
    expect(canvas.width).toBe(780);
    expect(canvas.height).toBe(1688);
    expect(ctx.arc.mock.calls.length).toBeLessThan(desktopArcs);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    unmount();
  });

  it("renders static stars for reduced motion and responds to preference changes", () => {
    reducedMotion = true;
    const { container, unmount } = render(<FloatingBackground />);
    expect(ctx.arc).toHaveBeenCalled();
    expect(frames.size).toBe(0);
    expect(container.firstChild).toHaveAttribute("data-paused", "true");

    reducedMotion = false;
    act(() => motionListeners.forEach((listener) => listener()));
    expect(frames.size).toBe(1);
    expect(container.firstChild).toHaveAttribute("data-paused", "false");

    reducedMotion = true;
    act(() => motionListeners.forEach((listener) => listener()));
    expect(frames.size).toBe(0);
    unmount();
  });

  it("pauses while hidden and resumes without advancing through the hidden interval", () => {
    const { container, unmount } = render(<FloatingBackground />);
    tick(0);
    tick(50);
    const position = ctx.arc.mock.calls.at(-1);

    hidden = true;
    fireEvent(document, new Event("visibilitychange"));
    expect(frames.size).toBe(0);
    expect(container.firstChild).toHaveAttribute("data-paused", "true");

    hidden = false;
    fireEvent(document, new Event("visibilitychange"));
    tick(10_000);
    expect(frames.size).toBe(1);
    expect(ctx.arc.mock.calls.at(-1)).toEqual(position);
    unmount();
  });

  it("moves stars by elapsed time independently of frame frequency", () => {
    const first = render(<FloatingBackground />);
    [0, 20, 40, 60].forEach(tick);
    const position = ctx.arc.mock.calls.at(-1);
    first.unmount();

    const second = render(<FloatingBackground />);
    [0, 60].forEach(tick);
    expect(ctx.arc.mock.calls.at(-1)).toEqual(position);
    second.unmount();
  });

  it("cancels animation and removes listeners on unmount", () => {
    const { unmount } = render(<FloatingBackground />);
    tick(0);
    unmount();
    expect(frames.size).toBe(0);
    expect(motionListeners.size).toBe(0);
    ctx.clearRect.mockClear();
    fireEvent(window, new Event("resize"));
    fireEvent(document, new Event("visibilitychange"));
    expect(ctx.clearRect).not.toHaveBeenCalled();
  });
});
