// src/app/curriculum/page.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";
import Link from "next/link";

export default function CurriculumPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <main className="min-h-screen bg-zinc-950 pt-24">
      <div className="mx-auto max-w-4xl px-4 py-16 lg:px-6">
        {/* Botão voltar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={18} />
            <span>Voltar ao portfólio</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-12 pb-8 border-b border-zinc-800"
        >
          <motion.div variants={itemVariants} className="mb-4">
            <h1 className="text-4xl font-bold text-zinc-50 md:text-5xl">
              Wolkendo Arias
            </h1>
            <p className="mt-2 text-lg text-emerald-400 font-medium">
              Computólogo | Desenvolvedor Web | Data Analyst
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 text-sm text-zinc-400">
            <a href="tel:11988519854" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              <Phone size={16} />
              <span>(11) 98851-9854</span>
            </a>
            <a href="mailto:woldobest@gmail.com" className="flex items-center gap-2 hover:text-emerald-400 transition-colors">
              <Mail size={16} />
              <span>woldobest@gmail.com</span>
            </a>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>Perus, SP</span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-4 flex gap-3">
            <a href="https://github.com/wolkendo" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400 transition-colors">
              <Github size={18} />
            </a>
            <a href="https://linkedin.com/in/wolkendo" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400 transition-colors">
              <Linkedin size={18} />
            </a>
          </motion.div>
        </motion.div>

        {/* Conteúdo do CV */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-12"
        >
          {/* Resumo Profissional */}
          <motion.section variants={itemVariants} className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Resumo Profissional
            </h2>
            <p className="text-zinc-300 leading-relaxed text-justify">
              Profissional com experiência em desenvolvimento de software, análise de dados e automação de processos. 
              Domino lógica de programação orientada a dados, desenvolvimento web completo (do código ao deploy) e 
              integração de sistemas. Experiência com linguagens como Python, JavaScript, Java, além de ferramentas 
              de Business Intelligence (Power BI), modelagem de processos (Bizagi) e desenvolvimento low-code 
              (Power Apps). Buscando aplicar conhecimentos técnicos em projetos de desenvolvimento web e soluções 
              baseadas em dados.
            </p>
          </motion.section>

          {/* Experiência Profissional */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Experiência Profissional
            </h2>

            <div className="space-y-6">
              {[
                {
                  cargo: "Desenvolvedor Full Stack",
                  empresa: "Prime Secure",
                  periodo: "Novembro 2025 - Presente",
                  descricoes: [
                    "Desenvolvimento de aplicações web com React, Next.js e Node.js",
                    "Integração com bancos de dados e APIs",
                    "Implementação de funcionalidades full stack"
                  ]
                },
                {
                  cargo: "Analista de Suporte Técnico - PJ",
                  empresa: "DXC",
                  periodo: "Setembro 2025 - Novembro 2025",
                  descricoes: [
                    "Onboarding e Offboarding de usuários",
                    "Instalação e configuração de softwares",
                    "Controle e manutenção de máquinas",
                    "Apoio nas rotinas de infraestrutura e manutenção preventiva"
                  ]
                },
                {
                  cargo: "Estagiário em Ciência da Computação",
                  empresa: "Tribunal de Justiça de São Paulo",
                  periodo: "Setembro 2024 -  Setembro 2025",
                  descricoes: [
                    "Mapeamento e documentação de processos utilizando Bizagi",
                    "Desenvolvimento de dashboards interativos no Power BI",
                    "Estruturação e modelagem de dados para decisões estratégicas",
                    "Desenvolvimento low-code de aplicativo de controle de ponto eletrônico utilizando Power Apps e Power Automate"
                  ]
                },
              ].map((exp, idx) => (
                <div key={idx} className="pl-4 border-l-2 border-emerald-500 space-y-2">
                  <div>
                    <h3 className="font-semibold text-zinc-50">{exp.cargo}</h3>
                    <p className="text-sm text-emerald-400">{exp.empresa}</p>
                    <p className="text-xs text-zinc-500">{exp.periodo}</p>
                  </div>
                  <ul className="space-y-1">
                    {exp.descricoes.map((desc, i) => (
                      <li key={i} className="text-sm text-zinc-400 flex gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Projetos */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Projetos Principais
            </h2>

            <div className="space-y-5">
              {[
                {
                  titulo: "Sistema Full Stack de Cadastro Web (Em andamento)",
                  descricao: "Aplicação web desenvolvida do zero até o deploy na nuvem, com autenticação de usuários, integração com banco de dados e hospedagem em ambiente AWS.",
                  tecnologias: ["Node.js", "Express", "PostgreSQL", "JavaScript", "HTML", "CSS", "AWS EC2", "GitHub"]
                },
                {
                  titulo: "Aplicativo Interno de Controle de Ponto",
                  descricao: "Aplicativo low-code desenvolvido com Microsoft Power Apps para registro de ponto e gerenciamento de estagiários. Integrado ao SharePoint e Power Automate, com automações para notificações e interface responsiva.",
                  tecnologias: ["Power Apps", "Power Automate", "SharePoint", "Microsoft 365"]
                },
                {
                  titulo: "Portfólio Pessoal (Este site)",
                  descricao: "Projeto desenvolvido para apresentar habilidades e experiências em desenvolvimento web, design gráfico e inteligência de dados. Interface moderna, responsiva e animada com integração com GitHub.",
                  tecnologias: ["React", "Next.js", "TypeScript", "Tailwind", "Framer Motion", "GitHub Pages"]
                },
              ].map((proj, idx) => (
                <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                  <h3 className="font-semibold text-zinc-50">{proj.titulo}</h3>
                  <p className="text-sm text-zinc-300">{proj.descricao}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tecnologias.map((tech, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Habilidades Técnicas */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Habilidades Técnicas
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  area: "Back-End",
                  skills: "Python, Node.js, Java, JavaScript"
                },
                {
                  area: "Front-End",
                  skills: "HTML5, CSS3, JavaScript, React, Next.js"
                },
                {
                  area: "Banco de Dados",
                  skills: "SQL Server, MySQL, PostgreSQL (modelagem relacional)"
                },
                {
                  area: "Infraestrutura & Deploy",
                  skills: "AWS (Lambda, EC2), Git, GitHub Pages"
                },
                {
                  area: "Business Intelligence",
                  skills: "Power BI, Power Platform, Bizagi"
                },
                {
                  area: "Ferramentas & Automação",
                  skills: "Power Apps, Power Automate, N8N, Notion"
                },
              ].map((skill, idx) => (
                <div key={idx} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                  <h3 className="font-semibold text-emerald-400 mb-2">{skill.area}</h3>
                  <p className="text-sm text-zinc-300">{skill.skills}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Formação Acadêmica */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Formação Acadêmica
            </h2>

            <div className="space-y-4">
              {[
                {
                  curso: "Bacharelado em Ciência da Computação",
                  instituição: "Universidade Cruzeiro do Sul",
                  periodo: "2022 - Presente (Previsão: Dez 2025)"
                },
                {
                  curso: "Tecnólogo em Telecomunicações",
                  instituição: "Centre Professionnel Notre Guadalupe",
                  periodo: "2015 - 2017"
                },
              ].map((form, idx) => (
                <div key={idx} className="pl-4 border-l-2 border-emerald-500">
                  <h3 className="font-semibold text-zinc-50">{form.curso}</h3>
                  <p className="text-sm text-zinc-400">{form.instituição}</p>
                  <p className="text-xs text-zinc-500">{form.periodo}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Certificações & Cursos */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Certificações & Cursos
            </h2>

            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Python Para Análise de Dados - DSA (Andamento)",
                "Desenvolvedor Web Back-End - Senac (2025)",
                "Power BI - Senac (2025)",
                "Introdução ao Mapeamento de Processo - Bizagi - TJSP (2025)",
                "Introduction to Cybersecurity & Endpoint Security - Senai (2024)",
                "CCNA: Introduction to Networks - Cisco (2024)",
                "Google: Inteligência Artificial e Produtividade - Santander | Open Academy (2024)",
                "Automação com N8N - Santander Open Academy (2026)"
              ].map((cert, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1 flex-shrink-0">✓</span>
                  <span className="text-sm text-zinc-300">{cert}</span>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Idiomas */}
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Idiomas
            </h2>

            <div className="space-y-2">
              {[
                { idioma: "Francês e Crioulo", nivel: "Nativo" },
                { idioma: "Português", nivel: "Fluente" },
                { idioma: "Inglês", nivel: "Intermediário" }
              ].map((lang, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b border-zinc-800/50 last:border-b-0">
                  <span className="font-medium text-zinc-50">{lang.idioma}</span>
                  <span className="text-sm text-emerald-400">{lang.nivel}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
