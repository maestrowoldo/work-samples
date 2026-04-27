import { z } from "zod";

export interface ContactValidationMessages {
  invalidCellphone: string;
  invalidEmail: string;
  maxEmail: string;
  maxMessage: string;
  maxName: string;
  minMessage: string;
  minName: string;
}

export const defaultContactValidationMessages: ContactValidationMessages = {
  invalidCellphone: "Celular inválido",
  invalidEmail: "Forneça um email válido",
  maxEmail: "Email deve ter no máximo 100 caracteres",
  maxMessage: "Mensagem deve ter no máximo 2000 caracteres",
  maxName: "Nome deve ter no máximo 100 caracteres",
  minMessage: "Mensagem deve ter pelo menos 10 caracteres",
  minName: "Nome deve ter pelo menos 3 caracteres",
};

export function createContactFormSchema(
  messages: ContactValidationMessages = defaultContactValidationMessages,
) {
  return z.object({
    nome: z
      .string()
      .min(3, messages.minName)
      .max(100, messages.maxName),
    email: z
      .string()
      .email(messages.invalidEmail)
      .max(100, messages.maxEmail),
    celular: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^(\d{10,11})$/.test(val.replace(/\D/g, "")),
        messages.invalidCellphone,
      ),
    mensagem: z
      .string()
      .min(10, messages.minMessage)
      .max(2000, messages.maxMessage),
  });
}

export const contactFormSchema = createContactFormSchema();

export const newsletterSchema = z.object({
  email: z.string().email("Forneça um email válido"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type NewsletterData = z.infer<typeof newsletterSchema>;
