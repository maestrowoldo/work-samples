// src/app/page.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import BlogPreview from "@/components/BlogPreview";
import TechMarquee from "@/components/TechMarquee";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <section id="inicio">
          <Hero />
        </section>

        <section id="sobre" className="scroll-mt-24">
          <About />
        </section>

        <section id="experiencia" className="scroll-mt-24">
          <Experience />
        </section>

        <section id="projeto" className="scroll-mt-24">
          <Projects />
        </section>

        <section id="blog" className="scroll-mt-24">
          <BlogPreview />
        </section>

        <TechMarquee />

        <section id="contato" className="scroll-mt-24">
          <Contact />
        </section>
      </main>

      <Footer />
    </div>
  );
}
