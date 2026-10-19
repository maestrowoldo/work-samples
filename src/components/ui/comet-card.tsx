"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import clsx from "clsx";
import styles from "./comet-card.module.css";

interface CometCardProps {
  children: ReactNode;
  className?: string;
  rotateDepth?: number;
  translateDepth?: number;
  disabled?: boolean;
}

const spring = { stiffness: 180, damping: 24, mass: 0.7 };

export function CometCard({ children, className, rotateDepth = 8, translateDepth = 5, disabled = false }: CometCardProps) {
  const enabled = useRef(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const light = useMotionValue(0);
  const x = useSpring(pointerX, spring);
  const y = useSpring(pointerY, spring);
  const opacity = useSpring(light, spring);
  const rotateX = useTransform(y, [-1, 1], [rotateDepth, -rotateDepth]);
  const rotateY = useTransform(x, [-1, 1], [-rotateDepth, rotateDepth]);
  const translateX = useTransform(x, [-1, 1], [-translateDepth, translateDepth]);
  const translateY = useTransform(y, [-1, 1], [-translateDepth, translateDepth]);
  const lightX = useTransform(x, [-1, 1], [0, 100]);
  const lightY = useTransform(y, [-1, 1], [0, 100]);
  const reflection = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, rgb(190 242 255 / 55%), transparent 65%), linear-gradient(115deg, transparent 35%, rgb(255 255 255 / 8%) 50%, transparent 65%)`;

  useEffect(() => {
    const preference = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const update = () => {
      enabled.current = preference.matches && !disabled;
      if (!enabled.current) {
        pointerX.set(0); pointerY.set(0); light.set(0);
        x.jump(0); y.jump(0); opacity.jump(0);
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, [disabled, pointerX, pointerY, light, x, y, opacity]);

  const reset = () => { pointerX.set(0); pointerY.set(0); light.set(0); };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    if (!enabled.current || event.pointerType !== "mouse") return;
    // Measure the stationary wrapper, so the transformed surface cannot feed back into the tilt.
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    pointerX.set(Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)));
    pointerY.set(Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1)));
    light.set(0.28);
  };

  return (
    <div className={clsx(styles.root, className)} data-comet-card="" data-disabled={disabled}
      onPointerMove={move} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset}>
      <motion.div className={styles.surface} data-comet-surface=""
        style={{ rotateX, rotateY, x: translateX, y: translateY }}>
        {children}
        <motion.div className={styles.reflection} aria-hidden="true" style={{ background: reflection, opacity }} />
      </motion.div>
    </div>
  );
}
