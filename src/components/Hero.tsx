"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, Code2, Download, MessageSquareText } from "lucide-react";

const proofItems = [
  { label: "Stack principal", value: "Next.js, Node.js, TypeScript e SQL" },
  { label: "Foco de entrega", value: "Interfaces, APIs, integrações e automação" },
  { label: "Qualidade", value: "Validação, testes e deploy com atenção a regressão" },
];

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
            Desenvolvimento web, automação e integração
          </motion.p>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold leading-tight text-zinc-50 sm:text-4xl lg:text-5xl">
            Desenvolvedor Full Stack para tirar projetos do{" "}
            <span className="text-emerald-400">conceito à produção</span>.
          </motion.h1>
          <motion.p variants={itemVariants} className="text-sm text-zinc-300 sm:text-base">
            Desenvolvo aplicações web completas, unindo interfaces modernas a uma lógica de negócio bem estruturada e integração com banco de dados. Meu foco está em qualidade, performance e na entrega de soluções realmente utilizáveis, não apenas visuais atrativos.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3">
            <a
              href="#contato"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-400"
            >
              <MessageSquareText size={16} />
              Falar sobre um projeto
            </a>
            <a
              href="#projeto"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:border-emerald-500 hover:text-emerald-400"
            >
              Ver estudos de caso
              <ArrowRight size={16} />
            </a>
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 transition-colors hover:text-zinc-100"
            >
              <Download size={16} />
              Abrir currículo
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-3 rounded-3xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:grid-cols-3">
            {proofItems.map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-400/90">
                  {item.label}
                </p>
                <p className="text-sm text-zinc-200">{item.value}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-4">
            <a
              href="https://www.linkedin.com/in/wolkendo-arias/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
            >
              <Briefcase size={18} />
              LinkedIn
            </a>
            <a
              href="https://github.com/maestrowoldo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-900 hover:text-emerald-400 transition-colors"
            >
              <Code2 size={18} />
              GitHub
            </a>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4 flex flex-wrap items-center gap-4 text-xs text-zinc-400">
            <span className="rounded-full border border-zinc-700/80 px-3 py-1">
              PT · FR · CR · EN
            </span>
            <span className="rounded-full border border-zinc-700/80 px-3 py-1">
              Computação + dados + design aplicado
            </span>
            <span className="rounded-full border border-zinc-700/80 px-3 py-1">
              Disponível para projetos web e automação
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative h-56 w-56 sm:h-64 sm:w-64 md:h-72 md:w-72"
        >
          {/* Brilho ao redor */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-emerald-500/30 rounded-3xl blur-xl"
            style={{ zIndex: 0 }}
          />

          {/* Círculo animado ao redor */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-3xl"
            style={{ padding: "2px", zIndex: 1 }}
          >
            <div className="absolute inset-[2px] bg-zinc-950 rounded-3xl" />
          </motion.div>

          {/* Imagem dentro */}
          <div className="absolute inset-[2px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/40 shadow-2xl z-10">
            <Image
              src="/designer.avif"
              alt="Foto de perfil de Wolkendo Arias"
              fill
              className="object-cover"
              priority
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/60 via-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
