"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Briefcase, Code2, Download, GraduationCap, Languages, MessageSquareText, Rocket, ShieldCheck, Target } from "lucide-react";
import { useLocaleContext } from "@/components/LocaleProvider";
import styles from "./Hero.module.css";

const proofIcons = [Code2, Target, ShieldCheck];
const badgeIcons = [Languages, GraduationCap];

export default function Hero() {
  const { dictionary, locale } = useLocaleContext();
  const copy = dictionary.hero;

  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.container}>
        <div className={styles.topGrid}>
          <div className={styles.introduction}>
            <p className={styles.eyebrow}><span aria-hidden="true" />{copy.eyebrow}</p>
            <h1 id="hero-heading" className={styles.heading}>
              {copy.title} <span>{copy.titleHighlight}</span>.
            </h1>
            <p className={styles.description}>{copy.description}</p>
            <div className={styles.actions}>
              <a href="#contato" className={styles.primaryAction}>
                <MessageSquareText size={17} aria-hidden="true" />{copy.ctaPrimary}
              </a>
              <a href="#projeto" className={styles.secondaryAction}>
                {copy.ctaSecondary}<ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
            <ul className={styles.badges}>
              {copy.badges.map((badge, index) => {
                const Icon = badgeIcons[index];
                return (
                  <li key={badge}>
                    {Icon ? <Icon size={14} aria-hidden="true" /> : <span className={styles.availabilityDot} aria-hidden="true" />}
                    {badge}
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className={styles.profile} aria-label="Wolkendo Arias">
            <div className={styles.portrait}>
              <span className={styles.portraitOrbit} aria-hidden="true" />
              <Image src="/foto-perfil.png" alt={copy.profileAlt} fill priority
                sizes="(min-width: 1200px) 380px, (min-width: 1000px) 340px, (min-width: 600px) 160px, 112px"
                className={styles.profileImage} />
              <div className={styles.portraitShade} aria-hidden="true" />
            </div>
            <div className={styles.profileInfo}>
              <p className={styles.name}>Wolkendo Arias<span aria-hidden="true" /></p>
              <p className={styles.role}>{copy.profileRole}</p>
              <div className={styles.profileLinks}>
                <Link href={`/${locale}/curriculum`} className={styles.resumeLink}>
                  <Download size={14} aria-hidden="true" />{copy.resumeLabel}
                </Link>
                <a href="https://www.linkedin.com/in/wolkendo-arias/" target="_blank" rel="noopener noreferrer">
                  <Briefcase size={14} aria-hidden="true" />{copy.socialLinkedIn}
                </a>
                <a href="https://github.com/maestrowoldo" target="_blank" rel="noopener noreferrer">
                  <Code2 size={14} aria-hidden="true" />{copy.socialGitHub}
                </a>
              </div>
            </div>
          </aside>
        </div>

        <ul className={styles.proofGrid}>
          {copy.proofItems.map((item, index) => {
            const Icon = proofIcons[index] ?? Rocket;
            return (
              <li key={item.label} className={styles.proofItem}>
                <span className={styles.proofIcon}><Icon size={20} aria-hidden="true" /></span>
                <div>
                  <p className={styles.proofLabel}>{item.label}</p>
                  <p className={styles.proofValue}>{item.value}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
