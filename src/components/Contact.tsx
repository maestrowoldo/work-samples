// src/components/Contact.tsx
"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactFormSchema, type ContactFormData } from "@/lib/validations";
import { Button, Input, Textarea } from "@/components/ui";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, MessageSquare, TimerReset } from "lucide-react";
import { useLocaleContext } from "@/components/LocaleProvider";

export default function Contact() {
  const { dictionary } = useLocaleContext();
  const [headingBefore, headingAfter = ""] = dictionary.contactSection.heading.split(dictionary.contactSection.highlight);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [celularFormatado, setCelularFormatado] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(createContactFormSchema(dictionary.contactSection.form.validation)),
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
                {headingBefore}
                <span className="text-emerald-400">{dictionary.contactSection.highlight}</span>
                {headingAfter}
              </h2>

              <p className="mt-3 text-sm text-zinc-400 md:text-base">
                {dictionary.contactSection.description}
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{dictionary.contactSection.infoCards[0]?.title}</p>
                  <p className="text-sm text-zinc-400">{dictionary.contactSection.infoCards[0]?.description}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-emerald-400">
                  <TimerReset size={18} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">{dictionary.contactSection.infoCards[1]?.title}</p>
                  <p className="text-sm text-zinc-400">{dictionary.contactSection.infoCards[1]?.description}</p>
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
                label={dictionary.contactSection.form.nameLabel}
                placeholder={dictionary.contactSection.form.namePlaceholder}
                {...register("nome")}
                error={errors.nome?.message}
              />
              <Input
                label={dictionary.contactSection.form.emailLabel}
                type="email"
                placeholder={dictionary.contactSection.form.emailPlaceholder}
                {...register("email")}
                error={errors.email?.message}
              />
            </div>

            <Input
              label={dictionary.contactSection.form.cellphoneLabel}
              placeholder={dictionary.contactSection.form.cellphonePlaceholder}
              value={celularFormatado}
              onChange={handleCelularChange}
              error={errors.celular?.message}
            />

            <Textarea
              label={dictionary.contactSection.form.messageLabel}
              placeholder={dictionary.contactSection.form.messagePlaceholder}
              rows={5}
              {...register("mensagem")}
              error={errors.mensagem?.message}
            />

            <div className="flex items-center gap-2">
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? dictionary.contactSection.form.submitLoading : dictionary.contactSection.form.submitIdle}
              </Button>
            </div>

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400"
              >
                <CheckCircle size={18} />
                <span>{dictionary.contactSection.form.successMessage}</span>
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400"
              >
                <AlertCircle size={18} />
                <span>{dictionary.contactSection.form.errorMessage}</span>
              </motion.div>
            )}
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
}
