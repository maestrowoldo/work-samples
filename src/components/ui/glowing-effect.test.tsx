import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GlowingEffect } from "./glowing-effect";

describe("project edge glow", () => {
  let frames: Map<number, FrameRequestCallback>;
  let frameId: number;
  let time: number;
  let allowed: boolean;
  let changePreference: () => void;

  const move = (x: number, y: number, pointerType = "mouse") => {
    const event = new Event("pointermove");
    Object.assign(event, { clientX: x, clientY: y, pointerType });
    fireEvent(document, event);
  };
  const tick = () => {
    time += 16;
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(time));
  };
  const setup = () => {
    const view = render(<article><GlowingEffect disabled={false} glow proximity={64} inactiveZone={0.01} /></article>);
    const card = view.container.firstElementChild!;
    vi.spyOn(card, "getBoundingClientRect").mockReturnValue(new DOMRect(100, 100, 200, 200));
    return { ...view, effect: card.querySelector<HTMLElement>("[data-glowing-effect]")! };
  };

  beforeEach(() => {
    frames = new Map(); frameId = 0; time = 0; allowed = true;
    changePreference = () => {};
    vi.stubGlobal("requestAnimationFrame", vi.fn((callback: FrameRequestCallback) => {
      frames.set(++frameId, callback); return frameId;
    }));
    vi.stubGlobal("cancelAnimationFrame", vi.fn((id: number) => frames.delete(id)));
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      get matches() { return allowed; },
      addEventListener: (_type: string, listener: () => void) => { changePreference = listener; },
      removeEventListener: vi.fn(),
    })));
  });

  afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("lights near the card and fades away outside its proximity or at its inactive center", () => {
    const { effect } = setup();
    move(95, 180); tick();
    expect(effect.style.getPropertyValue("--glow-active")).toBe("1");
    move(0, 180); tick();
    expect(effect.style.getPropertyValue("--glow-active")).toBe("0");
    move(200, 200); tick();
    expect(effect.style.getPropertyValue("--glow-active")).toBe("0");
  });

  it("follows the pointer around the edge and stops requesting frames once settled", () => {
    const { effect } = setup();
    move(290, 200); tick();
    const initial = effect.style.getPropertyValue("--glow-angle");
    move(200, 290);
    for (let count = 0; count < 50; count++) tick();
    expect(effect.style.getPropertyValue("--glow-angle")).not.toBe(initial);
    expect(frames.size).toBe(0);
  });

  it("ignores touch and stops immediately when motion preferences change", () => {
    const { effect } = setup();
    move(290, 200, "touch"); tick();
    expect(effect.style.getPropertyValue("--glow-active")).not.toBe("1");
    move(290, 200); tick();
    expect(effect.style.getPropertyValue("--glow-active")).toBe("1");
    allowed = false; changePreference();
    expect(effect.style.getPropertyValue("--glow-active")).toBe("0");
    move(200, 290); tick();
    expect(frames.size).toBe(0);
  });

  it("cancels pending animation and listeners when removed", () => {
    const { unmount } = setup();
    move(290, 200);
    expect(frames.size).toBe(1);
    unmount();
    expect(frames.size).toBe(0);
    move(200, 290);
    expect(frames.size).toBe(0);
  });
});
