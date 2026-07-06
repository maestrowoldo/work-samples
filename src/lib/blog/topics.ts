const techTopicCatalog = [
  {
    label: "Inteligência Artificial",
    keywords: [
      "agent",
      "agents",
      "ai",
      "artificial intelligence",
      "copilot",
      "foundation model",
      "genai",
      "generative ai",
      "llm",
      "machine learning",
      "ml",
      "multimodal",
      "rag",
    ],
  },
  {
    label: "Programação",
    keywords: [
      "api",
      "compiler",
      "framework",
      "javascript",
      "node",
      "programming",
      "python",
      "react",
      "rust",
      "sdk",
      "typescript",
      "webdev",
    ],
  },
  {
    label: "Segurança",
    keywords: [
      "auth",
      "cve",
      "cybersecurity",
      "encryption",
      "exploit",
      "patch",
      "ransomware",
      "security",
      "threat",
      "vulnerability",
      "zero-day",
    ],
  },
  {
    label: "Cloud",
    keywords: [
      "aws",
      "azure",
      "cloud",
      "container",
      "edge",
      "gcp",
      "infrastructure",
      "kubernetes",
      "serverless",
    ],
  },
  {
    label: "DevOps",
    keywords: [
      "cicd",
      "ci/cd",
      "deployment",
      "devops",
      "docker",
      "infra",
      "observability",
      "pipeline",
      "platform engineering",
      "release",
      "sre",
    ],
  },
  {
    label: "Open Source",
    keywords: [
      "apache",
      "community",
      "foss",
      "github",
      "gitlab",
      "license",
      "maintainer",
      "open source",
      "oss",
      "repository",
    ],
  },
  {
    label: "Ferramentas para Desenvolvedores",
    keywords: [
      "cli",
      "code editor",
      "developer tool",
      "dx",
      "extension",
      "ide",
      "productivity",
      "tooling",
      "workflow",
    ],
  },
] as const;

const devToTags = [
  "ai",
  "machinelearning",
  "programming",
  "javascript",
  "typescript",
  "security",
  "cloud",
  "devops",
  "opensource",
  "productivity",
] as const;

const githubSearchQueries = [
  "llm OR \"artificial intelligence\" OR agent OR copilot",
  "typescript OR javascript OR python OR framework",
  "security OR vulnerability OR auth OR encryption",
  "cloud OR kubernetes OR serverless OR infrastructure",
  "devops OR ci/cd OR docker OR observability",
  "\"open source\" OR cli OR developer tool OR sdk",
] as const;

export function getDevToTags() {
  return [...devToTags];
}

export function getGitHubSearchQueries() {
  return [...githubSearchQueries];
}

export function getTechTopicLabels() {
  return techTopicCatalog.map((topic) => topic.label);
}

export function matchTopicCategories(text: string) {
  const normalizedText = text.toLowerCase();

  return techTopicCatalog
    .filter((topic) =>
      topic.keywords.some((keyword) => normalizedText.includes(keyword.toLowerCase())),
    )
    .map((topic) => topic.label);
}

export function getPrimaryTopicCategory(matches: string[]) {
  return matches[0] ?? "Tecnologia";
}

export function extractTopicKeywords(text: string) {
  const normalizedText = text.toLowerCase();
  const matchedKeywords = new Set<string>();

  for (const topic of techTopicCatalog) {
    for (const keyword of topic.keywords) {
      if (normalizedText.includes(keyword.toLowerCase())) {
        matchedKeywords.add(keyword);
      }
    }
  }

  return [...matchedKeywords];
}
