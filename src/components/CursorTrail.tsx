"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./CursorTrail.module.css";

interface TrailPoint {
  x: number;
  y: number;
  time: number;
}

const TRAIL_LIFETIME_MS = 800;
const MAX_POINTS = 64;
const MAX_JUMP_DISTANCE = 320;
const TRAIL_COLORS = ["#67e8f9", "#6ee7b7", "#c4b5fd"];
const RIBBONS = [
  { name: "glow", offset: 0, color: 0 },
  { name: "main", offset: 0, color: 0 },
  { name: "emerald", offset: 8, color: 1 },
  { name: "violet", offset: -7, color: 2 },
] as const;

function buildRibbon(points: TrailPoint[], offset: number) {
  const curve = points.map((point, index) => {
    const before = points[Math.max(0, index - 1)];
    const after = points[Math.min(points.length - 1, index + 1)];
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const length = Math.hypot(dx, dy) || 1;
    const spread = Math.sin(index / (points.length - 1) * Math.PI) * offset;
    return { x: point.x - dy / length * spread, y: point.y + dx / length * spread };
  });

  let path = `M ${curve[0].x.toFixed(1)} ${curve[0].y.toFixed(1)}`;
  for (let index = 1; index < curve.length - 1; index++) {
    const point = curve[index];
    const next = curve[index + 1];
    path += ` Q ${point.x.toFixed(1)} ${point.y.toFixed(1)} ${((point.x + next.x) / 2).toFixed(1)} ${((point.y + next.y) / 2).toFixed(1)}`;
  }
  const head = curve[curve.length - 1];
  return `${path} L ${head.x.toFixed(1)} ${head.y.toFixed(1)}`;
}

export default function CursorTrail() {
  const [isEnabled, setIsEnabled] = useState(false);
  const gradientId = useId();
  const cursorAuraRef = useRef<HTMLSpanElement>(null);
  const cursorCoreRef = useRef<HTMLSpanElement>(null);
  const ribbonRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const gradientRefs = useRef<(SVGLinearGradientElement | null)[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(pointer: fine)");
    const updateAvailability = () => setIsEnabled(finePointer.matches && !reducedMotion.matches);
    updateAvailability();
    reducedMotion.addEventListener("change", updateAvailability);
    finePointer.addEventListener("change", updateAvailability);
    return () => {
      reducedMotion.removeEventListener("change", updateAvailability);
      finePointer.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    let points: TrailPoint[] = [];
    let previous: TrailPoint | null = null;
    let frame: number | null = null;

    const clearRibbon = () => {
      pathRefs.current.forEach((path) => path?.setAttribute("d", ""));
      if (ribbonRef.current) ribbonRef.current.style.opacity = "0";
    };

    const draw = (now: number) => {
      frame = null;
      points = points.filter((point) => now - point.time < TRAIL_LIFETIME_MS);
      if (points.length < 2) {
        clearRibbon();
        return;
      }

      const tail = points[0];
      const head = points[points.length - 1];
      const opacity = Math.max(0, 1 - (now - head.time) / TRAIL_LIFETIME_MS);
      if (ribbonRef.current) ribbonRef.current.style.opacity = String(opacity * opacity);

      gradientRefs.current.forEach((gradient) => {
        if (!gradient) return;
        gradient.setAttribute("x1", String(tail.x));
        gradient.setAttribute("y1", String(tail.y));
        // Keep the gradient defined when a curve returns to its starting point.
        gradient.setAttribute("x2", String(head.x === tail.x && head.y === tail.y ? head.x + 1 : head.x));
        gradient.setAttribute("y2", String(head.y));
      });
      RIBBONS.forEach((ribbon, index) => {
        pathRefs.current[index]?.setAttribute("d", buildRibbon(points, ribbon.offset));
      });
      frame = requestAnimationFrame(draw);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;

      const target = event.target instanceof Element
        ? event.target.closest('a[href], button, [role="button"], input, textarea, select, summary, label[for], [contenteditable="true"]')
        : null;
      const interactive = Boolean(target && !target.matches(':disabled, [aria-disabled="true"]'));
      for (const element of [cursorAuraRef.current, cursorCoreRef.current]) {
        if (!element) continue;
        element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        element.dataset.visible = "true";
        element.dataset.interactive = String(interactive);
      }

      const point = { x: event.clientX, y: event.clientY, time: performance.now() };
      if (!previous || point.time - previous.time >= TRAIL_LIFETIME_MS) {
        points = [point];
        previous = point;
        clearRibbon();
        return;
      }

      const dx = point.x - previous.x;
      const dy = point.y - previous.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 2) return;

      // Interpolate fast movements so the tail stays continuous and bounded.
      const length = Math.min(distance, MAX_JUMP_DISTANCE);
      const start = distance > MAX_JUMP_DISTANCE
        ? { x: point.x - dx / distance * length, y: point.y - dy / distance * length }
        : previous;
      if (distance > MAX_JUMP_DISTANCE) points = [];
      const steps = Math.ceil(length / 6);
      for (let index = 1; index <= steps; index++) {
        points.push({
          x: start.x + (point.x - start.x) * index / steps,
          y: start.y + (point.y - start.y) * index / steps,
          time: point.time,
        });
      }
      points = points.slice(-MAX_POINTS);
      previous = point;
      if (frame === null) frame = requestAnimationFrame(draw);
    };

    const hide = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      points = [];
      previous = null;
      clearRibbon();
      for (const element of [cursorAuraRef.current, cursorCoreRef.current]) {
        if (!element) continue;
        element.dataset.visible = "false";
        element.dataset.pressed = "false";
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") return;
      if (cursorAuraRef.current) cursorAuraRef.current.dataset.pressed = "true";
      if (cursorCoreRef.current) cursorCoreRef.current.dataset.pressed = "true";
    };
    const handlePointerUp = () => {
      if (cursorAuraRef.current) cursorAuraRef.current.dataset.pressed = "false";
      if (cursorCoreRef.current) cursorCoreRef.current.dataset.pressed = "false";
    };
    const handleVisibilityChange = () => {
      if (document.hidden) hide();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("resize", hide);
    document.addEventListener("pointerleave", hide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", hide);
      document.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className={styles.overlay} aria-hidden="true" data-testid="cursor-trail">
      <span ref={cursorAuraRef} className={styles.cursorAura} data-visible="false" />
      <span ref={cursorCoreRef} className={styles.cursorCore} data-visible="false" />
      <svg ref={ribbonRef} className={styles.ribbons} width="100%" height="100%" focusable="false">
        <defs>
          {TRAIL_COLORS.map((color, index) => (
            <linearGradient key={color} id={`${gradientId}-${index}`} gradientUnits="userSpaceOnUse"
              ref={(element) => { gradientRefs.current[index] = element; }}>
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="55%" stopColor={color} stopOpacity="0.65" />
              <stop offset="100%" stopColor={index === 0 ? "#effdff" : color} />
            </linearGradient>
          ))}
        </defs>
        {RIBBONS.map((ribbon, index) => (
          <path key={ribbon.name} ref={(element) => { pathRefs.current[index] = element; }}
            className={styles[ribbon.name]} data-cursor-trail-line={ribbon.name}
            fill="none" stroke={`url(#${gradientId}-${ribbon.color})`} strokeLinecap="round" strokeLinejoin="round" />
        ))}
      </svg>
    </div>
  );
}
