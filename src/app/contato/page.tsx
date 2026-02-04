"use client";

import { useState, FormEvent } from "react";

export default function ContatoPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function sendLead(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setMsg(data.message || "Mensagem enviada!");
      e.currentTarget.reset();
    } catch {
      setMsg("Erro ao enviar mensagem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="pt-28 max-w-3xl mx-auto px-4 pb-20">
      <h1 className="text-3xl font-bold text-center">
        Fale <span className="text-[#00FF08]">Comigo</span>
      </h1>

      <form onSubmit={sendLead} className="mt-10 flex flex-col gap-4">
        <input
          name="nome"
          type="text"
          placeholder="Seu nome"
          required
          className="bg-neutral-900 px-4 py-3 rounded-xl border border-white/10"
        />

        <input
          name="email"
          type="email"
          placeholder="Seu email"
          required
          className="bg-neutral-900 px-4 py-3 rounded-xl border border-white/10"
        />

        <input
          name="celular"
          type="text"
          placeholder="Seu celular"
          className="bg-neutral-900 px-4 py-3 rounded-xl border border-white/10"
        />

        <textarea
          name="mensagem"
          placeholder="Digite sua mensagem"
          required
          rows={5}
          className="bg-neutral-900 px-4 py-3 rounded-xl border border-white/10"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-[#00FF08] text-black font-semibold py-3 rounded-full hover:bg-green-400 transition"
        >
          {loading ? "Enviando..." : "Enviar mensagem"}
        </button>
      </form>

      {msg && <p className="text-center mt-4 text-gray-200">{msg}</p>}
    </main>
  );
}
