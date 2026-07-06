// src/components/About.tsx
"use client";

import { motion } from "framer-motion";
import { Blocks, Bot, ChartColumnIncreasing, Globe2 } from "lucide-react";
import { useLocaleContext } from "@/components/LocaleProvider";

const icons = [Blocks, Bot, ChartColumnIncreasing, Globe2];

export default function About() {
  const { dictionary } = useLocaleContext();
  const [headingBefore, headingAfter = ""] = dictionary.about.heading.split(dictionary.about.highlight);
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
          {headingBefore}
          <span className="text-emerald-400">{dictionary.about.highlight}</span>
          {headingAfter}
        </motion.h2>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mx-auto mt-8 max-w-5xl"
        >
          <motion.div
            variants={itemVariants}
            className="mx-auto max-w-3xl space-y-4 text-sm leading-relaxed text-zinc-300 md:text-base"
          >
            {dictionary.about.description.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {dictionary.about.pillars.map((pillar, index) => {
              const Icon = icons[index];

              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5"
                >
                  <div className="mb-4 inline-flex rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-400">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-zinc-50">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{pillar.description}</p>
                </div>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
