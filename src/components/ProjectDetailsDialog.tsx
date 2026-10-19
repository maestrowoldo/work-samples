"use client";

import { useEffect, useRef, type KeyboardEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import type { ProjectItem } from "./ProjectCaseCard";
import type { SiteDictionary } from "@/lib/site-content";
import styles from "./Projects.module.css";

interface ProjectDetailsDialogProps {
  project: ProjectItem;
  copy: SiteDictionary["projects"];
  locale: string;
  index: number;
  id: string;
  reducedMotion: boolean;
  onClose: () => void;
}

export default function ProjectDetailsDialog({ project, copy, locale, index, id, reducedMotion, onClose }: ProjectDetailsDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const backdropPressed = useRef(false);
  const shared = (part: string) => reducedMotion ? undefined : `project-${part}-${index}`;
  const isExternal = project.href.startsWith("http");
  const href = isExternal ? project.href : `/${locale}${project.href}`;
  const titleId = `${id}-project-title`;

  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const controls = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href], [tabindex='0']");
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    }
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  const action = <>{copy.visitLabel}<ArrowUpRight size={17} aria-hidden="true" /></>;
  const details = [
    { label: copy.problemLabel, value: project.problem },
    { label: copy.solutionLabel, value: project.solution },
    { label: copy.impactLabel, value: project.impact },
  ];

  return (
    <motion.dialog layoutRoot ref={dialogRef} className={styles.dialog} aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onPointerDown={(event) => { backdropPressed.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (backdropPressed.current && event.target === event.currentTarget) onClose();
      }}>
      <motion.div className={styles.detailPanel} layoutId={shared("card")}
        initial={reducedMotion ? { opacity: 0 } : undefined}
        animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={reducedMotion ? { duration: 0 } : {
          layout: { type: "spring", stiffness: 340, damping: 32 }, opacity: { duration: 0.18 },
        }}>
        <motion.div className={styles.detailPreview} layoutId={shared("image")}>
          <Image src={project.image} alt={project.title} fill sizes="(max-width: 650px) 100vw, 620px"
            className={styles.projectImage} />
          <div className={styles.imageShade} aria-hidden="true" />
          <span className={styles.detailTag}>{project.tag}</span>
        </motion.div>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label={copy.closeLabel}>
          <X size={19} aria-hidden="true" />
        </button>
        <div className={styles.detailContent} tabIndex={0} role="region" aria-labelledby={titleId}>
          <p className={styles.category}>{project.category}</p>
          <motion.h3 id={titleId} className={styles.detailTitle} layoutId={shared("title")}>
            {project.title}
          </motion.h3>
          <motion.p className={styles.detailDescription} layoutId={shared("description")}>
            {project.description}
          </motion.p>
          <div className={styles.detailTechnologies}>
            <h4>{copy.technologiesLabel}</h4>
            <ul className={styles.technologies}>
              {project.tech.map((tech) => <li key={tech}>{tech}</li>)}
            </ul>
          </div>
          <dl className={styles.caseDetails}>
            {details.map(({ label, value }, detailIndex) => (
              <div key={label}>
                <dt><span aria-hidden="true">0{detailIndex + 1}</span>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className={styles.detailFooter}>
          {isExternal ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className={styles.visitButton}>{action}</a>
          ) : (
            <Link href={href} className={styles.visitButton} onClick={onClose}>{action}</Link>
          )}
        </div>
      </motion.div>
    </motion.dialog>
  );
}
