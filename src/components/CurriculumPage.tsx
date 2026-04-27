"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Download, Mail, Phone, MapPin, Code2, Briefcase } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useLocaleContext } from "@/components/LocaleProvider";

export default function CurriculumPage() {
  const { dictionary, locale } = useLocaleContext();
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = () => {
    setIsGenerating(true);

    try {
      const link = document.createElement("a");
      link.href = "/Wolkendo CV 11-25.pdf";
      link.download = dictionary.curriculum.downloadFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert(dictionary.contactSection.form.errorMessage);
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8 flex items-center justify-between gap-4"
        >
          <Link href={`/${locale}`} className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={18} />
            <span>{dictionary.curriculum.backLabel}</span>
          </Link>
          <button
            onClick={generatePDF}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            <span>
              {isGenerating
                ? dictionary.curriculum.generatingLabel
                : dictionary.curriculum.downloadLabel}
            </span>
          </button>
        </motion.div>

        <div className="rounded-lg border border-zinc-800/50 bg-zinc-950 p-8 md:p-12">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-12"
          >
            <motion.div
              variants={itemVariants}
              className="mb-12 border-b border-zinc-800 pb-8"
            >
              <motion.div variants={itemVariants} className="mb-4">
                <h1 className="text-4xl font-bold text-zinc-50 md:text-5xl">
                  Wolkendo Arias
                </h1>
                <p className="mt-2 text-lg font-medium text-emerald-400">
                  {dictionary.curriculum.headerRole}
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
                  <span>{dictionary.curriculum.contact.location}</span>
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

            <motion.section variants={itemVariants} className="space-y-3">
              <h2 className="border-b border-emerald-400 pb-2 text-2xl font-bold text-zinc-50">
                {dictionary.curriculum.sections.professionalSummary}
              </h2>
              <p className="text-justify leading-relaxed text-zinc-300">
                {dictionary.curriculum.profileSummary}
              </p>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="border-b border-emerald-400 pb-2 text-2xl font-bold text-zinc-50">
                {dictionary.curriculum.sections.experience}
              </h2>

              <div className="space-y-6">
                {dictionary.curriculum.experience.map((experience) => (
                  <div key={`${experience.role}-${experience.company}`} className="space-y-2 border-l-2 border-emerald-500 pl-4">
                    <div>
                      <h3 className="font-semibold text-zinc-50">{experience.role}</h3>
                      <p className="text-sm text-emerald-400">{experience.company}</p>
                      <p className="text-xs text-zinc-500">{experience.period}</p>
                    </div>
                    <ul className="space-y-1">
                      {experience.descriptions.map((description) => (
                        <li key={description} className="flex gap-2 text-sm text-zinc-400">
                          <span className="text-emerald-400">•</span>
                          <span>{description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="border-b border-emerald-400 pb-2 text-2xl font-bold text-zinc-50">
                {dictionary.curriculum.sections.projects}
              </h2>

              <div className="space-y-5">
                {dictionary.curriculum.projects.map((project) => (
                  <div key={project.title} className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                    <h3 className="font-semibold text-zinc-50">{project.title}</h3>
                    <p className="text-sm text-zinc-300">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((technology) => (
                        <span key={`${project.title}-${technology}`} className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">
                          {technology}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="border-b border-emerald-400 pb-2 text-2xl font-bold text-zinc-50">
                {dictionary.curriculum.sections.technicalSkills}
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                {dictionary.curriculum.skills.map((skill) => (
                  <div key={skill.area} className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                    <h3 className="mb-2 font-semibold text-emerald-400">{skill.area}</h3>
                    <p className="text-sm text-zinc-300">{skill.skills}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="border-b border-emerald-400 pb-2 text-2xl font-bold text-zinc-50">
                {dictionary.curriculum.sections.education}
              </h2>

              <div className="space-y-4">
                {dictionary.curriculum.education.map((item) => (
                  <div key={item.course} className="border-l-2 border-emerald-500 pl-4">
                    <h3 className="font-semibold text-zinc-50">{item.course}</h3>
                    <p className="text-sm text-zinc-400">{item.institution}</p>
                    <p className="text-xs text-zinc-500">{item.period}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="border-b border-emerald-400 pb-2 text-2xl font-bold text-zinc-50">
                {dictionary.curriculum.sections.certifications}
              </h2>

              <div className="grid gap-3 md:grid-cols-2">
                {dictionary.curriculum.certifications.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="mt-1 flex-shrink-0 text-emerald-400">✓</span>
                    <span className="text-sm text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="space-y-4">
              <h2 className="border-b border-emerald-400 pb-2 text-2xl font-bold text-zinc-50">
                {dictionary.curriculum.sections.languages}
              </h2>

              <div className="space-y-2">
                {dictionary.curriculum.languages.map((item) => (
                  <div key={item.language} className="flex items-center justify-between border-b border-zinc-800/50 pb-2 last:border-b-0">
                    <span className="font-medium text-zinc-50">{item.language}</span>
                    <span className="text-sm text-emerald-400">{item.level}</span>
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
