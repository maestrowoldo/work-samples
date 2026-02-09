"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Linkedin, Github } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="pt-24 pb-16 md:pt-28 md:pb-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row md:justify-between lg:px-6">
        <motion.div
          className="max-w-xl space-y-6"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.p variants={itemVariants} className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            Desenvolvedor Full Stack
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            Transformando ideias em{" "}
            <span className="text-emerald-400">realidade digital</span>.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-zinc-300 sm:text-base">
            Desenvolvedor Full Stack com experiência em dados, automação e visualização com Power BI. Transformo problemas em soluções inovadoras e acessíveis usando tecnologia, dados e design.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            <a
              href="#contato"
              className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-zinc-950 hover:bg-emerald-400"
            >
              Entre em contato
            </a>
            <a
              href="#projeto"
              className="text-sm font-medium text-zinc-300 hover:text-emerald-400"
            >
              Ver meus projetos →
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4">
            <a
              href="https://linkedin.com/in/wolkendo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
            >
              <Linkedin size={18} />
              LinkedIn
            </a>
            <a
              href="https://github.com/maestrowoldo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
            >
              <Github size={18} />
              GitHub
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="rounded-full border border-zinc-700/80 px-3 py-1">
              Multilíngue: PT · FR · CR · EN
            </span>
            <span className="rounded-full border border-zinc-700/80 px-3 py-1">
              Ciência da Computação · Cruzeiro do Sul
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-56 w-56 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/40 shadow-2xl sm:h-64 sm:w-64 md:h-72 md:w-72"
        >
          <Image
            src="/designer.avif"
            alt="Foto de perfil de Wolkendo Arias"
            fill
            className="object-cover"
            priority
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
