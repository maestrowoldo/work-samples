"use client";

import { motion } from "framer-motion";
import { Blocks, Bug, Rocket, SearchCheck } from "lucide-react";
import { useLocaleContext } from "@/components/LocaleProvider";

const icons = [SearchCheck, Blocks, Bug, Rocket];

export default function HowIWork() {
  const { dictionary } = useLocaleContext();
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
            {dictionary.howIWork.heading.replace(dictionary.howIWork.highlight, "")}
            <span className="text-emerald-400">{dictionary.howIWork.highlight}</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            {dictionary.howIWork.description}
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {dictionary.howIWork.workflow.map((item, index) => {
              const Icon = icons[index];

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/45 p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                      {item.step}
                    </span>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-emerald-400">
                      <Icon size={20} />
                    </div>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-zinc-50">{item.title}</h3>
                  <p className="mt-2 text-sm text-zinc-400">{item.description}</p>
                </motion.div>
              );
            })}
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-[2rem] border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-400">
              {dictionary.howIWork.asideEyebrow}
            </p>
            <h3 className="mt-4 text-2xl font-semibold text-zinc-50">
              {dictionary.howIWork.asideTitle}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              {dictionary.howIWork.asideDescription}
            </p>

            <div className="mt-6 space-y-3">
              {dictionary.howIWork.signals.map((signal) => (
                <div
                  key={signal}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 px-4 py-3 text-sm text-zinc-200"
                >
                  {signal}
                </div>
              ))}
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
