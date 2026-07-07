export interface BlogSourceLink {
  imageAlt?: string;
  imageUrl?: string;
  siteName?: string;
  source: string;
  title: string;
  url: string;
}

export interface BlogHeroImage {
  alt: string;
  credit?: string;
  descriptionUrl?: string;
  height?: number;
  license?: string;
  licenseUrl?: string;
  mime?: string;
  originalUrl?: string;
  source?: string;
  sourceUrl?: string;
  src: string;
  width?: number;
}

export interface BlogPostContent {
  author: string;
  content: string;
  date: string;
  description: string;
  readTime: number;
  slug: string;
  tags: string[];
  title: string;
  category?: string;
  heroImage?: BlogHeroImage;
  imageCredit?: string;
  imageDescriptionUrl?: string;
  imageLicense?: string;
  imageLicenseUrl?: string;
  imageOriginalUrl?: string;
  keyTakeaways?: string[];
  origin?: "static" | "generated";
  contentHash?: string;
  publishedAtReference?: string;
  sourceUrl?: string;
  sourceUrls?: string[];
  sourceLinks?: BlogSourceLink[];
  whyItMatters?: string;
}

export interface TechNewsItem {
  categoryMatches: string[];
  id: string;
  publishedAt: string;
  publishedAtReliable: boolean;
  score: number;
  source: string;
  summary: string;
  title: string;
  url: string;
}

export interface SelectedTopic {
  category: string;
  keywords: string[];
  lead: TechNewsItem;
  supporting: TechNewsItem[];
  summary: string;
}

export interface GeneratedBlogPostDraft {
  category: string;
  content: string;
  contentHash?: string;
  date: string;
  description: string;
  heroImage: BlogHeroImage;
  imageQuery?: string;
  keyTakeaways: string[];
  publishedAtReference?: string;
  readTime: number;
  slug?: string;
  sourceUrl?: string;
  sourceUrls?: string[];
  sourceLinks: BlogSourceLink[];
  tags: string[];
  title: string;
  whyItMatters: string;
}

export interface SavedBlogPostResult {
  filePath: string;
  post: BlogPostContent;
}
