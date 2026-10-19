import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MouseGlow from "./MouseGlow";

let currentPathname = "/pt";

vi.mock("next/navigation", () => ({
  usePathname: () => currentPathname,
}));

describe("MouseGlow", () => {
  beforeEach(() => {
    currentPathname = "/pt";
    document.querySelector("#mouse-glow")?.remove();
  });

  it("does not render on localized home pages", () => {
    const { rerender } = render(<MouseGlow />);
    expect(document.querySelector("#mouse-glow")).not.toBeInTheDocument();

    currentPathname = "/en";
    rerender(<MouseGlow />);
    expect(document.querySelector("#mouse-glow")).not.toBeInTheDocument();
  });

  it("keeps the glow on inner routes and cleans it up when returning home", () => {
    currentPathname = "/pt/blog";
    const { rerender } = render(<MouseGlow />);
    expect(document.querySelector("#mouse-glow")).toBeInTheDocument();

    currentPathname = "/pt";
    rerender(<MouseGlow />);
    expect(document.querySelector("#mouse-glow")).not.toBeInTheDocument();
  });
});
