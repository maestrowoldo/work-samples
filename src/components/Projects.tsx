"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProjectCaseCard from "@/components/ProjectCaseCard";
import { useLocaleContext } from "@/components/LocaleProvider";

const getCarouselConfig = (width: number) => {
  if (width < 640) {
    return { gap: 18, perView: 1 };
  }

  if (width < 1024) {
    return { gap: 24, perView: 2 };
  }

  return { gap: 30, perView: 3 };
};

export default function Projects() {
  const { dictionary, locale } = useLocaleContext();
  const shouldReduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const pointerStartX = useRef<number | null>(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const projects = dictionary.projects.items;
  const { gap, perView } = useMemo(
    () => getCarouselConfig(viewportWidth),
    [viewportWidth],
  );
  const maxIndex = Math.max(projects.length - perView, 0);
  const visibleIndex = Math.min(activeIndex, maxIndex);
  const cardWidth =
    viewportWidth > 0 ? (viewportWidth - gap * (perView - 1)) / perView : 0;
  const translateX = visibleIndex * (cardWidth + gap);
  const canGoPrevious = visibleIndex > 0;
  const canGoNext = visibleIndex < maxIndex;
  const featuredHeadingParts = dictionary.projects.featuredHeading.match(
    /^(.*)\s+(\S+)$/,
  );

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const updateWidth = () => setViewportWidth(viewport.clientWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(viewport);

    return () => observer.disconnect();
  }, []);

  const goToIndex = (index: number) => {
    setActiveIndex(Math.min(Math.max(index, 0), maxIndex));
  };

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = event.clientX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (pointerStartX.current === null) {
      return;
    }

    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(distance) < 40) {
      return;
    }

    if (distance < 0) {
      goToIndex(visibleIndex + 1);
      return;
    }

    goToIndex(visibleIndex - 1);
  };

  return (
    <section className="relative overflow-hidden py-10 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.06),transparent_24%),radial-gradient(circle_at_85%_30%,rgba(6,182,212,0.05),transparent_26%)]" />

      <div className="relative mx-auto max-w-6xl px-4 lg:px-6">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 text-center md:mb-12"
        >
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
            {featuredHeadingParts ? featuredHeadingParts[1] : dictionary.projects.featuredHeading}{" "}
            {featuredHeadingParts ? (
              <span className="text-emerald-400">{featuredHeadingParts[2]}</span>
            ) : null}
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            {dictionary.projects.description}
          </p>
        </motion.div>

        <div className="mx-auto max-w-[940px]">
          <div className="mb-4 flex justify-end">
            <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={dictionary.projects.previousProjectLabel}
              disabled={!canGoPrevious}
              onClick={() => goToIndex(visibleIndex - 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-100 transition-colors duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
            >
              <ChevronLeft size={17} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label={dictionary.projects.nextProjectLabel}
              disabled={!canGoNext}
              onClick={() => goToIndex(visibleIndex + 1)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900/70 text-zinc-100 transition-colors duration-300 hover:border-emerald-400/40 hover:bg-emerald-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

          <div
            ref={viewportRef}
            className="overflow-hidden touch-pan-y"
            onPointerDown={handlePointerDown}
            onPointerCancel={() => {
              pointerStartX.current = null;
            }}
            onPointerUp={handlePointerUp}
          >
            <div
              className="flex will-change-transform"
              style={{
                gap,
                transform: `translate3d(-${translateX}px, 0, 0)`,
                transition: shouldReduceMotion
                  ? "none"
                  : "transform 360ms cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="min-w-0 shrink-0"
                  style={{ width: cardWidth || undefined }}
                >
                  <ProjectCaseCard
                    locale={locale}
                    project={project}
                    copy={{
                      viewMoreLabel: dictionary.projects.viewMoreLabel,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={dictionary.projects.goToProjectSlideLabel.replace(
                  "{number}",
                  String(index + 1),
                )}
                aria-current={visibleIndex === index ? "step" : undefined}
                onClick={() => goToIndex(index)}
                className="h-3 w-3 rounded-full border border-zinc-700 p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70"
              >
                <span
                  className={`block h-full w-full rounded-full transition-colors duration-300 ${
                    visibleIndex === index ? "bg-emerald-400" : "bg-zinc-600"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
