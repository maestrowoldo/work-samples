import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";

const posts: Record<
  string,
  {
    titulo: string;
    descricao: string;
    conteudo: string;
    data: string;
    tempo_leitura: number;
    tags: string[];
    autor: string;
  }
> = {
  "introducao-nextjs": {
    titulo: "Introdução ao Next.js 16",
    descricao: "Aprenda os fundamentos do Next.js e como criar aplicações web modernas.",
    conteudo: `# Introdução ao Next.js 16

Next.js é um framework React poderoso que simplifica o desenvolvimento de aplicações web modernas. Neste artigo, vamos explorar seus principais recursos.

## Por que usar Next.js?

Next.js oferece:
- Server-side rendering (SSR) para melhor SEO
- Static Site Generation (SSG) para performance
- API Routes para backend integrado
- Image optimization automática

## Como começar

Para começar com Next.js, você só precisa executar um comando simples.`,
    data: "2025-02-01",
    tempo_leitura: 8,
    tags: ["Next.js", "React", "Web Dev"],
    autor: "Wolkendo Arias",
  },
  "power-bi-dashboards": {
    titulo: "Criando Dashboards Profissionais com Power BI",
    descricao: "Guia completo para criar dashboards interativos e impactantes com Power BI.",
    conteudo: `# Criando Dashboards Profissionais com Power BI

Power BI é uma ferramenta poderosa para visualização e análise de dados. Aqui estão os passos para criar dashboards profissionais.

## Conceitos Fundamentais

- Power Query: ETL (Extract, Transform, Load)
- Data Model: Relacionamento entre tabelas
- Measures: Cálculos personalizados com DAX
- Visualizações: Gráficos e elementos visuais

## Boas Práticas

Dominar Power BI abre muitas oportunidades em análise de dados!`,
    data: "2025-01-28",
    tempo_leitura: 12,
    tags: ["Power BI", "Data", "Analytics"],
    autor: "Wolkendo Arias",
  },
  "typescript-avancado": {
    titulo: "TypeScript Avançado: Tipos Genéricos e Utilitários",
    descricao: "Domine tipos genéricos, tipos utilitários e padrões avançados de TypeScript.",
    conteudo: `# TypeScript Avançado: Tipos Genéricos e Utilitários

TypeScript oferece recursos poderosos para criar código type-safe e reutilizável. Neste artigo, vamos explorar conceitos avançados.

## Tipos Genéricos

Genéricos permitem criar funções e classes que funcionam com múltiplos tipos:

- Functions Genéricas: Reutilizar lógica com diferentes tipos
- Classes Genéricas: Estruturas flexíveis e type-safe
- Constraints: Limitar tipos genéricos com extends

## Tipos Utilitários

TypeScript fornece tipos utilitários prontos:

- Partial<T>: Torna todas as propriedades opcionais
- Pick<T, K>: Seleciona propriedades específicas
- Omit<T, K>: Exclui propriedades específicas
- Record<K, T>: Mapeia chaves para valores

## Padrões Avançados

- Conditional Types: Tipos que dependem de condições
- Mapped Types: Transformar tipos dinamicamente
- Type Guards: Validação em tempo de execução

Dominar esses conceitos torna você um especialista TypeScript!`,
    data: "2025-02-03",
    tempo_leitura: 15,
    tags: ["TypeScript", "Web Dev", "Advanced"],
    autor: "Wolkendo Arias",
  },
};

export async function generateStaticParams() {
  return Object.keys(posts).map((slug) => ({
    slug,
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];

  if (!post) {
    return {
      title: "Artigo não encontrado",
    };
  }

  return {
    title: `${post.titulo} - Blog Wolkendo Arias`,
    description: post.descricao,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8">
            <ArrowLeft size={18} />
            Voltar para blog
          </Link>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold text-zinc-50 mb-4">{post.titulo}</h1>

              <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <time>{new Date(post.data).toLocaleDateString("pt-BR")}</time>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>{post.tempo_leitura} min de leitura</span>
                </div>
                <div>Por {post.autor}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose prose-invert max-w-none text-zinc-300">
              {post.conteudo.split("\n").map((paragraph, idx) => {
                if (paragraph.startsWith("# ")) {
                  return (
                    <h1 key={idx} className="text-3xl font-bold text-zinc-50 mt-8 mb-4">
                      {paragraph.replace("# ", "")}
                    </h1>
                  );
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={idx} className="text-2xl font-bold text-zinc-50 mt-6 mb-3">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  return (
                    <li key={idx} className="text-zinc-300 ml-6">
                      {paragraph.replace("- ", "")}
                    </li>
                  );
                }
                if (paragraph.trim() === "") {
                  return null;
                }
                return (
                  <p key={idx} className="text-zinc-300 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                );
              })}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
}
