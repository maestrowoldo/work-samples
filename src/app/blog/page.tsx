import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Blog - Wolkendo Arias",
  description: "Artigos sobre desenvolvimento web, dados e tecnologia",
};

const posts = [
  {
    slug: "introducao-nextjs",
    titulo: "Introdução ao Next.js 16",
    descricao: "Aprenda os fundamentos do Next.js e como criar aplicações web modernas.",
    conteudo: "# Introdução ao Next.js 16\n\nEste é um artigo sobre Next.js...",
    data: "2025-02-01",
    tempo_leitura: "8 min",
    tags: ["Next.js", "React", "Web Dev"],
  },
  {
    slug: "power-bi-dashboards",
    titulo: "Criando Dashboards Profissionais com Power BI",
    descricao: "Guia completo para criar dashboards interativos e impactantes com Power BI.",
    conteudo: "# Dashboards com Power BI\n\nAqui você aprenderá a criar...",
    data: "2025-01-28",
    tempo_leitura: "12 min",
    tags: ["Power BI", "Data", "Analytics"],
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="mx-auto max-w-4xl px-4 lg:px-6">
          <Link href="/#blog" className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 mb-8">
            <ArrowLeft size={18} />
            Voltar
          </Link>

          <h1 className="text-4xl font-bold text-zinc-50 mb-3">Blog</h1>
          <p className="text-zinc-400 mb-12">
            Artigos sobre desenvolvimento web, análise de dados e tecnologia
          </p>

          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold text-zinc-50 hover:text-emerald-400 transition-colors">
                      {post.titulo}
                    </h2>
                    <p className="text-zinc-400 mt-2">{post.descricao}</p>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-zinc-500 mt-4">
                      <span>{new Date(post.data).toLocaleDateString("pt-BR")}</span>
                      <span>•</span>
                      <span>{post.tempo_leitura}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
