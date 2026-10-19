"use client";

import { Layers3 } from "lucide-react";
import { useId, useState } from "react";
import { AnimatePresence, LayoutGroup, useReducedMotion } from "framer-motion";
import ProjectCaseCard from "@/components/ProjectCaseCard";
import ProjectDetailsDialog from "@/components/ProjectDetailsDialog";
import { useLocaleContext } from "@/components/LocaleProvider";
import styles from "./Projects.module.css";

export default function Projects() {
  const { dictionary, locale } = useLocaleContext();
  const copy = dictionary.projects;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const layoutId = useId();
  const reducedMotion = useReducedMotion();
  const headingParts = copy.featuredHeading.match(/^(.*)\s+(\S+)$/);

  return (
    <section className={styles.section} aria-labelledby="featured-projects-heading">
      <div className={styles.ambient} aria-hidden="true" />
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              <span className={styles.statusLight} aria-hidden="true" />
              {copy.eyebrow}
            </p>
            <h2 id="featured-projects-heading" className={styles.heading}>
              {headingParts ? headingParts[1] : copy.featuredHeading}{" "}
              {headingParts && <span>{headingParts[2]}</span>}
            </h2>
            <p className={styles.description}>{copy.description}</p>
          </div>
          <div className={styles.collectionMark} aria-hidden="true">
            <span className={styles.collectionOrbit} />
            <Layers3 size={24} strokeWidth={1.3} />
            <span>{String(copy.items.length).padStart(2, "0")}</span>
          </div>
        </header>

        <LayoutGroup id={layoutId}>
          <div className={styles.grid}>
            {copy.items.map((project, index) => (
              <div key={project.href} className={styles.cardSlot}>
                <ProjectCaseCard project={project} copy={copy} index={index}
                  expanded={activeIndex === index} onExpand={() => setActiveIndex(index)}
                  reducedMotion={!!reducedMotion} />
              </div>
            ))}
          </div>
          <AnimatePresence>
            {activeIndex !== null && (
              <ProjectDetailsDialog key={copy.items[activeIndex].href}
                locale={locale} project={copy.items[activeIndex]} copy={copy}
                index={activeIndex} id={layoutId} reducedMotion={!!reducedMotion}
                onClose={() => setActiveIndex(null)} />
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </section>
  );
}
