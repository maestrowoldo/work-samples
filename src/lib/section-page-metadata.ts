import { buildPageMetadata } from "@/lib/metadata";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/site-content";

export function buildSectionPageMetadata(
  locale: Locale,
  pathname: string,
  title: string,
  description: string,
) {
  return buildPageMetadata({
    locale,
    pathname,
    title: `${title} - Wolkendo Arias`,
    description,
  });
}

export function getSectionPageCopy(locale: Locale) {
  const dictionary = getDictionary(locale);

  return {
    about: {
      title: dictionary.about.heading,
      description: dictionary.about.description[0],
    },
    experience: {
      title: dictionary.experience.heading,
      description: dictionary.experience.description,
    },
    process: {
      title: dictionary.howIWork.heading,
      description: dictionary.howIWork.description,
    },
    projects: {
      title: dictionary.projects.heading,
      description: dictionary.projects.description,
    },
  };
}
