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
  return (
    <article className="flex h-[305px] flex-col overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#2a2d40] transition duration-300 motion-reduce:transition-none motion-safe:group-hover:-translate-y-1 group-hover:border-violet-300/25 group-focus-visible:border-violet-300/35">
      <div className="relative h-[132px] shrink-0 overflow-hidden bg-zinc-900">
        <Image
          src={project.image}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 260px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 motion-reduce:transition-none motion-safe:group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col px-4 py-4">
        <h3 className="line-clamp-2 text-[17px] font-semibold leading-[1.18] text-[#f4f4f7]">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[13.5px] leading-5 text-[#c5c6d0]">
          {project.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-3">
          {project.tech.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-violet-200/10 bg-[rgba(139,92,246,0.35)] px-2.5 py-1 text-[10px] font-medium leading-none text-[#d8c7ff]"
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
        className="group block h-full rounded-[10px] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111426] motion-reduce:transition-none"
      >
        {body}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={`${copy.viewMoreLabel}: ${project.title}`}
      className="group block h-full rounded-[10px] transition-transform duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111426] motion-reduce:transition-none"
    >
      {body}
    </Link>
  );
}
