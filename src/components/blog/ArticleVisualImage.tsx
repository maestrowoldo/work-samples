/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import type { BlogVisualAsset } from "@/lib/blog/presentation";

export function ArticleVisualImage({
  className,
  fit = "cover",
  priority = false,
  sizes,
  visual,
}: {
  className?: string;
  fit?: "contain" | "cover";
  priority?: boolean;
  sizes: string;
  visual: BlogVisualAsset;
}) {
  const objectClass = fit === "contain" ? "object-contain" : "object-cover";

  if (visual.kind === "remote") {
    return (
      <img
        src={visual.src}
        alt={visual.alt}
        className={`absolute inset-0 h-full w-full ${objectClass} object-center ${className ?? ""}`}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        referrerPolicy="no-referrer"
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      src={visual.src}
      alt={visual.alt}
      fill
      className={`${objectClass} object-center ${className ?? ""}`}
      priority={priority}
      sizes={sizes}
    />
  );
}
