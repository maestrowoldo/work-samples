// src/components/Contact.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { Button, Input, Textarea } from "@/components/ui";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, Download, MessageSquare, TimerReset } from "lucide-react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [celularFormatado, setCelularFormatado] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  // Função para formatar celular em (11) 99999-9999
  const formatarCelular = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replaceAll(/\D/g, "");
    
    // Limita a 11 dígitos
    const limitado = apenasNumeros.slice(0, 11);
    
    // Aplica o formato (DD) 9XXXX-XXXX
    if (limitado.length === 0) return "";
    if (limitado.length <= 2) return `(${limitado}`;
    if (limitado.length <= 7) return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
    return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
  };

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const formatado = formatarCelular(valor);
    setCelularFormatado(formatado);
    // Atualiza o valor do formulário com os dígitos sem formatação
    setValue("celular", valor.replaceAll(/\D/g, ""));
  };

  async function onSubmit(data: ContactFormData) {
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("success");
        reset();
        setCelularFormatado("");
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 lg:px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]"
        >
          <motion.div variants={itemVariants} className="space-y-5">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-50 md:text-3xl">
                Vamos transformar sua necessidade em <span className="text-emerald-400">entrega concreta</span>
              </h2>

              <p className="mt-3 text-sm text-zinc-400 md:text-base">
                Se você precisa de uma aplicação web, melhoria de processo, integração
                entre sistemas ou uma solução mais organizada para operação, me mande o
                contexto. Eu respondo com objetividade.
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">O que você pode me enviar</p>
                  <p className="text-sm text-zinc-400">Ideia do projeto, prazo, stack atual, gargalo técnico ou necessidade do negócio.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
                  <TimerReset size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Como eu costumo atuar</p>
                  <p className="text-sm text-zinc-400">Diagnóstico, implementação, validação e ajuste fino para a entrega ficar utilizável de verdade.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 rounded-[2rem] border border-zinc-800 bg-zinc-900/35 p-6 md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Nome completo"
                placeholder="Seu nome"
                {...register("nome")}
                error={errors.nome?.message}
              />
              <Input
                label="E-mail"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <Input
              label="Celular (opcional)"
              placeholder="(11) 99999-9999"
              value={celularFormatado}
              onChange={handleCelularChange}
              error={errors.celular?.message}
            />

            <Textarea
              label="Mensagem"
              placeholder="Conte o que você precisa resolver, o contexto atual e o que espera como entrega."
              rows={5}
              {...register("mensagem")}
              error={errors.mensagem?.message}
            />

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Enviando..." : "Enviar mensagem"}
              </Button>
            </div>

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              >
                <CheckCircle size={18} />
                <span>Mensagem enviada com sucesso! Obrigado por entrar em contato.</span>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
              >
                <AlertCircle size={18} />
                <span>Erro ao enviar. Tente novamente em alguns instantes.</span>
              </motion.div>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
