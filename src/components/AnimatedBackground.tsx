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
  // CONFIGURAÇÕES CUSTOMIZÁVEIS
  // ═══════════════════════════════════════════════════════════════════
  const config = {
    // Efeito de Mouse
    glowSize: 400,
    glowOpacity: 0.2,
    glowBlur: 60,
    followSpeed: 0.08,
    glowColor: "rgba(16, 185, 129", // Esmeralda com alpha customizável

    // Partículas
    particleCount: 50,
    particleMaxRadius: 1.5,
    particleMinRadius: 0.5,
    particleMaxOpacity: 0.6,
    particleMinOpacity: 0.2,
    particleSpeed: 0.5,

    // Animação
    animationDuration: 45, // segundos
  };

  // ═══════════════════════════════════════════════════════════════════
  // INICIALIZAR PARTÍCULAS
  // ═══════════════════════════════════════════════════════════════════
  const initializeParticles = (width: number, height: number) => {
    particlesRef.current = [];

    for (let i = 0; i < config.particleCount; i++) {
      particlesRef.current.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * (config.particleMaxRadius - config.particleMinRadius) + config.particleMinRadius,
        opacity: Math.random() * (config.particleMaxOpacity - config.particleMinOpacity) + config.particleMinOpacity,
        speed: Math.random() * config.particleSpeed + 0.1,
        directionX: (Math.random() - 0.5) * 2,
        directionY: (Math.random() - 0.5) * 2,
      });
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // DESENHAR PARTÍCULAS COM CANVAS
  // ═══════════════════════════════════════════════════════════════════
  const drawParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar cada partícula
    particlesRef.current.forEach((particle) => {
      // Atualizar posição
      particle.x += particle.directionX * particle.speed;
      particle.y += particle.directionY * particle.speed;

      // Wrap around (voltar do outro lado)
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.y > canvas.height) particle.y = 0;
      if (particle.y < 0) particle.y = canvas.height;

      // Desenhar com glow sutil
      ctx.fillStyle = `rgba(16, 185, 129, ${particle.opacity})`;
      ctx.shadowColor = "rgba(16, 185, 129, 0.5)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Próximo frame
    animationFrameRef.current = requestAnimationFrame(drawParticles);
  };

  // ═══════════════════════════════════════════════════════════════════
  // LISTENERS DE MOUSE
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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
        (mousePos.current.targetX - mousePos.current.x) * config.followSpeed;
      mousePos.current.y +=
        (mousePos.current.targetY - mousePos.current.y) * config.followSpeed;

      // Atualizar posição do glow
      if (glowRef.current) {
        glowRef.current.style.left = `${mousePos.current.x}px`;
        glowRef.current.style.top = `${mousePos.current.y}px`;
        glowRef.current.style.opacity = String(config.glowOpacity);
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
          width: `${config.glowSize}px`,
          height: `${config.glowSize}px`,
          background: `radial-gradient(circle, ${config.glowColor}, ${config.glowOpacity}) 0%, ${config.glowColor}, 0) 70%)`,
          filter: `blur(${config.glowBlur}px)`,
        }}
      />

      {/* Overlay para melhorar legibilidade */}
      <div className={styles.overlay} />
    </div>
  );
}
