export interface BlogSourceLink {
  imageAlt?: string;
  imageUrl?: string;
  siteName?: string;
  source: string;
  title: string;
  url: string;
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
  origin?: "static" | "generated";
  sourceLinks?: BlogSourceLink[];
}

export interface TechNewsItem {
  categoryMatches: string[];
  id: string;
  publishedAt: string;
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
  date: string;
  description: string;
  readTime: number;
  sourceLinks: BlogSourceLink[];
  tags: string[];
  title: string;
}

export interface SavedBlogPostResult {
  filePath: string;
  post: BlogPostContent;
}
