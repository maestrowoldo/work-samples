// src/components/Projects.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import "./Projects.css";
import { useLocaleContext } from "@/components/LocaleProvider";

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
  const { dictionary, locale } = useLocaleContext();
  const [headingBefore, headingAfter = ""] = dictionary.projects.heading.split(dictionary.projects.highlight);
  return (
    <section className="border-y border-zinc-900 bg-zinc-950/60 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
            {headingBefore}
            <span className="text-emerald-400">{dictionary.projects.highlight}</span>
            {headingAfter}
          </h2>

          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            {dictionary.projects.description}
          </p>
        </div>

        <motion.div
          className="grid gap-6 xl:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {dictionary.projects.items.map((project) => (
            <motion.a
              key={project.title}
              href={project.href.startsWith("/") ? `/${locale}${project.href}` : project.href}
              target={project.href.startsWith("http") ? "_blank" : undefined}
              rel={project.href.startsWith("http") ? "noopener noreferrer" : undefined}
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
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  {project.category}
                </p>
                <h3 className="text-sm font-semibold text-zinc-50 md:text-base">{project.title}</h3>
                <p className="text-xs text-zinc-400 md:text-sm">{project.description}</p>

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

                <div className="mt-3 rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    {dictionary.projects.challengeLabel}
                  </p>
                  <p className="mt-1 text-xs text-zinc-300">{project.challenge}</p>
                </div>

                <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/70 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400">
                    {dictionary.projects.deliveryLabel}
                  </p>
                  <p className="mt-1 text-xs text-zinc-300">{project.delivery}</p>
                </div>

                <div className="mt-auto pt-3 flex items-center gap-2 text-xs font-medium text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>{dictionary.projects.viewMoreLabel}</span>
                  {project.href.startsWith("http") ? <ExternalLink size={14} /> : <ArrowUpRight size={14} />}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
