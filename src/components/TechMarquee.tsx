'use client';

import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiTypescript,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiPostgresql,
  SiDocker,
  SiGit,
  SiTailwindcss,
} from 'react-icons/si';
import styles from './TechMarquee.module.css';

const technologies = [
  { name: 'HTML5', icon: SiHtml5, color: '#E34C26' },
  { name: 'CSS3', icon: SiCss3, color: '#1572B6' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'Node.js', icon: SiNodedotjs, color: '#68A063' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Git', icon: SiGit, color: '#F1502F' },
  { name: 'TailwindCSS', icon: SiTailwindcss, color: '#06B6D4' },
];

export default function TechMarquee() {
  return (
    <section className={styles.marqueeContainer}>
      <h2 className={styles.marqueeTitle}>
        <span className={styles.white}>I WORK</span>{' '}
        <span className={styles.green}>WITH:</span>
      </h2>
      
      <div className={styles.marqueeContent}>
        <div className={styles.marqueeTrack}>
          {/* Primeira fileira */}
          {technologies.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={`tech-1-${idx}`} className={styles.techItem}>
                <Icon size={72} color={tech.color} />
                <span className={styles.techLabel}>{tech.name}</span>
              </div>
            );
          })}

          {/* Segunda fileira (duplicada para efeito infinito) */}
          {technologies.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={`tech-2-${idx}`} className={styles.techItem}>
                <Icon size={72} color={tech.color} />
                <span className={styles.techLabel}>{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gradientes de fade nas laterais */}
      <div className={styles.fadeLeft} />
      <div className={styles.fadeRight} />
    </section>
  );
}
