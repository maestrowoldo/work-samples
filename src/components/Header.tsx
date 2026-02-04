"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all
      ${scrolled ? "backdrop-blur-xl bg-black/40 border-b border-white/10" : ""}
    `}>
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Image
          src="/images/logo-best.png"
          width={60}
          height={60}
          className="rounded-xl"
          alt="Logo"
        />

        <ul className="hidden md:flex items-center gap-8 text-gray-300">
          <li><a href="#inicio" className="hover:text-white">Início</a></li>
          <li><a href="#sobre" className="hover:text-white">Sobre</a></li>
          <li><a href="#projeto" className="hover:text-white">Projetos</a></li>
          <li><a href="#especialidade" className="hover:text-white">Especialidades</a></li>
        </ul>

        <a href="#formulario" className="hidden md:block">
          <button className="bg-[#00FF08] px-4 py-2 rounded-full text-black font-semibold hover:bg-green-400 transition">
            Contato
          </button>
        </a>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white"
        >
          <span className="text-3xl">☰</span>
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-black border-t border-white/10">
          <ul className="flex flex-col text-center text-gray-300 py-4 gap-4">
            <li><a href="#inicio">Início</a></li>
            <li><a href="#sobre">Sobre</a></li>
            <li><a href="#projeto">Projetos</a></li>
            <li><a href="#especialidade">Especialidades</a></li>
            <li>
              <a href="#formulario">
                <button className="bg-[#00FF08] text-black px-4 py-2 rounded-full font-semibold">
                  Contato
                </button>
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
