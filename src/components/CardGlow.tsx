'use client';

import { useRef, useState } from 'react';
import styles from './CardGlow.module.css';

interface CardGlowProps {
  children: React.ReactNode;
  color?: 'emerald' | 'cyan' | 'purple' | 'blue' | 'pink' | 'orange';
  icon?: string;
  title?: string;
  description?: string;
  badge?: string;
  intensity?: 'low' | 'medium' | 'high';
  floating?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CardGlow({
  children,
  color = 'emerald',
  icon,
  title,
  description,
  badge,
  intensity = 'medium',
  floating = false,
  onClick,
  className = '',
}: CardGlowProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [particles, setParticles] = useState<
    Array<{ id: string; x: number; y: number; color: string }>
  >([]);

  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const glowSecondaryRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);

  // Mapeamento de cores
  const colorMap = {
    emerald: {
      glow: 'rgba(16, 185, 129, 0.4)',
      border: '#10b981',
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    cyan: {
      glow: 'rgba(34, 211, 238, 0.4)',
      border: '#22d3ee',
      bg: 'rgba(34, 211, 238, 0.1)',
    },
    purple: {
      glow: 'rgba(168, 85, 247, 0.4)',
      border: '#a855f7',
      bg: 'rgba(168, 85, 247, 0.1)',
    },
    blue: {
      glow: 'rgba(59, 130, 246, 0.4)',
      border: '#3b82f6',
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    pink: {
      glow: 'rgba(236, 72, 153, 0.4)',
      border: '#ec4899',
      bg: 'rgba(236, 72, 153, 0.1)',
    },
    orange: {
      glow: 'rgba(249, 115, 22, 0.4)',
      border: '#f97316',
      bg: 'rgba(249, 115, 22, 0.1)',
    },
  };

  const sizes = {
    low: { glow: 100, secondary: 150 },
    medium: { glow: 150, secondary: 250 },
    high: { glow: 200, secondary: 350 },
  };

  const currentColor = colorMap[color];
  const currentSize = sizes[intensity];

  // Handle mouse move para efeito de glow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMouseX(x);
    setMouseY(y);

    // Atualizar glow
    if (glowRef.current) {
      glowRef.current.style.left = `${x}px`;
      glowRef.current.style.top = `${y}px`;
    }

    // Atualizar glow secundário (maior e mais desfocado)
    if (glowSecondaryRef.current) {
      glowSecondaryRef.current.style.left = `${x}px`;
      glowSecondaryRef.current.style.top = `${y}px`;
    }
  };

  const handleMouseEnter = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = '1';
    }
    if (glowSecondaryRef.current) {
      glowSecondaryRef.current.style.opacity = '1';
    }
    createParticles();
  };

  const handleMouseLeave = () => {
    if (glowRef.current) {
      glowRef.current.style.opacity = '0';
    }
    if (glowSecondaryRef.current) {
      glowSecondaryRef.current.style.opacity = '0';
    }
  };

  // Criar partículas animadas
  const createParticles = () => {
    if (!cardRef.current) return;

    const count = intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 4;

    const newParticles = Array.from({ length: count }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      x: mouseX,
      y: mouseY,
      color: currentColor.border,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    // Remover partículas após animação
    setTimeout(() => {
      setParticles((prev) => prev.slice(count));
    }, 800);
  };

  return (
    <div
      ref={cardRef}
      className={`${styles.cardGlow} ${floating ? styles.floating : ''} ${className}`}
      style={
        {
          '--glow-color': currentColor.border,
          '--border-color': currentColor.border,
        } as React.CSSProperties
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Borda iluminada */}
      <div className={styles.border} />

      {/* Glow primário */}
      <div
        ref={glowRef}
        className={styles.glow}
        style={{
          width: `${currentSize.glow}px`,
          height: `${currentSize.glow}px`,
          background: currentColor.glow,
          boxShadow: `0 0 40px ${currentColor.glow}`,
        }}
      />

      {/* Glow secundário (maior) */}
      <div
        ref={glowSecondaryRef}
        className={styles.glowSecondary}
        style={{
          width: `${currentSize.secondary}px`,
          height: `${currentSize.secondary}px`,
          background: currentColor.glow,
        }}
      />

      {/* Partículas */}
      <div ref={particlesRef} className={styles.particles}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={styles.particle}
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              background: particle.color,
              boxShadow: `0 0 8px ${particle.color}`,
              animation: `particleFloat 0.8s ease-out forwards`,
            }}
          />
        ))}
      </div>

      {/* Conteúdo */}
      <div className={styles.content}>
        {/* Seção do ícone com badge */}
        {icon && (
          <div className={styles.iconSection}>
            <div
              className={styles.iconContainer}
              style={{
                background: `${currentColor.bg}`,
                borderColor: currentColor.border,
              }}
            >
              {icon}
            </div>
            {badge && <div className={styles.badge}>{badge}</div>}
          </div>
        )}

        {/* Seção de texto */}
        {(title || description) && (
          <div className={styles.textSection}>
            {title && <h3 className={styles.title}>{title}</h3>}
            {description && <p className={styles.description}>{description}</p>}
          </div>
        )}

        {/* Children (conteúdo customizado) */}
        <div className={styles.children}>{children}</div>
      </div>
    </div>
  );
}
