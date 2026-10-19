"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import styles from "./CursorTrail.module.css";

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  color: string;
  driftX: number;
  driftY: number;
  rotation: number;
  size: number;
}

const CURSOR_TRAIL_CONFIG = {
  gridSize: 24,
  durationMs: 880,
  maxParticles: 20,
} as const;

const PARTICLE_COLORS = ["52 211 153", "34 211 238", "167 139 250"] as const;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FINE_POINTER_QUERY = "(pointer: fine)";

export default function CursorTrail() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const cursorAuraRef = useRef<HTMLSpanElement>(null);
  const nextParticleId = useRef(0);
  const lastGridPosition = useRef<string | null>(null);
  const particleTimeouts = useRef(new Map<number, ReturnType<typeof setTimeout>>());

  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const updateAvailability = () => {
      const canShowTrail = finePointer.matches && !reducedMotion.matches;
      setIsEnabled(canShowTrail);

      if (!canShowTrail) {
        setParticles([]);
        lastGridPosition.current = null;
      }
    };

    updateAvailability();
    reducedMotion.addEventListener("change", updateAvailability);
    finePointer.addEventListener("change", updateAvailability);

    return () => {
      reducedMotion.removeEventListener("change", updateAvailability);
      finePointer.removeEventListener("change", updateAvailability);
    };
  }, []);

  useEffect(() => {
    if (!isEnabled) {
      lastGridPosition.current = null;
      return;
    }

    const timeouts = particleTimeouts.current;

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse" && event.pointerType !== "pen") {
        return;
      }

      if (cursorAuraRef.current) {
        cursorAuraRef.current.style.transform =
          `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
        cursorAuraRef.current.dataset.visible = "true";
      }

      const x = Math.round(event.clientX / CURSOR_TRAIL_CONFIG.gridSize) * CURSOR_TRAIL_CONFIG.gridSize;
      const y = Math.round(event.clientY / CURSOR_TRAIL_CONFIG.gridSize) * CURSOR_TRAIL_CONFIG.gridSize;
      const gridPosition = `${x}:${y}`;

      if (gridPosition === lastGridPosition.current) {
        return;
      }

      lastGridPosition.current = gridPosition;
      const id = nextParticleId.current++;
      const angle = (id * 137.5 * Math.PI) / 180;
      const driftDistance = 16 + (id % 4) * 5;
      const particle = {
        id,
        x,
        y,
        color: PARTICLE_COLORS[id % PARTICLE_COLORS.length],
        driftX: Math.round(Math.cos(angle) * driftDistance),
        driftY: Math.round(Math.sin(angle) * driftDistance - 10),
        rotation: (id * 47) % 180,
        size: 5 + (id % 3) * 2,
      };

      setParticles((currentParticles) => [
        ...currentParticles.slice(-(CURSOR_TRAIL_CONFIG.maxParticles - 1)),
        particle,
      ]);

      const timeout = setTimeout(() => {
        setParticles((currentParticles) =>
          currentParticles.filter((currentParticle) => currentParticle.id !== particle.id),
        );
        timeouts.delete(particle.id);
      }, CURSOR_TRAIL_CONFIG.durationMs);
      timeouts.set(particle.id, timeout);
    };

    const handlePointerLeave = () => {
      lastGridPosition.current = null;

      if (cursorAuraRef.current) {
        cursorAuraRef.current.dataset.visible = "false";
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerleave", handlePointerLeave);
      timeouts.forEach((timeout) => clearTimeout(timeout));
      timeouts.clear();
    };
  }, [isEnabled]);

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={styles.overlay} aria-hidden="true" data-testid="cursor-trail">
      <span ref={cursorAuraRef} className={styles.cursorAura} data-visible="false" />
      {particles.map((particle) => (
        <span
          key={particle.id}
          className={styles.particle}
          data-cursor-trail-particle=""
          style={
            {
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              "--cursor-trail-size": `${particle.size}px`,
              "--cursor-trail-duration": `${CURSOR_TRAIL_CONFIG.durationMs}ms`,
              "--cursor-trail-color": particle.color,
              "--cursor-trail-drift-x": `${particle.driftX}px`,
              "--cursor-trail-drift-y": `${particle.driftY}px`,
              "--cursor-trail-rotation": `${particle.rotation}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
