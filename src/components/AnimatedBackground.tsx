"use client";

import { useEffect, useRef } from "react";
import styles from "./AnimatedBackground.module.css";

interface MousePos {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  directionX: number;
  directionY: number;
}

const ANIMATED_BACKGROUND_CONFIG = {
  glowSize: 400,
  glowOpacity: 0.2,
  glowBlur: 60,
  followSpeed: 0.08,
  glowColor: "rgba(16, 185, 129",
  particleCount: 50,
  particleMaxRadius: 1.5,
  particleMinRadius: 0.5,
  particleMaxOpacity: 0.6,
  particleMinOpacity: 0.2,
  particleSpeed: 0.5,
  animationDuration: 45,
} as const;

/**
 * Componente de Background Animado
 * - Partículas/estrelas flutuantes
 * - Efeito de glow que segue o mouse
 * - Overlay gradiente para melhorar legibilidade
 */
export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<MousePos>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // ═══════════════════════════════════════════════════════════════════
  // LISTENERS DE MOUSE
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initializeParticles = (width: number, height: number) => {
      particlesRef.current = [];

      for (let i = 0; i < ANIMATED_BACKGROUND_CONFIG.particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius:
            Math.random() *
              (ANIMATED_BACKGROUND_CONFIG.particleMaxRadius -
                ANIMATED_BACKGROUND_CONFIG.particleMinRadius) +
            ANIMATED_BACKGROUND_CONFIG.particleMinRadius,
          opacity:
            Math.random() *
              (ANIMATED_BACKGROUND_CONFIG.particleMaxOpacity -
                ANIMATED_BACKGROUND_CONFIG.particleMinOpacity) +
            ANIMATED_BACKGROUND_CONFIG.particleMinOpacity,
          speed: Math.random() * ANIMATED_BACKGROUND_CONFIG.particleSpeed + 0.1,
          directionX: (Math.random() - 0.5) * 2,
          directionY: (Math.random() - 0.5) * 2,
        });
      }
    };

    const drawParticles = () => {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle) => {
        particle.x += particle.directionX * particle.speed;
        particle.y += particle.directionY * particle.speed;

        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.y > canvas.height) particle.y = 0;
        if (particle.y < 0) particle.y = canvas.height;

        ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
        ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(drawParticles);
    };

    // Redimensionar canvas
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeParticles(canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // Iniciar animação de partículas
    drawParticles();

    // ─────────────────────────────────────────────────────────────────
    // MOUSE MOVE - Efeito de glow
    // ─────────────────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;

      // Smooth follow
      mousePos.current.x +=
        (mousePos.current.targetX - mousePos.current.x) *
        ANIMATED_BACKGROUND_CONFIG.followSpeed;
      mousePos.current.y +=
        (mousePos.current.targetY - mousePos.current.y) *
        ANIMATED_BACKGROUND_CONFIG.followSpeed;

      // Atualizar posição do glow
      if (glowRef.current) {
        glowRef.current.style.left = `${mousePos.current.x}px`;
        glowRef.current.style.top = `${mousePos.current.y}px`;
        glowRef.current.style.opacity = String(
          ANIMATED_BACKGROUND_CONFIG.glowOpacity,
        );
      }
    };

    // ─────────────────────────────────────────────────────────────────
    // MOUSE LEAVE - Fade out do glow
    // ─────────────────────────────────────────────────────────────────
    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // ─────────────────────────────────────────────────────────────────
    // LIMPEZA
    // ─────────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {/* Canvas para partículas animadas */}
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        }}
      />

      {/* Efeito de glow que segue o mouse */}
      <div
        ref={glowRef}
        className={styles.mouseGlow}
        style={{
          width: `${ANIMATED_BACKGROUND_CONFIG.glowSize}px`,
          height: `${ANIMATED_BACKGROUND_CONFIG.glowSize}px`,
          background: `radial-gradient(circle, ${ANIMATED_BACKGROUND_CONFIG.glowColor}, ${ANIMATED_BACKGROUND_CONFIG.glowOpacity}) 0%, ${ANIMATED_BACKGROUND_CONFIG.glowColor}, 0) 70%)`,
          filter: `blur(${ANIMATED_BACKGROUND_CONFIG.glowBlur}px)`,
        }}
      />

      {/* Overlay para melhorar legibilidade */}
      <div className={styles.overlay} />
    </div>
  );
}
