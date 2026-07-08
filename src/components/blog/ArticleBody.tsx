import type { ReactNode } from "react";
import Link from "next/link";
import { stripInitialArticleHeading } from "@/lib/blog/presentation";

function slugifyHeading(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, " ")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") || "secao";
}

function renderInlineMarkdown(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    const key = `${keyPrefix}-${index}`;

    if (token.startsWith("**")) {
      nodes.push(
        <strong key={key} className="font-semibold text-stone-950">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("`")) {
      nodes.push(
        <code key={key} className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[0.92em] text-stone-950">
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      const label = linkMatch?.[1] ?? token;
      const href = linkMatch?.[2] ?? "#";
      const isExternal = /^https?:\/\//i.test(href);

      if (isExternal) {
        nodes.push(
          <a
            key={key}
            href={href}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {label}
          </a>,
        );
      } else {
        nodes.push(
          <Link
            key={key}
            href={href}
            className="font-medium text-emerald-800 underline decoration-emerald-300 underline-offset-4 transition-colors hover:text-emerald-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            {label}
          </Link>,
        );
      }
    }

    lastIndex = match.index + token.length;
    index += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function ArticleBody({ content }: { content: string }) {
  const lines = stripInitialArticleHeading(content).split("\n");
  const elements: ReactNode[] = [];
  const usedHeadingIds = new Map<string, number>();
  let listItems: string[] = [];

  const getHeadingId = (heading: string) => {
    const baseId = slugifyHeading(heading);
    const count = usedHeadingIds.get(baseId) ?? 0;
    usedHeadingIds.set(baseId, count + 1);
    return count === 0 ? baseId : `${baseId}-${count + 1}`;
  };

  const flushList = () => {
    if (listItems.length === 0) {
      return;
    }

    elements.push(
      <ul key={`list-${elements.length}`} className="my-7 list-disc space-y-3 pl-6 text-lg leading-8 text-stone-700 marker:text-emerald-700">
        {listItems.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item, `li-${elements.length}-${index}`)}</li>
        ))}
      </ul>,
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const paragraph = line.trim();

    if (!paragraph) {
      flushList();
      return;
    }

    if (paragraph.startsWith("- ")) {
      listItems.push(paragraph.replace(/^-+\s*/, ""));
      return;
    }

    flushList();

    if (paragraph.startsWith("### ")) {
      const heading = paragraph.replace(/^###\s+/, "");
      elements.push(
        <h3 key={`h3-${index}`} className="mt-10 text-xl font-semibold leading-tight text-stone-950">
          {renderInlineMarkdown(heading, `h3-${index}`)}
        </h3>,
      );
      return;
    }

    if (paragraph.startsWith("## ")) {
      const heading = paragraph.replace(/^##\s+/, "");
      elements.push(
        <h2
          key={`h2-${index}`}
          id={getHeadingId(heading)}
          className="scroll-mt-28 pt-4 text-2xl font-semibold leading-tight text-stone-950 md:text-3xl"
        >
          {renderInlineMarkdown(heading, `h2-${index}`)}
        </h2>,
      );
      return;
    }

    if (paragraph.startsWith("> ")) {
      elements.push(
        <blockquote key={`quote-${index}`} className="my-8 border-l-2 border-emerald-700 pl-5 text-lg leading-8 text-stone-700">
          {renderInlineMarkdown(paragraph.replace(/^>\s*/, ""), `quote-${index}`)}
        </blockquote>,
      );
      return;
    }

    elements.push(
      <p key={`p-${index}`} className="text-lg leading-8 text-stone-700">
        {renderInlineMarkdown(paragraph, `p-${index}`)}
      </p>,
    );
  });

  flushList();

  return <div className="space-y-7">{elements}</div>;
}
