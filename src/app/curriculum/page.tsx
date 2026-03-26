// src/app/curriculum/page.tsx
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, Mail, Phone, MapPin, Code2, Briefcase } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export default function CurriculumPage() {
  const cvRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);
    try {
      const link = document.createElement("a");
      link.href = "/Wolkendo CV 11-25.pdf";
      link.download = "Curriculo-Wolkendo-Arias.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      alert("Erro ao baixar o currículo. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

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
    <main className="min-h-screen bg-zinc-950 pt-24 pb-12">
      <div className="mx-auto max-w-4xl px-4 lg:px-6">
        {/* Botão voltar e Download */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={18} />
            <span>Voltar ao portfólio</span>
          </Link>
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span>{isGenerating ? "Gerando..." : "Baixar PDF"}</span>
          </button>
        </motion.div>

        {/* CV Content */}
        <div ref={cvRef} className="rounded-lg border border-zinc-800/50 bg-zinc-950 p-8 md:p-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="mb-12 pb-8 border-b border-zinc-800"
            >
              <motion.div variants={itemVariants} className="mb-4">
                <h1 className="text-4xl font-bold text-zinc-50 md:text-5xl">
                  Wolkendo Arias
                </h1>
                <p className="mt-2 text-lg text-emerald-400 font-medium">
                  Desenvolvedor Web Full Stack 
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 text-sm text-zinc-400">
                <div className="flex items-center gap-2">
                  <Phone size={16} />
                  <span>(11) 98851-9854</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>woldobest@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Perus, SP</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mt-4 flex gap-3">
                <a href="https://github.com/maestrowoldo" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  <Code2 size={18} />
                </a>
                <a href="https://www.linkedin.com/in/wolkendo-arias/" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-emerald-400 transition-colors">
                  <Briefcase size={18} />
                </a>
              </motion.div>
            </motion.div>

            {/* Resumo Profissional */}
          <motion.section variants={itemVariants} className="space-y-3">
            <h2 className="text-2xl font-bold text-zinc-50 border-b border-emerald-400 pb-2">
              Resumo Profissional
            </h2>
            <p className="text-zinc-300 leading-relaxed text-justify">
              Desenvolvedor Full Stack com experiência no desenvolvimento de aplicações web do código ao deploy, integração de sistemas e automação de processos. Atuo principalmente com Node.js, JavaScript e TypeScript, criando aplicações robustas e escaláveis. Possuo vivência complementar em análise de dados e Business Intelligence (Power BI), além de modelagem de processos e soluções low-code, aplicando tecnologia com foco em qualidade de software, automação e prevenção de falhas.
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
                    "Desenvolvimento de aplicações web full stack utilizando React, Next.js e Node.js",
                    "Criação e consumo de APIs REST, integração com bancos de dados relacionais",
                    "Implementação de autenticação de usuários, regras de negócio e validações",
                    "Criação de testes automatizados com Vitest voltados à validação de funcionalidades e controle de regressões",
                    "Apoio em atividades de QA, identificação de falhas e validação funcional das aplicações",
                    "Análise e detecção de vulnerabilidades e riscos de segurança em aplicações web",
                    "Atuação no ciclo completo: desenvolvimento, versionamento, testes e deploy"
                  ]
                },
                {
                  cargo: "Analista de Suporte Técnico",
                  empresa: "DXC Technology",
                  periodo: "Setembro 2025 - Novembro 2025",
                  descricoes: [
                    "Suporte técnico a usuários (onboarding/offboarding)",
                    "Instalação e configuração de softwares e ambientes",
                    "Apoio à infraestrutura e manutenção preventiva"
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
              ].map((exp) => (
                <div key={`${exp.cargo}-${exp.empresa}`} className="pl-4 border-l-2 border-emerald-500 space-y-2">
                  <div>
                    <h3 className="font-semibold text-zinc-50">{exp.cargo}</h3>
                    <p className="text-sm text-emerald-400">{exp.empresa}</p>
                    <p className="text-xs text-zinc-500">{exp.periodo}</p>
                  </div>
                  <ul className="space-y-1">
                    {exp.descricoes.map((desc, i) => (
                      <li key={`${exp.cargo}-${i}`} className="text-sm text-zinc-400 flex gap-2">
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
                  titulo: "Sistema Full Stack de Cadastro Web",
                  descricao: "Aplicação web full stack desenvolvida do zero até o deploy em nuvem, com implementação completa de autenticação de usuários, API REST em Node.js e Express, modelagem relacional com PostgreSQL e versionamento com Git/Github.",
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
              ].map((proj) => (
                <div key={proj.titulo} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
                  <h3 className="font-semibold text-zinc-50">{proj.titulo}</h3>
                  <p className="text-sm text-zinc-300">{proj.descricao}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tecnologias.map((tech) => (
                      <span key={`${proj.titulo}-${tech}`} className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
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
              ].map((skill) => (
                <div key={skill.area} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
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
              ].map((form) => (
                <div key={form.curso} className="pl-4 border-l-2 border-emerald-500">
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
              ].map((cert) => (
                <div key={cert} className="flex items-start gap-2">
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
              ].map((lang) => (
                <div key={lang.idioma} className="flex justify-between items-center pb-2 border-b border-zinc-800/50 last:border-b-0">
                  <span className="font-medium text-zinc-50">{lang.idioma}</span>
                  <span className="text-sm text-emerald-400">{lang.nivel}</span>
                </div>
              ))}
            </div>
          </motion.section>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
