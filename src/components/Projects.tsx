"use client";

import { motion, useReducedMotion } from "framer-motion";
import ProjectCaseCard from "@/components/ProjectCaseCard";
import { useLocaleContext } from "@/components/LocaleProvider";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Projects() {
  const { dictionary, locale } = useLocaleContext();
  const shouldReduceMotion = useReducedMotion();
  const [headingBefore, headingAfter = ""] = dictionary.projects.heading.split(
    dictionary.projects.highlight,
  );

  return (
    <section className="relative overflow-hidden border-y border-white/6 bg-zinc-950 py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(45,212,191,0.08),transparent_22%),radial-gradient(circle_at_85%_30%,rgba(59,130,246,0.08),transparent_24%),linear-gradient(180deg,rgba(9,9,11,0.92)_0%,rgba(9,9,11,0.98)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-cyan-400/8 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-10 max-w-3xl text-center sm:mb-12"
        >
          <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          <h2 className="mt-5 text-3xl font-semibold leading-[1.04] text-zinc-50 sm:text-4xl lg:text-[2.8rem]">
            {headingBefore}
            <span className="bg-[linear-gradient(135deg,#f8fafc_0%,#d1fae5_42%,#67e8f9_100%)] bg-clip-text text-transparent">
              {dictionary.projects.highlight}
            </span>
            {headingAfter}
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
            {dictionary.projects.description}
          </p>
        </motion.div>

        <motion.div
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={shouldReduceMotion ? undefined : containerVariants}
        >
          {dictionary.projects.items.map((project) => (
            <motion.div
              key={project.title}
              variants={shouldReduceMotion ? undefined : itemVariants}
              className="h-full"
            >
              <ProjectCaseCard
                locale={locale}
                project={project}
                copy={{
                  problemLabel: dictionary.projects.problemLabel,
                  solutionLabel: dictionary.projects.solutionLabel,
                  impactLabel: dictionary.projects.impactLabel,
                  viewMoreLabel: dictionary.projects.viewMoreLabel,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
