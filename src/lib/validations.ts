import { z } from "zod";

export const contactFormSchema = z.object({
  nome: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Forneça um email válido")
    .max(100, "Email deve ter no máximo 100 caracteres"),
  celular: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^(\d{10,11})$/.test(val.replace(/\D/g, "")),
      "Celular inválido"
    ),
  mensagem: z
    .string()
    .min(10, "Mensagem deve ter pelo menos 10 caracteres")
    .max(2000, "Mensagem deve ter no máximo 2000 caracteres"),
});

export const newsletterSchema = z.object({
  email: z.string().email("Forneça um email válido"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
