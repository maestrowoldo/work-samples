"use client";

import { FadeIn, StaggerContainer } from "./animations";
import { motion } from "framer-motion";
import { Calendar, Briefcase } from "lucide-react";

const experiences = [
  {
    title: "Desenvolvedor Full Stack",
    company: "Freelancer",
    period: "2023 - Presente",
    description:
      "Desenvolvimento de aplicações web com React, Next.js e Node.js. Integração com bancos de dados e APIs.",
    skills: ["React", "Next.js", "TypeScript", "Node.js", "SQL"],
  },
  {
    title: "Analista de Dados",
    company: "Projetos Acadêmicos",
    period: "2023 - Presente",
    description:
      "Análise e visualização de dados com Power BI e Python. Criação de dashboards interativos.",
    skills: ["Power BI", "Python", "SQL", "Excel", "Tableau"],
  },
  {
    title: "Designer Gráfico",
    company: "Behance & Portfólio",
    period: "2022 - Presente",
    description:
      "Identidade visual, design de interfaces e materiais gráficos para redes sociais.",
    skills: ["Photoshop", "Illustrator", "Figma", "Adobe XD"],
  },
  {
    title: "Estudante de Ciência da Computação",
    company: "Universidade Cruzeiro do Sul",
    period: "2023 - 2026 (previsto)",
    description:
      "Formação em Ciência da Computação com foco em desenvolvimento web e análise de dados.",
    skills: ["Java", "Python", "JavaScript", "SQL", "Arquitetura"],
  },
];

export default function Experience() {
  return (
    <section className="border-y border-zinc-900 bg-zinc-950/60 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
            Minha <span className="text-emerald-400">Trajetória</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            Experiências e formação que moldaram minha carreira em tecnologia
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <StaggerContainer>
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="mb-8 border-l-2 border-emerald-500/30 pl-6 relative"
              >
                <div className="absolute w-4 h-4 bg-emerald-500 rounded-full -left-3 -top-0.5" />

                <div className="flex items-start gap-4">
                  <Briefcase className="text-emerald-400 flex-shrink-0 mt-1" size={20} />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-zinc-50">{exp.title}</h3>
                    <p className="text-sm text-emerald-400 font-medium">{exp.company}</p>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <Calendar size={14} />
                      <span>{exp.period}</span>
                    </div>
                    <p className="text-sm text-zinc-300 mt-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-block px-2 py-1 text-xs rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
