"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Expand } from "lucide-react";
import type { SiteDictionary } from "@/lib/site-content";
import styles from "./Projects.module.css";

export type ProjectItem = SiteDictionary["projects"]["items"][number];

interface ProjectCaseCardProps {
  project: ProjectItem;
  copy: Pick<SiteDictionary["projects"], "detailsLabel">;
  index: number;
  expanded: boolean;
  reducedMotion: boolean;
  onExpand: () => void;
}

export default function ProjectCaseCard({ project, copy, index, expanded, reducedMotion, onExpand }: ProjectCaseCardProps) {
  const shared = (part: string) => reducedMotion ? undefined : `project-${part}-${index}`;

  return (
    <motion.article className={styles.card} layoutId={shared("card")}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}>
      <motion.div className={styles.preview} layoutId={shared("image")}>
        <div className={styles.previewBadges}>
          <span className={styles.projectTag}>{project.tag}</span>
          <span className={styles.projectNumber} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <div className={styles.imageFrame}>
          <Image src={project.image} alt="" fill
            sizes="(min-width: 1100px) 260px, (min-width: 600px) 45vw, 380px"
            className={styles.projectImage} />
          <div className={styles.imageShade} aria-hidden="true" />
        </div>
      </motion.div>
      <div className={styles.cardBody}>
        <p className={styles.category}>{project.category}</p>
        <h3 className={styles.projectTitle}>
          <button type="button" className={styles.cardTrigger} onClick={onExpand}
            aria-haspopup="dialog" aria-expanded={expanded}
            aria-label={`${copy.detailsLabel}: ${project.title}`}>
            <motion.span layoutId={shared("title")}>{project.title}</motion.span>
          </button>
        </h3>
        <motion.p className={styles.projectDescription} layoutId={shared("description")}>
          {project.description}
        </motion.p>
        <div className={styles.cardFooter} aria-hidden="true">
          <span>{copy.detailsLabel}</span>
          <span className={styles.actionIcon}><Expand size={15} /></span>
        </div>
      </div>
    </motion.article>
  );
}
