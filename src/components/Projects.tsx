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
    return { gap: 22, perView: 2 };
  }

  return { gap: 31, perView: 3 };
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
    <section className="relative overflow-hidden border-y border-white/6 bg-[#070a13] py-14 sm:py-16">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,10,19,0.98)_0%,rgba(10,13,24,0.98)_100%)]" />

      <div className="relative mx-auto max-w-[880px] px-4 sm:px-6 lg:px-0">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-[18px] border border-white/[0.08] bg-[#111426] px-4 py-5 shadow-[0_18px_55px_rgba(0,0,0,0.24)] sm:px-5 sm:py-6"
        >
          <div className="mb-5 flex items-center justify-between gap-4 sm:mb-6">
            <h2 className="text-lg font-semibold leading-tight text-[#f4f4f7] sm:text-xl">
              {dictionary.projects.featuredHeading}
            </h2>

            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={dictionary.projects.previousProjectLabel}
                disabled={!canGoPrevious}
                onClick={() => goToIndex(visibleIndex - 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-[#f4f4f7] transition-colors duration-300 hover:border-violet-300/35 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
              >
                <ChevronLeft size={17} aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label={dictionary.projects.nextProjectLabel}
                disabled={!canGoNext}
                onClick={() => goToIndex(visibleIndex + 1)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] text-[#f4f4f7] transition-colors duration-300 hover:border-violet-300/35 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70 disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
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
                className="h-3 w-3 rounded-full border border-white/20 p-0.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/70"
              >
                <span
                  className={`block h-full w-full rounded-full transition-colors duration-300 ${
                    visibleIndex === index ? "bg-[#d8c7ff]" : "bg-white/25"
                  }`}
                />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
