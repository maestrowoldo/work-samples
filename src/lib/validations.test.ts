import { describe, expect, it } from "vitest";
import {
  contactFormSchema,
  newsletterSchema,
} from "@/lib/validations";

describe("contactFormSchema", () => {
  it("accepts valid contact data", () => {
    const result = contactFormSchema.safeParse({
      nome: "Wolkendo Arias",
      email: "woldobest@gmail.com",
      celular: "(11) 99999-9999",
      mensagem: "Quero conversar sobre um novo projeto web.",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid email and short message", () => {
    const result = contactFormSchema.safeParse({
      nome: "Wo",
      email: "email-invalido",
      celular: "123",
      mensagem: "curta",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.nome).toBeDefined();
      expect(result.error.flatten().fieldErrors.email).toBeDefined();
      expect(result.error.flatten().fieldErrors.celular).toBeDefined();
      expect(result.error.flatten().fieldErrors.mensagem).toBeDefined();
    }
  });
});

describe("newsletterSchema", () => {
  it("accepts a valid email", () => {
    expect(
      newsletterSchema.safeParse({ email: "newsletter@example.com" }).success,
    ).toBe(true);
  });

  it("rejects an invalid email", () => {
    expect(newsletterSchema.safeParse({ email: "email-invalido" }).success).toBe(
      false,
    );
  });
});
