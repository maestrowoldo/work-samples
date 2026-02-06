import { Card } from "./ui";
import { FadeIn } from "./animations";
import { Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import "./BlogPreview.css";

const posts = [
  {
    slug: "introducao-nextjs",
    titulo: "Introdução ao Next.js 16",
    descricao: "Aprenda os fundamentos do Next.js e como criar aplicações web modernas.",
    imagem: "/blog/nextjs.jpg",
    data: "2025-02-01",
    tempo_leitura: "8 min",
    tags: ["Next.js", "React", "Web Dev"],
  },
  {
    slug: "power-bi-dashboards",
    titulo: "Criando Dashboards Profissionais com Power BI",
    descricao: "Guia completo para criar dashboards interativos e impactantes com Power BI.",
    imagem: "/blog/powerbi.jpg",
    data: "2025-01-28",
    tempo_leitura: "12 min",
    tags: ["Power BI", "Data", "Analytics"],
  },
  {
    slug: "typescript-avancado",
    titulo: "TypeScript Avançado: Types e Generics",
    descricao: "Domine tipos avançados e genéricos em TypeScript para código mais seguro.",
    imagem: "/blog/typescript.jpg",
    data: "2025-01-20",
    tempo_leitura: "10 min",
    tags: ["TypeScript", "JavaScript", "Dev"],
  },
];

export default function BlogPreview() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
            Últimos <span className="text-emerald-400">Artigos</span>
          </h2>
          <p className="mt-3 text-sm text-zinc-400 md:text-base">
            Insights sobre desenvolvimento, dados e tecnologia
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post, index) => (
            <FadeIn key={post.slug} delay={index * 0.1}>
              <Link href={`/blog/${post.slug}`}>
                <Card hover className="blog-card">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tag-glow"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-zinc-50 hover:text-emerald-400 transition-colors">
                        {post.titulo}
                      </h3>
                      <p className="text-sm text-zinc-400 mt-2">{post.descricao}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-zinc-500 pt-4 border-t border-zinc-800">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(post.data).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <span>{post.tempo_leitura}</span>
                    </div>

                    <div className="flex items-center gap-2 text-emerald-400 hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium">Ler artigo</span>
                      <ArrowRight size={16} />
                    </div>
                  </div>
                </Card>
              </Link>
            </FadeIn>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <span>Ver todos os artigos</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
