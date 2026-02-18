"use client";

import { useRef, useState } from "react";
import { ReactNode } from "react";
import styles from "./CardGlow.module.css";

interface CardGlowProps {
  children?: ReactNode;
  glowColor?: string;
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  badge?: string;
  animated?: boolean;
  intensity?: "low" | "medium" | "high";
}

const PARTICLE_OFFSETS = [
  { x: -22, y: -16 },
  { x: 0, y: 18 },
  { x: 20, y: -10 },
];

/**
 * Componente CardGlow Premium - Versão 2
 * Efeitos visuais avançados com ícone, glow duplo, partículas, etc
 */
export default function CardGlow({
  children,
  glowColor = "emerald",
  className = "",
  icon,
  title,
  description,
  badge,
  animated = false,
  intensity = "medium",
}: CardGlowProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowRef2 = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const colorMap: Record<string, { glow: string; border: string; bg: string }> = {
    emerald: {
      glow: "rgb(16, 185, 129)",
      border: "rgba(16, 185, 129, 0.5)",
      bg: "rgba(16, 185, 129, 0.1)",
    },
    cyan: {
      glow: "rgb(8, 145, 178)",
      border: "rgba(8, 145, 178, 0.5)",
      bg: "rgba(8, 145, 178, 0.1)",
    },
    purple: {
      glow: "rgb(139, 92, 246)",
      border: "rgba(139, 92, 246, 0.5)",
      bg: "rgba(139, 92, 246, 0.1)",
    },
    blue: {
      glow: "rgb(59, 130, 246)",
      border: "rgba(59, 130, 246, 0.5)",
      bg: "rgba(59, 130, 246, 0.1)",
    },
    pink: {
      glow: "rgb(236, 72, 153)",
      border: "rgba(236, 72, 153, 0.5)",
      bg: "rgba(236, 72, 153, 0.1)",
    },
  };

  const intensityMap: Record<string, { glowSize: number; blur: number; opacity: number }> = {
    low: { glowSize: 150, blur: 25, opacity: 0.15 },
    medium: { glowSize: 200, blur: 40, opacity: 0.25 },
    high: { glowSize: 300, blur: 60, opacity: 0.35 },
  };

  const selectedColor = colorMap[glowColor] || colorMap.emerald;
  const selectedIntensity = intensityMap[intensity];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowRef.current || !glowRef2.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    glowRef.current.style.left = `${x}px`;
    glowRef.current.style.top = `${y}px`;
    glowRef2.current.style.left = `${x}px`;
    glowRef2.current.style.top = `${y}px`;
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    if (glowRef.current) {
      glowRef.current.style.opacity = String(selectedIntensity.opacity);
    }
    if (glowRef2.current) {
      glowRef2.current.style.opacity = String(selectedIntensity.opacity * 0.5);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (glowRef.current) {
      glowRef.current.style.opacity = "0";
    }
    if (glowRef2.current) {
      glowRef2.current.style.opacity = "0";
    }
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.cardGlow} ${animated ? styles.floating : ""} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        "--glow-color": selectedColor.glow,
        "--border-color": selectedColor.border,
        "--bg-color": selectedColor.bg,
      } as React.CSSProperties & {
        "--glow-color": string;
        "--border-color": string;
        "--bg-color": string;
      }}
    >
      {/* Fundo com gradiente */}
      <div
        className={styles.bgGradient}
        style={{
          background: selectedColor.bg,
        }}
      />

      {/* Borda iluminada */}
      <div className={styles.border} />

      {/* Glow duplo */}
      <div
        ref={glowRef}
        className={styles.glow}
        style={{
          width: `${selectedIntensity.glowSize}px`,
          height: `${selectedIntensity.glowSize}px`,
          background: `radial-gradient(circle, ${selectedColor.glow} 0%, transparent 70%)`,
          filter: `blur(${selectedIntensity.blur}px)`,
        }}
      />

      <div
        ref={glowRef2}
        className={styles.glowSecondary}
        style={{
          width: `${selectedIntensity.glowSize * 0.6}px`,
          height: `${selectedIntensity.glowSize * 0.6}px`,
          background: `radial-gradient(circle, ${selectedColor.glow} 0%, transparent 60%)`,
          filter: `blur(${selectedIntensity.blur * 0.7}px)`,
        }}
      />

      {/* Conteúdo */}
      <div className={styles.content}>
        {icon && (
          <div className={`${styles.iconSection} ${isHovering ? styles.iconActive : ""}`}>
            <div className={styles.iconContainer}>{icon}</div>
            {badge && <div className={styles.badge}>{badge}</div>}
          </div>
        )}

        <div className={styles.textSection}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {description && <p className={styles.description}>{description}</p>}
          {children && <div className={styles.children}>{children}</div>}
        </div>
      </div>

      {/* Partículas ao hover */}
      {isHovering && (
        <div className={styles.particles}>
          {PARTICLE_OFFSETS.map((offset, i) => (
            <div
              key={i}
              className={styles.particle}
              style={{
                left: `${mousePos.x + offset.x}px`,
                top: `${mousePos.y + offset.y}px`,
                backgroundColor: selectedColor.glow,
                animation: `particleFloat ${0.8 + i * 0.2}s ease-out forwards`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
