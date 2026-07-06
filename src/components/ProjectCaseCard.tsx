"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { SiteDictionary } from "@/lib/site-content";

type ProjectItem = SiteDictionary["projects"]["items"][number];

interface ProjectCaseCardProps {
  locale: string;
  project: ProjectItem;
  copy: Pick<
    SiteDictionary["projects"],
    "impactLabel" | "problemLabel" | "solutionLabel" | "viewMoreLabel"
  >;
}

function ProjectCaseCardBody({
  project,
  copy,
  isExternal,
}: {
  project: ProjectItem;
  copy: ProjectCaseCardProps["copy"];
  isExternal: boolean;
}) {
  const DestinationIcon = isExternal ? ExternalLink : ArrowUpRight;

  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[rgba(255,255,255,0.035)] shadow-[0_16px_42px_rgba(0,0,0,0.34)] backdrop-blur-xl transition-colors duration-300 group-hover:border-white/16 group-hover:bg-[rgba(255,255,255,0.045)] group-focus-visible:border-cyan-300/20 group-focus-visible:bg-[rgba(255,255,255,0.045)] sm:rounded-[24px] sm:shadow-[0_20px_60px_rgba(0,0,0,0.38)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.06),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.08),transparent_36%)] opacity-80" />
      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent sm:inset-x-8" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(180deg,transparent_0%,rgba(8,10,18,0.18)_36%,rgba(8,10,18,0.55)_100%)]" />

      <div className="relative h-36 overflow-hidden border-b border-white/10 bg-zinc-900/80 sm:h-auto sm:aspect-[16/9]">
        <Image src={project.image} alt={project.title} fill className="object-cover" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,16,0.14)_0%,rgba(7,10,20,0.34)_52%,rgba(7,10,18,0.82)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.1),transparent_42%),radial-gradient(circle_at_78%_18%,rgba(96,165,250,0.08),transparent_28%)]" />

        <div className="absolute left-3 top-3 sm:left-4 sm:top-4">
          <span className="rounded-full border border-white/12 bg-black/35 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-100 backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[10px] sm:tracking-[0.24em]">
            {project.tag}
          </span>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-3 px-3.5 py-3.5 sm:gap-4 sm:px-5 sm:py-5">
        <div className="space-y-2 sm:space-y-2.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-100/60 sm:text-[10px] sm:tracking-[0.24em]">
            {project.category}
          </p>
          <h3 className="max-w-[16ch] line-clamp-2 text-base font-semibold leading-[1.12] text-zinc-50 sm:max-w-[18ch] sm:text-xl sm:line-clamp-none">
            {project.title}
          </h3>
          <p className="max-w-xl line-clamp-2 text-[13px] leading-5 text-zinc-400 sm:text-sm sm:leading-6 sm:line-clamp-none">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-colors duration-300 group-hover:border-white/14 group-hover:bg-white/[0.04] group-focus-visible:border-white/14 group-focus-visible:bg-white/[0.04] sm:px-2.5 sm:py-1 sm:text-[10px]"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[18px] sm:p-3.5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-cyan-100/60 sm:text-[10px] sm:tracking-[0.24em]">
            {copy.impactLabel}
          </p>
          <p className="mt-1.5 line-clamp-3 text-[13px] leading-5 text-zinc-300 sm:mt-2 sm:text-sm sm:leading-6 sm:line-clamp-none">
            {project.impact}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-0.5 sm:pt-1">
          <span className="text-[13px] font-medium text-zinc-100 transition-colors duration-300 group-hover:text-cyan-100 group-focus-visible:text-cyan-100 sm:text-sm">
            {copy.viewMoreLabel}
          </span>

          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-zinc-200 transition-colors duration-300 group-hover:border-cyan-300/20 group-hover:text-cyan-100 group-focus-visible:border-cyan-300/20 group-focus-visible:text-cyan-100 sm:h-8 sm:w-8">
            <DestinationIcon size={13} />
          </span>
        </div>
      </div>
    </article>
  );
}

export default function ProjectCaseCard({
  locale,
  project,
  copy,
}: ProjectCaseCardProps) {
  const isExternal = project.href.startsWith("http");
  const href = isExternal ? project.href : `/${locale}${project.href}`;
  const body = (
    <ProjectCaseCardBody project={project} copy={copy} isExternal={isExternal} />
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${copy.viewMoreLabel}: ${project.title}`}
        className="group block h-full rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 sm:rounded-[24px]"
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${copy.viewMoreLabel}: ${project.title}`}
      className="group block h-full rounded-[20px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/60 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 sm:rounded-[24px]"
    >
      {body}
    </Link>
  );
}
