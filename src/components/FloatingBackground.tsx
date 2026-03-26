'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  radius: number;
  speed: number;
}

interface Moon {
  x: number;
  y: number;
  radius: number;
  baseY: number;
  floatSpeed: number;
  floatAmount: number;
}

export default function FloatingBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const stars: Star[] = Array.from({ length: 120 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.2 + 0.2,
      speed: Math.random() * 0.3 + 0.1,
    }));

    // Lua flutuante com movimento orbital
    const moon: Moon = {
      x: width * 0.5,
      y: height * 0.5,
      radius: 80,
      baseY: height * 0.5,
      floatSpeed: 0.002,
      floatAmount: width * 0.3,
    };

    // Desenhar a lua - versão realista
    const drawMoon = (x: number, y: number, radius: number) => {
      // Glow externo sutil e realista
      const haloGradient = ctx.createRadialGradient(x, y, radius, x, y, radius + 80);
      haloGradient.addColorStop(0, 'rgba(200, 200, 180, 0.15)');
      haloGradient.addColorStop(0.4, 'rgba(200, 200, 180, 0.08)');
      haloGradient.addColorStop(0.8, 'rgba(200, 200, 180, 0.03)');
      haloGradient.addColorStop(1, 'rgba(200, 200, 180, 0)');

      ctx.fillStyle = haloGradient;
      ctx.beginPath();
      ctx.arc(x, y, radius + 80, 0, Math.PI * 2);
      ctx.fill();

      // Gradiente lunar realista (tons mais naturais)
      const gradient = ctx.createRadialGradient(x - 15, y - 15, 0, x, y, radius);
      gradient.addColorStop(0, 'rgba(230, 230, 215, 1)');
      gradient.addColorStop(0.5, 'rgba(210, 210, 195, 0.98)');
      gradient.addColorStop(0.8, 'rgba(190, 190, 175, 0.96)');
      gradient.addColorStop(1, 'rgba(160, 160, 145, 0.94)');

      // Desenhar círculo da lua
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Crateras/detalhes sutis (sombras naturais)
      const craterGradient = ctx.createRadialGradient(
        x + radius * 0.3,
        y + radius * 0.3,
        0,
        x,
        y,
        radius
      );
      craterGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      craterGradient.addColorStop(0.6, 'rgba(100, 100, 90, 0.08)');
      craterGradient.addColorStop(1, 'rgba(100, 100, 90, 0.12)');

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = craterGradient;
      ctx.fill();

      // Borda sutil da lua
      ctx.strokeStyle = 'rgba(180, 180, 160, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Brilho sutil (realista)
      const softGlow = ctx.createRadialGradient(x - 18, y - 18, 5, x, y, radius);
      softGlow.addColorStop(0, 'rgba(240, 240, 230, 0.15)');
      softGlow.addColorStop(0.6, 'rgba(230, 230, 220, 0.05)');
      softGlow.addColorStop(1, 'rgba(220, 220, 210, 0)');

      ctx.fillStyle = softGlow;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Movimento orbital da lua (círculo completo na página)
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const orbitRadius = Math.min(width, height) * 0.35;
      
      // Posição orbital com movimento suave
      const angle = (timeRef.current * moon.floatSpeed) % (Math.PI * 2);
      moon.x = centerX + Math.cos(angle) * orbitRadius;
      moon.y = centerY + Math.sin(angle) * orbitRadius * 0.6;
      
      drawMoon(moon.x, moon.y, moon.radius);

      // Desenhar estrelas com mais brilho
      stars.forEach((star) => {
        star.y -= star.speed;
        if (star.y < 0) star.y = height;

        // Glow effect ao redor das estrelas
        const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
        glowGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        glowGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Estrela brilhante
        ctx.fillStyle = 'rgba(255, 255, 255, 1)';
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      timeRef.current += 1;
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      // Atualizar posição da lua
      moon.x = width * 0.85;
      moon.y = height * 0.2;
      moon.baseY = height * 0.2;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}
