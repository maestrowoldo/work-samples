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
            Nascido no Haiti, sou fluente em Crioulo e Francês. Durante minha jornada no Brasil,
            desenvolvi o Português e aprimorei meu Inglês, construindo uma base multicultural
            que me ajuda a me adaptar a diferentes contextos e pessoas.
          </motion.p>
          <motion.p variants={itemVariants}>
            Atualmente curso Ciência da Computação na Universidade Cruzeiro do Sul. Já tive contato
            com linguagens como Python, Java, PHP e JavaScript, além de bancos de dados SQL, HTML, CSS
            e fundamentos de redes de computadores.
          </motion.p>
          <motion.p variants={itemVariants}>
            Me encontrei na interseção entre desenvolvimento web, visualização de dados com Power BI
            e automação com Power Platform. Gosto de transformar problemas em soluções visuais e acessíveis,
            sempre com foco em usabilidade e impacto real.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
