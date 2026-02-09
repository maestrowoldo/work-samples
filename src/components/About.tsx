// src/components/About.tsx
"use client";

import { motion } from "framer-motion";

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section className="border-y border-zinc-900 bg-zinc-950/60 py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-2xl font-semibold text-zinc-50 md:text-3xl"
        >
          Muito prazer, <span className="text-emerald-400">sou Wolkendo Arias</span>.
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-8 max-w-3xl mx-auto space-y-4 text-sm leading-relaxed text-zinc-300 md:text-base"
        >
          <motion.p variants={itemVariants}>
            Desenvolvedor Full Stack, bacharel em Ciência da Computação, com experiência no desenvolvimento de aplicações web, integração de sistemas e automação de processos. Atuo com tecnologias como React, Next.js, Node.js, Python e bancos de dados SQL, sempre com foco em qualidade, usabilidade e entrega em produção.

            Possuo vivência complementar em análise de dados e visualização com Power BI, além de automação com Power Platform.

            Nascido no Haiti, sou fluente em Crioulo e Francês, com domínio do Português e Inglês, o que me permite atuar em ambientes multiculturais e colaborativos.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
