"use client";

import { useEffect, useRef } from "react";
import styles from "./FloatingBackground.module.css";

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  depth: number;
  phase: number;
  color: string;
}

function wrapStarPosition(position: number, size: number) {
  const span = size + 16;
  return ((position + 8) % span + span) % span - 8;
}

export default function FloatingBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let frame: number | null = null;
    let previousTime: number | null = null;
    let elapsed = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const motion = motionPreference.matches ? 0 : elapsed;
        const angle = motion / 120 + star.phase;
        // Drift slowly to the left; nearby layers move a little faster.
        const x = wrapStarPosition(
          star.x * width - motion * star.depth * 0.6 + Math.sin(angle) * star.depth * 3,
          width,
        );
        const y = wrapStarPosition(
          star.y * height + motion * star.depth * 0.15 + Math.cos(angle * 0.7) * star.depth * 2,
          height,
        );
        const opacity = star.opacity + Math.sin(motion / 7 + star.phase) * 0.06;

        // Nearer stars have a faint halo; distant points stay crisp.
        if (star.depth >= 2) {
          ctx.fillStyle = `rgba(${star.color}, ${opacity * 0.1})`;
          ctx.beginPath();
          ctx.arc(x, y, star.radius * 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = `rgba(${star.color}, ${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      const count = Math.min(
        width < 768 ? 300 : 900,
        Math.max(180, Math.round(width * height / 1500)),
      );
      stars = Array.from({ length: count }, (_, index) => {
        const depth = index < count * 0.78 ? 1 : index < count * 0.96 ? 2 : 3;
        const x = Math.random();
        // A loose band of distant stars follows the galactic dust, without a grid.
        const y = index % 3 === 0
          ? Math.min(0.98, Math.max(0.02, 0.85 - x * 0.7 + (Math.random() - 0.5) * 0.4))
          : Math.random();
        return {
          x,
          y,
          radius: (depth === 1 ? 0.3 : 0.15 + depth * 0.35) + Math.random() * 0.45,
          opacity: 0.22 + depth * 0.15 + Math.random() * 0.18,
          depth,
          phase: Math.random() * Math.PI * 2,
          color: Math.random() < 0.22 ? "248, 230, 204" : "218, 231, 255",
        };
      });
      draw();
    };

    const animate = (timestamp: number) => {
      if (previousTime !== null) elapsed += Math.min(timestamp - previousTime, 100) / 1000;
      previousTime = timestamp;
      draw();
      frame = requestAnimationFrame(animate);
    };

    const syncAnimation = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      previousTime = null;
      container.dataset.paused = String(document.hidden || motionPreference.matches);
      draw();
      if (!document.hidden && !motionPreference.matches) {
        frame = requestAnimationFrame(animate);
      }
    };

    resize();
    syncAnimation();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", syncAnimation);
    motionPreference.addEventListener("change", syncAnimation);

    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", syncAnimation);
      motionPreference.removeEventListener("change", syncAnimation);
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.space} aria-hidden="true" data-paused="true">
      <div className={styles.galaxy} />
      <canvas ref={canvasRef} className={styles.stars} />
      <div className={styles.meteor}>
        <div className={styles.shootingStar} />
      </div>
      <div className={styles.moon} />
      <div className={styles.planet} />
      <div className={`${styles.satelliteOrbit} ${styles.nearOrbit}`}>
        <div className={styles.satellite} />
      </div>
      <div className={`${styles.satelliteOrbit} ${styles.farOrbit}`}>
        <div className={styles.satellite} />
      </div>
      <div className={`${styles.satelliteOrbit} ${styles.distantOrbit}`}>
        <div className={styles.satellite} />
      </div>
      <div className={styles.shade} />
    </div>
  );
}
