// src/components/Skills.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Code2, Database, Palette, Zap } from "lucide-react";

const skillCategories = [
  {
    title: "Frontend",
    description: "Interface & Experiência",
    icon: Code2,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30 hover:border-blue-400/50",
    items: [
      { name: "HTML5", level: "Avançado" },
      { name: "CSS3", level: "Avançado" },
      { name: "JavaScript", level: "Avançado" },
      { name: "TypeScript", level: "Intermediário" },
      { name: "React", level: "Avançado" },
      { name: "Next.js", level: "Avançado" },
      { name: "Tailwind CSS", level: "Avançado" },
      { name: "Framer Motion", level: "Intermediário" },
    ],
  },
  {
    title: "Backend & Dados",
    description: "Servidores & Banco de Dados",
    icon: Database,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30 hover:border-purple-400/50",
    items: [
      { name: "Node.js", level: "Intermediário" },
      { name: "Python", level: "Intermediário" },
      { name: "PostgreSQL", level: "Intermediário" },
      { name: "MySQL", level: "Intermediário" },
      { name: "MongoDB", level: "Básico" },
      { name: "Prisma", level: "Intermediário" },
      { name: "REST API", level: "Avançado" },
      { name: "SQL", level: "Avançado" },
    ],
  },
  {
    title: "Design & UX",
    description: "Criatividade & Visualização",
    icon: Palette,
    color: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30 hover:border-orange-400/50",
    items: [
      { name: "Figma", level: "Avançado" },
      { name: "Adobe XD", level: "Intermediário" },
      { name: "Photoshop", level: "Avançado" },
      { name: "Illustrator", level: "Intermediário" },
      { name: "UI/UX Design", level: "Intermediário" },
      { name: "Prototipagem", level: "Intermediário" },
      { name: "Design Responsivo", level: "Avançado" },
      { name: "Acessibilidade", level: "Intermediário" },
    ],
  },
  {
    title: "Análise & BI",
    description: "Dados & Inteligência",
    icon: Zap,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30 hover:border-green-400/50",
    items: [
      { name: "Power BI", level: "Avançado" },
      { name: "Power Query", level: "Intermediário" },
      { name: "DAX", level: "Intermediário" },
      { name: "Excel Avançado", level: "Avançado" },
      { name: "Análise de Dados", level: "Intermediário" },
      { name: "Google Analytics", level: "Básico" },
      { name: "Visualização de Dados", level: "Avançado" },
      { name: "Relatórios", level: "Avançado" },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const skillVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3 },
  },
};

const getLevelColor = (level: string) => {
  switch (level) {
    case "Avançado":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
    case "Intermediário":
      return "bg-blue-500/20 text-blue-300 border-blue-500/50";
    case "Básico":
      return "bg-amber-500/20 text-amber-300 border-amber-500/50";
    default:
      return "bg-zinc-800 text-zinc-300 border-zinc-700";
  }
};

export default function Skills() {
  return (
    <section className="py-20 border-y border-zinc-900 bg-zinc-950/30">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-50 mb-3">
            Tecnologias & <span className="text-emerald-400">Ferramentas</span>
          </h2>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl mx-auto">
            Stack completo de ferramentas e tecnologias que utilizo para criar soluções modernas, escaláveis e impactantes
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          {skillCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.title}
                variants={categoryVariants}
                className={`rounded-2xl border border-zinc-800/50 bg-gradient-to-br ${category.color} backdrop-blur-sm p-6 hover:border-zinc-700 transition-all duration-300 group`}
              >
                {/* Category Header */}
                <div className="flex items-start gap-3 mb-5">
                  <div className="p-2 rounded-lg bg-zinc-900/50 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
                    <IconComponent className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-zinc-50 text-sm md:text-base">
                      {category.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{category.description}</p>
                  </div>
                </div>

                {/* Skills List */}
                <div className="space-y-2">
                  {category.items.map((skill, idx) => (
                    <motion.div
                      key={skill.name}
                      variants={skillVariants}
                      transition={{ delay: idx * 0.05 }}
                      className="group/item"
                    >
                      <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-emerald-500/30 transition-all duration-200">
                        <span className="text-xs font-medium text-zinc-200">
                          {skill.name}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getLevelColor(
                            skill.level
                          )}`}
                        >
                          {skill.level}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: "Tecnologias", value: "25+" },
            { label: "Ferramentas", value: "15+" },
            { label: "Linguagens", value: "6+" },
            { label: "Anos", value: "3+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-center hover:border-emerald-500/30 transition-colors"
            >
              <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
