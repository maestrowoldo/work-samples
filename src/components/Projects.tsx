// src/components/Projects.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import "./Projects.css";

const projects = [
  {
    title: "Programação Web",
    description: "Landing pages, portfólios e sistemas web responsivos.",
    image: "/web_pro.jpg",
    href: "https://github.com/maestrowoldo",
    tag: "Web",
    tech: ["React", "Next.js", "Tailwind"],
  },
  {
    title: "Design & Identidade Visual",
    description: "Artes para redes sociais, identidade visual e materiais gráficos.",
    image: "/designer.avif",
    href: "https://www.behance.net",
    tag: "Design",
    tech: ["Photoshop", "Illustrator", "Figma"],
  },
  {
    title: "Dashboards em Power BI",
    description: "Painéis para acompanhamento de indicadores, cursos e operações.",
    image: "/BI.jpg",
    href: "#",
    tag: "Power BI",
    tech: ["Power BI", "SQL", "DAX"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
  },
};

export default function Projects() {
  return (
    <section className="border-y border-zinc-900 bg-zinc-950/60 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
            Meu <span className="text-emerald-400">Portfólio</span>
          </h2>

          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            Alguns dos trabalhos que refletem minha mistura de código, dados e design.
          </p>
        </div>

        <motion.div
          className="grid gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {projects.map((project) => (
            <motion.a
              key={project.title}
              href={project.href}
              target="_blank"
              variants={itemVariants}
              className="project-card group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/50 shadow-md transition duration-300 hover:-translate-y-2"
            >
              <div className="project-image relative h-40 w-full overflow-hidden bg-zinc-800">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="shine" />
                <div className="absolute left-3 top-3 rounded-full bg-zinc-950/80 px-2 py-1 text-xs text-emerald-400">
                  {project.tag}
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="text-sm font-semibold text-zinc-50 md:text-base">
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-400 md:text-sm">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 flex items-center gap-2 text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>Ver detalhes</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
