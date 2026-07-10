"use client";

import Image from "next/image";
import Link from "next/link";
import type { SiteDictionary } from "@/lib/site-content";

type ProjectItem = SiteDictionary["projects"]["items"][number];

interface ProjectCaseCardProps {
  locale: string;
  project: ProjectItem;
  copy: Pick<SiteDictionary["projects"], "viewMoreLabel">;
}

function ProjectCaseCardBody({
  project,
}: {
  project: ProjectItem;
}) {
  const isLogoImage = project.image === "/nexochat.png";

  return (
    <article className="flex h-[330px] flex-col overflow-hidden rounded-[12px] border border-zinc-800 bg-zinc-900/55 shadow-[0_14px_36px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 motion-reduce:transition-none motion-safe:group-hover:-translate-y-1 group-hover:border-emerald-400/30 group-hover:bg-zinc-900/70 group-focus-visible:border-emerald-400/40">
      <div className="relative h-[145px] shrink-0 overflow-hidden border-b border-zinc-800 bg-zinc-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_34%),linear-gradient(180deg,rgba(9,9,11,0)_0%,rgba(9,9,11,0.24)_100%)]" />
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
          className={`transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-[1.03] ${
            isLogoImage
              ? "object-contain p-5 opacity-95"
              : "object-cover opacity-90"
          }`}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,11,0.02)_0%,rgba(9,9,11,0.2)_100%)]" />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4.5 py-4 sm:px-5">
        <h3 className="line-clamp-2 text-[18px] font-semibold leading-[1.16] text-zinc-50">
          {project.title}
        </h3>
        <p className="mt-2.5 line-clamp-2 text-sm leading-5 text-zinc-400">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium leading-none text-emerald-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
            >
              {tech}
            </span>
          ))}
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
  const body = <ProjectCaseCardBody project={project} />;

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${copy.viewMoreLabel}: ${project.title}`}
        className="group block h-full rounded-[12px] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 motion-reduce:transition-none"
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${copy.viewMoreLabel}: ${project.title}`}
      className="group block h-full rounded-[12px] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950 motion-reduce:transition-none"
    >
      {body}
    </Link>
  );
}
