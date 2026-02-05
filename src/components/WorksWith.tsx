'use client';

import { motion } from 'framer-motion';
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiBootstrap,
  SiTypescript,
  SiTailwindcss,
  SiReact,
} from 'react-icons/si';

const technologies = [
  {
    name: 'HTML5',
    icon: SiHtml5,
    color: '#E34C26',
  },
  {
    name: 'CSS3',
    icon: SiCss3,
    color: '#1572B6',
  },
  {
    name: 'JavaScript',
    icon: SiJavascript,
    color: '#F7DF1E',
  },
  {
    name: 'Bootstrap',
    icon: SiBootstrap,
    color: '#7952B3',
  },
  {
    name: 'TypeScript',
    icon: SiTypescript,
    color: '#3178C6',
  },
  {
    name: 'TailwindCSS',
    icon: SiTailwindcss,
    color: '#06B6D4',
  },
  {
    name: 'React',
    icon: SiReact,
    color: '#61DAFB',
  },
];

export default function WorksWith() {
  return (
    <section className="py-24 border-t border-zinc-800 bg-gradient-to-b from-zinc-950/50 to-zinc-950">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-3xl md:text-4xl font-bold mb-16"
        >
          <span className="text-yellow-400">I WORK WITH:</span>
        </motion.h2>

        {/* Technologies Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {technologies.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.15, y: -8 }}
                className="group relative"
              >
                {/* Glow Background */}
                <div
                  className="absolute inset-0 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `radial-gradient(circle, ${tech.color}40, transparent 70%)`,
                  }}
                />

                {/* Icon Container */}
                <div className="relative flex flex-col items-center gap-3 px-6 py-8 rounded-lg border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm group-hover:border-zinc-600 transition-all duration-300">
                  <Icon
                    size={48}
                    style={{
                      color: tech.color,
                      filter: `drop-shadow(0 0 8px ${tech.color}80)`,
                    }}
                    className="group-hover:drop-shadow-lg transition-all duration-300"
                  />
                  <span className="text-sm font-medium text-zinc-300 group-hover:text-white transition-colors">
                    {tech.name}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
