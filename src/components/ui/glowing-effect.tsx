"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import clsx from "clsx";
import styles from "./glowing-effect.module.css";

interface GlowingEffectProps {
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  proximity?: number;
  inactiveZone?: number;
  className?: string;
  alwaysOn?: boolean;
}

export function GlowingEffect({ spread = 40, glow = false, disabled = true, proximity = 64, inactiveZone = 0.01, className, alwaysOn = false }: GlowingEffectProps) {
  const effectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const effect = effectRef.current;
    const card = effect?.parentElement;
    if (!effect || !card || disabled || alwaysOn) return;
    const preference = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    let angle: number | null = null;
    let previousTime = 0;

    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      angle = null;
      effect.style.setProperty("--glow-active", "0");
    };

    const update = (time: number) => {
      frame = 0;
      if (!pointer || !preference.matches || document.hidden) { reset(); return; }
      const bounds = card.getBoundingClientRect();
      const { x, y } = pointer;
      const dx = x - (bounds.left + bounds.width / 2);
      const dy = y - (bounds.top + bounds.height / 2);
      const near = bounds.width > 0 && bounds.height > 0
        && x >= bounds.left - proximity && x <= bounds.right + proximity
        && y >= bounds.top - proximity && y <= bounds.bottom + proximity;
      const insideInactiveZone = Math.hypot(dx, dy) < Math.min(bounds.width, bounds.height) * Math.max(0, inactiveZone) / 2;
      if (!near || insideInactiveZone) { reset(); return; }

      const target = Math.atan2(dy, dx) * 180 / Math.PI + 90;
      if (angle === null) angle = target;
      // Follow the shortest arc, including when crossing the 0/360-degree seam.
      const delta = (((target - angle) % 360 + 540) % 360) - 180;
      const elapsed = Math.min(64, Math.max(1, time - previousTime));
      angle += delta * (1 - Math.exp(-elapsed / 65));
      previousTime = time;
      effect.style.setProperty("--glow-angle", `${angle}deg`);
      effect.style.setProperty("--glow-active", "1");
      if (Math.abs(delta) > 0.05) frame = requestAnimationFrame(update);
    };

    const schedule = () => {
      if (!frame && pointer && preference.matches && !document.hidden) frame = requestAnimationFrame(update);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
      schedule();
    };
    const leave = () => { pointer = null; reset(); };
    const updatePreference = () => { if (preference.matches) schedule(); else leave(); };
    const visibility = () => { if (document.hidden) leave(); };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("blur", leave);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", updatePreference);
    return () => {
      reset();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("blur", leave);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", updatePreference);
    };
  }, [disabled, proximity, inactiveZone, alwaysOn]);

  return (
    <div ref={effectRef} className={clsx(styles.effect, className)} data-glowing-effect=""
      data-always-on={alwaysOn && !disabled} aria-hidden="true"
      style={{ "--glow-spread": `${Math.max(1, Math.min(180, spread))}deg` } as CSSProperties}>
      {glow && <div className={clsx(styles.ring, styles.halo)} />}
      <div className={styles.ring} />
    </div>
  );
}
