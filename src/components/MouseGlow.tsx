'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { stripLocaleFromPathname } from '@/lib/i18n';

export default function MouseGlow() {
  const pathname = usePathname();
  const isHomePage = stripLocaleFromPathname(pathname) === '/';

  useEffect(() => {
    if (isHomePage) return;

    const glow = document.createElement('div');
    glow.id = 'mouse-glow';
    document.body.appendChild(glow);

    const move = (e: MouseEvent) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      glow.remove();
    };
  }, [isHomePage]);

  return null;
}
